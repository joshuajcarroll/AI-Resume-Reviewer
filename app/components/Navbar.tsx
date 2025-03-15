"use client"; // Add this directive for client-side rendering

import Link from "next/link"; // For navigation between pages
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo or App Name */}
        <Link href="/" className="text-2xl font-bold">
          ResumeMatch
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          {/* Add more links here if needed */}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white py-4">
          <div className="flex flex-col items-center">
            <Link href="/" className="py-2" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link href="/dashboard" className="py-2" onClick={toggleMobileMenu}>
              Dashboard
            </Link>
            <Link href="/about" className="py-2" onClick={toggleMobileMenu}>
              About
            </Link>
            {/* Add more links here if needed */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
