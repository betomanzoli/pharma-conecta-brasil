
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Building2, Clock, TrendingUp, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";

const Careers = () => {
  const opportunities = [
    {
      id: 1,
      title: "Analista de Controle de Qualidade Sênior",
      company: "FarmaBrasil Ltda",
      location: "São Paulo, SP",
      type: "CLT",
      level: "Sênior",
      salary: "R$ 8.000 - R$ 12.000",
      posted: "2 dias atrás",
      requirements: ["Farmácia", "HPLC", "Validação de Métodos"],
      description: "Responsável pela análise físico-química de medicamentos e validação de métodos analíticos."
    },
    {
      id: 2,
      title: "Especialista Regulatório",
      company: "BioPharma Inovação",
      location: "Rio de Janeiro, RJ",
      type: "CLT",
      level: "Pleno",
      salary: "R$ 10.000 - R$ 15.000",
      posted: "1 semana atrás",
      requirements: ["ANVISA", "Registro de Medicamentos", "Farmacovigilância"],
      description: "Conduzir processos de registro de medicamentos junto à ANVISA e órgãos internacionais."
    },
    {
      id: 3,
      title: "Pesquisador em P&D",
      company: "InnovaFarma",
      location: "Campinas, SP",
      type: "CLT",
      level: "Júnior",
      salary: "R$ 6.000 - R$ 9.000",
      posted: "3 dias atrás",
      requirements: ["Mestrado", "Desenvolvimento Farmacêutico", "Formulação"],
      description: "Desenvolver novas formulações farmacêuticas e apoiar projetos de P&D."
    }
  ];

  const mentorshipPrograms = [
    {
      id: 1,
      title: "Programa de Mentoria em Regulatório",
      mentor: "Dra. Ana Rodrigues",
      duration: "6 meses",
      level: "Iniciante",
      topics: ["Registro ANVISA", "Compliance", "Farmacovigilância"]
    },
    {
      id: 2,
      title: "Mentoria em P&D Farmacêutico",
      mentor: "Dr. Carlos Ferreira",
      duration: "4 meses",
      level: "Intermediário",
      topics: ["Desenvolvimento", "Formulação", "Scale-up"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ComplianceDisclaimer />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Carreiras Farmacêuticas
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Acelere sua carreira com oportunidades exclusivas e programas de mentoria
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">150+</div>
              <div className="text-sm text-gray-600">Vagas Ativas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">25+</div>
              <div className="text-sm text-gray-600">Mentores Especialistas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Profissionais Conectados</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">80+</div>
              <div className="text-sm text-gray-600">Empresas Parceiras</div>
            </CardContent>
          </Card>
        </div>

        {/* Job Opportunities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Oportunidades de Trabalho</h2>
          
          <div className="space-y-4">
            {opportunities.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{job.salary}</div>
                      <Badge variant="secondary">{job.level}</Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Requisitos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req) => (
                        <Badge key={req} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button>Ver Detalhes</Button>
                    <Button variant="outline">Candidatar-se</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mentorship Programs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Programas de Mentoria</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentorshipPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                  <p className="text-sm text-gray-600">com {program.mentor}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary">{program.level}</Badge>
                    <span className="text-sm text-gray-600">{program.duration}</span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Tópicos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.topics.map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full">Participar do Programa</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  );
};

export default Careers;
