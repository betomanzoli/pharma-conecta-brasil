
import React from 'react';
import HeroSection from "@/components/sections/HeroSection";
import PlatformFeatures from "@/components/sections/PlatformFeatures";
import UserTypeSolutions from "@/components/sections/UserTypeSolutions";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { StrategicRecommendations } from "@/components/sections/StrategicRecommendations";
import { PlatformStats } from "@/components/sections/PlatformStats";
import { SecurityCompliance } from "@/components/sections/SecurityCompliance";
import CallToAction from "@/components/sections/CallToAction";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StrategicRecommendations />
      <UserTypeSolutions />
      <PlatformFeatures />
      <PlatformStats />
      <TestimonialsSection />
      <SecurityCompliance />
      <CallToAction />
    </div>
  );
};

export default Index;
