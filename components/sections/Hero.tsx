"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Floating analytics card components
function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-accent/5 floating-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Stat mini card
function StatCard({
  label,
  value,
  change,
  delay,
}: {
  label: string;
  value: string;
  change?: string;
  delay: number;
}) {
  return (
    <GlassCard className="p-4 min-w-[140px]" delay={delay}>
      <p className="text-[11px] text-background/50 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-background">{value}</p>
      {change && (
        <p className="text-xs text-accent font-semibold mt-1">{change}</p>
      )}
    </GlassCard>
  );
}

interface HeroProps {
  onGetAudit?: () => void;
}

export default function Hero({ onGetAudit }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 sm:pt-24 pb-12 bg-primary dark:bg-black overflow-hidden"
    >
      {/* === Background Effects === */}
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* === Main Content === */}
      <div className="container-max relative z-10 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ---- Left: Copy ---- */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                Digital Growth Agency
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.1] text-background tracking-tight"
            >
              Hard to
              <br />
              Find Online?
              <br />
              <span className="text-accent relative">
                Let Us Help You
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C40 2 80 2 100 3.5C120 5 160 6 199 3"
                    stroke="#0E79B2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </span>
              <br />
              Get Discovered.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-background/60 leading-relaxed max-w-md"
            >
              Great businesses go unnoticed because customers can&apos;t find them.
              We fix that — improving your online presence so the right customers
              find you at the right time.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <motion.button
                onClick={() => onGetAudit?.()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold bg-accent text-background rounded-xl hover:bg-accent/90 transition-all duration-200 cursor-interactive shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Your Free Audit
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => (window.location.href = "#services")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-background/80 border border-background/20 rounded-xl hover:bg-background/5 hover:border-background/30 transition-all duration-200 cursor-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Services
              </motion.button>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-primary bg-accent/20 flex items-center justify-center"
                    >
                      <span className="text-[9px] text-accent font-bold">
                        {["JR", "SK", "MA", "PL"][i - 1]}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-background/50">
                  <span className="text-background/80 font-semibold">
                    50+
                  </span>{" "}
                  Local Businesses
                </p>
              </div>
              <div className="h-4 w-px bg-background/10" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 text-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <p className="text-xs text-background/50 ml-1">4.9 rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ---- Right: Floating Dashboard Cards ---- */}
          <div className="hidden lg:block relative h-[560px]">
            {/* Main dashboard card */}
            <GlassCard className="absolute top-4 right-0 w-[340px] p-5" delay={0.3}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-background">
                  Visibility Score
                </h3>
                <span className="text-[10px] text-accent font-medium px-2 py-0.5 rounded-full bg-accent/15">
                  Live
                </span>
              </div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-bold text-background">94%</span>
                <span className="text-sm text-accent font-semibold mb-1">
                  +12%
                </span>
              </div>
              {/* Mini bar chart */}
              <div className="flex items-end gap-1.5 h-16">
                {[40, 55, 45, 65, 50, 70, 60, 80, 75, 90, 85, 94].map(
                  (h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-sm bg-accent/30"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: 0.6 + i * 0.05 }}
                    />
                  )
                )}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-background/30">Jan</span>
                <span className="text-[10px] text-background/30">Dec</span>
              </div>
            </GlassCard>

            {/* SEO Ranking Card */}
            <GlassCard
              className="absolute top-[200px] right-[280px] w-[200px] p-4"
              delay={0.5}
            >
              <p className="text-[11px] text-background/50 uppercase tracking-wider mb-2">
                Local SEO Rank
              </p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-accent">#2</span>
                <div>
                  <p className="text-xs text-background/70">Google Maps</p>
                  <p className="text-[10px] text-accent">↑ 5 positions</p>
                </div>
              </div>
            </GlassCard>

            {/* Reviews Card */}
            <GlassCard
              className="absolute top-[320px] right-[60px] w-[220px] p-4"
              delay={0.7}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-background/50 uppercase tracking-wider">
                  Reviews
                </p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-3 h-3 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-background">4.8</span>
                <span className="text-xs text-background/50 mb-0.5">
                  192 reviews
                </span>
              </div>
              <p className="text-[11px] text-background/40 mt-2 italic">
                "Very recommended! Great service..."
              </p>
            </GlassCard>

            {/* Small stat cards */}
            <motion.div
              className="absolute bottom-0 right-[200px] flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <StatCard
                label="Impressions"
                value="2.1k"
                change="+18%"
                delay={0.9}
              />
              <StatCard
                label="Clicks"
                value="847"
                change="+24%"
                delay={1.0}
              />
            </motion.div>

            {/* Floating abstract shape */}
            <motion.div
              className="absolute -top-8 right-[180px] w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 backdrop-blur-sm floating-card"
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-[100px] right-[380px] w-12 h-12 rounded-full bg-accent/8 border border-accent/15 backdrop-blur-sm floating-card"
              animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          {/* Mobile: Simplified stat row */}
          <motion.div
            className="lg:hidden grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <p className="text-xl font-bold text-accent">94%</p>
              <p className="text-[10px] text-background/50 mt-0.5">
                Visibility
              </p>
            </div>
            <div className="p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <p className="text-xl font-bold text-accent">#2</p>
              <p className="text-[10px] text-background/50 mt-0.5">
                SEO Rank
              </p>
            </div>
            <div className="p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <p className="text-xl font-bold text-accent">4.8</p>
              <p className="text-[10px] text-background/50 mt-0.5">
                Rating
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
