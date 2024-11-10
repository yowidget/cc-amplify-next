// components/Transacciones.tsx
import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function Transacciones({
  user,
  client,
}: {
  user: any;
  client: any;
}) {
  const [isSending, setIsSending] = useState(false);
  const [transacciones, setTransacciones] = useState<
    {
      id: string;
      concepto: string | null;
      categoria: {
        nombre: string;
        id: string;
        createdAt: string;
        updatedAt: string;
      };
    }[]
  >([]);

  const [transaccionInput, setTransaccionInput] = useState<string>("");

  useEffect(() => {
    loadTransacciones();
  }, []);

  async function loadTransacciones() {
    const { data, errors } = await client.models.Transaccion.list({
      selectionSet: ["id", "concepto", "categoria.*"],
    });
    if (errors)
      throw console.error("Error al obtener las transacciones", errors);
    setTransacciones(data);
  }

  async function createTransaccionFromInput() {
    if (transaccionInput.trim() === "") return;
    setIsSending(true);
    const transaccionesArray: Schema["categorize"]["args"]["prompt"] = [];
    transaccionInput
      .split(",")
      .map((item) => transaccionesArray.push(item))
      .filter(Boolean);

    client.queries
      .categorize({ prompt: transaccionesArray })
      .then(
        async ({
          data: categorizedTransacciones,
          errors,
        }: {
          data: any;
          errors: any;
        }) => {
          if (errors)
            throw console.error(
              "Error al categorizar las transacciones",
              errors
            );

          if (typeof categorizedTransacciones === "string") {
            const newCategorizedTransacciones = JSON.parse(
              categorizedTransacciones
            );
            if (Array.isArray(newCategorizedTransacciones)) {
              newCategorizedTransacciones.map(({ text, category }) => {
                const deliverDate =
                  Date.now() + 1 * 60 * 1000 - 6 * 60 * 60 * 1000;
                const deliverDateISO = new Date(deliverDate)
                  .toISOString()
                  .substring(0, 19);
                console.log({ deliverDateISO });
                client.mutations
                  .createTransaccionSchedule({
                    concepto: text,
                    categoriaId: category,
                    deliverDate: deliverDateISO,
                    userTimeZone,
                    email: user?.signInDetails?.loginId || "",
                  })
                  .then(({ data, errors }: { data: any; errors: any }) => {
                    if (errors)
                      throw console.error(
                        "Error al crear la transacción",
                        errors
                      );
                    console.log("Transacción creada", data);
                  });
              });
            }
          }
        }
      )
      .catch((e:any) => {
        console.error("Error al crear las transacciones", e);
      })
      .finally(() => {
        setIsSending(false);
        setTransaccionInput("");
        loadTransacciones();
      });
  }
  return (
    <section>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-6">Nueva Transacción</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={transaccionInput}
            onChange={(e) => setTransaccionInput(e.target.value)}
            placeholder="Ingrese el valor de la transacción"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-capitalone-blue"
            disabled={isSending}
          />
          <button
            onClick={createTransaccionFromInput}
            className="px-4 py-2 bg-capitalone-red text-white rounded-md hover:bg-capitalone-red-dark"
            disabled={!transaccionInput.trim() || isSending}
          >
            {isSending ? "Enviando..." : "Agregar"}
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Tus transacciones</h2>
        <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-md shadow-sm">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  Concepto
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  Categoría
                </th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map((transaccion) => (
                <tr key={transaccion.id}>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                    {transaccion.concepto}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                    {transaccion.categoria?.nombre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
