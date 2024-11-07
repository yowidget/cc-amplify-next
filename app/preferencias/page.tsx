"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { categories, categoryIcons } from './categories';
import { CategoryListProps } from './model';
Amplify.configure(outputs);

const client = generateClient<Schema>();

const CategoryList = ({ categories }: CategoryListProps) => {
  return (
    <div>
    <h2>Selecciona tus preferencias</h2>
    {Object.values(categories).map((category)=> (
      <section
        style={{
          borderRadius: "8px",
          minWidth: "90vw",
        }}>
        <div key={category.id}>
          <h4>{categoryIcons[category.id as keyof typeof categoryIcons]} {category.nombre}</h4>
          <ul className="chip-wrapper">
            {category.preferencias.map((preferencia,index)=> (
              <li 
              key={`${category.id}-${index}`}
              className="chip">{preferencia}</li>  
            ))}
          </ul>
        </div>
      </section>

    ))}
    </div>        
  )
}

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
        <CategoryList categories={categories} />
      </div>
      <button onClick={signOut} style={{
        margin: "1rem",
        position: "fixed",
        bottom: 0,
        width: "80vw",
        display: "block",
        }}>
        Next
      </button>        
    </main>
  );
}
