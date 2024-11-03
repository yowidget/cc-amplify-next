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
  const [recompensas, setRecompensas] = useState<
    Array<Schema["Recompensa"]["type"]>
  >([]);
  const [preferenciasDeclaradas, setPreferenciasDeclaradas] = useState<
    Array<Schema["PreferenciaDeclarada"]["type"]>
  >([]);

  const { user, signOut } = useAuthenticator();

  function listRecompensas() {
    const subscription = client.models.Recompensa.observeQuery(
        {
            selectionSet: ['nombre', 'categoriaId', 'categoria.nombre', 'id'],
          }
    ).subscribe({
      next: (data) => {
        console.log("recompensas:",data.items);
        setRecompensas([...data.items])},
    });
    return subscription;
  }

  function listPreferenciasDeclaradas() {
    const subscription = client.models.PreferenciaDeclarada.observeQuery(
        {
            selectionSet: ['categoria.nombre', 'nombre','preferenciaId','categoriaId'],
          }
    ).subscribe({
      next: (data) => {
        console.log(data.items);
        setPreferenciasDeclaradas([...data.items])},
    });
    return subscription;
  }


  useEffect(() => {
      const preferenciaSubscription = listPreferenciasDeclaradas();
      const recompensaSubscription = listRecompensas();

    // Cleanup suscripciones para evitar fugas de memoria
    return () => {
      recompensaSubscription.unsubscribe();
      preferenciaSubscription.unsubscribe();
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
            <li key={preferencia.id}>{preferencia.nombre} - {preferencia.categoria.nombre} </li>
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
                (preferencia) => preferencia.categoriaId === recompensa.categoriaId
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
