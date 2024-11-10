"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import InputLabel from '@mui/material/InputLabel';
import Setup from "./setup";
import Recompensas from "./recompensas";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
      <button color="primary" onClick={onSubmit} disabled={disabled}>
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





  function listPreferencias(categoriaSelect: SelectChangeEvent) {
    setSelectedCategoriaId(categoriaSelect.target.value);
    client.models.Preferencia.list({
      filter: {
        categoriaId: { eq: categoriaSelect.target.value },
      },
    }).then((data) => {
      setPreferencias([...data.data]);
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
        next: (data) => setCategorias([...data.items]),
      });
      return subscription;
    } catch (e) {
      console.error("Error al listar las categorías", e);
    }
  }

  useEffect(() => {
    listCategorias();
  }, []);



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


 



  function handleEliminarCategoria(id: string) {
    client.models.Categoria.delete({ id: id });
  }

  useEffect(() => {
    const subscription = client.models.PreferenciaDeclarada.observeQuery().subscribe({
      next: (data) => setPreferenciasDeclaradas([...data.items])
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main>
          <h2>Bienvenido {user?.signInDetails?.loginId}</h2>
          <h2>Agregar Preferencias</h2>
          <div style={{margin: "1rem 0"}}>
          <InputLabel>Selecciona una categoría:</InputLabel>
          <Select
            className="select"
            labelId="categoriaSelect"
            id="categoriaSelect"
            value={selectedCategoriaId ?? "Selecciona una categoria"}
            label="Selecciona una categoria"
            onChange={listPreferencias}
          >
            {categorias.map((categoria) => (
              <MenuItem  key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </MenuItem>
            ))
            }
          </Select>
          </div>

          <div style={{margin: "1rem 0"}}>
            <InputArea
              label=""
              placeholder="Ingresa las preferencias separadas por coma"
              value={preferenciaInput}
              onChange={(e) => setPreferenciaInput(e.target.value)}
              onSubmit={createPreferenciasFromInput}
              disabled={!preferenciaInput.trim() || !selectedCategoriaId}
            />              
          </div>
          <h2>Tus Preferencias son:</h2>
          {/* Sección para PreferenciasDeclaradas */}
          <section
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
          <div>
          {preferenciasDeclaradas.map((preferencia) => (
            <div key={preferencia.id} className="slider-item">
              {preferencia.nombre}
            </div>
          ))}
          </div>
      </section>
    </main>
  );
}
