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

import { ChangeEvent } from "react";

function InputArea({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
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
  const [transacciones, setTransacciones] = useState<
    Array<Schema["Transaccion"]["type"]>
  >([]);
  const [transaccionInput, setTransaccionInput] = useState<string>("");

  function listTransacciones() {
    const subscription = client.models.Transaccion.observeQuery().subscribe({
      next: (data) => setTransacciones([...data.items]),
    });
    return subscription;
  }
  useEffect(() => {
    const subscription = listTransacciones();
    return () => subscription.unsubscribe();
  }, []);
  async function createTransaccionFromInput() {
    const transaccionesArray = transaccionInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await Promise.all(
        transaccionesArray.map((nombre) =>
          client.models.Transaccion.create({ concepto: nombre })
        )
      );
      setTransaccionInput("");
    } catch (e) {
      console.error("Error al crear las transacciones", e);
    }
  }
  async function handleCreateOrdenClick() {
    console.log("Crear Orden");
    // const orden = await client.mutations.publishOrderToEventBridge({
    // orderId: "12345",
    // status: "SHIPPED",
    // message: "Order has been shipped",
    // });
    //console.log("Orden creada", orden);
  }
  return (
    <main>
      <h1>Transacciones</h1>

      <section
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>Transacciones existentes:</h3>
        <ul>
          {transacciones.map((transaccion) => (
            <li key={transaccion.id}>{transaccion.concepto}</li>
          ))}
        </ul>
        <InputArea
          label="Agregar"
          placeholder="Ingresa las transacciones separadas por coma"
          value={transaccionInput}
          onChange={(e) => setTransaccionInput(e.target.value)}
          onSubmit={createTransaccionFromInput}
          disabled={!transaccionInput.trim()}
        />
      </section>

      <section>
        <h3>Ordenes</h3>
        <input type="text" placeholder="Orden" />
        <button
          onClick={() => {
            handleCreateOrdenClick();
          }}
        >
          Crear Orden
        </button>
      </section>
    </main>
  );
}
