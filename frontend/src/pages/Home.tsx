import HeroCarousel from "../components/HeroSection/HeroCarousel";
import HeroSection from "../components/HeroSection/HeroSection";

export default function Home() {
  return (
    <div className="flex justify-between gap-10 h-[75vh] items-center">
      {/* left content */}
      <HeroSection />

      {/* right content */}
      <HeroCarousel />
    </div>
  );
}
