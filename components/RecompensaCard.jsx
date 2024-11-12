import "./RecompensaCard.css";
import {  getUrl } from "aws-amplify/storage";
import { useEffect, useState } from "react";

export const RecompensaCard = ({ recompensa, onOpenModal }) => {
  const [url, setURL] = useState("");

    useEffect(() => {
      if (!recompensa.img) return;
      getUrl({ path: recompensa.img || "" })
        .then((result) => {
          setURL(result?.url?.href || "");
        })
        .catch((error) => {
          console.error("Error al obtener la URL de la imagen", error);
        });
    }, [recompensa.img]);
    
  return (
    <div className="recompensa-card">
      <div className="card-categorias">
        <div className="categoria-items">
          {/* <span className="categoria-item">{recompensa.categoria.nombre}</span> */}
          {/* {recompensa.categorias.map((categoria) => (
          ))} */}
        </div>
      </div>
      <img
        // src={recompensa.imagen}
        // alt={recompensa.nombre}
        src={url || "https://via.placeholder.com/150"}
        alt={`imagen de la recompensa ${recompensa.nombre}`}
        className="recompensa-imagen"
      />
      <div className="card-info">
        <span className="beneficio-nombre">{recompensa.nombre}</span>
        {/* <button
          onClick={() => onOpenModal(recompensa)}
          className="detalle-button"
        >
          Ver detalles
        </button> */}         
        <button
          style={{width: "100%", marginBottom:"1rem"}}
          onClick={() => onOpenModal(recompensa)}
          className="px-4 py-2 bg-capitalone-blue-light text-white rounded-md hover:bg-capitalone-indigo transition-all">
          Ver detalles
        </button>

      </div>
    </div>
  );
};
