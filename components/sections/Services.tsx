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
      className="service-card cursor-interactive"
    >
      {/* Icon */}
      <div className="icon mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10">
        <Icon className="w-6 h-6 text-accent" />
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold leading-snug">
        {service.name}
      </h3>

      {/* Hook — always visible */}
      <p className="short text-sm sm:text-base text-accent">
        {service.hook}
      </p>

      {/* Full description — revealed on hover */}
      <p className="full text-sm leading-relaxed opacity-70">
        {service.description}
      </p>
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
