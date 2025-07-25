
import { HeroSection } from "@/components/sections/HeroSection";
import { PlatformFeatures } from "@/components/sections/PlatformFeatures";
import { UserTypeSolutions } from "@/components/sections/UserTypeSolutions";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { StrategicRecommendations } from "@/components/sections/StrategicRecommendations";
import { PlatformStats } from "@/components/sections/PlatformStats";
import { SecurityCompliance } from "@/components/sections/SecurityCompliance";
import { CallToAction } from "@/components/sections/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PlatformFeatures />
      <UserTypeSolutions />
      <StrategicRecommendations />
      <PlatformStats />
      <TestimonialsSection />
      <SecurityCompliance />
      <CallToAction />
    </div>
  );
};

export default Index;
