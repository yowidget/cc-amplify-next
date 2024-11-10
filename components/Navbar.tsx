// components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white text-capitalone-blue p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo y nombre */}
        <div className="flex items-center space-x-2">
          <Link href="/" passHref>
            <Image 
              src="/COT_logo.svg"  // Ruta del logo
              alt="Logo de MyApp" 
              width={120}        // Ancho del logo (ajustable)
              height={40}       // Alto del logo (ajustable)
              className="cursor-pointer  md:w-48"
              priority          // Carga optimizada para el logo
            />
          </Link>
         
        </div>

        {/* Enlaces de navegación */}
        <div className="space-x-4">

          <Link href="/recompensas" className="hover:text-capitalone-red">
            Recompensas
          </Link>
          <Link href="/transacciones" className="hover:text-capitalone-red">
            Transacciones
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
