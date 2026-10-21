import { CAMPOS_PREMISSAS } from '@/data/camposPremissas';
import type {
  CampoPremissa,
  CenarioCredenciamento,
  EtapaCenario,
  OrigemDado,
  PerspectivaRoi,
  PremissasCenario,
} from '@/types/calculadora';

/* === PREMISSAS PADRAO | inicio === */
// Referencias de mercado pesquisadas em out/2026 (fontes em doc/fontes_e_decisoes.md, secao 04).
// Prazos sem/com HSS e taxas de retrabalho seguem o PDF "Credenciamento Medico Com HSS x Sem HSS" (sem dado brasileiro publico).
// Preco da HSS nao e publico: o valor por credenciamento (instituicao) e a mensalidade do medico sao hipoteses a substituir pela proposta comercial.
// Para reproduzir o exemplo numerico do PDF (R$ 8.930 por medico, lado da instituicao): 8 consultas, 7 dias, 65%,
// R$ 250, parte do medico 60%, custo R$ 25, 8/3 h, R$ 60, 35/15%, R$ 250.
export const PREMISSAS_PADRAO: PremissasCenario = {
  // Agenda de 3 turnos de ~6 h com consultas de 20 a 25 min; faltas de 10% a 20% em clinicas privadas.
  consultasPorDia: 14,
  diasAtendimentoSemana: 3,
  ocupacaoPercentual: 75,
  // Mix 70% convenio (R$ 122 a R$ 140 em 2026) e 30% particular (mediana R$ 400 a R$ 500), liquido de glosa final (~2%).
  ticketMedio: 190,
  // Divisao 70/30 quando o medico emite o proprio documento; 60/40 quando a clinica fatura.
  parcelaMedicoPercentual: 70,
  prazoRecebimentoDias: 45,
  mesesAnalise: 12,
  retrabalhoSemHssPercentual: 35,
  retrabalhoComHssPercentual: 15,
  // PJ: Simples Anexo III 6% (com Fator R), Anexo V 15,5%, Lucro Presumido 13% a 17%.
  impostosPercentual: 13,
  custoConsultaMedico: 0,
  // Medico ja inscrito no CRM: renovacao de ACLS (~R$ 1.090), exames, certidoes e certificado digital (R$ 120 a R$ 260).
  custoEntrada: 2000,
  horasMedicoSemHss: 16,
  horasMedicoComHss: 5,
  // R$ 190 x 70% x (1 - 13%) ~ R$ 116 por consulta x ~2,3 consultas por hora.
  valorHoraMedico: 250,
  custoRetrabalhoMedico: 250,
  mensalidadeHssMedico: 0,
  mensalidadeCurso: 0,
  mesesCurso: 0,
  medicosPorMes: 4,
  // Insumos e taxa de cartao (~3% do valor).
  custoConsultaInstituicao: 15,
  // Exemplo do PDF: 8 h sem HSS e 3 h com HSS por credenciamento.
  horasEquipeSemHss: 8,
  horasEquipeComHss: 3,
  // Estimativa: analista com salario de ~R$ 4.500 e ~70% de encargos e beneficios, 170 h por mes.
  custoHoraEquipe: 45,
  // ~3 h da equipe para pedir, receber e conferir de novo.
  custoRetrabalhoInstituicao: 150,
  // Hipotese: a HSS nao publica preco (sem valor nos documentos nem no site). R$ 350 equivale a proposta usada antes
  // (R$ 1.500 por mes + R$ 3.000 de implantacao) diluida em 12 meses com 5 medicos por mes. Substituir pela proposta comercial.
  valorCredenciamentoHss: 350,
};

// Campos que o visitante preenche por padrao; o ADM pode mudar por cenario.
export const CAMPOS_VISITANTE_PADRAO: Record<PerspectivaRoi, CampoPremissa[]> = {
  medico: ['consultasPorDia', 'diasAtendimentoSemana', 'ticketMedio', 'parcelaMedicoPercentual', 'custoEntrada'],
  instituicao: ['medicosPorMes', 'consultasPorDia', 'ticketMedio', 'parcelaMedicoPercentual', 'valorCredenciamentoHss'],
};

export function montarCamposVisitantePadrao(premissas: PremissasCenario): Record<PerspectivaRoi, CampoPremissa[]> {
  const comCurso = premissas.mensalidadeCurso > 0;
  return {
    medico: comCurso ? [...CAMPOS_VISITANTE_PADRAO.medico, 'mensalidadeCurso', 'mesesCurso'] : [...CAMPOS_VISITANTE_PADRAO.medico],
    instituicao: [...CAMPOS_VISITANTE_PADRAO.instituicao],
  };
}
/* === PREMISSAS PADRAO | fim === */

/* === CENARIOS PADRAO | inicio === */
function etapa(id: string, nome: string, diasSemHss: number, diasComHss: number, nota: string): EtapaCenario {
  return { id, nome, diasSemHss, diasComHss, hssAtua: diasComHss < diasSemHss, nota };
}

function cenarioPadrao(
  dados: Omit<CenarioCredenciamento, 'ativo' | 'origemPrazos' | 'origemCriacao' | 'premissas' | 'camposVisitante'> & {
    premissas?: Partial<PremissasCenario>;
  },
): CenarioCredenciamento {
  const premissas = { ...PREMISSAS_PADRAO, ...dados.premissas };
  return { ...dados, ativo: true, origemPrazos: 'hipotese', origemCriacao: 'adm', premissas, camposVisitante: montarCamposVisitantePadrao(premissas) };
}

const CENARIOS_BASE: CenarioCredenciamento[] = [
  cenarioPadrao({
    id: 'hospital-clinica-individual',
    nome: 'Hospital ou clínica: credenciamento individual',
    resumoSite: 'Entrada de um médico no corpo clínico de um hospital ou clínica.',
    limite: 'A análise técnica e a aprovação continuam sendo humanas.',
    perspectivas: ['medico', 'instituicao'],
    etapas: [
      etapa('pre-cadastro', 'Pré-cadastro e distribuição do formulário', 3, 1, 'HSS pode organizar onboarding digital; resposta do médico ainda importa.'),
      etapa('coleta-documentos', 'Coleta e organização de documentos', 10, 4, 'Benefício depende de documentos existentes e completos.'),
      etapa('triagem-validacao', 'Triagem e validação de credenciais', 7, 3, 'A validação oficial e decisões exigidas permanecem.'),
      etapa('correcoes', 'Correções e reenvios', 10, 4, 'Redução depende da taxa real de retrabalho.'),
      etapa('analise-tecnica', 'Análise técnica / comissão', 10, 10, 'Mantida igual: decisão institucional não é presumida como acelerada.'),
      etapa('contrato-cadastro', 'Contrato e cadastro operacional', 12, 8, 'Negociação, assinatura e treinamento podem limitar o ganho.'),
    ],
  }),
  cenarioPadrao({
    id: 'recem-formado-curso',
    nome: 'Recém-formado: do diploma ao primeiro plantão',
    resumoSite: 'Médico recém-formado que entra em plantões de pronto atendimento e quer saber quando recupera o curso de medicina.',
    limite: 'Registro no CRM, abertura de PJ e aprovação da instituição não dependem da HSS. O curso é um investimento já feito: a HSS só antecipa a renda que o paga.',
    perspectivas: ['medico', 'instituicao'],
    etapas: [
      etapa('registro-crm', 'Registro no CRM e carteira profissional', 20, 20, 'Fora da HSS: depende do conselho regional.'),
      etapa('abertura-pj', 'Abertura de PJ ou cadastro de autônomo', 10, 10, 'Fora da HSS: contador, Junta Comercial e prefeitura.'),
      etapa('dossie', 'Montagem do dossiê (diploma, cursos, vacinas)', 10, 3, 'Cadastro único reaproveitado em mais de um serviço.'),
      etapa('envio-triagem', 'Envio e triagem nos serviços de plantão', 8, 3, 'Checklist e status digital no lugar de e-mails.'),
      etapa('correcoes-recem', 'Correções e reenvios', 7, 2, 'Pendências rastreadas na plataforma.'),
      etapa('aprovacao-escala', 'Aprovação e primeira escala', 10, 10, 'Mantida igual: decisão e escala são da instituição.'),
    ],
    premissas: {
      // Plantao de 12 h com ~30 atendimentos; 3 plantoes por semana. Bruto ~R$ 1.300 por plantao (mercado: R$ 1.200 a R$ 1.600).
      consultasPorDia: 30,
      diasAtendimentoSemana: 3,
      ocupacaoPercentual: 90,
      ticketMedio: 120,
      parcelaMedicoPercentual: 40,
      prazoRecebimentoDias: 45,
      mesesAnalise: 60,
      // Inscricao e carteira do CRM (~R$ 300), anuidade 2026 (R$ 948), ACLS (~R$ 1.090), BLS (~R$ 500), e-CPF (~R$ 160),
      // seguro de responsabilidade civil em inicio de carreira (~R$ 4.000/ano) e abertura de PJ (~R$ 1.000).
      custoEntrada: 8000,
      horasMedicoSemHss: 20,
      horasMedicoComHss: 6,
      valorHoraMedico: 110,
      custoRetrabalhoMedico: 110,
      // Media nacional ~R$ 9.500 e mediana ~R$ 10.866 em 2026; 6 anos de graduacao.
      mensalidadeCurso: 10000,
      mesesCurso: 72,
      medicosPorMes: 6,
      custoConsultaInstituicao: 20,
    },
  }),
  cenarioPadrao({
    id: 'plantao-pronto-atendimento',
    nome: 'Plantões em pronto atendimento',
    resumoSite: 'Médico já registrado que entra na escala de plantões de um pronto atendimento.',
    limite: 'Aprovação da coordenação e montagem da escala continuam com a instituição.',
    perspectivas: ['medico', 'instituicao'],
    etapas: [
      etapa('envio-plantao', 'Envio de documentos e certificados (ACLS, CRM, RQE)', 8, 3, 'Cadastro único reaproveitado entre serviços.'),
      etapa('validacao-plantao', 'Triagem e validação de credenciais', 5, 2, 'Checklist e status digital no lugar de e-mails.'),
      etapa('correcoes-plantao', 'Correções e reenvios', 6, 2, 'Pendências rastreadas na plataforma.'),
      etapa('aprovacao-plantao', 'Aprovação da coordenação', 7, 7, 'Mantida igual: decisão da instituição.'),
      etapa('contrato-escala', 'Contrato PJ e inclusão na escala', 8, 5, 'Assinatura digital; a escala depende da coordenação.'),
    ],
    premissas: {
      // Plantao de 12 h com ~30 atendimentos, 2 plantoes por semana; bruto de ~R$ 1.440 por plantao (mercado: R$ 1.200 a R$ 1.600).
      consultasPorDia: 30,
      diasAtendimentoSemana: 2,
      ocupacaoPercentual: 90,
      ticketMedio: 120,
      parcelaMedicoPercentual: 40,
      prazoRecebimentoDias: 45,
      // Medico ja inscrito: renovacao de ACLS, anuidade do CRM e certificado digital.
      custoEntrada: 2500,
      horasMedicoSemHss: 12,
      horasMedicoComHss: 4,
      // R$ 120 x 40% x (1 - 13%) x 30 atendimentos ÷ 12 h ~ R$ 104 por hora.
      valorHoraMedico: 105,
      custoRetrabalhoMedico: 105,
      // Pronto atendimento renova a escala com frequencia.
      medicosPorMes: 8,
      custoConsultaInstituicao: 20,
    },
  }),
  cenarioPadrao({
    id: 'hospital-cobra-repassa',
    nome: 'Hospital cobra a consulta e repassa honorários',
    resumoSite: 'O hospital fatura o atendimento e repassa a parte do médico.',
    limite: 'Contrato, faturamento, regras de repasse e integração podem limitar a redução.',
    perspectivas: ['medico', 'instituicao'],
    etapas: [
      etapa('pre-cadastro-documentos', 'Pré-cadastro e documentos', 13, 5, 'Organização digital; aprovação técnica segue com a instituição.'),
      etapa('validacao-credenciais', 'Validação de credenciais', 7, 3, 'Não substitui consulta às fontes oficiais.'),
      etapa('analise-aprovacao', 'Análise técnica / aprovação', 10, 10, 'Mantida igual no exemplo.'),
      etapa('contrato-repasse', 'Contrato, repasse e dados fiscais', 12, 9, 'Depende de jurídico e financeiro.'),
      etapa('agenda-faturamento', 'Agenda, faturamento e liberação', 11, 7, 'Integrações e onboarding dependem da instituição.'),
    ],
    // Hospitais recebem das operadoras em ~80 dias (Anahp, 2025) e repassam depois.
    premissas: { parcelaMedicoPercentual: 60, prazoRecebimentoDias: 80 },
  }),
  cenarioPadrao({
    id: 'convenio-operadora',
    nome: 'Convênio ou operadora',
    resumoSite: 'Clínica ou médico entrando na rede de um plano de saúde, com a consulta paga pela operadora.',
    limite: 'Análise de rede, negociação e autorização da operadora podem não acelerar.',
    perspectivas: ['medico', 'instituicao'],
    etapas: [
      etapa('preparacao-envio', 'Preparação e envio documental', 20, 7, 'HSS pode organizar documentos; completude ainda importa.'),
      etapa('validacao-documental', 'Validação documental', 10, 5, 'Exemplo de hipótese, não benchmark.'),
      etapa('analise-rede', 'Análise de rede / negociação', 50, 50, 'Mantida igual: depende da operadora.'),
      etapa('contrato-integracao', 'Contrato e integração de faturamento', 25, 15, 'TISS/sistemas/contrato podem exigir projeto próprio.'),
    ],
    // Consulta eletiva paga por operadoras em 2026: R$ 122 (Unimed FESP) a R$ 140 (Bradesco); agenda de convenio mais curta.
    premissas: { ticketMedio: 130, consultasPorDia: 16, prazoRecebimentoDias: 60 },
  }),
  cenarioPadrao({
    id: 'multiplas-instituicoes',
    nome: 'Várias instituições com o mesmo cadastro',
    resumoSite: 'Médico que se credencia em mais de um lugar reaproveitando documentos.',
    limite: 'Benefício maior quando o médico repete o envio dos mesmos documentos. Cada instituição mantém seus critérios.',
    perspectivas: ['medico', 'instituicao'],
    etapas: [
      etapa('envio-repetido', 'Preparação e envio repetido de documentos', 10, 2, 'Cenário onde o cadastro reutilizável pode ajudar mais.'),
      etapa('triagem-institucional', 'Triagem/validação institucional', 7, 3, 'Cada instituição mantém seus próprios critérios.'),
      etapa('analise-decisao', 'Análise técnica e decisão', 10, 10, 'Mantida igual no exemplo.'),
      etapa('contrato-onboarding', 'Contrato e onboarding', 8, 7, 'Varia por contratante.'),
    ],
    premissas: { diasAtendimentoSemana: 2, horasMedicoSemHss: 24, horasMedicoComHss: 4 },
  }),
  cenarioPadrao({
    id: 'consultorio-proprio',
    nome: 'Consultório próprio',
    resumoSite: 'Abertura, licenças e regularização local do consultório.',
    limite: 'A HSS não substitui abertura de empresa, licenças, CNES ou adequação do imóvel.',
    perspectivas: ['medico'],
    etapas: [
      etapa('regularizacao-local', 'Abertura, licenças, CNES e adequação do imóvel', 30, 30, 'HSS não substitui regularização local; neste exemplo, nenhuma economia é presumida.'),
    ],
    premissas: {
      // Particular: mediana de R$ 400 a R$ 500 em especialidades; consultas de 30 a 40 min; agenda em formacao.
      ticketMedio: 350,
      consultasPorDia: 10,
      diasAtendimentoSemana: 4,
      parcelaMedicoPercentual: 100,
      ocupacaoPercentual: 50,
      custoConsultaMedico: 30,
      // Abertura de PJ (R$ 500 a R$ 1.800), alvara e vigilancia sanitaria, seguro e adequacao basica do espaco.
      custoEntrada: 15000,
      // Cartao de credito em ate 30 dias.
      prazoRecebimentoDias: 15,
    },
  }),
];
// Cada cenario aparece para um unico perfil: os casos comuns viram uma versao para o medico e outra para a instituicao,
// com nome e descricao na voz de quem simula.
const TEXTOS_POR_PERFIL: Record<string, Record<PerspectivaRoi, { nome: string; resumoSite: string }>> = {
  'hospital-clinica-individual': {
    medico: { nome: 'Entrar no corpo clínico de um hospital ou clínica', resumoSite: 'Você se credencia para atender em um hospital ou clínica.' },
    instituicao: { nome: 'Credenciar um médico no corpo clínico', resumoSite: 'Sua instituição recebe, confere e libera novos médicos.' },
  },
  'recem-formado-curso': {
    medico: { nome: 'Recém-formado: do diploma ao primeiro plantão', resumoSite: 'Você acabou de se formar, vai dar plantões e quer saber quando recupera o curso de medicina.' },
    instituicao: { nome: 'Contratar recém-formados para plantões', resumoSite: 'Pronto atendimento que credencia médicos recém-formados para a escala.' },
  },
  'plantao-pronto-atendimento': {
    medico: { nome: 'Dar plantões em pronto atendimento', resumoSite: 'Você já tem CRM e entra na escala de plantões de um pronto atendimento.' },
    instituicao: { nome: 'Pronto atendimento: credenciar plantonistas', resumoSite: 'Sua unidade credencia médicos para a escala de plantões.' },
  },
  'hospital-cobra-repassa': {
    medico: { nome: 'Atender em hospital que repassa honorários', resumoSite: 'O hospital fatura a consulta e repassa a sua parte.' },
    instituicao: { nome: 'Hospital que fatura e repassa honorários', resumoSite: 'Sua instituição cobra o atendimento e repassa a parte do médico.' },
  },
  'convenio-operadora': {
    medico: { nome: 'Entrar na rede de um convênio', resumoSite: 'Você se credencia em um plano de saúde, que paga a consulta.' },
    instituicao: { nome: 'Clínica entrando na rede de um convênio', resumoSite: 'Sua clínica credencia os médicos em uma operadora.' },
  },
  'multiplas-instituicoes': {
    medico: { nome: 'Atender em vários lugares com o mesmo cadastro', resumoSite: 'Você se credencia em mais de uma instituição reaproveitando documentos.' },
    instituicao: { nome: 'Receber médicos que já têm cadastro HSS', resumoSite: 'Médicos que chegam com documentos já organizados em outra instituição.' },
  },
};

export const CENARIOS_PADRAO: CenarioCredenciamento[] = CENARIOS_BASE.flatMap((cenario) =>
  cenario.perspectivas.map((perspectiva) => ({
    ...cenario,
    id: cenario.perspectivas.length > 1 ? `${cenario.id}-${perspectiva}` : cenario.id,
    perspectivas: [perspectiva],
    ...(cenario.perspectivas.length > 1 ? TEXTOS_POR_PERFIL[cenario.id]?.[perspectiva] : undefined),
  })),
);
/* === CENARIOS PADRAO | fim === */

/* === ROTULOS | inicio === */
export const ROTULOS_PERSPECTIVA: Record<PerspectivaRoi, string> = {
  medico: 'Médico',
  instituicao: 'Hospital ou clínica',
};

export const ROTULOS_ORIGEM: Record<OrigemDado, string> = {
  hipotese: 'Hipótese de simulação',
  piloto: 'Medido em piloto',
  medido: 'Medido em operação real',
};
/* === ROTULOS | fim === */

/* === FUNCOES DE APOIO | inicio === */
export function clonarCenarios(cenarios: CenarioCredenciamento[]): CenarioCredenciamento[] {
  return JSON.parse(JSON.stringify(cenarios)) as CenarioCredenciamento[];
}

export function filtrarCenariosPublicos(cenarios: CenarioCredenciamento[], perspectiva: PerspectivaRoi): CenarioCredenciamento[] {
  return cenarios.filter((cenario) => cenario.ativo && cenario.perspectivas.includes(perspectiva));
}

function numero(valor: unknown, padrao: number): number {
  const convertido = Number(valor);
  return valor !== null && valor !== '' && Number.isFinite(convertido) ? Math.max(0, convertido) : padrao;
}

function objeto(valor: unknown): Record<string, unknown> {
  return valor && typeof valor === 'object' ? (valor as Record<string, unknown>) : {};
}

export function normalizarPremissas(valor: unknown): PremissasCenario {
  const origem = objeto(valor);
  const resultado = { ...PREMISSAS_PADRAO };

  (Object.keys(PREMISSAS_PADRAO) as CampoPremissa[]).forEach((campo) => {
    resultado[campo] = numero(origem[campo], PREMISSAS_PADRAO[campo]);
  });

  resultado.diasAtendimentoSemana = Math.min(7, Math.max(1, resultado.diasAtendimentoSemana));
  resultado.mesesAnalise = Math.max(1, Math.round(resultado.mesesAnalise));
  return resultado;
}

// Aceita so campos existentes e do grupo certo (agenda vale para os dois perfis; os demais, so para o proprio perfil).
function normalizarCamposVisitante(valor: unknown, premissas: PremissasCenario): Record<PerspectivaRoi, CampoPremissa[]> {
  const padrao = montarCamposVisitantePadrao(premissas);
  const origem = objeto(valor);

  const filtrar = (perspectiva: PerspectivaRoi): CampoPremissa[] => {
    const lista = origem[perspectiva];
    if (!Array.isArray(lista)) return padrao[perspectiva];
    // Cenarios salvos antes da troca de modelo de preco pediam a mensalidade da HSS; hoje e o valor por credenciamento.
    const validos = lista.map((campo) => (campo === 'mensalidadeHss' ? 'valorCredenciamentoHss' : campo)).filter(
      (campo): campo is CampoPremissa =>
        typeof campo === 'string' &&
        campo in CAMPOS_PREMISSAS &&
        (CAMPOS_PREMISSAS[campo as CampoPremissa].grupo === 'agenda' || CAMPOS_PREMISSAS[campo as CampoPremissa].grupo === perspectiva),
    );
    return Array.from(new Set(validos));
  };

  return { medico: filtrar('medico'), instituicao: filtrar('instituicao') };
}

// Versao anterior guardava dois conjuntos (premissasMedico e premissasInstituicao) com os mesmos fatos repetidos.
// Os fatos da agenda vem do lado do medico; os custos de cada lado vem do proprio conjunto.
function migrarPremissasAntigas(item: Record<string, unknown>, perspectivas: PerspectivaRoi[]): Record<string, unknown> {
  const medico = objeto(item.premissasMedico);
  const instituicao = objeto(item.premissasInstituicao);
  const comum = perspectivas.includes('medico') ? medico : instituicao;
  const parcelaInstituicao = Number(instituicao.parcelaInstituicaoPercentual);

  return {
    consultasPorDia: comum.consultasPorDia,
    diasAtendimentoSemana: comum.diasAtendimentoSemana,
    ocupacaoPercentual: comum.ocupacaoPercentual,
    ticketMedio: comum.ticketMedio,
    parcelaMedicoPercentual: medico.parcelaMedicoPercentual ?? (Number.isFinite(parcelaInstituicao) ? 100 - parcelaInstituicao : undefined),
    prazoRecebimentoDias: comum.prazoRecebimentoDias,
    mesesAnalise: comum.mesesAnalise,
    retrabalhoSemHssPercentual: comum.retrabalhoSemHssPercentual,
    retrabalhoComHssPercentual: comum.retrabalhoComHssPercentual,
    impostosPercentual: medico.impostosPercentual,
    custoConsultaMedico: medico.custoPorConsulta,
    custoEntrada: medico.custoEntrada,
    horasMedicoSemHss: medico.horasPapeladaSemHss,
    horasMedicoComHss: medico.horasPapeladaComHss,
    valorHoraMedico: medico.valorHoraMedico,
    custoRetrabalhoMedico: medico.custoPorRetrabalho,
    mensalidadeHssMedico: medico.custoHssMensal,
    medicosPorMes: instituicao.medicosPorMes,
    custoConsultaInstituicao: instituicao.custoPorConsulta,
    horasEquipeSemHss: instituicao.horasAdmSemHss,
    horasEquipeComHss: instituicao.horasAdmComHss,
    custoHoraEquipe: instituicao.custoHoraAdm,
    custoRetrabalhoInstituicao: instituicao.custoPorRetrabalho,
    valorCredenciamentoHss: instituicao.valorCredenciamentoHss,
  };
}

export function normalizarEtapas(valor: unknown): EtapaCenario[] {
  const etapas = Array.isArray(valor) ? valor : [];

  return etapas.map((etapaSalva, indice) => {
    const item = objeto(etapaSalva);
    const diasSemHss = Math.round(numero(item.diasSemHss, 0));
    const hssAtua = item.hssAtua !== false;

    return {
      id: String(item.id || `etapa-${indice + 1}`),
      nome: String(item.nome || `Etapa ${indice + 1}`),
      diasSemHss,
      diasComHss: hssAtua ? Math.min(diasSemHss, Math.round(numero(item.diasComHss, diasSemHss))) : diasSemHss,
      hssAtua,
      nota: String(item.nota ?? ''),
    };
  });
}

export function normalizarCenario(valor: unknown, indice = 0): CenarioCredenciamento {
  const item = objeto(valor);
  const perspectivasBrutas = Array.isArray(item.perspectivas) ? (item.perspectivas as unknown[]) : [];
  const perspectivas = perspectivasBrutas.filter((p): p is PerspectivaRoi => p === 'medico' || p === 'instituicao');
  const perspectivasValidas: PerspectivaRoi[] = perspectivas.length > 0 ? Array.from(new Set(perspectivas)) : ['medico', 'instituicao'];
  const origem: OrigemDado = item.origemPrazos === 'piloto' ? 'piloto' : item.origemPrazos === 'medido' ? 'medido' : 'hipotese';
  const premissasBrutas = item.premissas ? item.premissas : migrarPremissasAntigas(item, perspectivasValidas);
  const premissas = normalizarPremissas(premissasBrutas);
  const etapas = normalizarEtapas(item.etapas);

  return {
    id: String(item.id || `cenario-${indice + 1}`),
    ativo: item.ativo !== false,
    nome: String(item.nome || `Cenário ${indice + 1}`),
    resumoSite: String(item.resumoSite ?? ''),
    limite: String(item.limite ?? ''),
    perspectivas: perspectivasValidas,
    origemPrazos: origem,
    origemCriacao: item.origemCriacao === 'ia' ? 'ia' : 'adm',
    etapas: etapas.length > 0 ? etapas : [{ id: 'etapa-1', nome: 'Etapa 1', diasSemHss: 0, diasComHss: 0, hssAtua: false, nota: '' }],
    premissas,
    camposVisitante: normalizarCamposVisitante(item.camposVisitante, premissas),
  };
}

// Garante que dados vindos do localStorage, do D1 ou da IA tenham todos os campos esperados.
export function normalizarCenarios(valor: unknown): CenarioCredenciamento[] | null {
  if (!Array.isArray(valor) || valor.length === 0) return null;

  const cenarios = valor
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item, indice) => normalizarCenario(item, indice));

  return cenarios.length > 0 ? cenarios : null;
}
/* === FUNCOES DE APOIO | fim === */
