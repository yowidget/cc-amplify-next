"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
Amplify.configure(outputs);

import { RecompensaCard } from "./RecompensaCard";

const client = generateClient<Schema>();

export default function RecompensasSugeridas() {
  const [categoriasId, setCategoriasIds] = useState<string[]>([]);
  const [recompensas, setRecompensas] = useState<
    Array<{
      id: string;
      categoriaId: string;
      nombre: string;
      img: string;
      categoria: {
        nombre: string;
      };
    }>
  >([]);
  const [preferenciasDeclaradas, setPreferenciasDeclaradas] = useState<
    Array<{
      id: string;
      categoriaId: string;
      nombre: string;
      categoria: {
        nombre: string;
      };
    }>
  >([]);

  const [selectedRecompensa, setSelectedRecompensa] = useState<any>(null);

  const handleOpenModal = (recompensa: any) => {
    setSelectedRecompensa(recompensa);
  };

  const handleCloseModal = () => {
    setSelectedRecompensa(null);
  };

  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    const getPreferencias = async () => {
      const preferencias = (await client.models.PreferenciaDeclarada.list({
        selectionSet: ["categoria.nombre", "nombre", "categoriaId", "id"],
      })) as {
        data: Array<{
          id: string;
          categoriaId: string;
          nombre: string;
          categoria: {
            nombre: string;
          };
        }>;
      };
      setPreferenciasDeclaradas(preferencias.data);

      if (preferencias.data.length > 0) {
        const categoriasIds = preferencias.data
          .map((preferencia) => preferencia.categoriaId)
          .filter((id): id is string => id !== null);
        setCategoriasIds(categoriasIds);

        const filter = { or: categoriasIds.map((id) => ({ categoriaId: { eq: id } })) };

        const recompensas = (await client.models.Recompensa.list({
          filter,
          selectionSet: ["nombre", "categoriaId", "categoria.nombre", "id", "img"],
        })) as {
          data: Array<{
            id: string;
            categoriaId: string;
            nombre: string;
            img: string;
            categoria: {
              nombre: string;
            };
          }>;
        };

        setRecompensas(recompensas.data);
      }
    };

    getPreferencias();

    return () => {
      setCategoriasIds([]);
      setPreferenciasDeclaradas([]);
      setRecompensas([]);
    };
  }, []);

  return (
    <>
      <section className="py-4 text-center">
        <h3 className="text-3xl mb-4">Venture X te da mucho más</h3>
        <p className="text-lg mb-4">Disfruta de los beneficios que te da tu tarjeta</p>

        {/* Mostrar invitación si no hay preferencias declaradas */}
        {preferenciasDeclaradas.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h4 className="text-xl font-semibold mb-2">
              ¿Quieres descubrir recompensas personalizadas?
            </h4>
            <Link href="/preferencias">
              <button className="mt-4 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition">
                Establecer preferencias
              </button>
            </Link>
          </div>
        ) : (
          <div className="recompensas-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recompensas
              .filter((recompensa) =>
                preferenciasDeclaradas.some(
                  (preferencia) => preferencia.categoriaId === recompensa.categoriaId
                )
              )
              .map((recompensa) => (
                <RecompensaCard
                  key={recompensa.id}
                  recompensa={recompensa}
                  onOpenModal={handleOpenModal}
                />
              ))}
          </div>
        )}

        <div className="flex justify-end items-end">
          <Link href="/recompensas" className="underline text-blue-600 hover:text-blue-800 my-2">
            Ver Todas Las Recompensas
          </Link>
        </div>
      </section>

      {/* Modal estilizado */}
      {selectedRecompensa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-2">{selectedRecompensa.nombre}</h3>
            <p className="text-gray-700 mb-4">{selectedRecompensa.categoria.nombre}</p>
            <p className="text-gray-600">{selectedRecompensa.terminos}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
