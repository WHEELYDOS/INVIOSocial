"use client";

import { useState } from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import Services from "@/components/sections/Services";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import OurBelief from "@/components/sections/OurBelief";
import Footer from "@/components/sections/Footer";
import BookConsultationModal from "@/components/ui/BookConsultationModal";
import ContactModal from "@/components/ui/ContactModal";
import FAQ from "@/components/sections/FAQ";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [showConsultation, setShowConsultation] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Fixed Navigation rendered outside stacking context to prevent clipping */}
      <Navbar onBookConsultation={() => setShowConsultation(true)} />

      {/* 
        MAIN CONTENT WRAPPER 
        This sits on top (z-10), casts a shadow on the layer beneath, 
        and has rounded bottom corners to create a physical "card" effect 
        that reveals the footer behind it. We apply the morph-bg directly here.
      */}
      <div 
        className="relative z-10 bg-[var(--morph-bg)] transition-colors duration-200"
        style={{
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          clipPath: "inset(0 0 -50px 0 round 0 0 40px 40px)",
        }}
      >
        <Hero onGetAudit={() => setShowContact(true)} />
        <SocialProof />
        <Services />
        <WhyChooseUs />
        <FAQ />
        <OurBelief
          onGetAudit={() => setShowContact(true)}
          onBookConsultation={() => setShowConsultation(true)}
        />
      </div>

      {/* 
        FOOTER LAYER 
        Rendered out-of-flow in a fixed container beneath the main content.
        Manages its own spacer dimensions.
      */}
      <Footer />

      {/* Modals rendered at root level to avoid stacking context issues */}
      <BookConsultationModal
        isOpen={showConsultation}
        onClose={() => setShowConsultation(false)}
      />
      <ContactModal
        isOpen={showContact}
        onClose={() => setShowContact(false)}
        defaultSubject="Free Website Audit"
      />

      {/* Floating Sticky Button for Mobile (matches screenshot) */}
      <div className="fixed bottom-6 right-4 sm:right-6 md:hidden z-50">
        <button
          onClick={() => setShowConsultation(true)}
          className="flex items-center gap-2 px-6 py-4 bg-black text-white rounded-full font-medium text-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 active:scale-95"
        >
          Start your project <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>

    </main>
  );
}
