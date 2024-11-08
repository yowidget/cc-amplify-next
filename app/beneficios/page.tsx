"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
import "./styles.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
Amplify.configure(outputs);

const client = generateClient<Schema>();

// Datos de prueba para las categorías y recompensas
const categorias = ["Entretenimiento", "Alimentos", "Salud", "Deportes", "Otros"];

const recompensas = [
  {
    id: 1,
    categorias: ["Entretenimiento", "Alimentos"],
    nombre: "2x1 en Cinepolis",
    imagen: "https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg",
    detalles: "Válido en Cinepolis todos los lunes. Aplica restricciones.",
    fechaCaducidad: "2024-12-31",
    terminos: "Válido hasta agotar existencias. Un beneficio por persona.",
  },
  {
    id: 2,
    categorias: ["Viajes"],
    nombre: "10% de descuento en Uber",
    imagen: "https://images.pexels.com/photos/8732920/pexels-photo-8732920.jpeg",
    detalles: "Válido en Uber Eats y Uber Rides. Máximo $50 de descuento.",
    fechaCaducidad: "2024-11-10",
    terminos: "Válido hasta agotar existencias. Un beneficio por persona.",
  },
  {
    id: 3,
    categorias: ["Salud", "Bienestar"],
    nombre: "Consulta médica gratis",
    imagen: "https://images.pexels.com/photos/6129681/pexels-photo-6129681.jpeg",
    detalles: "Válido en consultas generales. No aplica con otras promociones.",
    fechaCaducidad: "2024-12-31",
    terminos: "Valido para mayores de 18 años. Un beneficio por persona.",
  },
  {
    id: 4,
    categorias: ["Alimentos"],
    nombre: "50% de descuento en Starbucks",
    imagen: "https://images.pexels.com/photos/976876/pexels-photo-976876.jpeg",
    detalles: "Válido en bebidas seleccionadas. No aplica con otras promociones.",
    fechaCaducidad: "2024-12-31",
    terminos: "Válido hasta agotar existencias. Un beneficio por persona.",
  },

  // Agregar más objetos de recompensa aquí
];

function RecompensaCard({ recompensa, onOpenModal }: any) {
  return (
    <div className="recompensa-card">
      <div className="card-categorias">
        <div className="categoria-items">
        {recompensa.categorias.map((categoria: string) => (
          <span key={categoria} className="categoria-item">
            {categoria}
          </span>
        ))}

        </div>
        <button className="like-button">❤️</button>
      </div>
     <img 
        src={recompensa.imagen} 
        alt={recompensa.nombre} 
        className="recompensa-imagen"
      />
      <div className="card-info">
        <span className="beneficio-nombre">{recompensa.nombre}</span>
        <button onClick={() => onOpenModal(recompensa)} className="detalle-button">
          Ver detalles
        </button>
      </div>
    </div>
  );
}

export default function RecompensasPage() {
  const [selectedRecompensa, setSelectedRecompensa] = useState<any>(null);

  const handleOpenModal = (recompensa: any) => {
    setSelectedRecompensa(recompensa);
  };

  const handleCloseModal = () => {
    setSelectedRecompensa(null);
  };

  return (
    <>
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar recompensas..."
        className="buscador"
      />

      {/* Categorías */}
      <div className="categorias-list">
        {categorias.map((categoria) => (
          <div key={categoria} className="categoria-item">
            {categoria}
          </div>
        ))}
      </div>

      {/* Historial de recompensas */}
      <h2>Historial de Recompensas y Ahorros</h2>
      <div className="recompensas-list">
        {recompensas.map((recompensa) => (
          <RecompensaCard
            key={recompensa.id}
            recompensa={recompensa}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>

      {/* Modal para ver detalles */}
      {selectedRecompensa && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedRecompensa.nombre}</h3>
            {/* <p>{selectedRecompensa.detalles}</p> */}
            {/* <p>Fecha de caducidad: {selectedRecompensa.fechaCaducidad}</p> */}
            <p>{selectedRecompensa.terminos}</p>
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}
