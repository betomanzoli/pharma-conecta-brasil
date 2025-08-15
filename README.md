
# Master AI Hub - Plataforma de IA para Indústria Farmacêutica

O Master AI Hub é uma plataforma especializada que combina inteligência artificial avançada com expertise farmacêutica para acelerar inovação, otimizar processos e facilitar colaborações no setor farmacêutico brasileiro.

## 🚀 Principais Funcionalidades

### 🤖 Agentes de IA Especializados
- **Project Analyst**: Análise e planejamento de projetos farmacêuticos
- **Business Strategist**: Desenvolvimento de estratégias de negócio e análises de mercado
- **Technical & Regulatory**: Análises técnico-regulatórias especializadas
- **Document Assistant**: Geração automatizada de documentação GxP/ICH
- **Coordinator**: Orquestração e síntese de análises multi-agente

### 💬 Master AI Assistant
- Chat inteligente com expertise farmacêutica
- Integração com base de conhecimento especializada
- Análise de contexto e recomendações personalizadas
- Suporte a múltiplos idiomas

### 📚 Base de Conhecimento
- Biblioteca de recursos farmacêuticos curados
- Sistema de ingestão de documentos com IA
- Busca semântica avançada
- Ratings e comentários da comunidade

### 🔍 Inteligência de Mercado
- Pesquisas em tempo real com Perplexity AI
- Análises de tendências farmacêuticas
- Monitoramento regulatório automatizado
- Insights competitivos

### 🤝 Marketplace de Parcerias
- Matching inteligente de parceiros
- Perfis especializados por expertise
- Sistema de verificação e compliance
- Gestão de colaborações

### 🎯 Biblioteca de Prompts
- Templates especializados para análises farmacêuticas
- Prompts categorizados por área de expertise
- Integração direta com o chat AI
- Compartilhamento e avaliação da comunidade

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Edge Functions, Auth)
- **IA**: Perplexity AI, OpenAI
- **Infraestrutura**: Vite, React Router, Tanstack Query

## ⚙️ Configuração

### Pré-requisitos
- Node.js 18+
- Conta Supabase
- Chaves de API:
  - Perplexity AI (recomendado)
  - OpenAI (opcional)

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd master-ai-hub
```

2. **Instale dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente no Supabase**
   - Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
   - Vá para Project Settings > Edge Functions
   - Configure os seguintes secrets:
     - `PERPLEXITY_API_KEY`: Sua chave da Perplexity AI
     - `OPENAI_API_KEY`: Sua chave da OpenAI (opcional)

4. **Execute o projeto**
```bash
npm run dev
```

## 🔧 Configuração das APIs

### Perplexity AI (Recomendado)
1. Obtenha sua chave em [Perplexity API](https://www.perplexity.ai/settings/api)
2. Configure no Supabase Dashboard como `PERPLEXITY_API_KEY`
3. Usado para pesquisas em tempo real e análises especializadas

### OpenAI (Opcional)
1. Obtenha sua chave em [OpenAI Platform](https://platform.openai.com/api-keys)
2. Configure no Supabase Dashboard como `OPENAI_API_KEY`
3. Usado como fallback para funcionalidades de chat

## 📊 Funcionalidades por Módulo

### Agentes de IA
- **Entrada**: Dados estruturados específicos por domínio
- **Processamento**: Análise especializada com contexto farmacêutico
- **Saída**: Relatórios em Markdown, KPIs e recomendações

### Chat Inteligente
- **Contexto**: Histórico de conversas persistente
- **Conhecimento**: Integração com base de dados farmacêutica
- **Personalização**: Adaptação ao perfil do usuário

### Marketplace
- **Matching**: Algoritmo de compatibilidade baseado em IA
- **Verificação**: Sistema de compliance automático
- **Comunicação**: Chat integrado entre parceiros

## 🔒 Segurança e Compliance

- **Autenticação**: Supabase Auth com RLS
- **Audit Logs**: Rastreamento de todas as operações
- **Rate Limiting**: Proteção contra uso excessivo
- **Verificação**: Sistema de validação de perfis farmacêuticos

## 🚀 Deploy

O projeto utiliza Supabase para backend e pode ser deployado em qualquer plataforma que suporte aplicações React:

1. **Build do projeto**
```bash
npm run build
```

2. **Deploy no Supabase** (automático via GitHub)
   - Conecte seu repositório no Supabase Dashboard
   - Edge Functions são deployadas automaticamente

3. **Plataformas suportadas**
   - Vercel
   - Netlify
   - AWS Amplify
   - Cloudflare Pages

## 📈 Monitoramento

### Logs de Edge Functions
- Acesse logs em tempo real no Supabase Dashboard
- Monitoramento de performance e erros
- Métricas de uso por função

### Analytics
- Dashboard de métricas integrado
- Tracking de uso dos agentes de IA
- Análise de engagement da comunidade

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── chat/           # Componentes de chat
│   ├── knowledge/      # Componentes da base de conhecimento
│   └── automation/     # Componentes de automação
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── integrations/       # Integrações (Supabase)
└── lib/               # Utilitários e configurações

supabase/
├── functions/          # Edge Functions
├── migrations/         # Migrações do banco
└── config.toml        # Configuração do Supabase
```

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Análise preditiva de projetos farmacêuticos
- [ ] Integração com APIs regulatórias (ANVISA, FDA)
- [ ] Sistema de workflow automatizado
- [ ] Dashboard de analytics avançado
- [ ] App mobile (React Native)

### Melhorias Planejadas
- [ ] Performance otimizada para grandes volumes
- [ ] Suporte a mais idiomas
- [ ] Integração com ferramentas de projeto (Jira, Slack)
- [ ] API pública para integrações

## 📞 Suporte

- **Documentação**: [Em desenvolvimento]
- **Issues**: Use o GitHub Issues
- **Email**: [Configurar email de suporte]
- **Community**: [Discord/Slack da comunidade]

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Master AI Hub** - Acelerando a inovação farmacêutica com inteligência artificial 🧬🤖
