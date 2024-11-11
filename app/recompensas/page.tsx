"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
Amplify.configure(outputs);

import { RecompensaCard } from "../../components/RecompensaCard";

const client = generateClient<Schema>();

// Definición de tipos para recompensas y preferencias declaradas
interface Recompensa {
  id: string;
  nombre: string;
  categoriaId?: string;
  categoria: {
    nombre: string;
  };
}

interface PreferenciaDeclarada {
  id: string;
  categoriaId: string;
  nombre: string;
  categoria: {
    nombre: string;
  };
}

export default function MisRecompensas() {
  const [categoriasId, setCategoriasIds] = useState<string[]>([]);
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [preferenciasDeclaradas, setPreferenciasDeclaradas] = useState<PreferenciaDeclarada[]>([]);
  const [selectedRecompensa, setSelectedRecompensa] = useState<Recompensa | null>(null);

  const handleOpenModal = (recompensa: Recompensa) => {
    setSelectedRecompensa(recompensa);
  };

  const handleCloseModal = () => {
    setSelectedRecompensa(null);
  };

  function listRecompensas() {
    try {
      const subscription = client.models.Recompensa.observeQuery({
        selectionSet: ["nombre", "categoriaId", "categoria.nombre", "id", "img"],
      }).subscribe({
        next: (data) => {
          setRecompensas(data.items as Recompensa[]);
        },
      });
      return subscription;
    } catch (e) {
      console.error("Error al listar las recompensas:", e);
    }
  }

  function listPreferenciasDeclaradas() {
    try {
      const subscription = client.models.PreferenciaDeclarada.observeQuery({
        selectionSet: ["nombre", "categoriaId", "categoria.nombre", "id"],
      }).subscribe({
        next: (data) => {
          setPreferenciasDeclaradas(data.items as PreferenciaDeclarada[]);
        },
      });
      return subscription;
    } catch (e) {
      console.error("Error al listar las recompensas:", e);
    }
  }

  useEffect(() => {
    const subRecompensas = listRecompensas();
    return () => {
      subRecompensas?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subPreferenciasDeclaradas = listPreferenciasDeclaradas();
    return () => {
      subPreferenciasDeclaradas?.unsubscribe();
    };
  }, []);

  // Agrupar recompensas por categoría, incluyendo las que no tienen categoría
  const recompensasPorCategoria = recompensas.reduce((acc: Record<string, Recompensa[]>, recompensa) => {
    const categoriaNombre = recompensa.categoria?.nombre || "Sin Categoría";
    if (!acc[categoriaNombre]) acc[categoriaNombre] = [];
    acc[categoriaNombre].push(recompensa);
    return acc;
  }, {});

  // Generar lista de categorías con recompensas para la barra de navegación
  const categoriasConRecompensas = Object.keys(recompensasPorCategoria).sort((a, b) => {
    if (a === "Sin Categoría") return 1;
    if (b === "Sin Categoría") return -1;
    return a.localeCompare(b);
  });

    // Función para hacer scroll a una sección específica
    const scrollToSection = (sectionId: string) => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };
  // Función para hacer scroll a una categoría específica
  const scrollToCategory = (categoriaNombre: string) => {
    const section = document.getElementById(categoriaNombre);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
console.log({recompensas});
  return (
    <>
      {/* Barra de Navegación de Categorías */}
      <nav className="sticky top-0 bg-white py-2 border-b border-gray-300 z-10">
        <div className="space-x-2 space-y-1  grid-flow-row-dense">
           {/* Botón para "Recompensas para ti" */}
           <button
            onClick={() => scrollToSection("recompensas-para-ti")}
            className="px-1 py-4 hover:border-b-2 text-capitalone-gray text-sm  transition"
          >
            Recompensas para Ti
          </button>
          {/* Botones para cada categoría */}
          {categoriasConRecompensas.map((categoriaNombre) => (
            <button
              key={categoriaNombre}
              onClick={() => scrollToCategory(categoriaNombre)}
              className="px-1 py-4 hover:border-b-2 border-capitalone-gray text-capitalone-gray text-sm  transition"
            >
              {categoriaNombre}
            </button>
          ))}
        </div>
      </nav>

      {/* Sección de Recompensas Filtradas en Grid */}
      <section id="recompensas-para-ti"  className="seccion-recompensas mt-8">
        <h3 className="text-2xl font-semibold mb-4">Recompensas para ti</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {recompensas
            .filter((recompensa) =>
              preferenciasDeclaradas.some(
                (preferencia) =>
                  preferencia.categoriaId === recompensa.categoriaId
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
      </section>

      {/* Sección de Recompensas Todas, Ordenadas y Separadas por Categoría */}
      <section className="seccion-recompensas mt-8">
        <h3 className="text-2xl font-semibold mb-4">Recompensas Todas</h3>
        <div>
          {categoriasConRecompensas.map((categoriaNombre) => (
            <div key={categoriaNombre} id={categoriaNombre} className="mb-8">
              {/* Separador con el nombre de la categoría */}
              <div className="border-b-2 border-gray-300 mb-4 pb-2">
                <h4 className="text-xl font-bold text-gray-700">{categoriaNombre}</h4>
              </div>
              {/* Slider horizontal de recompensas de la categoría */}
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                {recompensasPorCategoria[categoriaNombre].map((recompensa) => (
                  <div key={recompensa.id} className="min-w-[250px]">
                    <RecompensaCard
                      recompensa={recompensa}
                      onOpenModal={handleOpenModal}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de Detalle de Recompensa */}
      {selectedRecompensa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">{selectedRecompensa.nombre}</h3>
            <p>{selectedRecompensa.categoria.nombre}</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
