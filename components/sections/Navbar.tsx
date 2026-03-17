"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle scroll detection for backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 dark:bg-black/80 backdrop-blur-md shadow-sm"
          : "bg-background dark:bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-interactive hover:opacity-90 transition-opacity py-2 px-3 rounded-lg hover:bg-primary/10 dark:hover:bg-black/10">
            {mounted && (
              <Image 
                src={theme === "dark" ? "/images/comp10.png" : "/images/logo0.png"} 
                alt="Invio Social" 
                width={550} 
                height={450}
                className="h-8 w-auto drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300 hover:scale-105"
                priority
              />
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-primary dark:text-background hover:text-accent dark:hover:text-accent transition-colors text-sm font-medium cursor-interactive relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Right Side: Theme Toggle + CTA */}
          <div className="flex items-center gap-4">
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-primary/10 dark:bg-background/10 hover:bg-primary/20 dark:hover:bg-background/20 transition-colors cursor-interactive shadow-md hover:shadow-lg"
                aria-label="Toggle theme"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
              </motion.button>
            )}

            <motion.button 
              onClick={() => window.location.href = "#contact"}
              className="hidden sm:inline-block btn-primary text-sm cursor-interactive"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-primary/10 dark:hover:bg-background/10 rounded-lg transition-colors cursor-interactive"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-primary dark:text-background" />
              ) : (
                <Menu className="w-6 h-6 text-primary dark:text-background" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-4 space-y-3 border-t border-primary/10 dark:border-background/10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-primary dark:text-background hover:text-accent dark:hover:text-accent transition-colors py-2 cursor-interactive"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <motion.button 
              onClick={() => {
                setIsOpen(false);
                window.location.href = "#contact";
              }}
              className="w-full btn-primary text-sm cursor-interactive"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}

