import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator, Beaker } from "lucide-react";
import { motion } from "framer-motion";

const QbDComplexityEvaluator: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Avaliador de Complexidade QbD
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Avalie a complexidade do desenvolvimento por Quality by Design (QbD).
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta calculadora está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Beaker className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Desenvolvendo algoritmos para avaliar complexidade de desenvolvimento baseado em Quality by Design.
          </p>
          <Button disabled>
            Aguarde - Em Breve
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QbDComplexityEvaluator;