"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
import "./styles.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
Amplify.configure(outputs);

import { RecompensaCard } from "../../src/components/RecompensaCard";

const client = generateClient<Schema>();

export default function MisRecompensas() {
  const [categoriasId, setCategoriasIds] = useState<Array<string>>([]);
  const [recompensas, setRecompensas] = useState<
    Array<{
      id: string;
      categoriaId?: string;
      nombre: string;
      categoria?: {
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

  const getPreferencias = async () => {
    const preferencias = await client.models.PreferenciaDeclarada.list({
      selectionSet: ["categoria.nombre", "nombre", "categoriaId", "id"],
    }) as {
      data: Array<{
        id: string;
        categoriaId: string;
        nombre: string;
        categoria: {
          nombre: string;
        };
      }>
    };
    // console.log("preferencias: ", preferencias);
    setPreferenciasDeclaradas(preferencias.data);
    const categoriasIds = preferencias.data
      .map((preferencia) => preferencia.categoriaId)
      .filter((id): id is string => id !== null);
    setCategoriasIds(categoriasIds);
    let fieldName = "categoriaId";
    // console.log({ categoriasId });
    let filterMembers = categoriasIds.map((item) =>
      JSON.parse(`{"${fieldName}":{"eq":"${item}"}}`)
    );
    let filter = { or: filterMembers };
    // console.log({ filter });
    const recompensas = await client.models.Recompensa.list({
      filter,
      selectionSet: ["nombre", "categoriaId", "categoria.nombre", "id"],
    }) as {
      data: Array<{
        id: string;
        categoriaId: string;
        nombre: string;
        categoria: {
          nombre: string;
        };
      }>
    };
    // console.log("recompensas: ", recompensas);
    setRecompensas(recompensas.data);
  };

  function getRecomendaciones() {

    client.models.Transaccion.list({
      selectionSet: ["id", "concepto", "categoria.*"],
    }).then(({ data, errors }) => {
      if (errors) {
        throw console.error("Error al obtener las transacciones", errors);
      }
      data.map((transaccion) => {
        const categoriaId = transaccion.categoria.id
        client.models.RecompensaCategoria.list({ filter: { categoriaId: { eq: categoriaId } } }).then(({ data, errors }) => {
          if (errors) {
            throw console.error("Error al obtener las recompensas por categoria", errors);
          }
          if (data) {
            data.map((recompensaCategoria) => {
              client.models.Recompensa.list({
                filter: { id: { eq: recompensaCategoria.id } },
                selectionSet: ["nombre", "categoriaId", "categoria.nombre", "categoria.id", "id"]
              }).then(({ data: tmprecompensas, errors }) => {
                if (errors) {
                  throw console.error("Error al obtener las recompensas", errors);
                }
                tmprecompensas.map((recompensa) => {
                  setRecompensas([...recompensas, { id: recompensa.id, categoriaId: recompensa?.categoriaId || "", nombre: recompensa?.nombre || "", categoria: recompensa.categoria }]);
                  console.log("Recompensa agregada a recomendaciones: ",recompensa)
                })
                // console.log("Recompensa: ", recompensaCreada);


              })
            })
          }
        })
        // id: string;
        // categoriaId: string;
        // nombre: string;
        // categoria: {
        //   nombre: string
        // }

      })
      // console.log("Transacciones: ", data);
    });
  }

  useEffect(() => {
    getPreferencias();
    getRecomendaciones();
    return () => {
      setCategoriasIds([]);
      setPreferenciasDeclaradas([]);
      setRecompensas([]);
    };
  }, []);

  async function test() {
    const { data, errors } = await client.models.Categoria.list({ selectionSet: ["id", "nombre"] })
    if (errors) {
      console.error("Error al obtener las categorias", errors);
    }
    if (data) {
      const transaccion = client.models.Transaccion.create({ concepto: "test", categoriaId: data[0].id })
      console.log("Transaccion creada: ", transaccion);
    }

  }

  return (
    <>
      <button onClick={() => test()}>Test</button>
      <h1>{user?.signInDetails?.loginId}'s Recompensas</h1>
      <section className="seccion-recompensas">
        <h3>Preferencias Declaradas:</h3>
        <div className="slider">
          <div className="slider-track">
            {preferenciasDeclaradas.map((preferencia) => (
              <div key={preferencia.id} className="slider-item">
                {preferencia.nombre} - {preferencia.categoria?.nombre || "Sin categoria"}{" "}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="seccion-recompensas">
        <h3>Recompensas personalizadas:</h3>
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
