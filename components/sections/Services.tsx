"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValue } from "framer-motion";
import { Search, TrendingUp, MapPin, Globe, Code2, Zap, LucideIcon } from "lucide-react";
type Service = {
  id: number;
  name: string;
  tags: string[];
  description: string;
  icon: LucideIcon;
  color: string;
  imageBg: string;
  imageUrl: string;
};

const services: Service[] = [
  {
    id: 1,
    name: "digital discovery",
    tags: ["Local SEO", "Google Business", "Search Visibility"],
    description: "We optimize your Google Business Profile to ensure your business appears in relevant local searches and attracts nearby customers actively looking for your services.",
    icon: Search,
    color: "#0E79B2", // accent
    imageBg: "bg-softBlue/20",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "reputation growth",
    tags: ["Review Management", "Trust Building", "Customer Feedback"],
    description: "We help you generate consistent, high-quality reviews and manage your online reputation to build trust and influence buying decisions.",
    icon: TrendingUp,
    color: "#0E79B2", // accent
    imageBg: "bg-primary/5",
    imageUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2400&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "local seo ranking",
    tags: ["Keyword Optimization", "Map Pack", "Organic Traffic"],
    description: "We improve your visibility in local search results so your business appears at the top when it matters most.",
    icon: MapPin,
    color: "#DBE2EF", // softBlue
    imageBg: "bg-accent/5",
    imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2400&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "digital presence",
    tags: ["Brand Identity", "Online Strategy", "Trust Signals"],
    description: "We create a structured digital presence that helps customers discover, understand, and trust your business instantly.",
    icon: Globe,
    color: "#0E79B2", // accent
    imageBg: "bg-primary/10",
    imageUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2400&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Web design & development",
    tags: ["Creative web design", "Web development", "Copywriting", "E-Commerce", "WordPress"],
    description: "Crafting digital experiences where beauty meets ROI, turning heads and unlocking revenue potential with every click.",
    icon: Code2,
    color: "#DBE2EF", // softBlue
    imageBg: "bg-softBlue/30",
    imageUrl: "https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?q=80&w=2400&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "automation systems",
    tags: ["Workflow Automation", "CRM Setup", "Efficiency"],
    description: "We set up automated systems for responses, review replies, and customer interactions — so your business runs efficiently.",
    icon: Zap,
    color: "#0E79B2", // accent
    imageBg: "bg-primary/5",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2400&auto=format&fit=crop",
  },
];

// Interactive 3D Background
function Background3DFlow() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    // Initial center position to prevent jump
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Extremely soft physics tuning for a liquid, lazy mouse-tracking spotlight
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 40, mass: 2 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 40, mass: 2 });

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-background" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-background flex items-center justify-center">
      {/* Massive vibrant flowing blobs strictly using the blue corporate palette */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] rounded-full bg-accent/30 blur-[100px] mix-blend-multiply"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-primary/10 blur-[100px] mix-blend-multiply"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[20%] w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] rounded-full bg-softBlue/60 blur-[120px] mix-blend-multiply"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] right-[20%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-accent/15 blur-[100px] mix-blend-multiply"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      />
      {/* Interactive mouse-following soft bright spotlight (Mix-blend removes to reduce CPU overhead on scroll) */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-white/70 blur-[80px]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
      />
    </div>
  );
}

interface CardProps {
  service: Service;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
}

function ServiceCard({ service, index, totalCards, progress }: CardProps) {
  const Icon = service.icon;

  const fraction = 1 / Math.max(1, totalCards - 1);
  const entryStart = (index - 1) * fraction;
  const entryEnd = index * fraction;
  // Next card covers 80% before starting fade
  const exitStart = index * fraction + 0.8 * fraction;
  const exitEnd = (index + 1) * fraction;

  // Y moves from 100vh to 0vh as it enters. Then pushes backwards slightly into Z-space via Y offset (-5vh) for a deep stack effect
  const yDomain = index === 0
    ? [0, exitStart, exitEnd, 1]
    : index === totalCards - 1
      ? [0, entryStart, entryEnd, 1]
      : [0, entryStart, entryEnd, exitStart, exitEnd, 1];

  const yRange = index === 0
    ? ["0vh", "0vh", "-8vh", "-8vh"]
    : index === totalCards - 1
      ? ["100vh", "100vh", "0vh", "0vh"]
      : ["100vh", "100vh", "0vh", "0vh", "-8vh", "-8vh"];

  const y = useTransform(progress, yDomain, yRange);

  // Opacity stays 1 until next card covers 80% (exitStart), then fades to 0
  const opDomain = index === totalCards - 1
    ? [0, 1]
    : [0, exitStart, exitEnd, 1];

  const opRange = index === totalCards - 1
    ? [1, 1]
    : [1, 1, 0, 0];

  const opacity = useTransform(progress, opDomain, opRange);

  // Scale drops from 1 to 0.88 for a deeply cinematic 3D perspective push
  const scaleDomain = index === totalCards - 1
    ? [0, 1]
    : index === 0
      ? [0, exitStart, exitEnd, 1]
      : [0, entryEnd, exitStart, exitEnd, 1];

  const scaleRange = index === totalCards - 1
    ? [1, 1]
    : index === 0
      ? [1, 1, 0.88, 0.88]
      : [1, 1, 1, 0.88, 0.88];

  const scale = useTransform(progress, scaleDomain, scaleRange);

  // Disable clicks completely when this specific card has faded out so underlying layers can be clicked
  const pointerEvents = useTransform(opacity, v => (v as number) > 0.5 ? "auto" : "none");

  // Reusable card content that adapts its layout cleanly for both desktop and mobile
  const CardContent = (
    <div className="relative flex flex-col md:flex-row w-full max-w-[1400px] mx-auto h-auto md:h-[600px] bg-background rounded-[40px] md:rounded-[60px] overflow-hidden card-shadow-light border border-black/5 group">
      
      {/* Mobile: Image goes first (order-1). Desktop: Image goes right (order-2) */}
      <div className="w-full md:w-[50%] flex items-stretch p-4 sm:p-6 md:p-8 lg:p-10 pt-4 md:pt-8 order-1 md:order-2">
        <div
          className="relative w-full h-[350px] sm:h-[400px] md:h-full min-h-[350px] md:min-h-[400px] rounded-none rounded-tr-[50px] md:rounded-tr-[80px] overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
          style={{
            backgroundColor: service.color, // Vibrant corporate color base
            transform: "translateZ(0)",
            WebkitMaskImage: "-webkit-radial-gradient(white, black)"
          }}
        >
          {/* Darker Underlying Image providing organic texture and contrast */}
          <img
            src={service.imageUrl}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover object-center scale-110 opacity-60 mix-blend-overlay"
          />
          {/* Heavy Blur to turn image into a smooth background gradient */}
          <div className="absolute inset-0 backdrop-blur-3xl z-0" />
          {/* Clean, sharply visible Logo floating over the vivid blur */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Icon
              className="w-1/2 h-1/2 max-w-[200px] max-h-[200px] text-white opacity-100 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      {/* Mobile: Text goes second (order-2). Desktop: Text goes left (order-1) */}
      <div className="w-full md:w-[50%] p-8 sm:p-14 md:p-16 lg:p-20 flex flex-col justify-center relative z-20 order-2 md:order-1 pt-4">
        <h3 className="text-[2.2rem] sm:text-[3rem] lg:text-[4.5rem] font-medium tracking-tight mb-6 md:mb-8 text-primary leading-[1]">
          {service.name.toLowerCase() === 'web design & development'
            ? <>Web design &<br />development</>
            : service.name}
        </h3>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 text-[12px] md:text-[13px] font-medium tracking-wide rounded-full border border-black/10 md:bg-white text-primary shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[17px] sm:text-lg text-darkGray/90 md:text-darkGray/80 font-medium leading-relaxed max-w-xl mb-8">
          {service.description}
        </p>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Version: Stacking Animation */}
      <motion.div
        style={{ opacity, y, scale, pointerEvents, willChange: "transform, opacity" }}
        className="hidden md:flex absolute inset-0 items-center justify-center p-4 md:p-8 lg:p-12"
      >
        {CardContent}
      </motion.div>

      {/* Mobile Version: Simple Scrollable Flow without Animation */}
      <div className="md:hidden w-full relative py-6 px-4 sm:px-6">
        {CardContent}
      </div>
    </>
  );
};

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the entire cinematic scrolling container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Extremely lush and soft physics spring on the page wheel progress itself
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <section id="services" className="relative w-full bg-background text-black pt-24 pb-24">
      {/* 3D Flowing Background - Fixed to section via sticky */}
      <div className="absolute inset-0">
        <div className="sticky top-0 left-0 w-full h-[100vh]">
          <Background3DFlow />
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full">
        {/* Title Section */}
        <div className="container-max px-4 md:px-12 text-center pb-16 md:pb-8 relative z-10">
          <h2 className="text-[10vw] sm:text-[7vw] leading-none font-medium tracking-tighter capitalize mb-6">
            How we help you grow
          </h2>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto text-black/60 font-medium">
            Premium services designed to get you discovered and turn your digital presence into a customer-generating machine.
          </p>
        </div>

        {/* Cinematic Crossfading Presentation Track (Desktop Only) */}
        <div ref={containerRef} className="relative mt-4 md:mt-8 hidden md:block h-[600vh]">
          <div className="sticky top-0 left-0 w-full h-[100vh] flex items-center justify-center overflow-hidden">
            {services.map((service, index) => (
              <ServiceCard
                key={`desk-${service.id}`}
                service={service}
                index={index}
                totalCards={services.length}
                progress={smoothProgress}
              />
            ))}
          </div>
        </div>

        {/* Simple Scrollable Flow (Mobile Only) */}
        <div className="relative mt-4 block md:hidden w-full flex-col">
          {services.map((service, index) => (
            <ServiceCard
              key={`mob-${service.id}`}
              service={service}
              index={index}
              totalCards={services.length}
              progress={smoothProgress} // Ignored by mobile render branches inside Card
            />
          ))}
        </div>
      </div>
    </section>
  );
}
