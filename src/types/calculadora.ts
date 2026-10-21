/* === TIPOS DA CALCULADORA | inicio === */
export type VisaoCalculadora = 'empresa' | 'medico';
export type PerspectivaRoi = 'medico' | 'instituicao';
export type OrigemDado = 'hipotese' | 'piloto' | 'medido';
export type OrigemCriacao = 'adm' | 'ia';
/* === TIPOS DA CALCULADORA | fim === */

/* === TIPOS DE CENARIO | inicio === */
export interface EtapaCenario {
  id: string;
  nome: string;
  diasSemHss: number;
  diasComHss: number;
  hssAtua: boolean;
  nota: string;
}

// Um unico conjunto de premissas por cenario: os fatos da agenda (consultas, ticket, repasse, prazo)
// sao os mesmos para o medico e para a instituicao; cada lado so acrescenta os proprios custos.
export interface PremissasCenario {
  // Agenda e receita (usadas pelos dois perfis)
  consultasPorDia: number;
  diasAtendimentoSemana: number;
  ocupacaoPercentual: number;
  ticketMedio: number;
  parcelaMedicoPercentual: number;
  prazoRecebimentoDias: number;
  mesesAnalise: number;
  retrabalhoSemHssPercentual: number;
  retrabalhoComHssPercentual: number;
  // Lado do medico
  impostosPercentual: number;
  custoConsultaMedico: number;
  custoEntrada: number;
  horasMedicoSemHss: number;
  horasMedicoComHss: number;
  valorHoraMedico: number;
  custoRetrabalhoMedico: number;
  mensalidadeHssMedico: number;
  mensalidadeCurso: number;
  mesesCurso: number;
  // Lado da instituicao
  medicosPorMes: number;
  custoConsultaInstituicao: number;
  horasEquipeSemHss: number;
  horasEquipeComHss: number;
  custoHoraEquipe: number;
  custoRetrabalhoInstituicao: number;
  // Valor fixo que a HSS cobra da instituicao por medico credenciado (sem mensalidade nem implantacao).
  valorCredenciamentoHss: number;
}

export type CampoPremissa = keyof PremissasCenario;

export interface CenarioCredenciamento {
  id: string;
  ativo: boolean;
  nome: string;
  resumoSite: string;
  limite: string;
  perspectivas: PerspectivaRoi[];
  origemPrazos: OrigemDado;
  origemCriacao: OrigemCriacao;
  etapas: EtapaCenario[];
  premissas: PremissasCenario;
  // Campos que o visitante preenche na calculadora; os demais usam o valor do ADM.
  camposVisitante: Record<PerspectivaRoi, CampoPremissa[]>;
}
/* === TIPOS DE CENARIO | fim === */

/* === TIPOS DE RESULTADO | inicio === */
export interface ResultadoTimeline {
  diasSemHss: number;
  diasComHss: number;
  diasEconomizados: number;
  hssAtua: boolean;
}

export interface ResultadoMedico {
  timeline: ResultadoTimeline;
  margemPorConsulta: number;
  margemDiaria: number;
  rendaMensal: number;
  faturamentoParadoSemHss: number;
  margemAntecipada: number;
  economiaHoras: number;
  economiaRetrabalho: number;
  horasPoupadas: number;
  beneficioHss: number;
  custoHssPeriodo: number;
  ganhoLiquidoHss: number;
  roiPercentual: number | null;
  custoEntradaSemHss: number;
  custoEntradaComHss: number;
  recuperaEntradaSemHssMeses: number | null;
  recuperaEntradaComHssMeses: number | null;
  investimentoFormacao: number;
  recuperaFormacaoSemHssMeses: number | null;
  recuperaFormacaoComHssMeses: number | null;
  mensalidadesCursoAntecipadas: number | null;
}

export interface ResultadoInstituicao {
  timeline: ResultadoTimeline;
  parcelaInstituicaoPercentual: number;
  margemPorConsulta: number;
  margemDiaria: number;
  margemAntecipadaPorMedico: number;
  custoEquipeSemHss: number;
  custoEquipeComHss: number;
  custoRetrabalhoSemHss: number;
  custoRetrabalhoComHss: number;
  economiaOperacionalPorMedico: number;
  beneficioPorMedico: number;
  beneficioMensal: number;
  beneficioPeriodo: number;
  custoHssPeriodo: number;
  beneficioLiquido: number;
  roiPercentual: number | null;
  paybackMeses: number | null;
  paybackCalendarioMeses: number | null;
  custoHssPorMedico: number;
  // Quanto volta para cada R$ 1 pago a HSS (beneficio por medico ÷ valor do credenciamento).
  retornoPorRealHss: number | null;
  custoCredenciamentoSemHss: number;
  margemParadaPorMedicoSemHss: number;
  margemParadaMensalSemHss: number;
  horasEquipeMesSemHss: number;
}

export interface RoiHorizonte {
  meses: number;
  roiPercentual: number | null;
  beneficioLiquido: number;
}

export interface LinhaMemoria {
  rotulo: string;
  formula: string;
  valor: string;
  destaque?: boolean;
}

// Mesmo item medido nos dois fluxos, para a regua de diferenca.
export interface ItemComparativo {
  id: string;
  rotulo: string;
  semHss: number;
  comHss: number;
  formatar: (valor: number) => string;
  // true quando o valor menor e o melhor (prazo, custo); false quando o maior e o melhor (renda).
  menorMelhor: boolean;
  detalhe?: string;
}
/* === TIPOS DE RESULTADO | fim === */

/* === TIPOS DA CALCULADORA DE CARREIRA | inicio === */
export type TipoCalculadora = 'medico' | 'corporativo' | 'carreira';

export interface PremissasCarreira {
  mensalidadeInicial: number;
  reajusteAnualPercentual: number;
  anosCurso: number;
  custoVidaMensal: number;
  materiais: number;
  preparatorioResidencia: number;
  // Atendimentos depois de formado, um item por local (medico que atende em mais de um lugar).
  // Cada local tem os proprios impostos e prazo de pagamento; a renda liquida mensal = soma dos liquidos dos locais.
  locais: LocalAtendimento[];
  // Custo de vida depois de formado; sem valor, acompanha o custo de vida informado nos gastos do curso.
  custoVidaFormado?: number;
}

export interface LocalAtendimento {
  id: string;
  nome: string;
  atendimentosPorDia: number;
  diasAtendimentoMes: number;
  valorAtendimento: number;
  parcelaMedicoPercentual: number;
  impostosPercentual: number;
  prazoRecebimentoDias: number;
}

// Campos numericos gerais da carreira (os do local ficam em CampoLocal).
export type CampoCarreira = Exclude<keyof PremissasCarreira, 'locais' | 'custoVidaFormado'>;
export type CampoLocal = Exclude<keyof LocalAtendimento, 'id' | 'nome'>;

export interface PerfilCarreira {
  id: string;
  nome: string;
  resumo: string;
  premissas: PremissasCarreira;
  // Investimento total publicado na pesquisa, para conferencia.
  investimentoReferencia: number;
}

export interface ResultadoCarreira {
  totalMensalidades: number;
  totalCustoVida: number;
  materiais: number;
  preparatorio: number;
  investimentoTotal: number;
  // Ganho liquido mensal calculado a partir dos atendimentos.
  rendaLiquidaMensal: number;
  // Custo de vida depois de formado e o que sobra por mes para pagar a formacao.
  custoVidaFormado: number;
  sobraMensal: number;
  mesesCurso: number;
  diasAteRenda: number;
  // Meses de exercicio, depois da primeira renda, para pagar a formacao.
  mesesPagarFormacao: number | null;
  // Meses desde o ingresso no curso ate o saldo voltar a zero.
  retornoDesdeIngressoMeses: number | null;
}
/* === TIPOS DA CALCULADORA DE CARREIRA | fim === */

/* === TIPOS DA IA | inicio === */
export interface MensagemChatIa {
  autor: 'visitante' | 'ia';
  texto: string;
}

export interface RespostaChatIa {
  mensagem: string;
  sugestoes: string[];
  concluido: boolean;
  cenario: CenarioCredenciamento | null;
}

export interface RespostaChatIaCarreira {
  mensagem: string;
  sugestoes: string[];
  concluido: boolean;
  perfil: PerfilCarreira | null;
}
/* === TIPOS DA IA | fim === */

/* === TIPOS DE LEAD | inicio === */
export interface LeadCaptado {
  nome: string;
  email: string;
  telefone: string;
  instituicao: string;
  cargo: string;
  porte: string;
  mensagem: string;
  visao: VisaoCalculadora;
}
/* === TIPOS DE LEAD | fim === */
