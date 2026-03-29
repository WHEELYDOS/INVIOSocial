"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Environment } from "@react-three/drei";

function LiquidSphere() {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere visible args={[1, 64, 64]} scale={2.2}>
        <MeshDistortMaterial
          color="#0E79B2"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

interface HeroProps {
  onGetAudit?: () => void;
}

export default function Hero({ onGetAudit }: HeroProps) {
  return (
    <section
      id="home"
      data-section-theme="dark"
      className="relative min-h-screen flex flex-col justify-center pt-32 pb-12 overflow-hidden bg-primary"
    >
      {/* 3D WebGL Background Container */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <LiquidSphere />
          </Suspense>
        </Canvas>
      </div>

      {/* Subtle grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      <div className="container-max relative z-10 px-4 sm:px-6 md:px-12 lg:px-24">
        {/* Massive Minimalist Typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1], delay: 0.1 }}
          className="max-w-5xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent text-sm sm:text-base font-semibold uppercase tracking-widest">
              Marketing Agency
            </span>
          </div>

          <h1
            className="text-[12vw] sm:text-[9vw] md:text-[7vw] lg:text-[6.5vw] font-bold text-white leading-[0.85] tracking-tighter lowercase mb-8"
          >
            hard to <br />
            find online? <br />
            <span className="text-white/40 italic font-medium relative inline-block group cursor-pointer cursor-interactive">
              let us help you
              {/* Custom underline animation on hover */}
              <span className="absolute left-0 bottom-[-5px] w-full h-[6px] bg-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]" />
            </span> <br />
            get discovered.
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-12">
            <motion.button
              onClick={() => onGetAudit?.()}
              className="group cursor-interactive bg-white text-primary px-8 py-5 rounded-full flex items-center gap-3 font-bold text-lg hover:bg-accent hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              start your project
              <div className="w-8 h-8 rounded-full bg-primary/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>

            <motion.div
              className="flex items-center gap-4 text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-primary bg-accent flex items-center justify-center text-white font-bold text-xs shadow-lg"
                  >
                    {["JR", "SK", "MA"][i - 1]}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">
                <span className="text-white">50+</span> local businesses transformed
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
