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

export default function Home() {
  const [showConsultation, setShowConsultation] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <main className="min-h-screen bg-background dark:bg-black">
      <Navbar onBookConsultation={() => setShowConsultation(true)} />
      <Hero onGetAudit={() => setShowContact(true)} />
      <SocialProof />
      <Services />
      <WhyChooseUs />
      <OurBelief 
        onGetAudit={() => setShowContact(true)}
        onBookConsultation={() => setShowConsultation(true)}
      />
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
    </main>
  );
}
