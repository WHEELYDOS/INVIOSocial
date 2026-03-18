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
  const [isOverDark, setIsOverDark] = useState(true); // Hero is first section = dark
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle scroll detection for backdrop blur + section awareness
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Detect if navbar overlaps the dark Hero section
      const heroEl = document.getElementById("home");
      if (heroEl) {
        const heroBottom = heroEl.getBoundingClientRect().bottom;
        setIsOverDark(heroBottom > 56); // 56px = navbar height
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run on mount
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

  // Dynamic styles based on whether navbar is over dark Hero or light sections
  const isDark = theme === "dark";
  const navOverDark = isOverDark || isDark;

  const navBg = isScrolled
    ? navOverDark
      ? "rgba(15, 23, 42, 0.85)"
      : "rgba(255, 255, 255, 0.85)"
    : navOverDark
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.7)";

  const navBorder = navOverDark
    ? "1px solid rgba(255, 255, 255, 0.08)"
    : isScrolled
      ? "1px solid rgba(0, 0, 0, 0.08)"
      : "1px solid transparent";

  const navShadow = isScrolled
    ? navOverDark
      ? "0 8px 30px rgba(0,0,0,0.3)"
      : "0 8px 30px rgba(0,0,0,0.08)"
    : "none";

  const linkColor = navOverDark ? "text-white/80 hover:text-white" : "text-primary/70 hover:text-primary";
  const iconColor = navOverDark ? "text-white" : "text-primary";
  const toggleBg = navOverDark ? "bg-white/10 hover:bg-white/20" : "bg-primary/5 hover:bg-primary/10";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        height: 56,
        background: navBg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: navBorder,
        boxShadow: navShadow,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 h-full flex items-center justify-between">
        {/* Logo — switches based on navbar position + theme */}
        <Link href="/" className="flex items-center cursor-interactive hover:opacity-90 transition-opacity py-2 px-3 rounded-lg">
          {mounted && (
            <Image
              src={navOverDark ? "/images/comp10.png" : "/images/logo0.png"}
              alt="Invio Social"
              width={550}
              height={450}
              className="h-8 w-auto drop-shadow-lg transition-all duration-500 hover:scale-105"
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
              className={`${linkColor} transition-all duration-300 text-sm font-medium cursor-interactive relative group`}
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
              className={`p-2 rounded-lg ${toggleBg} transition-colors cursor-interactive shadow-md hover:shadow-lg`}
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className={`w-5 h-5 ${navOverDark ? "text-white" : "text-primary"}`} />
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
            className={`md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors cursor-interactive`}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${iconColor}`} />
            ) : (
              <Menu className={`w-6 h-6 ${iconColor}`} />
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
        style={{
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="px-6 pt-4 pb-4 space-y-3 border-t border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-white/80 hover:text-accent transition-colors py-2 cursor-interactive"
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
    </nav>
  );
}
