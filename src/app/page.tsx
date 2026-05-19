import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { TeamPreview } from "@/components/sections/team-preview";
import { StatsSection } from "@/components/sections/stats-section";
import { AdmissionSection } from "@/components/sections/admission-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <TeamPreview />
        <AdmissionSection />
      </main>
      <Footer />
    </>
  );
}
