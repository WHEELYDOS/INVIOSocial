"use client";

import { motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  MapPin,
  Globe,
  Code2,
  Zap,
} from "lucide-react";

const services = [
  {
    id: 1,
    name: "Digital Discovery Optimization",
    hook: "Be found when customers search for you.",
    description:
      "We optimize your Google Business Profile to ensure your business appears in relevant local searches and attracts nearby customers actively looking for your services.",
    icon: Search,
  },
  {
    id: 2,
    name: "Reputation Growth System",
    hook: "Turn happy customers into powerful social proof.",
    description:
      "We help you generate consistent, high-quality reviews and manage your online reputation to build trust and influence buying decisions.",
    icon: TrendingUp,
  },
  {
    id: 3,
    name: "Local SEO Optimization",
    hook: "Rank higher. Get more local customers.",
    description:
      "We improve your visibility in local search results so your business appears at the top when it matters most.",
    icon: MapPin,
  },
  {
    id: 4,
    name: "Digital Presence Setup",
    hook: "Build a strong and credible online identity.",
    description:
      "We create a structured digital presence that helps customers discover, understand, and trust your business instantly.",
    icon: Globe,
  },
  {
    id: 5,
    name: "Website Development",
    hook: "Websites designed to convert visitors into customers.",
    description:
      "We build clean, fast, and conversion-focused websites that make it easy for users to learn about your business and take action.",
    icon: Code2,
  },
  {
    id: 6,
    name: "Automation Systems",
    hook: "Save time. Respond faster. Grow smarter.",
    description:
      "We set up automated systems for responses, review replies, and customer interactions — so your business runs efficiently without manual effort.",
    icon: Zap,
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden p-6 sm:p-8 rounded-2xl glass cursor-interactive card-glow transition-all duration-400"
      whileHover={{ y: -8, scale: 1.02 }}
      style={{ transition: "all 0.4s ease" }}
    >
      {/* Icon */}
      <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/15 group-hover:bg-accent/20 transition-all duration-300">
        <Icon className="w-6 h-6 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]" />
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-primary dark:text-background mb-2 leading-snug">
        {service.name}
      </h3>

      {/* Hook — visible by default (short description) */}
      <p className="text-sm sm:text-base font-semibold text-accent mb-3 leading-snug">
        {service.hook}
      </p>

      {/* Full description — fades in on hover */}
      <p className="text-sm text-primary/65 dark:text-background/60 leading-relaxed opacity-0 translate-y-[10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
        {service.description}
      </p>

      {/* Glow border on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{
          border: "1px solid rgba(86, 163, 243, 0.5)",
          boxShadow: "0 0 30px rgba(86, 163, 243, 0.2)",
        }}
      />

      {/* Subtle bottom accent line on hover */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-accent/0 group-hover:bg-accent/40 transition-all duration-300 rounded-full" />
    </motion.div>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="section-padding bg-transparent relative overflow-hidden"
    >
      {/* Ambient gradient blob */}
      <div
        className="ambient-blob ambient-blob-lg"
        style={{ top: "-100px", right: "-150px" }}
      />
      <div
        className="ambient-blob ambient-blob-md"
        style={{ bottom: "-80px", left: "-100px" }}
      />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="heading-lg mb-4">
            Turn Your Online Presence Into a Customer-Generating Machine
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Everything you need to get discovered, build trust, and convert
            visitors into paying customers.
          </p>
        </motion.div>

        {/* Services Grid — 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
