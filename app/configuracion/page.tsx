"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Setup from "./setup";
import Recompensas from "./recompensas";
Amplify.configure(outputs);

const client = generateClient<Schema>();

interface InputAreaProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  disabled: boolean;
}

function InputArea({ label, placeholder, value, onChange, onSubmit, disabled }: InputAreaProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{label}</h2>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring focus:ring-blue-200 mb-2"
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        className={`w-full py-2 px-4 rounded-lg text-white transition duration-200 ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
      >
        Crear
      </button>
    </div>
  );
}


export default function Configuracion() {
  const { user, signOut } = useAuthenticator();
  const [categorias, setCategorias] = useState<Array<Schema["Categoria"]["type"]>>([]);
  const [categoriaInput, setCategoriaInput] = useState<string>("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);

  const [preferencias, setPreferencias] = useState<Array<Schema["Preferencia"]["type"]>>([]);
  const [preferenciaInput, setPreferenciaInput] = useState<string>("");
  const [selectedPreferencia, setSelectedPreferencia] = useState<Schema["Preferencia"]["type"] | null>(null);

  const [preferenciasDeclaradas, setPreferenciasDeclaradas] = useState<Array<Schema["PreferenciaDeclarada"]["type"]>>([]);


  useEffect(() => {
    listCategorias();
    listPreferenciasDeclaradas();
  }, []);

  function changeCategoriasSelect(categoriaSelect: HTMLSelectElement) {
    setSelectedCategoriaId(categoriaSelect.value);
    listPreferencias(categoriaSelect.value);
  }

  function listPreferencias(categoriaId?: string) {
    client.models.Preferencia.list({
      filter: {
        categoriaId: { eq: categoriaId || selectedCategoriaId || "" },
      },
    }).then((data) => {
      setPreferencias([...data.data]);
    });
  }

  function listPreferenciasDeclaradas() {
    client.models.PreferenciaDeclarada.list().then((data) => {
      setPreferenciasDeclaradas([...data.data]);
    });
  }

  async function createCategoriasFromInput() {
    const categoriasArray = categoriaInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await Promise.all(
        categoriasArray.map((nombre) =>
          client.models.Categoria.create({ nombre }).then
            (({ data }) => {
              console.log("Categoria creada ", data);
            })
        )
      );
      setCategoriaInput("");
    } catch (e) {
      console.error("Error al crear las categorías", e);
    } finally {
      listCategorias();
    }
  }

  async function createPreferenciasFromInput() {
    if (!selectedCategoriaId) {
      alert(
        "Por favor selecciona una categoría antes de agregar preferencias."
      );
      return;
    }

    const preferenciasArray = preferenciaInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await Promise.all(
        preferenciasArray.map((nombre) =>
          client.models.Preferencia.create({
            nombre,
            categoriaId: selectedCategoriaId,
          }).then(({ data }) => {
            console.log("Preferencia creada ", data);
            listPreferencias();
          })
        )
      );

      setPreferenciaInput("");
    } catch (e) {
      console.error("Error al crear las preferencias", e);
    }
  }

  function listCategorias() {
    try {
      const subscription = client.models.Categoria.observeQuery().subscribe({
        next: (data) => {
          setCategorias([...data.items])
        },
      });
      return subscription;
    } catch (e) {
      console.error("Error al listar las categorías", e);
    }
  }



  function handlePreferenciaClick(id: string) {
    client.models.Preferencia.delete({ id }).then(({ errors }) => {
      if (errors) {
        console.error("Error al eliminar preferencia", errors);
        return;
      }
      console.log("Preferencia eliminada");
      listPreferencias();
    });
  }

  function handleEliminarCategoria(id: string) {
    client.models.Categoria.delete({ id: id });
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{user?.signInDetails?.loginId}'s Data Management</h1>
      <div className="flex flex-wrap gap-8">

        {/* Categorías Section */}
        <section className="flex-1 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
          <InputArea
            label="Agregar Categorías"
            placeholder="Ingresa las categorías separadas por coma"
            value={categoriaInput}
            onChange={(e) => setCategoriaInput(e.target.value)}
            onSubmit={createCategoriasFromInput}
            disabled={!categoriaInput.trim()}
          />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Categorías Existentes:</h3>
          <div className="max-h-64 overflow-y-auto">

            <ul className="space-y-2">
              {categorias.map((categoria) => (
                <li
                  key={categoria.id}
                  className="flex justify-between items-center border-b border-gray-300 pb-2"
                >
                  {/* Primera columna (70%) */}
                  <div className="w-[70%]">
                    <div className="text-sm font-semibold">{categoria.nombre}</div>
                  </div>

                  {/* Segunda columna (30%) */}
                  <div className="w-[30%] flex justify-end">
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                      onClick={() => handleEliminarCategoria(categoria.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>


          </div>
        </section>

        {/* Preferencias Section */}
        <section className="flex-1 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Agregar Preferencias</h2>
          <label htmlFor="categoriaSelect" className="block mb-2 text-gray-600">
            Selecciona una categoría:
          </label>
          <select
            id="categoriaSelect"
            value={selectedCategoriaId ?? ""}
            onChange={(e) => changeCategoriasSelect(e.target)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-200"
          >
            <option value="" disabled>
              -- Selecciona una categoría --
            </option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <InputArea
            label="Agregar Preferencias"
            placeholder="Ingresa las preferencias separadas por coma"
            value={preferenciaInput}
            onChange={(e) => setPreferenciaInput(e.target.value)}
            onSubmit={createPreferenciasFromInput}
            disabled={!preferenciaInput.trim() || !selectedCategoriaId}
          />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Preferencias Existentes:</h3>
          <div className="max-h-[400px] overflow-y-auto">
            <ul className="space-y-2">
              {preferencias.map((preferencia) => (
                <li
                  key={preferencia.id}
                  className="flex justify-between items-center border-b border-gray-300 pb-2"
                >
                  {/* Primera columna (70%) */}
                  <div className="w-[70%]">
                    <div className="text-sm font-semibold">{preferencia.nombre}</div>
                  </div>

                  {/* Segunda columna (30%) */}
                  <div className="w-[30%] flex justify-end">
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                      onClick={() => handlePreferenciaClick(preferencia.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>


        </section>
      </div>

      {/* Otros Componentes */}
      <div className="mt-8">
        <Recompensas />
        <Setup />
      </div>

      <button
        onClick={signOut}
        className="mt-6 w-full py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200"
      >
        Sign out
      </button>
    </main>
  );
}
