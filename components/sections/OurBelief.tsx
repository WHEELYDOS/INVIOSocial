import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OurBeliefProps {
  onGetAudit?: () => void;
  onBookConsultation?: () => void;
}

const beliefs = [
  {
    title: "Focus on real growth.",
    description: "We don't chase vanity metrics or hollow followers. Our focus is aggressive growth—developing high-performance websites and strategic digital marketing pipelines designed to generate real, measurable revenue.",
  },
  {
    title: "Mastery that scales.",
    description: "Whether you're a local business looking to dominate the map pack or a scaling brand needing custom e-commerce web development, our expertise positions you exactly where your highest-value customers are searching.",
  },
  {
    title: "Practical strategies.",
    description: "Complexity acts as friction. We engineer simple, transparent, and actionable strategies that cut through the noise, driving measurable improvements in your online discovery and user conversions.",
  },
  {
    title: "A tailored approach.",
    description: "There is no universal formula for digital dominance. We rigorously analyze your unique market situation to craft bespoke web experiences and marketing solutions tailored strictly to your aggressive growth targets.",
  },
];

export default function OurBelief({ onGetAudit, onBookConsultation }: OurBeliefProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-24 sm:py-40 bg-[#FAFAFA] text-black relative overflow-hidden">

      {/* Liquid Gradient Background */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-60 mix-blend-multiply">
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 top-[20%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[#E8A5D8]/40 blur-[100px]"
            style={{ willChange: "transform", transform: "translateZ(0)" }}
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[10%] top-[40%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[#96E6E6]/40 blur-[100px]"
            style={{ willChange: "transform", transform: "translateZ(0)" }}
          />
        </div>
      )}

      <div className="container-max px-4 md:px-12 relative z-10">

        {/* Header Title */}
        <div className="w-full flex justify-end mb-24 md:mb-32 pr-4 md:pr-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-8xl font-medium tracking-tighter"
          >
            Strategically built.
          </motion.h2>
        </div>

        {/* Interactive List */}
        <div className="flex flex-col w-full">
          {beliefs.map((belief, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              className="group relative border-t border-black/20 py-8 md:py-12 cursor-interactive"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 relative">

                {/* Number & Title */}
                <div className="md:col-span-8 flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                  <span className={`text-sm md:text-base font-medium transition-colors duration-500 mt-2 text-black ${hoveredIndex !== index ? 'md:text-black/30' : ''}`}>
                    0{index + 1}/
                  </span>
                  <h3
                    className={`text-5xl sm:text-6xl md:text-[6rem] lg:text-[7rem] font-medium tracking-tighter leading-none transition-colors duration-500 text-black ${hoveredIndex !== index ? 'md:text-black/20' : ''}`}
                  >
                    {belief.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="md:col-span-4 flex items-center md:justify-end mt-4 md:mt-0 md:min-h-[80px]">
                  
                  {/* Desktop Hover Reveal */}
                  <div className="hidden md:block w-full">
                    <AnimatePresence mode="wait">
                      {hoveredIndex === index && (
                        <motion.p
                          key={`desc-${index}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="text-base md:text-lg text-black/80 leading-relaxed max-w-sm ml-auto"
                        >
                          {belief.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile Always Visible */}
                  <p className="block md:hidden text-base sm:text-[17px] text-black/80 font-medium leading-relaxed max-w-sm">
                    {belief.description}
                  </p>

                </div>
              </div>
            </div>
          ))}
          {/* Bottom border for the last item */}
          <div className="border-t border-black/20 w-full" />
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-24 md:mt-32 pt-8"
        >
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => onGetAudit?.()}
              className="w-full sm:w-auto px-10 py-5 bg-black text-white rounded-full text-lg font-medium hover:bg-black/80 transition-colors duration-300 shadow-xl cursor-interactive"
            >
              start growing today
            </button>
            <button
              onClick={() => onBookConsultation?.()}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black border border-black/10 rounded-full text-lg font-medium hover:bg-black/5 transition-colors duration-300 shadow-sm cursor-interactive"
            >
              book a call
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
