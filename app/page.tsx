"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [categorias, setCategorias] = useState<Array<Schema["Categoria"]["type"]>>([]);
  const [categoriaInput, setCategoriaInput] = useState<string>("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);

  const [preferencias, setPreferencias] = useState<Array<Schema["Preferencia"]["type"]>>([]);
  const [preferenciaInput, setPreferenciaInput] = useState<string>("");

  const { user, signOut } = useAuthenticator();

  function listCategorias() {
    client.models.Categoria.observeQuery().subscribe({
      next: (data) => setCategorias([...data.items]),
    });
  }

  function listPreferencias( categoriaSelect: HTMLSelectElement ) {
    setSelectedCategoriaId(categoriaSelect.value);
    // client.models.Preferencia.observeQuery().subscribe({
    //   next: (data) => {
    //     console.log({data});
    //     setPreferencias([...data.items])},
    // });
    client.models.Preferencia.list({
      filter: {
        categoriaId: { eq: categoriaSelect.value },
      },
    }).then((data) => {
      console.log(data);
      setPreferencias([...data.data]);
    });
  }

  useEffect(() => {
    listCategorias();
    // listPreferencias();
  }, []);

  function createCategoriasFromInput() {
    const categoriasArray = categoriaInput.split(",").map((item) => item.trim()).filter(Boolean);
    categoriasArray.forEach((nombre) => {
      client.models.Categoria.create({
        nombre,
      });
    });
    setCategoriaInput("");
  }

  function createPreferenciasFromInput() {
    if (!selectedCategoriaId) {
      alert("Por favor selecciona una categoría antes de agregar preferencias.");
      return;
    }

    const preferenciasArray = preferenciaInput.split(",").map((item) => item.trim()).filter(Boolean);
    preferenciasArray.forEach((nombre) => {
      client.models.Preferencia.create({
        nombre,
        categoriaId: selectedCategoriaId, // Asocia la preferencia a la categoría seleccionada
      });
    });
    setPreferenciaInput("");
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s Data Management</h1>
      
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Sección para Categorias */}
        <section style={{ flex: 1, border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <h2>Agregar Categorías</h2>
          <textarea
            placeholder="Ingresa las categorías separadas por coma"
            value={categoriaInput}
            onChange={(e) => setCategoriaInput(e.target.value)}
            style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          />
          <button onClick={createCategoriasFromInput} disabled={!categoriaInput.trim()}>
            Crear categorías
          </button>
          <h3>Categorías existentes:</h3>
          <ul>
            {categorias.map((categoria) => (
              <li key={categoria.id}>{categoria.nombre}</li>
            ))}
          </ul>
        </section>

        {/* Sección para Preferencias */}
        <section style={{ flex: 1, border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <h2>Agregar Preferencias</h2>
          
          {/* Select para seleccionar una categoría */}
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

          <textarea
            placeholder="Ingresa las preferencias separadas por coma"
            value={preferenciaInput}
            onChange={(e) => setPreferenciaInput(e.target.value)}
            style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          />
          <button onClick={createPreferenciasFromInput} disabled={!preferenciaInput.trim() || !selectedCategoriaId}>
            Crear preferencias
          </button>
          <h3>Preferencias existentes:</h3>
          <ul>
            {preferencias.map((preferencia) => (
              <li key={preferencia.id}>{preferencia.nombre}</li>
            ))}
          </ul>
        </section>
      </div>

      <button onClick={signOut} style={{ marginTop: "20px" }}>Sign out</button>
    </main>
  );
}
