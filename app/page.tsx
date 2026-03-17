import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import Services from "@/components/sections/Services";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import OurBelief from "@/components/sections/OurBelief";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background dark:bg-black">
      <Navbar />
      <Hero />
      <SocialProof />
      <Services />
      <WhyChooseUs />
      <OurBelief />
      <Footer />
    </main>
  );
}
