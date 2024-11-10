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
  return (
    <nav className="bg-white text-capitalone-blue p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo y nombre */}
        <div className="flex items-center space-x-2">
          <Link href="/" passHref>
            <Image
              src="/COT_logo.svg" // Ruta del logo
              alt="Logo de MyApp"
              width={120} // Ancho del logo (ajustable)
              height={40} // Alto del logo (ajustable)
              className="cursor-pointer  md:w-48"
              priority // Carga optimizada para el logo
            />
          </Link>
        </div>

        {/* Enlaces de navegación */}
        <div
          className={`flex-col md:flex md:flex-row md:space-x-4 md:items-center ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          <Link href="/preferencias" className="hover:text-capitalone-red">
            Preferencias
          </Link>
         
          <button onClick={signOut}>Sign out</button>
        </div>
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
      </div>
    </nav>
  );
};

export default Navbar;
