"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import Pill from "@/components/Pill";

Amplify.configure(outputs);

const client = generateClient<Schema>();

// Tipos para las entidades
interface Categoria {
  id: string;
  nombre: string;
  createdAt: string;
  updatedAt: string;
}

interface Preferencia {
  id: string;
  nombre: string;
  categoriaId: string;
}

interface PreferenciaDeclarada {
  id: string;
  nombre: string;
  preferenciaId: string;
  categoriaId: string;
}

export default function Preferencias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [preferencias, setPreferencias] = useState<Preferencia[]>([]);
  const [preferenciasDeclaradas, setPreferenciasDeclaradas] = useState<
    PreferenciaDeclarada[]
  >([]);

  useEffect(() => {
    const subscription =
      client.models.PreferenciaDeclarada.observeQuery().subscribe({
        next: (data) =>
          setPreferenciasDeclaradas([...data.items] as PreferenciaDeclarada[]),
        error: (e) =>
          console.error("Error al cargar preferencias declaradas", e),
      });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = client.models.Categoria.observeQuery().subscribe({
      next: (data) => setCategorias([...data.items] as Categoria[]),
      error: (e) => console.error("Error al cargar las categorías", e),
    });
    return () => subscription.unsubscribe();
  }, [preferenciasDeclaradas]);

  useEffect(() => {
    if (categorias.length > 0) {
      client.models.Preferencia.list()
        .then((data) => {
          const sortedPreferencias = (data.data as Preferencia[]).sort(
            (a, b) => {
              const categoriaA =
                categorias.find((c) => c.id === a.categoriaId)?.nombre || "";
              const categoriaB =
                categorias.find((c) => c.id === b.categoriaId)?.nombre || "";
              return categoriaA.localeCompare(categoriaB);
            }
          );
          setPreferencias(sortedPreferencias);
        })
        .catch((e) => console.error("Error al cargar preferencias", e));
    }
  }, [categorias]);

  function handlePreferenciaClick(preferencia: Preferencia) {
    client.models.PreferenciaDeclarada.create({
      nombre: preferencia.nombre,
      preferenciaId: preferencia.id,
      categoriaId: preferencia.categoriaId,
    }).then((newPreferenciaDeclarada) => {
      setPreferenciasDeclaradas((prev) => [
        ...prev,
        newPreferenciaDeclarada.data as PreferenciaDeclarada,
      ]);
    });
  }

  function handlePreferenciaDeclaradaClick(preferenciaId: string) {
    const preferenciaDeclarada = preferenciasDeclaradas.find(
      (pref) => pref.preferenciaId === preferenciaId
    );
    if (preferenciaDeclarada) {
      client.models.PreferenciaDeclarada.delete({ id: preferenciaDeclarada.id })
        .then(() => {
          setPreferenciasDeclaradas((prev) =>
            prev.filter((pref) => pref.id !== preferenciaDeclarada.id)
          );
        })
        .catch((e) =>
          console.error("Error al eliminar preferencia declarada", e)
        );
    }
  }

  const isPreferenciaActiva = (preferenciaId: string) =>
    preferenciasDeclaradas.some(
      (prefDeclarada) => prefDeclarada.preferenciaId === preferenciaId
    );

  const preferenciasPorCategoria = categorias.map((categoria) => ({
    ...categoria,
    preferencias: preferencias.filter(
      (pref) => pref.categoriaId === categoria.id
    ),
  }));

  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tus Preferencias</h2>

      {preferenciasPorCategoria.map((categoria) => (
        <section key={categoria.id} className="mb-6">
          <h3 className="text-xl font-semibold mb-3">{categoria.nombre}</h3>
          <div className="flex flex-wrap gap-2">
            {categoria.preferencias.map((preferencia) => {
              const activa = isPreferenciaActiva(preferencia.id);
              return (
                <Pill
                  key={preferencia.id}
                  nombre={preferencia.nombre}
                  isActive={activa}
                  onClick={() =>
                    activa
                      ? handlePreferenciaDeclaradaClick(preferencia.id)
                      : handlePreferenciaClick(preferencia)
                  }
                />
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
