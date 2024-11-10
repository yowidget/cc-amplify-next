import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" passHref>
          <a className="text-2xl font-bold">MyApp</a>
        </Link>
        <div className="space-x-4">
          <Link href="/" passHref>
            <a className="hover:text-gray-300">Home</a>
          </Link>
          <Link href="/about" passHref>
            <a className="hover:text-gray-300">About</a>
          </Link>
          <Link href="/contact" passHref>
            <a className="hover:text-gray-300">Contact</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;