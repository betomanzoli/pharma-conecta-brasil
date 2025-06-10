
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, FlaskConical, UserCheck, Wrench, GraduationCap, Shield } from "lucide-react";

interface UserType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const userTypes: UserType[] = [
  {
    id: "professional",
    title: "Profissional da Indústria",
    description: "Networking profissional e desenvolvimento de carreira",
    icon: Users,
    color: "bg-blue-50 border-blue-200 text-blue-800"
  },
  {
    id: "company",
    title: "Empresa",
    description: "Farmacêutica, Alimentícia, Biotecnológica",
    icon: Building2,
    color: "bg-green-50 border-green-200 text-green-800"
  },
  {
    id: "laboratory",
    title: "Laboratório Analítico",
    description: "Serviços analíticos especializados",
    icon: FlaskConical,
    color: "bg-purple-50 border-purple-200 text-purple-800"
  },
  {
    id: "consultant",
    title: "Consultor/Prestador de Serviços",
    description: "Expertise especializada e consultoria",
    icon: UserCheck,
    color: "bg-orange-50 border-orange-200 text-orange-800"
  },
  {
    id: "supplier",
    title: "Fornecedor de Equipamentos",
    description: "Catálogos de produtos e suporte técnico",
    icon: Wrench,
    color: "bg-red-50 border-red-200 text-red-800"
  },
  {
    id: "university",
    title: "Universidade/Pesquisador",
    description: "Colaboração em pesquisa e desenvolvimento",
    icon: GraduationCap,
    color: "bg-indigo-50 border-indigo-200 text-indigo-800"
  },
  {
    id: "regulatory",
    title: "Órgão Regulatório",
    description: "Atualizações oficiais e diretrizes",
    icon: Shield,
    color: "bg-gray-50 border-gray-200 text-gray-800"
  }
];

interface UserTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const UserTypeSelector = ({ selectedType, onTypeSelect }: UserTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;
        
        return (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isSelected ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => onTypeSelect(type.id)}
          >
            <CardHeader className="text-center pb-2">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${type.color} mb-2`}>
                <Icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg">{type.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 text-sm mb-4">{type.description}</p>
              <Button 
                variant={isSelected ? "default" : "outline"}
                className="w-full"
              >
                {isSelected ? "Selecionado" : "Selecionar"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserTypeSelector;
