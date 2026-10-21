import { calcularLiquidoLocal } from '@/services/calculosCarreira';
import { calcularRoiInstituicao, FATOR_CONSERVADOR, formatarMeses, formatarMoeda, formatarNumero, formatarPercentual } from '@/services/calculosRoi';
import type {
  EtapaCenario,
  LinhaMemoria,
  PremissasCarreira,
  PremissasCenario,
  ResultadoCarreira,
  ResultadoInstituicao,
  ResultadoMedico,
} from '@/types/calculadora';

/* === APOIO | inicio === */
const r = formatarMoeda;
const p = (valor: number): string => `${formatarNumero(valor)}%`;
const h = (valor: number): string => `${formatarNumero(valor)} h`;
const d = (valor: number): string => `${formatarNumero(valor)} dias`;
/* === APOIO | fim === */

/* === MEMORIA DO MEDICO | inicio === */
// Cada linha mostra a formula com os valores reais do cenario, para o visitante e o ADM conferirem a conta.
export function montarMemoriaMedico(resultado: ResultadoMedico, premissas: PremissasCenario): LinhaMemoria[] {
  const { timeline } = resultado;
  const linhas: LinhaMemoria[] = [
    {
      rotulo: 'Dias economizados',
      formula: `${d(timeline.diasSemHss)} sem HSS − ${d(timeline.diasComHss)} com HSS (só etapas em que a HSS atua)`,
      valor: d(timeline.diasEconomizados),
    },
    {
      rotulo: 'Ganho por consulta',
      formula: `${r(premissas.ticketMedio)} × ${p(premissas.parcelaMedicoPercentual)} × (1 − ${p(premissas.impostosPercentual)}) − ${r(premissas.custoConsultaMedico)}`,
      valor: r(resultado.margemPorConsulta),
    },
    {
      rotulo: 'Ganho por dia corrido',
      formula: `${formatarNumero(premissas.consultasPorDia)} consultas × ${p(premissas.ocupacaoPercentual)} × ${r(resultado.margemPorConsulta)} × ${formatarNumero(premissas.diasAtendimentoSemana)} ÷ 7`,
      valor: r(resultado.margemDiaria),
    },
    { rotulo: 'Renda mensal depois de liberado', formula: `${r(resultado.margemDiaria)} × 30 dias`, valor: r(resultado.rendaMensal) },
    {
      rotulo: 'Começar a atender antes',
      formula: `${d(timeline.diasEconomizados)} × ${r(resultado.margemDiaria)}`,
      valor: r(resultado.margemAntecipada),
    },
    {
      rotulo: 'Tempo de papelada poupado',
      formula: `(${h(premissas.horasMedicoSemHss)} − ${h(premissas.horasMedicoComHss)}) × ${r(premissas.valorHoraMedico)} por hora`,
      valor: r(resultado.economiaHoras),
    },
    {
      rotulo: 'Retrabalho evitado',
      formula: `(${p(premissas.retrabalhoSemHssPercentual)} − ${p(premissas.retrabalhoComHssPercentual)}) × ${r(premissas.custoRetrabalhoMedico)}`,
      valor: r(resultado.economiaRetrabalho),
    },
    {
      rotulo: 'Mensalidade da HSS no período',
      formula: `${r(premissas.mensalidadeHssMedico)} × ${formatarNumero(premissas.mesesAnalise)} meses`,
      valor: r(resultado.custoHssPeriodo),
    },
    {
      rotulo: 'Ganho total com a HSS',
      formula: `${r(resultado.margemAntecipada)} + ${r(resultado.economiaHoras)} + ${r(resultado.economiaRetrabalho)} − ${r(resultado.custoHssPeriodo)}`,
      valor: r(resultado.ganhoLiquidoHss),
      destaque: true,
    },
    {
      rotulo: 'Custo para entrar (sem / com HSS)',
      formula: `${r(premissas.custoEntrada)} + papelada + retrabalho`,
      valor: `${r(resultado.custoEntradaSemHss)} / ${r(resultado.custoEntradaComHss)}`,
    },
    {
      rotulo: 'Recupera o custo de entrada',
      formula: `(dias até liberar + ${d(premissas.prazoRecebimentoDias)} para receber) ÷ 30 + custo ÷ renda mensal`,
      valor: `${formatarMeses(resultado.recuperaEntradaComHssMeses)} (sem HSS: ${formatarMeses(resultado.recuperaEntradaSemHssMeses).toLowerCase()})`,
    },
  ];

  if (resultado.investimentoFormacao > 0) {
    linhas.push(
      {
        rotulo: 'Investimento no curso de medicina',
        formula: `${r(premissas.mensalidadeCurso)} × ${formatarNumero(premissas.mesesCurso)} meses`,
        valor: r(resultado.investimentoFormacao),
      },
      {
        rotulo: 'Recupera curso + entrada',
        formula: `espera ÷ 30 + (curso + custo para entrar) ÷ renda mensal`,
        valor: `${formatarMeses(resultado.recuperaFormacaoComHssMeses)} (sem HSS: ${formatarMeses(resultado.recuperaFormacaoSemHssMeses).toLowerCase()})`,
        destaque: true,
      },
    );
  }

  return linhas;
}
/* === MEMORIA DO MEDICO | fim === */

/* === MEMORIA DA INSTITUICAO | inicio === */
export function montarMemoriaInstituicao(resultado: ResultadoInstituicao, premissas: PremissasCenario, etapas: EtapaCenario[]): LinhaMemoria[] {
  const { timeline } = resultado;
  const conservador = calcularRoiInstituicao(etapas, premissas, FATOR_CONSERVADOR);

  return [
    {
      rotulo: 'Dias economizados',
      formula: `${d(timeline.diasSemHss)} sem HSS − ${d(timeline.diasComHss)} com HSS (só etapas em que a HSS atua)`,
      valor: d(timeline.diasEconomizados),
    },
    {
      rotulo: 'Margem por consulta',
      formula: `${r(premissas.ticketMedio)} × ${p(resultado.parcelaInstituicaoPercentual)} da instituição − ${r(premissas.custoConsultaInstituicao)}`,
      valor: r(resultado.margemPorConsulta),
    },
    {
      rotulo: 'Margem por dia corrido',
      formula: `${formatarNumero(premissas.consultasPorDia)} consultas × ${p(premissas.ocupacaoPercentual)} × ${r(resultado.margemPorConsulta)} × ${formatarNumero(premissas.diasAtendimentoSemana)} ÷ 7`,
      valor: r(resultado.margemDiaria),
    },
    {
      rotulo: 'Margem antecipada por médico',
      formula: `${d(timeline.diasEconomizados)} × ${r(resultado.margemDiaria)}`,
      valor: r(resultado.margemAntecipadaPorMedico),
    },
    {
      rotulo: 'Economia da equipe por médico',
      formula: `(${h(premissas.horasEquipeSemHss)} − ${h(premissas.horasEquipeComHss)}) × ${r(premissas.custoHoraEquipe)} por hora`,
      valor: r(resultado.custoEquipeSemHss - resultado.custoEquipeComHss),
    },
    {
      rotulo: 'Retrabalho evitado por médico',
      formula: `(${p(premissas.retrabalhoSemHssPercentual)} − ${p(premissas.retrabalhoComHssPercentual)}) × ${r(premissas.custoRetrabalhoInstituicao)}`,
      valor: r(resultado.custoRetrabalhoSemHss - resultado.custoRetrabalhoComHss),
    },
    {
      rotulo: 'Benefício por médico',
      formula: 'margem antecipada + economia da equipe + retrabalho evitado',
      valor: r(resultado.beneficioPorMedico),
    },
    {
      rotulo: 'Benefício no período',
      formula: `${r(resultado.beneficioPorMedico)} × ${formatarNumero(premissas.medicosPorMes)} médicos × ${formatarNumero(premissas.mesesAnalise)} meses`,
      valor: r(resultado.beneficioPeriodo),
    },
    {
      rotulo: 'Custo da HSS no período',
      formula: `${r(premissas.valorCredenciamentoHss)} × ${formatarNumero(premissas.medicosPorMes)} médicos × ${formatarNumero(premissas.mesesAnalise)} meses`,
      valor: r(resultado.custoHssPeriodo),
    },
    {
      rotulo: 'ROI do período',
      formula: `(${r(resultado.beneficioPeriodo)} − ${r(resultado.custoHssPeriodo)}) ÷ ${r(resultado.custoHssPeriodo)}`,
      valor: formatarPercentual(resultado.roiPercentual),
      destaque: true,
    },
    {
      rotulo: 'A HSS se paga em',
      formula: `liberação com HSS (${formatarNumero(resultado.timeline.diasComHss)} dias) + prazo de recebimento (${formatarNumero(premissas.prazoRecebimentoDias)} dias), se o benefício por médico superar ${r(premissas.valorCredenciamentoHss)}`,
      valor: formatarMeses(resultado.paybackMeses),
    },
    {
      rotulo: 'Retorno por real pago à HSS',
      formula: `${r(resultado.beneficioPorMedico)} ÷ ${r(premissas.valorCredenciamentoHss)} por médico`,
      valor: resultado.retornoPorRealHss === null ? 'Sem custo HSS' : `R$ ${formatarNumero(resultado.retornoPorRealHss)} por R$ 1`,
    },
    {
      rotulo: 'Conservador (metade da redução)',
      formula: 'mesma conta com metade dos dias, horas e retrabalho economizados',
      valor: `ROI ${formatarPercentual(conservador.roiPercentual)}, payback ${formatarMeses(conservador.paybackMeses).toLowerCase()}`,
    },
  ];
}
/* === MEMORIA DA INSTITUICAO | fim === */

/* === MEMORIA DA CARREIRA | inicio === */
export function montarMemoriaCarreira(resultado: ResultadoCarreira, premissas: PremissasCarreira): LinhaMemoria[] {
  const anos = formatarNumero(resultado.mesesCurso / 12);
  const pagar = resultado.mesesPagarFormacao;

  return [
    {
      rotulo: 'Total em mensalidades',
      formula: `${r(premissas.mensalidadeInicial)} × 12 por ano, com ${p(premissas.reajusteAnualPercentual)} de reajuste ao ano, por ${anos} anos`,
      valor: r(resultado.totalMensalidades),
    },
    {
      rotulo: 'Custo de vida',
      formula: `${r(premissas.custoVidaMensal)} × ${formatarNumero(resultado.mesesCurso)} meses`,
      valor: r(resultado.totalCustoVida),
    },
    { rotulo: 'Materiais e equipamentos', formula: 'valor total informado, rateado nos meses de curso', valor: r(resultado.materiais) },
    { rotulo: 'Preparatório e provas de residência', formula: 'valor total informado, nos 2 últimos anos', valor: r(resultado.preparatorio) },
    {
      rotulo: 'Investimento total na formação',
      formula: 'mensalidades + custo de vida + materiais + preparatório',
      valor: r(resultado.investimentoTotal),
      destaque: true,
    },
    // Uma linha por local de atendimento, ja com os impostos daquele local.
    ...premissas.locais.map((local) => ({
      rotulo: `Líquido em ${local.nome || 'local sem nome'}`,
      formula: `${formatarNumero(local.atendimentosPorDia)} atendimentos × ${formatarNumero(local.diasAtendimentoMes)} plantões × ${r(
        local.valorAtendimento,
      )} × ${p(local.parcelaMedicoPercentual)} × (1 - ${p(local.impostosPercentual)} de impostos)`,
      valor: r(calcularLiquidoLocal(local)),
    })),
    {
      rotulo: 'Ganho líquido por mês',
      formula: premissas.locais.length > 1 ? 'soma do líquido dos locais' : 'líquido do local',
      valor: r(resultado.rendaLiquidaMensal),
    },
    {
      rotulo: 'Custo de vida depois de formado',
      formula: premissas.custoVidaFormado === undefined ? 'igual ao custo de vida dos gastos do curso' : 'valor informado nos atendimentos',
      valor: r(resultado.custoVidaFormado),
    },
    {
      rotulo: 'Sobra por mês',
      formula: `${r(resultado.rendaLiquidaMensal)} de ganho líquido - ${r(resultado.custoVidaFormado)} de custo de vida`,
      valor: r(resultado.sobraMensal),
      destaque: true,
    },
    {
      rotulo: 'Tempo de retorno do investimento',
      formula: `(${r(resultado.investimentoTotal)} + custo de vida até o 1º pagamento) ÷ ${r(resultado.sobraMensal)} de sobra por mês`,
      valor: pagar === null ? 'Não atinge' : `${formatarMeses(pagar)} (${formatarNumero(pagar / 12)} anos)`,
      destaque: true,
    },
    {
      rotulo: 'Retorno desde o ingresso no curso',
      formula: `${formatarNumero(resultado.mesesCurso)} meses de curso + ${d(resultado.diasAteRenda)} até o primeiro pagamento${premissas.locais.length > 1 ? ' (média dos locais, pesada pela renda)' : ''} ÷ 30 + tempo de retorno`,
      valor:
        resultado.retornoDesdeIngressoMeses === null ? 'Não atinge' : `${formatarNumero(resultado.retornoDesdeIngressoMeses / 12)} anos`,
    },
  ];
}
/* === MEMORIA DA CARREIRA | fim === */
