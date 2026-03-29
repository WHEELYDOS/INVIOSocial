"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onBookConsultation?: () => void;
}

export default function Navbar({ onBookConsultation }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const handleScroll = () => {
      // 1. Get all semantic sections
      const sections = document.querySelectorAll("section, footer, [data-section-theme]");
      let currentTheme: 'dark' | 'light' = 'dark'; // default to hero's theme
      
      // 2. Determine which section covers the navbar area (approx top 50px)
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        // If the navbar horizontal line (y=50) falls within this section's vertical bounds
        if (rect.top <= 60 && rect.bottom > 60) {
          const el = sections[i] as HTMLElement;
          const classes = el.className || "";
          const id = el.id || "";
          
          if (
            el.getAttribute("data-section-theme") === "dark" || 
            id === "home" || 
            classes.includes("bg-primary") || 
            classes.includes("bg-black")
          ) {
             currentTheme = "dark";
          } else {
             currentTheme = "light";
          }
          break;
        }
      }
      setTheme(currentTheme);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Force dark theme when menu overlay is open so elements are visible on the dark modal
  const activeTheme = isOpen ? 'dark' : theme;

  const navLinks = [
    { label: "home", href: "#home" },
    { label: "services", href: "#services" },
    { label: "about", href: "#about" },
    { label: "faq", href: "#faq" },
  ];

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 z-50 px-6 md:px-12 flex justify-between items-center pointer-events-none">
        
        {/* Left - Dynamic Logo */}
        <Link
          href="/"
          className="pointer-events-auto flex items-center cursor-interactive hover:opacity-80 transition-opacity drop-shadow-sm"
        >
          <div className="relative flex items-center justify-start w-[120px] h-[30px] sm:w-[140px] sm:h-[36px]">
            {/* comp10.png -> Used on dark backgrounds, usually white-colored logo */}
            <div className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${activeTheme === 'dark' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <Image
                src="/images/comp10.png"
                alt="Invio Social"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            {/* logo0.png -> Used on light backgrounds, usually black-colored logo */}
            <div className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${activeTheme === 'light' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <Image
                src="/images/logo0.png"
                alt="Invio Social"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
        </Link>

        {/* Right - Dynamic Controls */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => onBookConsultation?.()}
            className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] shadow-lg hover:scale-105 active:scale-95
              ${activeTheme === 'dark' 
                ? 'bg-white text-black border border-white/10 hover:bg-white/90' 
                : 'bg-black text-white border border-black/10 hover:bg-black/90'}`}
          >
            Hire us <ArrowRight size={16} />
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] shadow-lg hover:scale-105 active:scale-95
              ${activeTheme === 'dark' 
                ? 'bg-white text-black border border-white/10 hover:bg-gray-100' 
                : 'bg-black text-white border border-black/10 hover:bg-[#222]'}`}
            aria-label="Toggle menu"
          >
            {isOpen ? (
               <X size={20} className={activeTheme === 'dark' ? 'text-black' : 'text-white'} />
            ) : (
               <div className="space-y-[4px] flex flex-col items-center justify-center">
                 <div className={`w-[16px] h-[1.5px] rounded-full transition-colors duration-700 ${activeTheme === 'dark' ? 'bg-black' : 'bg-white'}`} />
                 <div className={`w-[16px] h-[1.5px] rounded-full transition-colors duration-700 ${activeTheme === 'dark' ? 'bg-black' : 'bg-white'}`} />
               </div>
            )}
          </button>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#0a0a0f] text-white flex flex-col items-center justify-center origin-top"
          >
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
               style={{
                 backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
               }}
            />
            
            <div className="flex flex-col items-center gap-6 relative z-10 w-full px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                  className="text-white/60 hover:text-white text-5xl md:text-7xl lg:text-[6rem] font-bold lowercase tracking-tighter transition-colors block text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 md:mt-12 flex flex-col items-center w-full max-w-sm"
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onBookConsultation?.();
                  }}
                  className="w-full bg-white text-black py-5 rounded-full font-bold lowercase text-xl hover:bg-accent hover:text-white transition-colors cursor-interactive"
                >
                  start project
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
