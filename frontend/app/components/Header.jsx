"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import clubLogo from "../../public/srijansilclublogo.jpg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navBarItems = [
    { name: "Home", link: "/" },
    { name: "Events", link: "/events" },
    { name: "Gallery", link: "/gallery" },
    { name: "Members", link: "/members" },
    { name: "Notices", link: "/notices" },
    { name: "Resources", link: "/resources" },
    { name: "Contact", link: "/#contact" },
    { name: "About", link: "/about" }
  ];

  const isActive = (link) => pathname === link;

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-blue-500 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition" />
            <Image
              src={clubLogo}
              alt="Srijansil Club Logo"
              width={50}
              height={50}
              className="h-12 w-12 object-contain rounded-full relative z-10"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 leading-tight">
              Srijansil Club
            </span>
            <span className="text-xs text-amber-600 font-medium">For Change</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navBarItems.map((itemNav) => (
              <li key={itemNav.name}>
                <Link
                  href={itemNav.link}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(itemNav.link)
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {itemNav.name}
                </Link>
              </li>
            ))}
            <li className="ml-2">
              <Link
                href="/events"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                Join Event
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-amber-100 transition"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <ul className="flex flex-col px-4 py-4 gap-1">
              {navBarItems.map((itemNav) => (
                <li key={itemNav.name}>
                  <Link
                    href={itemNav.link}
                    className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(itemNav.link)
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {itemNav.name}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href="/events"
                  className="block text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Join Event
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
