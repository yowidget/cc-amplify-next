export const RecompensaCard = ({ recompensa, onOpenModal }) => {
  return (
    <div className="recompensa-card">
      <div className="card-categorias">
        <div className="categoria-items">
          
          {/* {recompensa.categorias.map((categoria) => (
          ))} */}
        </div>
      </div>
      <img
        // src={recompensa.imagen}
        // alt={recompensa.nombre}
        src="https://images.pexels.com/photos/732548/pexels-photo-732548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt={`imagen de la recompensa ${recompensa.nombre}`}
        className="recompensa-imagen"
      />
      <div className="card-info">
        <span className="beneficio-nombre">{recompensa.nombre}</span>
        <button
          onClick={() => onOpenModal(recompensa)}
          className="detalle-button"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};
