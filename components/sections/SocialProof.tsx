"use client";

import { motion } from "framer-motion";

export default function SocialProof() {
  const words = [
    "digital discovery",
    "reputation growth",
    "local seo",
    "web development",
    "automation",
  ];

  // Quadruple items for seamless ultra-wide loop
  const marqueeItems = [...words, ...words, ...words, ...words];

  return (
    <section className="py-24 sm:py-32 overflow-hidden relative bg-white dark:bg-[#FBFEF9]">
      {/* Massive Marquee Strip */}
      <div className="relative w-full overflow-hidden flex items-center">
        <motion.div
          className="flex whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {marqueeItems.map((item, index) => (
            <div key={index} className="flex items-center shrink-0">
              <span
                className="text-[12vw] sm:text-[10vw] font-bold lowercase tracking-tighter leading-none"
                style={{
                  WebkitTextStroke: index % 2 === 0 ? "none" : "2px #191923",
                  color: index % 2 === 0 ? "#191923" : "transparent"
                }}
              >
                {item}
              </span>
              <span className="text-black/30 mx-8 md:mx-16 text-[4vw] opacity-50">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Core Mission Statement */}
      <div className="container-max px-6 md:px-12 lg:px-24 mt-20 sm:mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary lowercase">
              our mission
            </h2>
            <div className="w-12 h-1 bg-accent mt-6 rounded-full" />
          </div>

          <div className="lg:col-span-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1] text-primary"
            >
              visibility is everything. <br />
              <span className="text-primary/40">we ensure the right customers find you at the right time.</span>
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
