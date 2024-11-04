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

  const [transacciones, setTransacciones] = useState<
    Array<Schema["Transaccion"]["type"]>
  >([]);
  const [transaccionInput, setTransaccionInput] = useState<string>("");

  const [recompensas, setRecompensas] = useState<
    Array<Schema["Recompensa"]["type"]>
  >([]);
  const [recompensaInput, setRecompensaInput] = useState<string>("");

  const { user, signOut } = useAuthenticator();

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
    const subscription = client.models.PreferenciaDeclarada.observeQuery().subscribe({
      next: (data) => {
        setPreferenciasDeclaradas([...data.items]);
      },
    });
    return subscription;
  }

  function listTransacciones() {
    const subscription = client.models.Transaccion.observeQuery().subscribe({
      next: (data) => setTransacciones([...data.items]),
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
        console.log(`Recompensa ${id} actualizada con la categoría ${categoriaId}`);
      })
      .catch((e) => {
        console.error(`Error al actualizar la recompensa ${id}`, e);
      });
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

  function invokeClasificaConcepto() {
    client.queries
      .clasificaConcepto({
        concepto: "Amplify",
      })
      .then((response) => {
        console.log(response);
      });
  }

  useEffect(() => {
    const categoriaSubscription = listCategorias();
    const preferenciasDeclaradasSubscription = listPreferenciasDeclaradas();
    const transaccionSubscription = listTransacciones();
    const recompensaSubscription = listRecompensas();

    // Cleanup suscripciones para evitar fugas de memoria
    return () => {
      categoriaSubscription.unsubscribe();
      preferenciasDeclaradasSubscription.unsubscribe();
      transaccionSubscription.unsubscribe();
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
        categoriasArray.map((nombre) => client.models.Categoria.create({ nombre }))
      );
      setCategoriaInput("");
    } catch (e) {
      console.error("Error al crear las categorías", e);
    }
  }

  async function createPreferenciasFromInput() {
    if (!selectedCategoriaId) {
      alert("Por favor selecciona una categoría antes de agregar preferencias.");
      return;
    }

    const preferenciasArray = preferenciaInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await Promise.all(
        preferenciasArray.map((nombre) =>
          client.models.Preferencia.create({ nombre, categoriaId: selectedCategoriaId })
        )
      );
      setPreferenciaInput("");
    } catch (e) {
      console.error("Error al crear las preferencias", e);
    }
  }

  async function createTransaccionFromInput() {
    const transaccionesArray = transaccionInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await Promise.all(
        transaccionesArray.map((nombre) => client.models.Transaccion.create({ concepto: nombre }))
      );
      setTransaccionInput("");
    } catch (e) {
      console.error("Error al crear las transacciones", e);
    }
  }

  async function createRecompensaFromInput() {
    const recompensasArray = recompensaInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await Promise.all(
        recompensasArray.map((nombre) => client.models.Recompensa.create({ nombre }))
      );
      setRecompensaInput("");
    } catch (e) {
      console.error("Error al crear las recompensas", e);
    }
  }

  function handlePreferenciaClick(
    preferencia: Schema["Preferencia"]["type"]
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

  function handleTransaccionDelete(id: string) {
    client.models.Transaccion.delete({ id });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s Data Management</h1>
      <section>
        <div>
          <h2>Saludo</h2>
          <button onClick={() => invokeSayHello()}>Say Hello</button>
          <button onClick={() => invokeClasificaConcepto()}>Clasifica Concepto</button>
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
              onClick={() => handlePreferenciaDeclaradaClick(preferenciaDeclarada.id)}
              key={preferenciaDeclarada.id}
            >
              {preferenciaDeclarada.nombre}
            </li>
          ))}
        </ul>
      </section>

      {/* Sección para Transacciones */}
      <section
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <InputArea
          label="Agregar Transacciones"
          placeholder="Ingresa las transacciones separadas por coma"
          value={transaccionInput}
          onChange={(e) => setTransaccionInput(e.target.value)}
          onSubmit={createTransaccionFromInput}
          disabled={!transaccionInput.trim()}
        />
        <h3>Transacciones existentes:</h3>
        <ul>
          {transacciones.map((transaccion) => (
            <li
              key={transaccion.id}
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleTransaccionDelete(transaccion.id)}
            >
              {transaccion.concepto}
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
                <label htmlFor={`categoriaSelect-${recompensa.id}`}>Selecciona una categoría:</label>
                <select
                  id={`categoriaSelect-${recompensa.id}`}
                  value={recompensa.categoriaId ?? ""}
                  onChange={(e) => handleRecompensaCategoriaChange(recompensa.id, e.target.value)}
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
