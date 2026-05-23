/* === DADOS BASE DO HERO | inicio === */
import type { DadosEmpresaRoi } from "@/types/calculadora";

export const dadosBaseHero: DadosEmpresaRoi = {
  nomeInstituicao: "Hospital exemplo",
  porteInstituicao: "Médio porte",
  profissionaisSaude: 120,
  atendimentosMes: 8500,
  ticketMedioAtendimento: 280,
  margemMediaAtendimento: 95,
  medicosCredenciadosMes: 12,
  valorMensalPorMedicoLiberado: 28000,
  tempoCredenciamentoAtualDias: 45,
  tempoCredenciamentoComHssDias: 12,
  horasAdministrativasSemana: 110,
  custoHoraAdministrativo: 42,
  reducaoAdministrativaPercentual: 38,
  taxaNoShowAtual: 18,
  taxaNoShowComHss: 11,
  reducaoGlosasPercentual: 22,
  custoGlosasMensal: 24000,
  custoMensalHss: 7500,
  custoImplantacaoHss: 18000,
  mesesAnalise: 12,
  tipoCredenciamentoId: "hospitalar-padrao",
  tipoCredenciamentoNome: "Credenciamento hospitalar padrão",
  horasAdministrativasPorCredenciamento: 22,
  taxaRetrabalhoDocumental: 24,
  custoRetrabalhoPorMedico: 520,
  taxaDocumentosVencidos: 10,
  custoDocumentoVencido: 260,
  margemLiquidaPercentual: 35,
};
/* === DADOS BASE DO HERO | fim === */

/* === DADOS DO PROCESSO | inicio === */
export const etapasProcesso = [
  {
    titulo: "Pré-cadastro do médico",
    texto: "Instituição ou médico inicia o fluxo com dados básicos, vínculo desejado e tipo de credenciamento.",
  },
  {
    titulo: "Envio e triagem documental",
    texto: "Documentos obrigatórios são reunidos, classificados e conferidos conforme o perfil do cenário.",
  },
  {
    titulo: "Validação de CRM, RQE e certidões",
    texto: "A etapa reduz risco assistencial e organiza a conferência das credenciais profissionais.",
  },
  {
    titulo: "Análise técnica e aprovação interna",
    texto: "Coordenação, corpo clínico, compliance ou jurídico validam o médico conforme as regras da instituição.",
  },
  {
    titulo: "Liberação operacional para atuação",
    texto: "O médico é liberado para agenda, plantão, procedimento ou recredenciamento conforme o cenário.",
  },
];

export const problemasSemHss = ["ANÁLISE EXAUSTIVA E FALSA AUTOMAÇÃO", "VALIDAÇÃO ARTESANAL E RETRABALHO", "INTEGRAÇÃO LIMITADA", "GESTÃO CAÓTICA E VULNERABILIDADE"];

export const informacoesSemHss = [
  "ANÁLISE EXAUSTIVA E FALSA AUTOMAÇÃO. A ausência de leitura automática — no papel ou em sistemas limitados — abre brechas para o erro humano e aprovações irregulares.",
  "VALIDAÇÃO ARTESANAL E RETRABALHO. O eterno vai-e-vem de e-mails cobrando anexos frustra o corpo clínico e atrasa o início dos plantões.",
  "INTEGRAÇÃO LIMITADA. Softwares que não conectam ao CRM ou bases federais tornam o preenchimento de dados repetitivo e lento.",
  "GESTÃO CAÓTICA E VULNERABILIDADE. Sem rastreabilidade clara, comprovar o compliance durante uma auditoria vira uma operação de resgate estressante.",
];

export const ganhosComHss = ["IA DE ALTA PRECISÃO", "SEGURANÇA BLINDADA", "ECOSSISTEMA INTEROPERÁVEL", "FOCO EM COMPLIANCE"];

export const informacoesComHss = [
  "IA DE ALTA PRECISÃO. Antecipa erros e inconsistências, acelerando drasticamente aprovações e eliminando falhas humanas.",
  "SEGURANÇA BLINDADA. Camadas de validação rigorosas que garantem a autenticidade documental e total conformidade com as normas do setor.",
  "ECOSSISTEMA INTEROPERÁVEL. Conecte-se aos principais sistemas hospitalares e bases regulatórias sem trabalho manual e silos de informação.",
  "FOCO EM COMPLIANCE. Trilhas de auditoria automáticas e arquitetura focada em compliance para fiscalizações sem estresse.",
];

export const depoimentos = [
  { texto: "A simulação deixou claro o custo de manter médicos aguardando liberação.", nome: "Gestora hospitalar", cargo: "Operações em saúde", cor: "#ffe4d6" },
  { texto: "O painel ADM permite ajustar tempos e percentuais por tipo de credenciamento.", nome: "Coordenador médico", cargo: "Corpo clínico", cor: "#e6edff" },
  { texto: "O processo fica mais transparente para a instituição e para o médico.", nome: "Diretora de clínica", cargo: "Rede assistencial", cor: "#ddf6d5" },
  { texto: "A comparação sem HSS e com HSS transforma burocracia em número de negócio.", nome: "Analista de saúde", cargo: "Planejamento financeiro", cor: "#f1e6ff" },
  { texto: "Conseguimos apresentar o ROI do credenciamento em poucos minutos.", nome: "Gerente financeiro", cargo: "Hospital geral", cor: "#d9f4ff" },
  { texto: "Os cenários ativos ajudam a adaptar a conversa para hospitais, clínicas e médicos.", nome: "Executiva comercial", cargo: "Health tech B2B", cor: "#e7f9df" },
  { texto: "A lógica por tempo deixa fácil explicar o prejuízo de cada dia de atraso.", nome: "Consultor de processos", cargo: "Eficiência operacional", cor: "#fff2cc" },
  { texto: "A navegação por etapas ajuda o gestor a preencher os dados sem confusão.", nome: "Coordenadora administrativa", cargo: "Clínica médica", cor: "#eadcff" },
  { texto: "O modelo dá visibilidade para recredenciamento, alta complexidade e PJ.", nome: "Diretor técnico", cargo: "Rede hospitalar", cor: "#dff7f2" },
  { texto: "O cálculo aproxima operação, financeiro e corpo clínico da mesma decisão.", nome: "Head de operações", cargo: "Instituição de saúde", cor: "#ffe3ee" },
  { texto: "A experiência visual ficou clara para demonstrar ganhos em reuniões comerciais.", nome: "Especialista comercial", cargo: "Soluções B2B", cor: "#dde7ff" },
  { texto: "O fluxo evidencia onde o processo tradicional perde tempo e dinheiro.", nome: "Auditor interno", cargo: "Qualidade hospitalar", cor: "#ebf4dd" },
  { texto: "As premissas no ADM dão controle para testar cenários conservadores e otimistas.", nome: "Controller", cargo: "Planejamento", cor: "#f5e8ff" },
  { texto: "A leitura de payback e ROI facilita priorizar a contratação da solução.", nome: "Diretor administrativo", cargo: "Hospital privado", cor: "#dcecff" },
  { texto: "A HSS transforma credenciamento em uma jornada mensurável.", nome: "Product owner", cargo: "Saúde digital", cor: "#ffe8d6" },
];
/* === DADOS DO PROCESSO | fim === */
