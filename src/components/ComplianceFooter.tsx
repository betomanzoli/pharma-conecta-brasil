
import { Shield, Lock, CheckCircle } from "lucide-react";

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
            <div className="bg-primary rounded-full p-2">
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
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <span className="text-2xl font-bold text-primary">FarmaConnect Brasil</span>
            </div>
            <p className="text-gray-400 mb-4">
              O ecossistema colaborativo da indústria farmacêutica brasileira
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-yellow-400 font-medium">
                ⚠️ Esta plataforma não substitui consulta médica profissional
              </p>
              <p className="text-gray-400">
                Informações destinadas exclusivamente para profissionais de saúde qualificados
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                  Política de Privacidade LGPD
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="/ethics" className="text-gray-400 hover:text-primary transition-colors">
                  Código de Ética
                </a>
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
            © 2024 FarmaConnect Brasil. Todos os direitos reservados.
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
