
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Pronto para revolucionar sua carreira na indústria farmacêutica?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Junte-se a milhares de profissionais que já estão construindo o futuro da saúde no Brasil.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/auth#register">
            <Button size="lg" className="bg-white text-[#1565C0] hover:bg-gray-50 font-semibold">
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1565C0]">
              Ver Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
