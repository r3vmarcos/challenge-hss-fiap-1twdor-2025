import type {
  EtapaCenario,
  PremissasCenario,
  ResultadoInstituicao,
  ResultadoMedico,
  ResultadoTimeline,
  RoiHorizonte,
} from '@/types/calculadora';

/* === CONSTANTES DO CALCULO | inicio === */
// Cenario conservador do PDF (secao 6): so metade da reducao simulada de prazo, horas e retrabalho se confirma.
export const FATOR_CONSERVADOR = 0.5;
export const HORIZONTES_ROI = [12, 24, 36];
const DIAS_POR_MES = 30;
/* === CONSTANTES DO CALCULO | fim === */

/* === FORMATADORES | inicio === */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(valor) ? valor : 0);
}

export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(Number.isFinite(valor) ? valor : 0);
}

export function formatarPercentual(valor: number | null): string {
  return valor === null ? 'Sem custo HSS' : `${formatarNumero(valor)}%`;
}

export function formatarMeses(valor: number | null): string {
  if (valor === null) return 'Não atinge nas premissas atuais';
  return `${formatarNumero(valor)} ${valor >= 0.95 && valor < 1.05 ? 'mês' : 'meses'}`;
}

// Tempo em meses na unidade mais legivel: dias abaixo de 1 mes, anos a partir de 3 anos.
export function formatarTempo(meses: number | null): string {
  if (meses === null) return 'Não atinge nas premissas atuais';
  if (meses < 1) {
    const dias = Math.max(0, Math.round(meses * DIAS_POR_MES));
    return `${dias} ${dias === 1 ? 'dia' : 'dias'}`;
  }
  if (meses >= 36) return `${formatarNumero(meses / 12)} anos`;
  return formatarMeses(meses);
}

function n(valor: number | undefined): number {
  return !Number.isFinite(valor) || Number(valor) < 0 ? 0 : Number(valor);
}

function pct(valor: number | undefined): number {
  return Math.min(100, n(valor)) / 100;
}
/* === FORMATADORES | fim === */

/* === TIMELINE | inicio === */
// A reducao so vale nas etapas em que a HSS atua; nas demais, o prazo com HSS e igual ao prazo sem HSS.
export function obterDiasComHssEtapa(etapa: EtapaCenario): number {
  return etapa.hssAtua ? Math.min(n(etapa.diasComHss), n(etapa.diasSemHss)) : n(etapa.diasSemHss);
}

export function calcularTimeline(etapas: EtapaCenario[]): ResultadoTimeline {
  const diasSemHss = etapas.reduce((total, etapa) => total + n(etapa.diasSemHss), 0);
  const diasComHss = etapas.reduce((total, etapa) => total + obterDiasComHssEtapa(etapa), 0);

  return {
    diasSemHss,
    diasComHss,
    diasEconomizados: Math.max(0, diasSemHss - diasComHss),
    hssAtua: etapas.some((etapa) => etapa.hssAtua),
  };
}

// Aplica o fator conservador sobre os dias economizados sem mexer no prazo sem HSS.
function ajustarTimeline(timeline: ResultadoTimeline, fator: number): ResultadoTimeline {
  if (fator >= 1) return timeline;
  const diasEconomizados = timeline.diasEconomizados * fator;
  return { ...timeline, diasEconomizados, diasComHss: timeline.diasSemHss - diasEconomizados };
}
/* === TIMELINE | fim === */

/* === AGENDA | inicio === */
// Margem diaria em dias corridos: com 7 dias de atendimento por semana reproduz exatamente a formula do PDF.
function calcularMargemDiaria(premissas: PremissasCenario, margemPorConsulta: number): number {
  const fatorSemana = Math.min(7, n(premissas.diasAtendimentoSemana)) / 7;
  return Math.max(0, n(premissas.consultasPorDia) * pct(premissas.ocupacaoPercentual) * margemPorConsulta * fatorSemana);
}

export function calcularConsultasMes(premissas: PremissasCenario): number {
  return n(premissas.consultasPorDia) * pct(premissas.ocupacaoPercentual) * (Math.min(7, n(premissas.diasAtendimentoSemana)) / 7) * DIAS_POR_MES;
}

// Reducao (sem - com) com o fator conservador; nunca negativa.
function reduzir(sem: number, com: number, fator: number): number {
  return Math.max(0, n(sem) - n(com)) * fator;
}
/* === AGENDA | fim === */

/* === CALCULO MEDICO | inicio === */
export function calcularRoiMedico(etapas: EtapaCenario[], premissas: PremissasCenario): ResultadoMedico {
  const timeline = calcularTimeline(etapas);
  const meses = Math.max(1, n(premissas.mesesAnalise));
  const atua = timeline.hssAtua;

  const margemPorConsulta =
    n(premissas.ticketMedio) * pct(premissas.parcelaMedicoPercentual) * (1 - pct(premissas.impostosPercentual)) - n(premissas.custoConsultaMedico);
  const margemDiaria = calcularMargemDiaria(premissas, margemPorConsulta);
  const rendaMensal = margemDiaria * DIAS_POR_MES;

  const custoHorasSem = n(premissas.horasMedicoSemHss) * n(premissas.valorHoraMedico);
  const custoHorasCom = atua ? n(premissas.horasMedicoComHss) * n(premissas.valorHoraMedico) : custoHorasSem;
  const custoRetrabalhoSem = pct(premissas.retrabalhoSemHssPercentual) * n(premissas.custoRetrabalhoMedico);
  const custoRetrabalhoCom = atua ? pct(premissas.retrabalhoComHssPercentual) * n(premissas.custoRetrabalhoMedico) : custoRetrabalhoSem;

  const margemAntecipada = timeline.diasEconomizados * margemDiaria;
  const economiaHoras = Math.max(0, custoHorasSem - custoHorasCom);
  const economiaRetrabalho = Math.max(0, custoRetrabalhoSem - custoRetrabalhoCom);
  const beneficioHss = margemAntecipada + economiaHoras + economiaRetrabalho;
  const custoHssPeriodo = n(premissas.mensalidadeHssMedico) * meses;

  const custoEntradaSemHss = n(premissas.custoEntrada) + custoHorasSem + custoRetrabalhoSem;
  const custoEntradaComHss = n(premissas.custoEntrada) + custoHorasCom + custoRetrabalhoCom;
  const investimentoFormacao = n(premissas.mensalidadeCurso) * n(premissas.mesesCurso);

  // Meses desde o inicio do processo ate o saldo voltar a zero: espera (liberacao + prazo de recebimento) + custo ÷ renda.
  const esperaSem = (timeline.diasSemHss + n(premissas.prazoRecebimentoDias)) / DIAS_POR_MES;
  const esperaCom = (timeline.diasComHss + n(premissas.prazoRecebimentoDias)) / DIAS_POR_MES;
  const rendaComHss = rendaMensal - n(premissas.mensalidadeHssMedico);
  const recuperar = (espera: number, custo: number, renda: number): number | null => (renda > 0 ? espera + custo / renda : null);

  return {
    timeline,
    margemPorConsulta,
    margemDiaria,
    rendaMensal,
    faturamentoParadoSemHss: timeline.diasSemHss * margemDiaria,
    margemAntecipada,
    economiaHoras,
    economiaRetrabalho,
    horasPoupadas: atua ? Math.max(0, n(premissas.horasMedicoSemHss) - n(premissas.horasMedicoComHss)) : 0,
    beneficioHss,
    custoHssPeriodo,
    ganhoLiquidoHss: beneficioHss - custoHssPeriodo,
    roiPercentual: custoHssPeriodo > 0 ? ((beneficioHss - custoHssPeriodo) / custoHssPeriodo) * 100 : null,
    custoEntradaSemHss,
    custoEntradaComHss,
    recuperaEntradaSemHssMeses: recuperar(esperaSem, custoEntradaSemHss, rendaMensal),
    recuperaEntradaComHssMeses: recuperar(esperaCom, custoEntradaComHss, rendaComHss),
    investimentoFormacao,
    recuperaFormacaoSemHssMeses: investimentoFormacao > 0 ? recuperar(esperaSem, custoEntradaSemHss + investimentoFormacao, rendaMensal) : null,
    recuperaFormacaoComHssMeses: investimentoFormacao > 0 ? recuperar(esperaCom, custoEntradaComHss + investimentoFormacao, rendaComHss) : null,
    mensalidadesCursoAntecipadas: n(premissas.mensalidadeCurso) > 0 ? margemAntecipada / n(premissas.mensalidadeCurso) : null,
  };
}
/* === CALCULO MEDICO | fim === */

/* === CALCULO INSTITUICAO | inicio === */
export function calcularRoiInstituicao(etapas: EtapaCenario[], premissas: PremissasCenario, fator = 1): ResultadoInstituicao {
  const timeline = ajustarTimeline(calcularTimeline(etapas), fator);
  const meses = Math.max(1, n(premissas.mesesAnalise));
  const medicosMes = n(premissas.medicosPorMes);
  const atua = timeline.hssAtua;
  const fatorAtuacao = atua ? fator : 0;
  const parcelaInstituicaoPercentual = 100 - Math.min(100, n(premissas.parcelaMedicoPercentual));

  const margemPorConsulta = n(premissas.ticketMedio) * pct(parcelaInstituicaoPercentual) - n(premissas.custoConsultaInstituicao);
  const margemDiaria = calcularMargemDiaria(premissas, margemPorConsulta);

  const custoEquipeSemHss = n(premissas.horasEquipeSemHss) * n(premissas.custoHoraEquipe);
  const custoRetrabalhoSemHss = pct(premissas.retrabalhoSemHssPercentual) * n(premissas.custoRetrabalhoInstituicao);
  const economiaEquipe = reduzir(premissas.horasEquipeSemHss, premissas.horasEquipeComHss, fatorAtuacao) * n(premissas.custoHoraEquipe);
  const economiaRetrabalho =
    (reduzir(premissas.retrabalhoSemHssPercentual, premissas.retrabalhoComHssPercentual, fatorAtuacao) / 100) * n(premissas.custoRetrabalhoInstituicao);

  const margemAntecipadaPorMedico = timeline.diasEconomizados * margemDiaria;
  const economiaOperacionalPorMedico = economiaEquipe + economiaRetrabalho;
  const beneficioPorMedico = margemAntecipadaPorMedico + economiaOperacionalPorMedico;
  const beneficioMensal = beneficioPorMedico * medicosMes;
  const beneficioPeriodo = beneficioMensal * meses;
  // Modelo de preco: valor fixo por medico credenciado, sem mensalidade nem implantacao.
  const valorHss = n(premissas.valorCredenciamentoHss);
  const custoHssPeriodo = valorHss * medicosMes * meses;
  const beneficioLiquido = beneficioPeriodo - custoHssPeriodo;
  // Sem custo inicial, a HSS se paga quando o primeiro medico credenciado com ela comeca a gerar receita
  // (liberacao com HSS + prazo de recebimento), desde que o beneficio por medico supere o valor cobrado.
  const paybackMeses = beneficioPorMedico > valorHss ? (timeline.diasComHss + n(premissas.prazoRecebimentoDias)) / DIAS_POR_MES : null;

  return {
    timeline,
    parcelaInstituicaoPercentual,
    margemPorConsulta,
    margemDiaria,
    margemAntecipadaPorMedico,
    custoEquipeSemHss,
    custoEquipeComHss: custoEquipeSemHss - economiaEquipe,
    custoRetrabalhoSemHss,
    custoRetrabalhoComHss: custoRetrabalhoSemHss - economiaRetrabalho,
    economiaOperacionalPorMedico,
    beneficioPorMedico,
    beneficioMensal,
    beneficioPeriodo,
    custoHssPeriodo,
    beneficioLiquido,
    roiPercentual: custoHssPeriodo > 0 ? (beneficioLiquido / custoHssPeriodo) * 100 : null,
    paybackMeses,
    paybackCalendarioMeses: paybackMeses,
    custoHssPorMedico: valorHss,
    retornoPorRealHss: valorHss > 0 ? beneficioPorMedico / valorHss : null,
    custoCredenciamentoSemHss: custoEquipeSemHss + custoRetrabalhoSemHss,
    margemParadaPorMedicoSemHss: timeline.diasSemHss * margemDiaria,
    margemParadaMensalSemHss: timeline.diasSemHss * margemDiaria * medicosMes,
    horasEquipeMesSemHss: n(premissas.horasEquipeSemHss) * medicosMes,
  };
}

// ROI do mesmo cenario em 12, 24 e 36 meses (especificacao do PDF para clinica/hospital).
export function calcularRoiHorizontes(etapas: EtapaCenario[], premissas: PremissasCenario): RoiHorizonte[] {
  return HORIZONTES_ROI.map((meses) => {
    const resultado = calcularRoiInstituicao(etapas, { ...premissas, mesesAnalise: meses });
    return { meses, roiPercentual: resultado.roiPercentual, beneficioLiquido: resultado.beneficioLiquido };
  });
}
/* === CALCULO INSTITUICAO | fim === */

/* === PROJECOES MES A MES | inicio === */
// Saldo acumulado do medico desde o inicio do processo: comeca negativo (custos de entrada e, se informado, o curso)
// e sobe depois da liberacao + prazo de recebimento. Cruza o zero no ponto de "recupera o investimento".
export function projetarAcumuladoMedico(resultado: ResultadoMedico, premissas: PremissasCenario): { semHss: number[]; comHss: number[] } {
  const meses = Math.max(1, Math.round(n(premissas.mesesAnalise)));
  const esperaSem = (resultado.timeline.diasSemHss + n(premissas.prazoRecebimentoDias)) / DIAS_POR_MES;
  const esperaCom = (resultado.timeline.diasComHss + n(premissas.prazoRecebimentoDias)) / DIAS_POR_MES;
  const rendaComHss = resultado.rendaMensal - n(premissas.mensalidadeHssMedico);
  const semHss: number[] = [];
  const comHss: number[] = [];

  for (let mes = 0; mes <= meses; mes += 1) {
    semHss.push(-resultado.custoEntradaSemHss - resultado.investimentoFormacao + resultado.rendaMensal * Math.max(0, mes - esperaSem));
    comHss.push(-resultado.custoEntradaComHss - resultado.investimentoFormacao + rendaComHss * Math.max(0, mes - esperaCom));
  }

  return { semHss, comHss };
}

// Instituicao: com HSS, resultado liquido acumulado (implantacao, depois beneficio menos mensalidade);
// sem HSS, margem que deixa de entrar enquanto os medicos aguardam liberacao.
export function projetarAcumuladoInstituicao(
  resultado: ResultadoInstituicao,
  premissas: PremissasCenario,
): { semHss: number[]; comHss: number[] } {
  const meses = Math.max(1, Math.round(n(premissas.mesesAnalise)));
  const semHss: number[] = [];
  const comHss: number[] = [];

  for (let mes = 0; mes <= meses; mes += 1) {
    semHss.push(-resultado.margemParadaMensalSemHss * mes);
    comHss.push((resultado.beneficioMensal - resultado.custoHssPorMedico * n(premissas.medicosPorMes)) * mes);
  }

  return { semHss, comHss };
}

// Instituicao, tempo x gasto: quanto o credenciamento custa no acumulado (equipe, retrabalho e margem parada
// enquanto o medico espera). Com HSS, cada medico soma o valor cobrado pela HSS por credenciamento; a distancia
// entre as linhas e a economia acumulada.
export function projetarGastoInstituicao(
  resultado: ResultadoInstituicao,
  premissas: PremissasCenario,
): { semHss: number[]; comHss: number[] } {
  const meses = Math.max(1, Math.round(n(premissas.mesesAnalise)));
  const medicosMes = n(premissas.medicosPorMes);
  const gastoMensalSem = medicosMes * (resultado.custoCredenciamentoSemHss + resultado.margemParadaPorMedicoSemHss);
  const gastoMensalCom =
    medicosMes *
    (resultado.custoEquipeComHss + resultado.custoRetrabalhoComHss + resultado.timeline.diasComHss * resultado.margemDiaria + resultado.custoHssPorMedico);
  const semHss: number[] = [];
  const comHss: number[] = [];

  for (let mes = 0; mes <= meses; mes += 1) {
    semHss.push(gastoMensalSem * mes);
    comHss.push(gastoMensalCom * mes);
  }

  return { semHss, comHss };
}

// Primeiro mes (fracionado) em que a serie passa de negativa para zero ou mais.
export function encontrarCruzamentoZero(valores: number[]): number | null {
  for (let indice = 1; indice < valores.length; indice += 1) {
    const anterior = valores[indice - 1];
    const atual = valores[indice];
    if (anterior < 0 && atual >= 0) return indice - 1 + -anterior / (atual - anterior);
  }
  return null;
}

// Interpola o valor da serie em um mes fracionado.
export function valorNoMes(valores: number[], mes: number): number {
  if (valores.length === 0) return 0;
  const base = Math.min(valores.length - 1, Math.max(0, Math.floor(mes)));
  const proximo = Math.min(valores.length - 1, base + 1);
  return valores[base] + (valores[proximo] - valores[base]) * (mes - base);
}
/* === PROJECOES MES A MES | fim === */

/* === TEMPO DE RETORNO POR MEDICO | inicio === */
// Instituicao: meses, desde o inicio do credenciamento, ate a margem de um medico pagar o custo de credencia-lo.
// Com HSS, cada medico tambem carrega o valor cobrado pela HSS pelo credenciamento.
export function calcularRetornoPorMedico(
  resultado: ResultadoInstituicao,
  premissas: PremissasCenario,
): { semHssMeses: number | null; comHssMeses: number | null } {
  const margemMensal = resultado.margemDiaria * DIAS_POR_MES;
  if (margemMensal <= 0) return { semHssMeses: null, comHssMeses: null };

  const prazo = n(premissas.prazoRecebimentoDias);
  const custoCom = resultado.custoEquipeComHss + resultado.custoRetrabalhoComHss + resultado.custoHssPorMedico;

  return {
    semHssMeses: (resultado.timeline.diasSemHss + prazo) / DIAS_POR_MES + resultado.custoCredenciamentoSemHss / margemMensal,
    comHssMeses: (resultado.timeline.diasComHss + prazo) / DIAS_POR_MES + custoCom / margemMensal,
  };
}

// Medico: o que entra no periodo da simulacao, depois da liberacao e do prazo de recebimento.
export function calcularRendaNoPeriodo(resultado: ResultadoMedico, premissas: PremissasCenario): { semHss: number; comHss: number } {
  const meses = Math.max(1, n(premissas.mesesAnalise));
  const esperaSem = (resultado.timeline.diasSemHss + n(premissas.prazoRecebimentoDias)) / DIAS_POR_MES;
  const esperaCom = (resultado.timeline.diasComHss + n(premissas.prazoRecebimentoDias)) / DIAS_POR_MES;

  return {
    semHss: resultado.rendaMensal * Math.max(0, meses - esperaSem),
    comHss: (resultado.rendaMensal - n(premissas.mensalidadeHssMedico)) * Math.max(0, meses - esperaCom),
  };
}
/* === TEMPO DE RETORNO POR MEDICO | fim === */
