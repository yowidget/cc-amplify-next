// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

const Navbar: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Cierra el menú al hacer clic en un enlace o el logo
  };

  return (
    <nav className="bg-white text-capitalone-blue p-4 border-b-2 border-capitalone-blue relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Botón de menú hamburguesa (visible en móviles) */}
        <button
          onClick={toggleMenu}
          className="block md:hidden focus:outline-none text-capitalone-blue"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Logo y nombre */}
        <div className="flex items-center md:items-start w-full md:w-auto justify-center md:justify-start">
          <Link href="/" passHref>
            <button onClick={handleLinkClick}>
              <Image
                src="/COT_logo.svg" // Ruta del logo
                alt="Logo de MyApp"
                width={120} // Ancho del logo (ajustable)
                height={40} // Alto del logo (ajustable)
                className="cursor-pointer"
                priority // Carga optimizada para el logo
              />
            </button>
          </Link>
        </div>

        {/* Enlaces de navegación para pantallas grandes */}
        <div className="hidden md:flex md:flex-row md:space-x-4 md:items-center">
          <Link href="/preferencias" className="hover:text-capitalone-red">
            Preferencias
          </Link>
          <Link href="/recompensas" className="hover:text-capitalone-red" onClick={handleLinkClick}>
              Recompensas
            </Link>
          <button onClick={signOut} className="hover:text-capitalone-red">
            Sign out
          </button>
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-capitalone-blue md:hidden z-20">
          <div className="flex flex-col p-4 space-y-2">
            <Link href="/" className="hover:text-capitalone-red" onClick={handleLinkClick}>
              Inicio
            </Link>
            <Link href="/preferencias" className="hover:text-capitalone-red" onClick={handleLinkClick}>
              Preferencias
            </Link>
            <Link href="/recompensas" className="hover:text-capitalone-red" onClick={handleLinkClick}>
              Recompensas
            </Link>
         
            <button onClick={() => { handleLinkClick(); signOut(); }} className="text-left hover:text-capitalone-red">
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
