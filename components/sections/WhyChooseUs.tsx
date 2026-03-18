"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Users,
  Zap,
  Award,
} from "lucide-react";

const differentiators = [
  {
    id: 1,
    title: "Focus on Real Growth",
    description:
      "We focus on helping businesses attract customers and generate real revenue — not just followers or vanity metrics.",
    icon: Lightbulb,
  },
  {
    id: 2,
    title: "Local Business Expertise",
    description:
      "We specialize in helping local businesses grow through digital discovery and online visibility.",
    icon: Users,
  },
  {
    id: 3,
    title: "Practical Strategies",
    description:
      "Our solutions are simple, actionable, and designed to produce measurable improvements in your online presence.",
    icon: Zap,
  },
  {
    id: 4,
    title: "Personalized Approach",
    description:
      "Every business is different. We analyze your situation and create strategies tailored to your needs.",
    icon: Award,
  },
];

function DifferentiatorCard({
  item,
  index,
}: {
  item: typeof differentiators[0];
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group p-4 sm:p-6 lg:p-8 rounded-2xl glass bg-white/70 dark:from-primary/20 dark:to-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 shadow-md dark:shadow-lg dark:shadow-accent/10 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-accent/20 transition-all duration-300 cursor-interactive backdrop-blur-sm card-glow"
    >
      <motion.div
        className="flex items-start gap-3 sm:gap-4"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-accent mt-1 flex-shrink-0" />
        <div>
          <h3 className="heading-md mb-3 text-primary dark:text-background">
            {item.title}
          </h3>
          <p className="text-primary dark:text-background/90 leading-relaxed">
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  return (
    <section
      id="about"
      className="section-padding bg-transparent relative overflow-hidden"
    >
      {/* Ambient gradient blob */}
      <div className="ambient-blob ambient-blob-lg" style={{ top: '-80px', left: '-120px' }} />
      <div className="ambient-blob ambient-blob-sm" style={{ bottom: '-50px', right: '-80px' }} />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">Why Choose Invio Social?</h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            We bring strategic expertise, proven results, and genuine partnership to every engagement
          </p>
        </motion.div>

        {/* Differentiators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentiators.map((item, index) => (
            <DifferentiatorCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

