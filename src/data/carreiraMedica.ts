import type { CampoCarreira, CampoLocal, LocalAtendimento, PerfilCarreira, PremissasCarreira } from '@/types/calculadora';

/* === PERFIS DE FORMACAO | inicio === */
// Os quatro perfis do estudo "Simulação Custos de Medicina" (pasta pesquisa, 2025-2026), com reajuste de 5% a.a.
// Renda liquida inicial do generalista: R$ 10 mil a R$ 15 mil por mes (meio da faixa: R$ 12.500).
// Atendimentos padrao = plantoes de pronto atendimento do cenario "Recem-formado" da calculadora do medico:
// 30 atendimentos × R$ 120 × 40% × (1 - 13%) × 10 plantoes = R$ 12.528 por mes, praticamente a media do estudo;
// o payback publicado (1,4 / 5,3 / 8,2 / 10,8 anos de exercicio) se mantem na primeira casa decimal.
// Prazo entre o 1o plantao e o 1o pagamento: fixo em 30 dias (nao aparece mais na calculadora).
export const PRAZO_PAGAMENTO_DIAS = 30;

const BASE: PremissasCarreira = {
  mensalidadeInicial: 0,
  reajusteAnualPercentual: 5,
  anosCurso: 6,
  custoVidaMensal: 2500,
  materiais: 18000,
  preparatorioResidencia: 10000,
  locais: [
    { id: 'local-1', nome: 'Pronto atendimento', atendimentosPorDia: 30, diasAtendimentoMes: 10, valorAtendimento: 120, parcelaMedicoPercentual: 40, impostosPercentual: 13, prazoRecebimentoDias: PRAZO_PAGAMENTO_DIAS },
  ],
};

export const PERFIS_CARREIRA: PerfilCarreira[] = [
  {
    id: 'publica',
    nome: 'Universidade pública',
    resumo: 'Sem mensalidade. O peso está no custo de vida durante os 6 anos.',
    premissas: { ...BASE },
    investimentoReferencia: 208000,
  },
  {
    id: 'privada-interior',
    nome: 'Particular no interior',
    resumo: 'Mensalidade de entrada perto de R$ 7.500 e custo de vida de cidade média.',
    premissas: { ...BASE, mensalidadeInicial: 7500, custoVidaMensal: 2250 },
    investimentoReferencia: 802170,
  },
  {
    id: 'privada-mediana',
    nome: 'Particular na mediana nacional',
    resumo: 'Mensalidade mediana de 2026 (R$ 11.415) e custo de vida padrão.',
    premissas: { ...BASE, mensalidadeInicial: 11415, custoVidaMensal: 3500, materiais: 22000, preparatorioResidencia: 20000 },
    investimentoReferencia: 1225685,
  },
  {
    id: 'privada-elite',
    nome: 'Particular de ponta na capital',
    resumo: 'Mensalidade perto de R$ 14.500, vida em metrópole e preparatório presencial.',
    premissas: { ...BASE, mensalidadeInicial: 14500, custoVidaMensal: 5000, materiais: 30000, preparatorioResidencia: 42000 },
    investimentoReferencia: 1615470,
  },
];
/* === PERFIS DE FORMACAO | fim === */

/* === CATALOGO DE CAMPOS DA CARREIRA | inicio === */
export interface DefinicaoCampoCarreira {
  rotulo: string;
  info: string;
  entraEm: string;
  prefixo?: string;
  sufixo?: string;
  min?: number;
  max?: number;
}

export const CAMPOS_CARREIRA: Record<CampoCarreira | CampoLocal, DefinicaoCampoCarreira> = {
  mensalidadeInicial: {
    rotulo: 'Mensalidade no 1º ano',
    info: 'Mensalidade do curso no primeiro ano. Em 2026 a mediana nacional ficou entre R$ 11.400 e R$ 11.415; no interior há cursos de R$ 5.800 a R$ 7.500 e o teto passa de R$ 15.700. Universidade pública: 0.',
    entraEm: 'Total em mensalidades = mensalidade × 12 a cada ano, com o reajuste aplicado de um ano para o outro.',
    prefixo: 'R$',
  },
  reajusteAnualPercentual: {
    rotulo: 'Reajuste por ano',
    info: 'Quanto a mensalidade sobe a cada ano (Lei 9.870/1999). O estudo usa 5% como projeção conservadora; o reajuste médio de 2026 foi de 9,8%.',
    entraEm: 'Mensalidade do ano seguinte = mensalidade do ano × (1 + reajuste).',
    sufixo: '%',
    max: 50,
  },
  anosCurso: {
    rotulo: 'Duração do curso',
    info: 'A graduação tem no mínimo 6 anos (12 semestres), com os 2 últimos em internato.',
    entraEm: 'Número de anos com mensalidade e custo de vida; a renda só começa depois da formatura.',
    sufixo: 'anos',
    min: 1,
    max: 10,
  },
  custoVidaMensal: {
    rotulo: 'Custo de vida por mês',
    info: 'Moradia, alimentação, transporte, contas e saúde. Interior: R$ 2.350 a R$ 4.050. Capitais: R$ 4.100 a R$ 6.900. O estudo usa R$ 2.500 (econômico), R$ 3.500 (padrão) e R$ 5.000 (metrópole).',
    entraEm: 'Custo de vida total = valor mensal × meses de curso.',
    prefixo: 'R$',
  },
  materiais: {
    rotulo: 'Materiais e equipamentos (total)',
    info: 'Kit acadêmico, jalecos e EPIs, livros e aplicativos, congressos e formatura, somados nos 6 anos. Faixa do estudo: R$ 18 mil (essencial) a R$ 30 mil (avançado).',
    entraEm: 'Somado ao investimento, distribuído ao longo do curso.',
    prefixo: 'R$',
  },
  preparatorioResidencia: {
    // A quebra (\n) e exibida pelo whitespace-pre-line do rotulo no CampoNumerico.
    rotulo: 'Preparatório e\nProvas de residência',
    info: 'Cursinho para a residência e taxas de inscrição no 5º e 6º ano. Plataformas digitais: cerca de R$ 8 mil; extensivos híbridos: R$ 20 mil; presencial premium: R$ 42 mil com as taxas.',
    entraEm: 'Somado ao investimento, distribuído nos 2 últimos anos do curso.',
    prefixo: 'R$',
  },
  atendimentosPorDia: {
    rotulo: 'Atendimentos por plantão ou dia',
    info: 'Quantos pacientes você atende em um plantão ou dia de trabalho. Plantão de 12 h em pronto atendimento: 25 a 35 atendimentos. Consultório ou UBS: 14 a 18 por turno de 6 h.',
    entraEm: 'Ganho líquido mensal = atendimentos × plantões no mês × valor × sua parte × (1 - impostos).',
    sufixo: 'atend.',
    min: 1,
  },
  diasAtendimentoMes: {
    rotulo: 'Plantões ou dias por mês',
    info: 'Quantos plantões ou dias de atendimento você faz no mês neste local. Um generalista em início de carreira costuma fazer de 8 a 15 plantões.',
    entraEm: 'Multiplica os atendimentos de um plantão para chegar ao mês.',
    sufixo: 'por mês',
    min: 1,
    max: 31,
  },
  valorAtendimento: {
    rotulo: 'Valor por atendimento',
    info: 'Quanto é cobrado por atendimento. Pronto atendimento: cerca de R$ 120 (plantão de 12 h paga R$ 1.200 a R$ 1.600 ao médico). Convênio: R$ 122 a R$ 140. Particular: R$ 300 a R$ 500.',
    entraEm: 'Ganho líquido mensal = atendimentos × plantões no mês × valor × sua parte × (1 - impostos).',
    prefixo: 'R$',
  },
  parcelaMedicoPercentual: {
    rotulo: 'Parte que fica com você',
    info: 'Quanto do valor do atendimento é repassado a você. Pronto atendimento: cerca de 40%. Clínica que fatura: 60%. Quando você emite o próprio documento: 70%. Consultório próprio: 100%.',
    entraEm: 'Aplicada sobre o valor de cada atendimento.',
    sufixo: '%',
    max: 100,
  },
  impostosPercentual: {
    rotulo: 'Impostos sobre o que recebe',
    info: 'Como PJ: Simples Anexo III 6% (com Fator R), Anexo V 15,5%, Lucro Presumido 13% a 17%.',
    entraEm: 'Descontados da sua parte para chegar ao ganho líquido.',
    sufixo: '%',
    max: 100,
  },
  prazoRecebimentoDias: {
    rotulo: 'Dias entre o 1º plantão e o 1º pagamento',
    info: 'Quanto tempo este local leva para pagar. Plantões costumam ser pagos 30 a 60 dias depois de realizados.',
    entraEm: 'Atrasa o início da renda depois da formatura, no retorno contado desde o ingresso.',
    sufixo: 'dias',
  },
};

// Passo "Custos do curso".
export const CAMPOS_CURSO: CampoCarreira[] = [
  'mensalidadeInicial',
  'reajusteAnualPercentual',
  'anosCurso',
  'custoVidaMensal',
  'materiais',
  'preparatorioResidencia',
];

// Passo "Seus atendimentos": todos os campos sao de cada local, inclusive impostos e prazo de pagamento.
// Iguais para todos os perfis, por isso valem tambem na comparacao entre perfis.
export const CAMPOS_LOCAL: CampoLocal[] = [
  'atendimentosPorDia',
  'diasAtendimentoMes',
  'valorAtendimento',
  'parcelaMedicoPercentual',
  'impostosPercentual',
];
export const MAXIMO_LOCAIS = 5;

// Custo de vida depois de formado: um valor so (da pessoa, nao do local), que comeca igual ao dos gastos do curso.
export const CAMPO_CUSTO_VIDA_FORMADO: DefinicaoCampoCarreira = {
  rotulo: 'Custo de vida por mês',
  info: 'Quanto você gasta por mês para viver depois de formado (moradia, alimentação, transporte, contas). Vem preenchido com o custo de vida dos gastos do curso; ajuste se vai mudar. Vale para você, não para cada local.',
  entraEm: 'Sobra por mês = ganho líquido - custo de vida; é a sobra que paga a formação.',
  prefixo: 'R$',
};

export function novoLocal(numero: number): LocalAtendimento {
  return {
    id: `local-${Date.now()}`,
    nome: `Local ${numero}`,
    atendimentosPorDia: 20,
    diasAtendimentoMes: 4,
    valorAtendimento: 120,
    parcelaMedicoPercentual: 60,
    impostosPercentual: 13,
    prazoRecebimentoDias: PRAZO_PAGAMENTO_DIAS,
  };
}

// Edicoes antigas ou vazias voltam para os locais padrao; locais salvos antes de impostos e prazo
// serem por local recebem os valores padrao nesses campos.
export function locaisValidos(valor: unknown): LocalAtendimento[] {
  if (!Array.isArray(valor) || valor.length === 0) return BASE.locais;
  return (valor as Partial<LocalAtendimento>[]).map((local, indice) => ({
    ...BASE.locais[0],
    id: `local-${indice + 1}`,
    nome: `Local ${indice + 1}`,
    ...local,
    prazoRecebimentoDias: PRAZO_PAGAMENTO_DIAS,
  }));
}

// Custos de um perfil com os atendimentos informados pelo visitante.
export function comAtendimentosDe(base: PremissasCarreira, origem: PremissasCarreira): PremissasCarreira {
  return { ...base, locais: origem.locais, custoVidaFormado: origem.custoVidaFormado };
}

// Faixa de ganho liquido mensal do generalista recem-formado no estudo; a media e o valor padrao.
export const FAIXA_GANHO_MERCADO = [
  { id: 'minimo', rotulo: 'Início da faixa', valor: 10000 },
  { id: 'media', rotulo: 'Média do mercado', valor: 12500 },
  { id: 'maximo', rotulo: 'Topo da faixa', valor: 15000 },
];
/* === CATALOGO DE CAMPOS DA CARREIRA | fim === */
