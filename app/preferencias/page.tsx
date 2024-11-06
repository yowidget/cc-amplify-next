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
      await Promise.all(
        recompensasArray.map((nombre) =>
          client.models.Recompensa.create({ nombre })
        )
      );
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
      <h3 style={{ textAlign: "center"}}>Welcome {user?.signInDetails?.loginId}</h3>
      <button onClick={signOut} style={{ marginTop: "20px" }}>
        Sign out
      </button>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Sección para preferencias */}
        <section
          style={{
            borderRadius: "8px",
            margin: "1rem",
            minWidth: "90vw",
          }}
        >
          <h2>Selecciona tus preferencias</h2>
          <h4>Essentials</h4>
          <ul className="chip-wrapper">
            <li className="chip">🏡 Rent</li>
            <li className="chip">🏡 Utilities</li>
            <li className="chip">🏡 Phone</li>
            <li className="chip">🏡 Rent</li>
            <li className="chip">🏡 Utilities</li>
            <li className="chip">🏡 Phone</li>          
          </ul>
          <h4>Food & Drink</h4>
          <ul className="chip-wrapper">
            <li className="chip">🌭 hot dog flavor water</li>
            <li className="chip">🍔 B King</li>
            <li className="chip">🍜 Wok</li>
            <li className="chip">🥑 Wallgreens</li>
            <li className="chip">🏡 Walmart</li>
            <li className="chip">🏡 Phone</li>          
          </ul>
          <h4>Health & Wellness</h4>
          <ul className="chip-wrapper">
            <li className="chip">🏡 Rent</li>
            <li className="chip">🏡 Utilities</li>
            <li className="chip">🏡 Phone</li>
            <li className="chip">🏡 Rent</li>
            <li className="chip">🏡 Utilities</li>
            <li className="chip">🏡 Phone</li>          
          </ul>          
          <h4>Miscellaneous</h4>
          <ul className="chip-wrapper">
            <li className="chip">🏡 Rent</li>
            <li className="chip">🏡 Utilities</li>
            <li className="chip">🏡 Phone</li>
            <li className="chip">🏡 Rent</li>
            <li className="chip">🏡 Utilities</li>
            <li className="chip">🏡 Phone</li>          
          </ul>          
        </section>
      </div>
      <button onClick={signOut} style={{ margin: "1rem" }}>
        Next
      </button>        
    </main>
  );
}
