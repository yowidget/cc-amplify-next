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

  const { user, signOut } = useAuthenticator();

  function listCategorias() {
    client.models.Categoria.observeQuery().subscribe({
      next: (data) => setCategorias([...data.items]),
    });
  }

  function listPreferencias(categoriaSelect: HTMLSelectElement) {
    setSelectedCategoriaId(categoriaSelect.value);
    // client.models.Preferencia.list({
    //   filter: {
    //     categoriaId: { eq: categoriaSelect.value },
    //   },
    //   selectionSet: ["id", "nombre", "categoriaId", "categoria.nombre"],
    // }).then((data) => {
    //   console.log({ data });
    //   // setPreferencias([...data.data]);
    // });
    client.models.Preferencia.list({
      filter: {
        categoriaId: { eq: categoriaSelect.value },
      },
    }).then((data) => {
      console.log("listPreferencias");
      console.log({ data });
      setPreferencias([...data.data]);
    });
  }

  function listPreferenciasDeclaradas() {
    client.models.PreferenciaDeclarada.observeQuery().subscribe({
      next: (data) => {
        setPreferenciasDeclaradas([...data.items]);
      },
    });
  }

  useEffect(() => {
    listCategorias();
    listPreferenciasDeclaradas();
  }, []);

  function createCategoriasFromInput() {
    const categoriasArray = categoriaInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    categoriasArray.forEach((nombre) => {
      client.models.Categoria.create({
        nombre,
      });
    });
    setCategoriaInput("");
  }

  function createPreferenciasFromInput() {
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
    preferenciasArray.forEach((nombre) => {
      client.models.Preferencia.create({
        nombre,
        categoriaId: selectedCategoriaId,
      });
    });
    setPreferenciaInput("");
  }

  // Función para manejar el clic en una preferencia
  function handlePreferenciaClick(
    preferencia: Schema["PreferenciaDeclarada"]["type"]
  ) {
    client.models.PreferenciaDeclarada.create({
      nombre: preferencia.nombre,
      preferenciaId: preferencia.id,
      categoriaId: preferencia.categoriaId,
    });
    setSelectedPreferencia(preferencia);
  }
  function handlePreferenciaDeclaradaClick(id: string) {
    client.models.PreferenciaDeclarada.delete({ id });
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
          <h2>Agregar Categorías</h2>
          <textarea
            placeholder="Ingresa las categorías separadas por coma"
            value={categoriaInput}
            onChange={(e) => setCategoriaInput(e.target.value)}
            style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          />
          <button
            onClick={createCategoriasFromInput}
            disabled={!categoriaInput.trim()}
          >
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

          <textarea
            placeholder="Ingresa las preferencias separadas por coma"
            value={preferenciaInput}
            onChange={(e) => setPreferenciaInput(e.target.value)}
            style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          />
          <button
            onClick={createPreferenciasFromInput}
            disabled={!preferenciaInput.trim() || !selectedCategoriaId}
          >
            Crear preferencias
          </button>
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

          {selectedPreferencia && (
            <div
              style={{
                marginTop: "20px",
                borderTop: "1px solid #ddd",
                paddingTop: "10px",
              }}
            >
              <h4>Detalles de Preferencia Seleccionada:</h4>
              <p>
                <strong>Nombre:</strong> {selectedPreferencia.nombre}
              </p>
              <p>
                <strong>ID de Categoría:</strong>{" "}
                {selectedPreferencia.categoriaId}
              </p>
              {/* Añade más detalles si es necesario */}
            </div>
          )}
        </section>
      </div>

      {/* Sección para PreferenciasDeclaradas */}
      <section
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2>Preferencias Declaradas</h2>
        <ul>
          {preferenciasDeclaradas.map((preferenciaDeclarada) => (
            <li
              style={{ cursor: "pointer", color: "red" }}
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

      <button onClick={signOut} style={{ marginTop: "20px" }}>
        Sign out
      </button>
    </main>
  );
}
