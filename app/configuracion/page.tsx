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
import PreferenciasDeclaradas from "@/src/cruds/recompensaCategorias"
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
        className={`w-full py-2 px-4 rounded-lg text-white transition duration-200 ${
          disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        Crear
      </button>
    </div>
  );
}


export default function Configuracion() {
  const { user, signOut } = useAuthenticator();
  const [categorias, setCategorias] = useState<
    Array<Schema["Categoria"]["type"]>
  >([]);
  const [categoriaInput, setCategoriaInput] = useState<string>("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(
    null
  );

  const [preferencias, setPreferencias] = useState<
    Array<Schema["Preferencia"]["type"]>
  >([]);
  const [preferenciaInput, setPreferenciaInput] = useState<string>("");
  const [selectedPreferencia, setSelectedPreferencia] = useState<
    Schema["Preferencia"]["type"] | null
  >(null);

  const [preferenciasDeclaradas, setPreferenciasDeclaradas] = useState<
    Array<Schema["PreferenciaDeclarada"]["type"]>
  >([]);


  function listPreferencias(categoriaSelect: HTMLSelectElement) {
    setSelectedCategoriaId(categoriaSelect.value);
    client.models.Preferencia.list({
      filter: {
        categoriaId: { eq: categoriaSelect.value },
      },
    }).then((data) => {
      console.log([...data.data]);
      setPreferencias([...data.data]);
    });
  }

  function listPreferenciasDeclaradas() {
    client.models.PreferenciaDeclarada.list().then((data) => {
      setPreferenciasDeclaradas([...data.data]);
    });
  }

  // function listRecompensas() {
  //   const subscription = client.models.Recompensa.observeQuery().subscribe({
  //     next: (data) => setRecompensas([...data.items])
  //   });

  //   return subscription;
  // }



  async function createCategoriasFromInput() {
    const categoriasArray = categoriaInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await Promise.all(
        categoriasArray.map((nombre) =>
          client.models.Categoria.create({ nombre })
        )
      );
      setCategoriaInput("");
    } catch (e) {
      console.error("Error al crear las categorías", e);
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

          console.log("Categorias", [...data.items]);
          setCategorias([...data.items])
        },
      });
      return subscription;
    } catch (e) {
      console.error("Error al listar las categorías", e);
    }
  }

  useEffect(() => {
    listCategorias();
    listPreferenciasDeclaradas();
  }, []);

  function handlePreferenciaClick(preferencia: Schema["PreferenciaDeclarada"]["type"]) {
    PreferenciasDeclaradas.post({ nombre: preferencia.nombre, preferenciaId: preferencia.id }).then(() => {
      console.log("Preferencia declarada creada");
    }
    ).catch((e) => {
      console.error("Error al crear la preferencia declarada", e);
    }
    ).finally(() => {
      setSelectedPreferencia(preferencia);
      listPreferenciasDeclaradas();
    });
  }

  function handlePreferenciaDeclaradaClick(id: string) {
    client.models.PreferenciaDeclarada.delete({ id }).then(() => {
      console.log("Preferencia declarada eliminada");

      listPreferenciasDeclaradas();
    }).catch((e) => {
      console.error("Error al eliminar la preferencia declarada", e);
    }
    );
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
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => handleEliminarCategoria(categoria.id)}
                >
                  {categoria.nombre} - {categoria.id}
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
            onChange={(e) => listPreferencias(e.target)}
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
          <ul className="space-y-2">
            {preferencias.map((preferencia) => (
              <li
                key={preferencia.id}
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => handlePreferenciaClick(preferencia)}
              >
                {preferencia.nombre}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Preferencias Declaradas Section */}
      <section className="border border-gray-300 p-5 rounded-lg mt-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Preferencias Declaradas</h2>
        <ul className="space-y-2">
          {preferenciasDeclaradas.map((preferenciaDeclarada) => (
            <li
              key={preferenciaDeclarada.id}
              className="cursor-pointer text-red-600 hover:underline"
              onClick={() => handlePreferenciaDeclaradaClick(preferenciaDeclarada.id)}
            >
              {preferenciaDeclarada.nombre}
            </li>
          ))}
        </ul>
      </section>

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
