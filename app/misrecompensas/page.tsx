"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function MisRecompensas() {
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

  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    const getPreferencias = async () => {
      const preferencias  = await client.models.PreferenciaDeclarada.list({
        selectionSet: ["categoria.nombre", "nombre", "categoriaId", "id"],
      })  ;
      console.log("preferencias: ", preferencias);
      //setPreferenciasDeclaradas(preferencias.data);
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
      });
      console.log("recompensas: ", recompensas);
      //setRecompensas(recompensas.data);
    };

    getPreferencias();

    return () => {
      setCategoriasIds([]);
      setPreferenciasDeclaradas([]);
      setRecompensas([]);
    };
  }, []);

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s Recompensas</h1>
      <section
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h3>Preferencias Declaradas:</h3>
        <ul>
          {preferenciasDeclaradas.map((preferencia) => (
            <li key={preferencia.id}>
              {preferencia.nombre} - {preferencia.categoria?.nombre || "Sin categoria"}{" "}
            </li>
          ))}
        </ul>
      </section>
      <section
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h3>Recompensas existentes:</h3>
        <ul>
          {recompensas
            .filter((recompensa) =>
              preferenciasDeclaradas.some(
                (preferencia) =>
                  preferencia.categoriaId === recompensa.categoriaId
              )
            )
            .map((recompensa) => (
              <li key={recompensa.id}>
                {recompensa.nombre} - {recompensa.categoria.nombre}
              </li>
            ))}
        </ul>
      </section>
      <button onClick={signOut} style={{ marginTop: "20px" }}>
        Sign out
      </button>
    </main>
  );
}
