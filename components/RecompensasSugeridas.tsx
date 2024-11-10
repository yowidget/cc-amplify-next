"use client";

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
  const [categoriasId, setCategoriasIds] = useState<Array<string>>([]);
  const [recompensas, setRecompensas] = useState<
  Array<{ 
    id: string; 
    categoriaId: string;
    nombre: string; 
    categoria: { 
      nombre: string 
    } 
  }>
  >([]);
  const [preferenciasDeclaradas, setPreferenciasDeclaradas] = useState<
  Array<{ 
    id: string; 
    categoriaId: string;
    nombre: string; 
    categoria: { 
      nombre: string 
    }  
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
      const preferencias  = await client.models.PreferenciaDeclarada.list({
        selectionSet: ["categoria.nombre", "nombre", "categoriaId", "id"],
      }) as { data: Array<{
        id: string;
        categoriaId: string;
        nombre: string;
        categoria: {
          nombre: string;
        };
      }> };
      console.log("preferencias: ", preferencias);
      setPreferenciasDeclaradas(preferencias.data);
      const categoriasIds = preferencias.data
        .map((preferencia) => preferencia.categoriaId)
        .filter((id): id is string => id !== null);
      setCategoriasIds(categoriasIds);
      let fieldName = "categoriaId";
      console.log({ categoriasId });
      let filterMembers = categoriasIds.map((item) =>
        JSON.parse(`{"${fieldName}":{"eq":"${item}"}}`)
      );
      let filter = { or: filterMembers };
      console.log({ filter });
      const recompensas = await client.models.Recompensa.list({
        filter,
        selectionSet: ["nombre", "categoriaId", "categoria.nombre", "id"],
      }) as { data: Array<{
        id: string;
        categoriaId: string;
        nombre: string;
        categoria: {
          nombre: string;
        };
      }> };
      console.log("recompensas: ", recompensas);
      setRecompensas(recompensas.data);
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
      <section className="seccion-recompensas">
        <h3>Hoy para ti:</h3>
        <div className="recompensas-list">
          {recompensas
            .filter((recompensa) =>
              preferenciasDeclaradas.some(
                (preferencia) =>
                  preferencia.categoriaId === recompensa.categoriaId
              )
            )
            .map((recompensa) => (
              // <div key={recompensa.id} className="recompensas-card">
              //   {recompensa.nombre} - {recompensa.categoria.nombre}
              // </div>
              <RecompensaCard
                key={recompensa.id}
                recompensa={recompensa}
                onOpenModal={handleOpenModal}
              />
            ))}
        </div>
      </section>
      {selectedRecompensa && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedRecompensa.nombre}</h3>
            {/* <p>{selectedRecompensa.detalles}</p> */}
            {/* <p>Fecha de caducidad: {selectedRecompensa.fechaCaducidad}</p> */}
            <p>{selectedRecompensa.terminos}</p>
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}
