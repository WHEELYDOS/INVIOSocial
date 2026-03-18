"use client";

import { motion } from "framer-motion";

export default function OurBelief() {
  const beliefs = [
    "Every good business deserves to be discovered by the customers who need it most.",
    "Many local businesses struggle not because they lack quality, but because they lack online visibility.",
    "With the right digital presence, even small businesses can reach more people and grow significantly.",
    "Our mission is to bridge that gap — making great businesses easily findable online.",
  ];

  return (
    <section className="section-padding bg-transparent relative overflow-hidden">
      {/* Decorative ambient gradient blobs */}
      <div className="ambient-blob ambient-blob-lg" style={{ top: '-50px', right: '-100px' }} />
      <div className="ambient-blob ambient-blob-md" style={{ bottom: '-80px', left: '-80px' }} />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-8 text-primary dark:text-background">What We Believe</h2>
        </motion.div>

        {/* Belief Cards */}
        <div className="max-w-4xl mx-auto">
          {beliefs.map((belief, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ x: 8 }}
              className="mb-6 last:mb-0 cursor-interactive"
            >
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl glass bg-white/70 dark:bg-primary/20 border border-primary/10 dark:border-primary/20 shadow-md dark:shadow-lg dark:shadow-accent/10 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-accent/20 transition-all duration-300 backdrop-blur-sm card-glow">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center mt-1">
                    <span className="text-background font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-base sm:text-lg font-medium text-primary dark:text-background leading-relaxed">
                    {belief}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-primary/10 dark:border-background/10"
        >
          <h3 className="heading-md mb-6 text-primary dark:text-background">Our Commitment</h3>
          <p className="text-base sm:text-lg md:text-xl text-primary dark:text-background leading-relaxed">
            We're committed to being your strategic partner in building a digital presence that attracts the right customers, builds lasting trust, and fuels sustainable growth. Your vision drives our work.
          </p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="btn-primary cursor-interactive"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Growing Today
            </motion.button>
            <motion.button
              className="btn-secondary cursor-interactive"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book a Consultation
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
