
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, Building2, FlaskConical, Shield, Briefcase } from "lucide-react";

interface UserTypeSelectorProps {
  onSelect: (userType: string) => void;
  selectedType?: string;
}

const UserTypeSelector = ({ onSelect, selectedType }: UserTypeSelectorProps) => {
  const userTypes = [
    {
      id: "professional",
      title: "Profissional",
      description: "Profissional da indústria farmacêutica buscando networking e oportunidades",
      icon: Users,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      features: ["Networking", "Marketplace", "Fóruns", "Mentorias"]
    },
    {
      id: "mentor",
      title: "Mentor",
      description: "Profissional experiente oferecendo mentoria e consultoria",
      icon: GraduationCap,
      color: "bg-green-50 border-green-200 text-green-800",
      features: ["Oferecer Mentoria", "Consultorias", "Receita Adicional", "Impacto Social"]
    },
    {
      id: "company",
      title: "Empresa",
      description: "Empresa farmacêutica buscando talentos, fornecedores e parcerias",
      icon: Building2,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      features: ["Recrutamento", "Fornecedores", "Parcerias", "Projetos"]
    },
    {
      id: "laboratory",
      title: "Laboratório",
      description: "Laboratório oferecendo serviços analíticos e de P&D",
      icon: FlaskConical,
      color: "bg-orange-50 border-orange-200 text-orange-800",
      features: ["Serviços Analíticos", "Capacidade", "Equipamentos", "Clientes"]
    },
    {
      id: "consultant",
      title: "Consultor",
      description: "Consultor independente oferecendo expertise especializada",
      icon: Briefcase,
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
      features: ["Projetos", "Expertise", "Flexibilidade", "Network"]
    },
    {
      id: "regulatory",
      title: "Regulatório",
      description: "Especialista em assuntos regulatórios e compliance",
      icon: Shield,
      color: "bg-red-50 border-red-200 text-red-800",
      features: ["Compliance", "Auditorias", "Registros", "Treinamentos"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;
        
        return (
          <Card 
            key={type.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isSelected ? 'ring-2 ring-primary shadow-lg' : ''
            } ${type.color}`}
            onClick={() => onSelect(type.id)}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-white">
                <Icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg">{type.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 text-center">{type.description}</p>
              <div className="space-y-2">
                {type.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              <Button 
                className={`w-full mt-4 ${isSelected ? 'bg-primary' : ''}`}
                variant={isSelected ? "default" : "outline"}
              >
                {isSelected ? 'Selecionado' : 'Selecionar'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserTypeSelector;
