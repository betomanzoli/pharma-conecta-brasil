
export interface StrategicProject {
  id: string;
  name: string;
  description: string;
  phase: 'planning' | 'execution' | 'monitoring' | 'completion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate: Date;
  budget: number;
  partners: string[];
  aiMatchingScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  expectedValue: number;
  actualValue?: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  kpis: StrategicKPI[];
  milestones: ProjectMilestone[];
  collaborativeGovernance: GovernanceMetrics;
  predictiveAnalysis: PredictiveInsights;
}

export interface StrategicKPI {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: 'financial' | 'operational' | 'strategic' | 'innovation';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completionDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dependencies: string[];
  assignedTo: string[];
  deliverables: string[];
}

export interface GovernanceMetrics {
  decisionMakingSpeed: number;
  stakeholderEngagement: number;
  conflictResolution: number;
  transparencyScore: number;
  complianceLevel: number;
  collaborationIndex: number;
}

export interface PredictiveInsights {
  successProbability: number;
  riskFactors: RiskFactor[];
  marketTrends: MarketTrend[];
  competitiveAnalysis: CompetitiveInsight[];
  recommendations: StrategicRecommendation[];
}

export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  probability: number;
  impact: number;
  category: 'technical' | 'market' | 'regulatory' | 'financial' | 'operational';
  mitigationStrategy: string;
  status: 'active' | 'mitigated' | 'accepted';
}

export interface MarketTrend {
  id: string;
  name: string;
  description: string;
  impact: number;
  timeline: string;
  confidence: number;
  source: string;
}

export interface CompetitiveInsight {
  competitor: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: number;
  strategicMoves: string[];
  threatLevel: number;
}

export interface StrategicRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expectedImpact: number;
  implementationTime: number;
  resources: string[];
  dependencies: string[];
  category: 'optimization' | 'expansion' | 'innovation' | 'risk_mitigation';
}

export interface GomesCasseresLaw {
  id: string;
  name: string;
  description: string;
  principle: string;
  application: string;
  metrics: string[];
  complianceLevel: number;
}

export interface SharedValueMetrics {
  economicValue: number;
  socialValue: number;
  environmentalValue: number;
  stakeholderValue: number;
  innovationValue: number;
  totalSharedValue: number;
}
