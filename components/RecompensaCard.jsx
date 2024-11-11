import "./RecompensaCard.css";
export const RecompensaCard = ({ recompensa, onOpenModal }) => {
  return (
    <div className="recompensa-card">
      <div className="card-categorias">
        <div className="categoria-items">
          <span className="categoria-item">{recompensa.categoria.nombre}</span>
          {/* {recompensa.categorias.map((categoria) => (
          ))} */}
        </div>
        <button className="like-button">❤️</button>
      </div>
      <img
        // src={recompensa.imagen}
        // alt={recompensa.nombre}
        src={recompensa.img || "https://via.placeholder.com/150"}
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
          className="px-4 py-2 bg-capitalone-red text-white rounded-md hover:bg-capitalone-red-dark">
          Ver detalles
        </button>
        <button
          style={{width: "100%", marginBottom:"1rem"}}
          className="px-4 py-2 bg-capitalone-blue text-white rounded-md hover:bg-capitalone-blue-light">
          Solicitar
        </button> 
      </div>
    </div>
  );
};
