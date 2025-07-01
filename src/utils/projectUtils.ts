
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'default';
    case 'in_progress': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'open': return 'Aberto';
    case 'in_progress': return 'Em Andamento';
    case 'completed': return 'Concluído';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
};

export const getServiceTypeLabel = (serviceType: string) => {
  switch (serviceType) {
    case 'laboratory_analysis': return 'Análise Laboratorial';
    case 'regulatory_consulting': return 'Consultoria Regulatória';
    case 'clinical_research': return 'Pesquisa Clínica';
    case 'manufacturing': return 'Fabricação';
    case 'quality_control': return 'Controle de Qualidade';
    default: return serviceType;
  }
};
