import type { DadosEmpresaRoi, DadosMedicoRoi, ResultadoEmpresaRoi, ResultadoMedicoRoi } from '@/types/calculadora';

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

function n(valor: number | undefined): number {
  return !Number.isFinite(valor) || Number(valor) < 0 ? 0 : Number(valor);
}
/* === FORMATADORES | fim === */

/* === CALCULO EMPRESA | inicio === */
export function calcularRoiEmpresa(dados: DadosEmpresaRoi): ResultadoEmpresaRoi {
  const meses = Math.max(1, n(dados.mesesAnalise));
  const medicosMes = n(dados.medicosCredenciadosMes);
  const horasPorCredenciamento = n(dados.horasAdministrativasPorCredenciamento);
  const custoHora = n(dados.custoHoraAdministrativo);
  const horasAdministrativasMensais =
    horasPorCredenciamento > 0 ? horasPorCredenciamento * medicosMes : n(dados.horasAdministrativasSemana) * 4.33;
  const custoAdm = horasAdministrativasMensais * custoHora;
  const economiaAdm = custoAdm * (n(dados.reducaoAdministrativaPercentual) / 100);

  const noShowAtual = n(dados.atendimentosMes) * (n(dados.taxaNoShowAtual) / 100);
  const noShowHss = n(dados.atendimentosMes) * (n(dados.taxaNoShowComHss) / 100);
  const margemAtendimento = n(dados.margemMediaAtendimento);
  const valorAtendimento = Math.max(
    margemAtendimento,
    n(dados.ticketMedioAtendimento) * (n(dados.margemLiquidaPercentual) > 0 ? n(dados.margemLiquidaPercentual) / 100 : 0.35),
  );
  const economiaNoShow = Math.max(0, noShowAtual - noShowHss) * valorAtendimento;

  const custoRetrabalhoMensal = medicosMes * n(dados.custoRetrabalhoPorMedico) * (n(dados.taxaRetrabalhoDocumental) / 100);
  const economiaRetrabalhoDocumental = custoRetrabalhoMensal * (n(dados.reducaoGlosasPercentual) / 100);
  const economiaGlosas = n(dados.custoGlosasMensal) * (n(dados.reducaoGlosasPercentual) / 100) + economiaRetrabalhoDocumental;
  const custoDocumentosVencidos = medicosMes * n(dados.custoDocumentoVencido) * (n(dados.taxaDocumentosVencidos) / 100);

  const diasRecuperados = Math.max(0, n(dados.tempoCredenciamentoAtualDias) - n(dados.tempoCredenciamentoComHssDias));
  const valorDiaMedico = n(dados.valorMensalPorMedicoLiberado) / 30;
  const receitaAntecipada = medicosMes * diasRecuperados * valorDiaMedico;
  const prejuizoSemHss = medicosMes * n(dados.tempoCredenciamentoAtualDias) * valorDiaMedico;

  const beneficios = economiaAdm + economiaNoShow + economiaGlosas + receitaAntecipada + custoDocumentosVencidos;
  const custos = n(dados.custoMensalHss) + n(dados.custoImplantacaoHss) / meses;
  const liquido = beneficios - custos;
  const roi = custos > 0 ? ((beneficios - custos) / custos) * 100 : 0;
  const payback = liquido > 0 ? n(dados.custoImplantacaoHss) / liquido : null;

  return {
    economiaAdministrativaMensal: economiaAdm,
    economiaNoShowMensal: economiaNoShow,
    economiaGlosasMensal: economiaGlosas,
    receitaAntecipadaMensal: receitaAntecipada,
    prejuizoMensalSemHss: prejuizoSemHss,
    beneficiosMensais: beneficios,
    custosMensaisEquivalentes: custos,
    beneficioLiquidoMensal: liquido,
    roiPercentual: roi,
    paybackMeses: payback,
    economiaProjetadaPeriodo: beneficios * meses,
    custoProjetadoPeriodo: custos * meses,
    ganhoLiquidoPeriodo: (beneficios - custos) * meses,
    tempoEconomizadoPorMedicoDias: diasRecuperados,
    tempoEconomizadoTotalDias: diasRecuperados * medicosMes,
    valorDiarioPorMedico: valorDiaMedico,
    prejuizoEvitadoPorAtraso: receitaAntecipada,
    custoAtualProcessoManual: custoAdm + custoRetrabalhoMensal + custoDocumentosVencidos,
    custoComDocumentosVencidos: custoDocumentosVencidos,
    economiaRetrabalhoDocumental,
  };
}
/* === CALCULO EMPRESA | fim === */

/* === CALCULO MEDICO | inicio === */
export function calcularRoiMedico(dados: DadosMedicoRoi): ResultadoMedicoRoi {
  const meses = Math.max(1, n(dados.mesesAnalise));
  const custoTempo = n(dados.horasPerdidasProcesso) * n(dados.valorHoraMedica);
  const repasseMensal = n(dados.receitaMensalEsperadaHospital) * (n(dados.percentualRepasseClinica) / 100);
  const receitaLiquidaMensal = Math.max(
    0,
    n(dados.receitaMensalEsperadaHospital) - repasseMensal - n(dados.custoOperacionalMensal),
  );
  const custoTotal =
    n(dados.custoCrmAnual) +
    n(dados.custoCursos) +
    n(dados.custoDocumentos) +
    n(dados.custoCertificadoDigital) +
    n(dados.custoVacinasExames) +
    n(dados.custoSeguroAnual) +
    n(dados.custoPjPrimeiroAno) +
    n(dados.custoTaxasHospitalares) +
    n(dados.investimentoInicial) +
    custoTempo;

  const dias = Math.max(0, n(dados.tempoCredenciamentoTradicionalDias) - n(dados.tempoCredenciamentoDigitalDias));
  const receitaAntecipada = dias * (receitaLiquidaMensal / 30);
  const beneficio = receitaAntecipada + receitaLiquidaMensal * meses;
  const roi = custoTotal > 0 ? ((beneficio - custoTotal) / custoTotal) * 100 : 0;
  const payback = receitaLiquidaMensal > 0 ? custoTotal / receitaLiquidaMensal : null;

  return {
    custoInicialTotal: custoTotal,
    economiaTempoCredenciamento: dias,
    receitaAntecipada,
    receitaLiquidaMensal,
    beneficioTotalPeriodo: beneficio,
    roiPercentual: roi,
    paybackMeses: payback,
    custoTempoPerdido: custoTempo,
    repasseMensal,
  };
}
/* === CALCULO MEDICO | fim === */
