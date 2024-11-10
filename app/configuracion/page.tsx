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


function InputArea({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  disabled,
}: InputAreaProps) {
  return (
    <div>
      <h2>{label}</h2>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ width: "100%", height: "100px", marginBottom: "10px" }}
      />
      <button onClick={onSubmit} disabled={disabled}>
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
          
          console.log("Categorias",[...data.items] );
          setCategorias([...data.items])},
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

  function handlePreferenciaClick(preferencia: Schema["Preferencia"]["type"]) {
    client.models.PreferenciaDeclarada.create({
      nombre: preferencia.nombre,
      preferenciaId: preferencia.id,
      categoriaId: preferencia.categoriaId,
    }).then(() => {
      console.log("Preferencia declarada asignada");
    }).catch((e) => {
      console.error("Error al declarar la preferencia", e);
    }).finally(() => {
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
    <main>
      <h1>{user?.signInDetails?.loginId}'s Data Management</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Sección para Categorias */}
        <section
          style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <InputArea
            label="Agregar Categorías"
            placeholder="Ingresa las categorías separadas por coma"
            value={categoriaInput}
            onChange={(e) => setCategoriaInput(e.target.value)}
            onSubmit={createCategoriasFromInput}
            disabled={!categoriaInput.trim()}
          />
          <h3>Categorías existentes:</h3>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <ul>
              {categorias.map((categoria) => (
                <li key={categoria.id} onClick={() => handleEliminarCategoria(categoria.id)}>{categoria.nombre} - {categoria.id}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sección para Preferencias */}
        <section
          style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h2>Agregar Preferencias</h2>
          <label htmlFor="categoriaSelect">Selecciona una categoría:</label>
          <select
            id="categoriaSelect"
            value={selectedCategoriaId ?? ""}
            onChange={(e) => listPreferencias(e.target)}
            style={{ width: "100%", marginBottom: "10px" }}
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
          <h3>Preferencias existentes:</h3>
          <ul>
            {preferencias.map((preferencia) => (
              <li
                key={preferencia.id}
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => handlePreferenciaClick(preferencia)}
              >
                {preferencia.nombre}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sección para PreferenciasDeclaradas */}
      <section className="border border-gray-300 p-5 rounded mt-5">
        <h2 className="text-xl font-semibold mb-3">Preferencias Declaradas</h2>
        <ul>
          {preferenciasDeclaradas.map((preferenciaDeclarada) => (
        <li
          className="cursor-pointer text-red-500 hover:underline"
          onClick={() =>
            handlePreferenciaDeclaradaClick(preferenciaDeclarada.id)
          }
          key={preferenciaDeclarada.id}
        >
          {preferenciaDeclarada.nombre}
        </li>
          ))}
        </ul>
      </section>

      <Recompensas />
      <Setup />

      <button onClick={signOut} style={{ marginTop: "20px" }}>
        Sign out
      </button>
    </main>
  );
}
