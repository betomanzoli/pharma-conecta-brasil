
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  GraduationCap, 
  Building2, 
  FlaskConical, 
  Shield, 
  Briefcase,
  University,
  Scale,
  Factory,
  FileText,
  Heart
} from "lucide-react";

interface UserTypeSelectorProps {
  onSelect: (userType: string) => void;
  selectedType?: string;
}

const UserTypeSelector = ({ onSelect, selectedType }: UserTypeSelectorProps) => {
  const userTypes = [
    {
      id: "professional",
      title: "Profissional",
      description: "Profissional individual da área farmacêutica",
      icon: Users,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      features: ["Networking", "Oportunidades", "Mentorias", "Especialização"],
      category: "individual"
    },
    {
      id: "company",
      title: "Empresa Farmacêutica",
      description: "Indústria farmacêutica, biotecnologia, genéricos",
      icon: Building2,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      features: ["Buscar Parceiros", "Laboratórios", "Fornecedores", "Regulatório"],
      category: "company"
    },
    {
      id: "laboratory",
      title: "Laboratório",
      description: "Laboratórios analíticos, BQV, EqFar, CROs",
      icon: FlaskConical,
      color: "bg-orange-50 border-orange-200 text-orange-800",
      features: ["Oferecer Serviços", "Capacidade", "Certificações", "Clientes"],
      category: "service_provider"
    },
    {
      id: "consultant",
      title: "Consultor",
      description: "Consultor independente especializado",
      icon: Briefcase,
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
      features: ["Projetos", "Expertise", "Regulatório", "Qualidade"],
      category: "service_provider"
    },
    {
      id: "regulatory_body",
      title: "Órgão Regulador",
      description: "ANVISA, Ministério da Saúde, órgãos governamentais",
      icon: Shield,
      color: "bg-red-50 border-red-200 text-red-800",
      features: ["Fiscalização", "Normas", "Registros", "Monitoramento"],
      category: "regulatory"
    },
    {
      id: "sector_entity",
      title: "Entidade Setorial",
      description: "Sindusfarma, associações, grupos de trabalho",
      icon: Scale,
      color: "bg-green-50 border-green-200 text-green-800",
      features: ["Representação", "Advocacy", "Networking", "Eventos"],
      category: "sector"
    },
    {
      id: "research_institution",
      title: "Instituição de Pesquisa",
      description: "Universidades, institutos, centros de P&D",
      icon: University,
      color: "bg-yellow-50 border-yellow-200 text-yellow-800",
      features: ["Pesquisa", "Desenvolvimento", "Parcerias", "Inovação"],
      category: "research"
    },
    {
      id: "supplier",
      title: "Fornecedor",
      description: "Matérias-primas, equipamentos, embalagens",
      icon: Factory,
      color: "bg-cyan-50 border-cyan-200 text-cyan-800",
      features: ["Produtos", "Certificações", "Logística", "Qualidade"],
      category: "supplier"
    },
    {
      id: "funding_agency",
      title: "Agência de Fomento",
      description: "FINEP, CNPq, agências de financiamento",
      icon: FileText,
      color: "bg-pink-50 border-pink-200 text-pink-800",
      features: ["Financiamento", "Editais", "Projetos", "Inovação"],
      category: "funding"
    },
    {
      id: "healthcare_provider",
      title: "Prestador de Saúde",
      description: "Hospitais, clínicas, farmácias",
      icon: Heart,
      color: "bg-teal-50 border-teal-200 text-teal-800",
      features: ["Aquisições", "Protocolos", "Qualidade", "Pacientes"],
      category: "healthcare"
    }
  ];

  const categories = {
    individual: "Pessoas Físicas",
    company: "Empresas",
    service_provider: "Prestadores de Serviços",
    regulatory: "Órgãos Reguladores",
    sector: "Entidades Setoriais",
    research: "Pesquisa e Desenvolvimento",
    supplier: "Fornecedores",
    funding: "Agências de Fomento",
    healthcare: "Saúde"
  };

  const groupedTypes = userTypes.reduce((acc, type) => {
    const category = type.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(type);
    return acc;
  }, {} as Record<string, typeof userTypes>);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Selecione seu Tipo de Organização
        </h2>
        <p className="text-muted-foreground">
          Escolha a categoria que melhor representa sua organização no ecossistema farmacêutico brasileiro
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Card 
              key={type.id} 
              className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                isSelected ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onSelect(type.id)}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div className="mx-auto p-2 rounded-full bg-accent w-fit">
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{type.title}</h3>
                  <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
                    {type.description}
                  </p>
                </div>
                <Button 
                  className="w-full h-8 text-xs"
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                >
                  {isSelected ? 'Selecionado' : 'Selecionar'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Não consegue encontrar seu tipo? Selecione a opção mais próxima e personalize no próximo passo.
        </p>
      </div>
    </div>
  );
};

export default UserTypeSelector;
