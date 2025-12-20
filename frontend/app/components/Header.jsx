"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import clubLogo from "../../public/srijansilclublogo.jpg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // current route

  const navBarItems = [
    { name: "Home", link: "/" },
    { name: "Contact", link: "/contact" },
    { name: "Notices", link: "/notices" },
    { name: "Resources", link: "/resources" },
    { name: "About", link: "/about" },
    { name: "Events", link: "/events" },
    { name: "Results", link: "/results" },
  ];

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const isActive = (link) => pathname === link;

  return (
    <header className="w-full border-b bg-white relative">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex items-center gap-2">
          <motion.div variants={item}>
            <Image
              src={clubLogo}
              alt="Srijansil Club Logo"
              width={50}
              height={50}
              className="h-12 w-12 object-contain"
              priority
            />
          </motion.div>
          <motion.span variants={item} className="text-lg font-semibold whitespace-nowrap">
            Srijansil Club
          </motion.span>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <motion.ul variants={container} initial="hidden" animate="visible" className="flex gap-6">
            {navBarItems.map((itemNav) => (
              <motion.li key={itemNav.name} variants={item}>
                <Link
                  href={itemNav.link}
                  className={`text-sm font-medium transition ${
                    isActive(itemNav.link) ? "text-blue-600 underline" : "text-gray-700 hover:text-black"
                  }`}
                >
                  {itemNav.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center rounded p-2 hover:bg-gray-100"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Animated Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute left-0 top-full w-full bg-white border-t shadow-md backdrop-blur-sm z-[100]"
          >
            <ul className="flex flex-col gap-2 px-4 py-4">
              {navBarItems.map((itemNav) => (
                <li key={itemNav.name}>
                  <Link
                    href={itemNav.link}
                    className={`block py-2 transition ${
                      isActive(itemNav.link) ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-black"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {itemNav.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
