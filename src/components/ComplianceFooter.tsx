
import { Shield, Lock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ComplianceFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 rounded-full p-2">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">Certificação SSL</p>
              <p className="text-sm text-gray-400">Dados protegidos por criptografia</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">Conformidade ANVISA e LGPD</p>
              <p className="text-sm text-gray-400">Regulamentações seguidas rigorosamente</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-[#1565C0] rounded-full p-2">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">Plataforma Verificada</p>
              <p className="text-sm text-gray-400">Para profissionais farmacêuticos</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-[#1565C0] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-2xl font-bold text-[#1565C0]">PharmaConnect Brasil</span>
            </div>
            <p className="text-gray-400 mb-4">
              O ecossistema colaborativo da indústria farmacêutica brasileira
            </p>
            <p className="text-gray-400 text-sm">
              Informações destinadas exclusivamente para profissionais de saúde qualificados
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-[#1565C0] transition-colors">
                  Política de Privacidade LGPD
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-[#1565C0] transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/ethics" className="text-gray-400 hover:text-[#1565C0] transition-colors">
                  Código de Ética
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Compliance</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ ANVISA</li>
              <li>✓ LGPD</li>
              <li>✓ ISO 27001</li>
              <li>✓ Auditoria Independente</li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400 mb-2">
            © 2025 PharmaConnect Brasil. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Todas as informações são para fins educacionais e networking profissional entre profissionais qualificados da indústria farmacêutica.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ComplianceFooter;
