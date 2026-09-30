import HeroSection from "@/components/home/HeroSection";
import StatementSection from "@/components/home/StatementSection";
import DashboardSection from "@/components/home/DashboardSection";
import IndustryShowcase from "@/components/home/IndustryShowcase";
import FinalCTA from "@/components/home/FinalCTA";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-canvas text-[#111111] min-h-screen relative selection:bg-brand-500 selection:text-white overflow-hidden">
      <Navigation />
      
      <HeroSection />
      <StatementSection />
      <DashboardSection />
      <IndustryShowcase />
      <FinalCTA />
      <Footer />
    </main>
  );
}
