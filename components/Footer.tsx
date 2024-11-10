// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-capitalone-blue text-capitalone-white p-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Capital. Todos los derechos reservados.</p>
        <p className="mt-2 text-capitalone-gray-light text-xs">
          Hecho con pasión por el equipo de CapitalChorizo.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
