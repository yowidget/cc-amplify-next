"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
Amplify.configure(outputs);

const client = generateClient<Schema>();
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
	
import { ChangeEvent } from "react";
import { a } from "@aws-amplify/backend";
import { Nullable } from "@aws-amplify/data-schema";

function InputArea({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div>
      <h2>{label}</h2>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ width: "100%", height: "100px", marginBottom: "10px" }}
      />
      <button onClick={onSubmit} disabled={disabled}>
        Crear
      </button>
    </div>
  );
}
export default function App() {
  const { user, signOut } = useAuthenticator();
  const [transacciones, setTransacciones] = useState<
    {
      id: string;
      concepto: Nullable<string>;
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
    const transaccionesArray: Schema["categorize"]["args"]["prompt"] = [];
    transaccionInput
      .split(",")
      .map((item) => transaccionesArray.push(item))
      .filter(Boolean);

    client.queries
      .categorize({ prompt: transaccionesArray })
      .then(async ({ data: categorizedTransacciones, errors }) => {
        if (errors)
          throw console.error("Error al categorizar las transacciones", errors);

        if (typeof categorizedTransacciones === "string") {
          const newCategorizedTransacciones = JSON.parse(
            categorizedTransacciones
          );
          if (Array.isArray(newCategorizedTransacciones)) {
            newCategorizedTransacciones.map(({ text, category }) => {
              const deliverDate = Date.now() + (1 * 60 * 1000)-(6*60*60*1000);
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
                  email: user?.signInDetails?.loginId,
                })
                .then(({ data, errors }) => {
                  if (errors)
                    throw console.error(
                      "Error al crear la transacción",
                      errors
                    );
                  console.log("Transacción creada", data);
                });

              // client.models.Transaccion.create({
              //   concepto: text,
              //   categoriaId: category,
              // }).then(({ data, errors }) => {
              //   if (errors)
              //     throw console.error("Error al crear la transacción", errors);
              //   console.log("Transacción creada", data);
              // });
            });
          }
        }
      })
      .catch((e) => {
        console.error("Error al crear las transacciones", e);
      })
      .finally(() => {
        setTransaccionInput("");
        loadTransacciones();
      });
  }

  async function handleDeleteTransaccion(id: string) {
    client.models.Transaccion.delete({ id }).then(({ data, errors }) => {
      if (errors)
        throw console.error("Error al eliminar la transacción", errors);
      console.log("Transacción eliminada", id);
      loadTransacciones();
    });
  }

  return (
    <main>
      <nav>
        <div>
          <a href="/">Inicio</a>
        </div>
        <div>
          <a href="/misrecompensas">Recompensas</a>
        </div>
        <div>
          <a href="/configuracion">Configuración</a>
        </div>
      </nav>
      <h1>Transacciones</h1>

      <section
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>Transacciones existentes:</h3>
        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((transaccion) => (
              <tr key={transaccion.id}>
                <td>{transaccion.concepto}</td>
                <td>{transaccion.categoria?.nombre}</td>
                <td>
                  <button
                    onClick={() => handleDeleteTransaccion(transaccion.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <InputArea
          label="Agregar"
          placeholder="Ingresa las transacciones separadas por coma"
          value={transaccionInput}
          onChange={(e) => setTransaccionInput(e.target.value)}
          onSubmit={createTransaccionFromInput}
          disabled={!transaccionInput.trim()}
        />
      </section>
    </main>
  );
}
