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

  const [recompensas, setRecompensas] = useState<
    Array<Schema["Recompensa"]["type"]>
  >([]);
  const [recompensaInput, setRecompensaInput] = useState<string>("");

  function listCategorias() {
    const subscription = client.models.Categoria.observeQuery().subscribe({
      next: (data) => setCategorias([...data.items]),
    });
    return subscription;
  }

  function listPreferencias(categoriaSelect: HTMLSelectElement) {
    setSelectedCategoriaId(categoriaSelect.value);
    client.models.Preferencia.list({
      filter: {
        categoriaId: { eq: categoriaSelect.value },
      },
    }).then((data) => {
      setPreferencias([...data.data]);
    });
  }

  function listPreferenciasDeclaradas() {
    const subscription =
      client.models.PreferenciaDeclarada.observeQuery().subscribe({
        next: (data) => {
          setPreferenciasDeclaradas([...data.items]);
        },
      });
    return subscription;
  }

  function listRecompensas() {
    const subscription = client.models.Recompensa.observeQuery().subscribe({
      next: (data) => setRecompensas([...data.items]),
    });
    return subscription;
  }

  function handleRecompensaCategoriaChange(id: string, categoriaId: string) {
    client.models.Recompensa.update({
      id,
      categoriaId,
    })
      .then(() => {
        console.log(
          `Recompensa ${id} actualizada con la categoría ${categoriaId}`
        );
      })
      .catch((e) => {
        console.error(`Error al actualizar la recompensa ${id}`, e);
      });
  }
  useEffect(() => {
    const categoriaSubscription = listCategorias();
    const preferenciasDeclaradasSubscription = listPreferenciasDeclaradas();
    const recompensaSubscription = listRecompensas();
    // Cleanup suscripciones para evitar fugas de memoria
    return () => {
      categoriaSubscription.unsubscribe();
      preferenciasDeclaradasSubscription.unsubscribe();
      recompensaSubscription.unsubscribe();
    };
  }, []);

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

  async function createRecompensaFromInput() {
    const recompensasArray = recompensaInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      // const { data, errors } = client.queries.categorize({prompt: recompensaInput});
      const { data, errors } = await client.queries.categorize({
        prompt: recompensaInput
      });
      if (errors) console.log(errors);
      console.log(data?.error);

      data?.categorizedData?.map((item: any) => {
        client.models.Recompensa.create({ nombre: item.text, categoriaId: item.category });
      });

      // await Promise.all(
      //   recompensasArray.map((nombre) =>
      //     client.models.Recompensa.create({ nombre })
      //   )
      // );
      setRecompensaInput("");
    } catch (e) {
      console.error("Error al crear las recompensas", e);
    }
  }

  function handlePreferenciaClick(preferencia: Schema["Preferencia"]["type"]) {
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


  function invokeSayHello() {
    client.queries
      .sayHello({
        name: "Amplify",
      })
      .then((response) => {
        console.log(response);
      });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s Data Management</h1>
      <nav>
        <div>
          <a href="/">Inicio</a>
        </div>
        <div>
          <a href="/configuracion">Configuración</a>
        </div>
        <div>
          <a href="/misrecompensas">Recompensas</a>
        </div>
      </nav>
      <section>
        <div>
          <button onClick={() => invokeSayHello()}>Say Hello</button>

        </div>
      </section>
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

      {/* Sección para Recompensas */}
      <section
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <InputArea
          label="Agregar Recompensas"
          placeholder="Ingresa las recompensas separadas por coma"
          value={recompensaInput}
          onChange={(e) => setRecompensaInput(e.target.value)}
          onSubmit={createRecompensaFromInput}
          disabled={!recompensaInput.trim()}
        />
        <h3>Recompensas existentes:</h3>
        <ul>
          {recompensas.map((recompensa) => (
            <li key={recompensa.id}>
              {recompensa.nombre}
              <div>
                <label htmlFor={`categoriaSelect-${recompensa.id}`}>
                  Selecciona una categoría:
                </label>
                <select
                  id={`categoriaSelect-${recompensa.id}`}
                  value={recompensa.categoriaId ?? ""}
                  onChange={(e) =>
                    handleRecompensaCategoriaChange(
                      recompensa.id,
                      e.target.value
                    )
                  }
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
              </div>
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
