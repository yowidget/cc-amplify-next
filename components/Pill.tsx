// src/components/Pill/Pill.tsx
import React from "react";

interface PillProps {
  nombre: string;
  isActive: boolean;
  onClick: () => void;
}

const Pill: React.FC<PillProps> = ({ nombre, isActive, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={`cursor-pointer px-3 py-1 rounded-full text-sm transition-all ${
        isActive
          ? "bg-capitalone-indigo text-white hover:bg-capitalone-blue"
          : "bg-gray-300 text-capitalone-blue hover:bg-capitalone-indigo hover:text-white"
      }`}
    >
      {nombre}
    </span>
  );
};

export default Pill;
