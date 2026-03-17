"use client";

import { motion } from "framer-motion";

export default function SocialProof() {
  const items = [
    "Invio Social",
    "Digital Discovery",
    "Reputation Growth",
    "Local SEO",
    "Digital Presence",
    "Web Development",
    "Automation Systems",
  ];

  // Duplicate items for seamless loop
  const marqueeItems = [...items, ...items];

  return (
    <section className="bg-primary/[0.03] dark:bg-white/5 py-8 sm:py-12 md:py-16 overflow-hidden border-y border-primary/10 dark:border-white/10 relative">
      {/* Ambient gradient accent */}
      <div className="ambient-blob ambient-blob-md" style={{ top: '-150px', right: '20%' }} />
      {/* Marquee Strip */}
      <div className="relative w-full overflow-hidden mb-8 sm:mb-12">
        <motion.div
          className="flex gap-6 sm:gap-8 md:gap-12 whitespace-nowrap"
          animate={{ x: [0, -2000] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {marqueeItems.map((item, index) => (
            <span
              key={index}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold text-primary dark:text-white/80 flex items-center gap-6 sm:gap-8 md:gap-12 flex-shrink-0"
            >
              {item}
              <span className="text-accent text-2xl">•</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Mission Section */}
      <div className="container-max px-4 sm:px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto"
        >
          <h2 className="heading-lg text-primary dark:text-background">Our Mission</h2>
          <p className="text-base md:text-lg text-primary dark:text-background/90 leading-relaxed">
            Invio Social is a digital growth agency that helps local businesses become easily discoverable online.
            In today's digital world, visibility is everything — and great businesses shouldn't go unnoticed.
          </p>
          <p className="text-base md:text-lg text-primary dark:text-background/90 leading-relaxed">
            We work closely with local businesses to improve their online presence,
            ensuring the right customers find them at the right time. Your growth is our mission.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
