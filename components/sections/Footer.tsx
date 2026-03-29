"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0.8, 1], [0.3, 1]);
  const y = useTransform(scrollYProgress, [0.8, 1], [50, 0]);

  return (
    <footer ref={containerRef} className="relative z-0 h-screen w-full flex flex-col justify-end bg-primary">
      {/* Sticky container that stays at the bottom */}
      <div className="sticky bottom-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-end pb-12 pt-24">
        {/* Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/10 rounded-full blur-[160px] pointer-events-none" />

        <motion.div 
          style={{ opacity, y }}
          className="container-max px-6 md:px-12 lg:px-24 relative z-10 flex flex-col items-center text-center mt-auto"
        >
            {/* Massive Call to Action */}
            <div className="w-full mb-20">
              <h2 className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-bold tracking-tighter lowercase leading-[0.85] mb-8 cursor-interactive group">
                let&apos;s talk.
                <span className="block w-full h-[2px] bg-white/20 mt-8 relative overflow-hidden">
                  <span className="absolute inset-0 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]" />
                </span>
              </h2>
              
              <a 
                href="mailto:inviosocial@gmail.com"
                className="inline-flex items-center gap-4 text-2xl sm:text-4xl font-medium text-white/60 hover:text-white transition-colors duration-300 cursor-interactive group"
              >
                inviosocial@gmail.com
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <ArrowRight className="w-6 h-6 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </a>
            </div>

            {/* Bottom Links */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 items-end pt-12 border-t border-white/10 text-left">
              <div>
                <span className="font-bold text-xl tracking-tight mb-2 block">Invio Social</span>
                <p className="text-white/50 text-sm max-w-xs font-medium leading-relaxed">
                  A marketing agency building unignorable visibility for local businesses.
                </p>
              </div>

              <div className="flex gap-8 text-sm font-bold lowercase text-white/50">
                {["home", "services", "about", "faq"].map((item) => (
                  <Link 
                    key={item}
                    href={`#${item}`}
                    className="hover:text-white transition-colors cursor-interactive"
                  >
                    {item}
                  </Link>
                ))}
              </div>

              <div className="flex md:justify-end gap-6">
                {[
                  { Icon: Linkedin, href: "https://www.linkedin.com/company/inviosocial/" },
                  { Icon: Instagram, href: "https://www.instagram.com/invio.social/" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-accent flex items-center justify-center transition-all duration-300 cursor-interactive"
                  >
                    <social.Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="w-full flex justify-between items-center mt-16 text-xs font-medium text-white/30 uppercase tracking-widest">
              <span>© {new Date().getFullYear()} Invio Social</span>
              <span>All rights reserved</span>
            </div>
        </motion.div>
      </div>
    </footer>
  );
}
