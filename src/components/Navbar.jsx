import { head } from "aws-amplify/api";

export const Navbar = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-item">
          <a href="/">Inicio</a>
        </div>
        <div className="navbar-item">
          <a href="/misrecompensas">Recompensas</a>
        </div>
        <div className="navbar-item">
          <a href="/configuracion">Configuración</a>
        </div>
      </nav>
    </header>
  );
};
