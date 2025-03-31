"use client"; // Ensure client-side rendering

import Link from "next/link";
import { useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs"; // Import Clerk authentication

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, signOut } = useAuth(); // Get authentication state

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
        </div>

        {/* User Authentication - Show Logout if Signed In */}
        <div className="hidden md:flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <UserButton afterSignOutUrl="/" /> {/* Profile Icon */}
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
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

            {/* Show Logout on Mobile */}
            {isSignedIn ? (
              <button
                onClick={() => signOut()}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="mt-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
