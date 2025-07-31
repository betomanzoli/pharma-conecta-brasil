
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import RealPlatformStats from '@/components/sections/RealPlatformStats';
import UserTypeSolutions from '@/components/sections/UserTypeSolutions';
import PlatformFeatures from '@/components/sections/PlatformFeatures';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { SecurityCompliance } from '@/components/sections/SecurityCompliance';
import CallToAction from '@/components/sections/CallToAction';
import ComplianceFooter from '@/components/ComplianceFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <RealPlatformStats />
      <UserTypeSolutions />
      <PlatformFeatures />
      <TestimonialsSection />
      <SecurityCompliance />
      <CallToAction />
      <ComplianceFooter />
    </div>
  );
};

export default Index;
