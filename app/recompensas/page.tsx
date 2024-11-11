"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import getRecompensasSugeridas from "@/src/functions/getRecompensasSugeridas";

Amplify.configure(outputs);

import { RecompensaCard } from "../../components/RecompensaCard";

const client = generateClient<Schema>();

interface Recompensa {
  id: string;
  nombre: string;
}

interface PreferenciaDeclarada {
  id: string;
  categoriaId: string;
  nombre: string;
  categoria: {
    nombre: string;
  };
}

interface RecompensaCategoria {
  recompensaId: string;
  categoriaId: string;
}

interface Categoria {
  id: string;
  nombre: string;
}

export default function MisRecompensas() {

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [recompensasSugeridas, setRecompensasSugeridas] = useState<Recompensa[]>([]);
  const [selectedRecompensa, setSelectedRecompensa] = useState<Recompensa | null>(null);
  const [recompensasCategorias, setRecompensasCategorias] = useState<RecompensaCategoria[]>([]);
  
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleOpenModal = (recompensa: Recompensa) => {
    setSelectedRecompensa(recompensa);
  };

  const handleCloseModal = () => {
    setSelectedRecompensa(null);
  };

  function listRecompensas() {
    try {
      const subscription = client.models.Recompensa.observeQuery({
        selectionSet: ["nombre", "id", "img"],
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

  function listRecompensasCategorias() {
    try {
      const subscription = client.models.RecompensaCategoria.observeQuery({
        selectionSet: ["recompensaId", "categoriaId"],
      }).subscribe({
        next: (data) => {
          setRecompensasCategorias(data.items as RecompensaCategoria[]);
        },
      });
      return subscription;
    } catch (e) {
      console.error("Error al listar las relaciones de recompensa-categoría:", e);
    }
  }

  function listCategorias() {
    try {
      const subscription = client.models.Categoria.observeQuery({
        selectionSet: ["nombre", "id"],
      }).subscribe({
        next: (data) => {
          setCategorias(data.items as Categoria[]);
        },
      });
      return subscription;
    } catch (e) {
      console.error("Error al listar las categorías:", e);
    }
  }

  useEffect(() => {
    getRecompensasSugeridas().then((data) => {
      if (data) {
        setRecompensasSugeridas(data);
      }
    });
    const subCategorias = listCategorias();
    const subRecompensas = listRecompensas();
    const subRecompensasCategorias = listRecompensasCategorias();

    return () => {
      subCategorias?.unsubscribe();
      subRecompensas?.unsubscribe();
      subRecompensasCategorias?.unsubscribe();
    };
  }, []);

  const recompensasPorCategoria = recompensasCategorias.reduce(
    (acc: Record<string, Recompensa[]>, { recompensaId, categoriaId }) => {
      const recompensa = recompensas.find((r) => r.id === recompensaId);
      const categoria = categorias.find((p) => p.id === categoriaId);

      if (recompensa && categoria) {
        const categoriaNombre = categoria.nombre;
        if (!acc[categoriaNombre]) acc[categoriaNombre] = [];
        acc[categoriaNombre].push(recompensa);
      }

      return acc;
    },
    {}
  );

  const categoriasConRecompensas = Object.keys(recompensasPorCategoria).sort((a, b) => {
    if (a === "Sin Categoría") return 1;
    if (b === "Sin Categoría") return -1;
    return a.localeCompare(b);
  });

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCategory = (categoriaNombre: string) => {
    const section = document.getElementById(categoriaNombre);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="sticky top-0 bg-white py-2 border-b border-gray-300 z-10 flex justify-between items-center px-4">
        <h2 className="text-m">Recompensas</h2>
        <button
          onClick={toggleMenuVisibility}
          className="text-blue-500 hover:text-blue-700 transition"
        >
          {isMenuVisible ? "Ocultar Categorías" : "Mostrar Categorías"}
        </button>
      </div>

      {isMenuVisible && (
        <nav className="sticky top-11 bg-white py-2 border-b border-gray-300 z-10">
          <div className="flex flex-wrap gap-2 px-4">
            <button
              onClick={() => scrollToSection("recompensas-para-ti")}
              className="px-3 py-2 bg-gray-200 rounded text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
            >
              Recompensas para Ti
            </button>
            {categoriasConRecompensas.map((categoriaNombre) => (
              <button
                key={categoriaNombre}
                onClick={() => scrollToCategory(categoriaNombre)}
                className="px-3 py-2 bg-gray-200 rounded text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
              >
                {categoriaNombre}
              </button>
            ))}
          </div>
        </nav>
      )}

      <section id="recompensas-para-ti" className="seccion-recompensas mt-8">
        <h3 className="mb-4">Recompensas para ti</h3>
          {recompensasSugeridas.length > 0 ? (
            recompensasSugeridas.map((recompensa) => (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              <RecompensaCard
                key={recompensa.id}
                recompensa={recompensa}
                onOpenModal={handleOpenModal}
              />
        </div>

            ))
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h4 className="mb-2">
              Por el momento no hay recompensas para mostrar.
            </h4>
          </div>
          )}
      </section>

      <section className="seccion-recompensas mt-8">
        <h3 className="mb-4">Recompensas Todas</h3>
        <div>
          {
          categoriasConRecompensas.length > 0 ? (
          categoriasConRecompensas.map((categoriaNombre) => (
            <div key={categoriaNombre} id={categoriaNombre} className="mb-8">
              <div className="border-b-2 border-gray-300 mb-4 pb-2">
                <h4 className="text-xl font-bold text-gray-700">{categoriaNombre}</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recompensasPorCategoria[categoriaNombre].map((recompensa) => (
                  <RecompensaCard
                    key={recompensa.id}
                    recompensa={recompensa}
                    onOpenModal={handleOpenModal}
                  />
                ))}
              </div>
            </div>
          ))): 
          (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
              <h4 className="mb-2">
                Por el momento no hay recompensas para mostrar.
              </h4>
          </div>            
          )
        }
        </div>
      </section>

      {selectedRecompensa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">{selectedRecompensa.nombre}</h3>
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
