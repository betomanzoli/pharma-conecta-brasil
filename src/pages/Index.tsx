
import HeroSection from "@/components/sections/HeroSection";
import PlatformFeatures from "@/components/sections/PlatformFeatures";
import UserTypeSolutions from "@/components/sections/UserTypeSolutions";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ComplianceFooter from "@/components/ComplianceFooter";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Cadastrar-se
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection />
        <PlatformFeatures />
        <UserTypeSolutions />
        <TestimonialsSection />
      </main>

      <ComplianceFooter />
    </div>
  );
};

export default Index;
