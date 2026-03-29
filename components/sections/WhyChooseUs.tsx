"use client";

import { motion } from "framer-motion";
import { Lightbulb, Users, Zap, Award } from "lucide-react";

export default function WhyChooseUs() {
  const differentiators = [
    {
      id: 1,
      title: "real growth",
      description: "We focus on generating real local revenue, not vanity metrics.",
      icon: Lightbulb,
      colSpan: "md:col-span-8",
      bg: "bg-[#F9F7F7] dark:bg-[#191923]",
      textColor: "text-primary",
      iconColor: "#0E79B2"
    },
    {
      id: 2,
      title: "local experts",
      description: "We master the art of hyper-local digital visibility.",
      icon: Users,
      colSpan: "md:col-span-4",
      bg: "bg-accent",
      textColor: "text-white",
      iconColor: "#ffffff"
    },
    {
      id: 3,
      title: "practical",
      description: "Simple, actionable, and measurable improvements.",
      icon: Zap,
      colSpan: "md:col-span-5",
      bg: "bg-primary",
      textColor: "text-white",
      iconColor: "#F6AE2D"
    },
    {
      id: 4,
      title: "personalized",
      description: "Every business is different. We tailor strategies to your needs.",
      icon: Award,
      colSpan: "md:col-span-7",
      bg: "bg-[#F9F7F7] dark:bg-[#20202d]",
      textColor: "text-primary",
      iconColor: "#E2574C"
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 relative overflow-hidden bg-white dark:bg-primary">
      <div className="container-max px-6 md:px-12 lg:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <h2 className="text-[10vw] sm:text-[8vw] md:text-[6vw] font-bold tracking-tighter lowercase leading-[0.9] text-primary">
              why choose <br /> us?
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-xl md:text-2xl font-medium text-primary/60 leading-tight">
              We bring strategic expertise, proven results, and genuine partnership to every engagement.
            </p>
          </div>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                className={`p-10 md:p-14 rounded-[40px] md:rounded-[60px] cursor-interactive group border border-primary/5 ${item.colSpan} ${item.bg} relative overflow-hidden`}
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="mb-16">
                    <Icon className="w-10 h-10 sm:w-14 sm:h-14 mb-8" style={{ color: item.iconColor }} />
                    <h3 className={`text-3xl sm:text-5xl font-bold tracking-tight lowercase ${item.textColor}`}>
                      {item.title}
                    </h3>
                  </div>
                  <p className={`text-lg sm:text-2xl font-medium opacity-80 leading-tight md:max-w-sm ${item.textColor}`}>
                    {item.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <span className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
