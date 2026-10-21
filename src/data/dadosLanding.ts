/* === DADOS DO PROCESSO | inicio === */
// resumo: linha curta do cartao. texto: o que acontece na etapa. comHss e limite: explicacao exibida no modal.
// Os limites seguem as notas dos cenarios da calculadora: a HSS organiza o fluxo, mas nao substitui decisoes da instituicao.
export const etapasProcesso = [
  {
    titulo: "Pré-cadastro do médico",
    resumo: "Dados básicos, vínculo e tipo de credenciamento.",
    texto: "Instituição ou médico inicia o fluxo com dados básicos, vínculo desejado e tipo de credenciamento.",
    comHss: "O médico recebe um formulário digital e preenche pelo celular. Os dados ficam salvos no cadastro único e são reaproveitados em outros credenciamentos.",
    limite: "O prazo ainda depende de o médico responder e enviar as informações.",
  },
  {
    titulo: "Envio e triagem documental",
    resumo: "Documentos reunidos e conferidos conforme o cenário.",
    texto: "Documentos obrigatórios são reunidos, classificados e conferidos conforme o perfil do cenário.",
    comHss: "Um checklist mostra o que cada tipo de credenciamento exige. Documento faltando ou com pendência aparece no status, sem troca de e-mails.",
    limite: "A triagem é mais rápida quando o médico já tem os documentos completos.",
  },
  {
    titulo: "Validação de CRM, RQE e certidões",
    resumo: "Conferência das credenciais e certidões do médico.",
    texto: "A etapa reduz risco assistencial e organiza a conferência das credenciais profissionais.",
    comHss: "Cada credencial tem status e histórico de conferência, e a plataforma avisa antes de um documento vencer.",
    limite: "A consulta às fontes oficiais, como o conselho regional, continua obrigatória.",
  },
  {
    titulo: "Análise técnica e aprovação interna",
    resumo: "Validação pelas áreas responsáveis da instituição.",
    texto: "Coordenação, corpo clínico, compliance ou jurídico validam o médico conforme as regras da instituição.",
    comHss: "O dossiê chega completo e organizado a quem aprova, com as pendências rastreadas desde o envio.",
    limite: "A decisão é da instituição. Na simulação, o prazo desta etapa é o mesmo com e sem a HSS.",
  },
  {
    titulo: "Liberação operacional para atuação",
    resumo: "Liberação para agenda, plantão ou procedimento.",
    texto: "O médico é liberado para agenda, plantão, procedimento ou recredenciamento conforme o cenário.",
    comHss: "Contrato com assinatura digital e status de liberação visível para o médico e para a instituição.",
    limite: "Agenda, escala e integração com os sistemas do hospital continuam com a instituição.",
  },
];

export const problemasSemHss = [
  "Descentralização. Arquivos espalhados em e-mails, planilhas e pastas tiram o controle do processo.",
  "Rotina manual. Sua equipe perde horas preciosas cobrando anexos e atualizando status um a um.",
  "Prazos cegos. Ausência de parâmetros de tempo, deixando a operação sem qualquer previsibilidade.",
  "Gargalo comercial. Processo rígido, lento e totalmente dependente de validações manuais dispersas.",
];

export const informacoesSemHss = [
  "Falta de fluxo único. Documentos isolados que inviabilizam a auditoria, rastreabilidade e priorização.",
  "Desperdício de tempo. O dia a dia vira um ciclo de retrabalho para lembrar pendências e atualizar controles.",
  "Prejuízo oculto. Sem um cálculo claro do impacto do atraso, a empresa perde receita sem mensurar o tamanho do estrago.",
  "Agendas vazias. Médicos ociosos impossibilitados de atender e faturamento permanentemente postergado.",
];

export const ganhosComHss = [
  "Fluxo centralizado. O fluxo digital centraliza etapas, documentos e premissas por tipo de credenciamento configurado no ADM.",
  "Modelagem por cenário. A instituição define tempo sem HSS, tempo com HSS, percentuais e custos para cada cenário ativo.",
  "Cálculo de impacto. A calculadora converte dias economizados em receita antecipada, economia operacional e ROI estimado.",
  "Governança comercial. O painel ADM ativa ou desativa cenários, mantendo o site alinhado ao processo comercial da HSS.",
];

export const informacoesComHss = [
  "Elimine a dispersão de dados. Garanta que toda a documentação e histórico fiquem em um único lugar, reduzindo erros operacionais e o tempo de busca por informações.",
  "Simulações precisas e personalizadas. Customize as variáveis da sua realidade operacional para enxergar com clareza o real impacto financeiro e de tempo na sua gestão.",
  "Decisões baseadas em dados reais. Transforme eficiência em números claros. Visualize o retorno financeiro, ROI, exato que a redução de prazos traz para o seu caixa.",
  "Autonomia e agilidade comercial. Gerencie suas estratégias em tempo real. Adapte as regras do sistema instantaneamente para refletir as novas metas do seu negócio.",
];

export const depoimentos = [
  { texto: "A simulação deixou claro o custo de manter médicos aguardando liberação.", nome: "Gestora hospitalar", cargo: "Operações em saúde", cor: "#ffe4d6", foto: "https://i.pravatar.cc/120?img=47" },
  { texto: "O painel ADM permite ajustar tempos e percentuais por tipo de credenciamento.", nome: "Coordenador médico", cargo: "Corpo clínico", cor: "#e6edff", foto: "https://i.pravatar.cc/120?img=12" },
  { texto: "O processo fica mais transparente para a instituição e para o médico.", nome: "Diretora de clínica", cargo: "Rede assistencial", cor: "#ddf6d5", foto: "https://i.pravatar.cc/120?img=32" },
  { texto: "A comparação sem HSS e com HSS transforma burocracia em número de negócio.", nome: "Analista de saúde", cargo: "Planejamento financeiro", cor: "#f1e6ff", foto: "https://i.pravatar.cc/120?img=5" },
  { texto: "Conseguimos apresentar o ROI do credenciamento em poucos minutos.", nome: "Gerente financeiro", cargo: "Hospital geral", cor: "#d9f4ff", foto: "https://i.pravatar.cc/120?img=59" },
  { texto: "Os cenários ativos ajudam a adaptar a conversa para hospitais, clínicas e médicos.", nome: "Executiva comercial", cargo: "Health tech B2B", cor: "#e7f9df", foto: "https://i.pravatar.cc/120?img=25" },
  { texto: "A lógica por tempo deixa fácil explicar o prejuízo de cada dia de atraso.", nome: "Consultor de processos", cargo: "Eficiência operacional", cor: "#fff2cc", foto: "https://i.pravatar.cc/120?img=14" },
  { texto: "A navegação por etapas ajuda o gestor a preencher os dados sem confusão.", nome: "Coordenadora administrativa", cargo: "Clínica médica", cor: "#eadcff", foto: "https://i.pravatar.cc/120?img=44" },
  { texto: "O modelo dá visibilidade para recredenciamento, alta complexidade e PJ.", nome: "Diretor técnico", cargo: "Rede hospitalar", cor: "#dff7f2", foto: "https://i.pravatar.cc/120?img=53" },
  { texto: "O cálculo aproxima operação, financeiro e corpo clínico da mesma decisão.", nome: "Head de operações", cargo: "Instituição de saúde", cor: "#ffe3ee", foto: "https://i.pravatar.cc/120?img=20" },
  { texto: "A experiência visual ficou clara para demonstrar ganhos em reuniões comerciais.", nome: "Especialista comercial", cargo: "Soluções B2B", cor: "#dde7ff", foto: "https://i.pravatar.cc/120?img=38" },
  { texto: "O fluxo evidencia onde o processo tradicional perde tempo e dinheiro.", nome: "Auditor interno", cargo: "Qualidade hospitalar", cor: "#ebf4dd", foto: "https://i.pravatar.cc/120?img=16" },
  { texto: "As premissas no ADM dão controle para testar cenários conservadores e otimistas.", nome: "Controller", cargo: "Planejamento", cor: "#f5e8ff", foto: "https://i.pravatar.cc/120?img=49" },
  { texto: "A leitura de payback e ROI facilita priorizar a contratação da solução.", nome: "Diretor administrativo", cargo: "Hospital privado", cor: "#dcecff", foto: "https://i.pravatar.cc/120?img=60" },
  { texto: "A HSS transforma credenciamento em uma jornada mensurável.", nome: "Product owner", cargo: "Saúde digital", cor: "#ffe8d6", foto: "https://i.pravatar.cc/120?img=31" },
];
/* === DADOS DO PROCESSO | fim === */
