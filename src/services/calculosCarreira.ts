import type { LocalAtendimento, PremissasCarreira, ResultadoCarreira } from '@/types/calculadora';

/* === CONSTANTES DA CARREIRA | inicio === */
const DIAS_POR_MES = 30;
// O preparatorio para a residencia e contratado no 5º e 6º ano.
const MESES_PREPARATORIO = 24;
// Teto do grafico: 40 anos desde o ingresso.
const MESES_MAXIMOS_GRAFICO = 480;
/* === CONSTANTES DA CARREIRA | fim === */

/* === APOIO | inicio === */
function n(valor: number | undefined): number {
  return !Number.isFinite(valor) || Number(valor) < 0 ? 0 : Number(valor);
}

function mesesDoCurso(premissas: PremissasCarreira): number {
  return Math.max(1, Math.round(n(premissas.anosCurso))) * 12;
}

// Mensalidade de cada mes do curso: o reajuste entra a cada 12 meses.
function mensalidadeNoMes(premissas: PremissasCarreira, mes: number): number {
  const ano = Math.floor(mes / 12);
  return n(premissas.mensalidadeInicial) * (1 + n(premissas.reajusteAnualPercentual) / 100) ** ano;
}

// Gasto de um mes do curso: mensalidade, custo de vida, materiais rateados no curso e preparatorio nos 2 ultimos anos.
function gastoNoMes(premissas: PremissasCarreira, mes: number): number {
  const meses = mesesDoCurso(premissas);
  if (mes >= meses) return 0;

  const mesesPreparatorio = Math.min(MESES_PREPARATORIO, meses);
  const preparatorio = mes >= meses - mesesPreparatorio ? n(premissas.preparatorioResidencia) / mesesPreparatorio : 0;
  return mensalidadeNoMes(premissas, mes) + n(premissas.custoVidaMensal) + n(premissas.materiais) / meses + preparatorio;
}
/* === APOIO | fim === */

/* === CALCULO DA CARREIRA | inicio === */
// Bruto mensal de um local, ja com a parte do medico: atendimentos × plantoes no mes × valor × parte.
export function calcularBrutoLocal(local: LocalAtendimento): number {
  const parte = Math.min(100, n(local.parcelaMedicoPercentual)) / 100;
  return n(local.atendimentosPorDia) * n(local.diasAtendimentoMes) * n(local.valorAtendimento) * parte;
}

// Liquido mensal de um local: bruto × (1 - impostos do local).
export function calcularLiquidoLocal(local: LocalAtendimento): number {
  return calcularBrutoLocal(local) * (1 - Math.min(100, n(local.impostosPercentual)) / 100);
}

// Ganho liquido mensal = soma dos liquidos dos locais.
export function calcularRendaCarreira(premissas: PremissasCarreira): number {
  return (premissas.locais ?? []).reduce((total, local) => total + calcularLiquidoLocal(local), 0);
}

// Prazo ate o primeiro pagamento, medio e ponderado pela renda de cada local. Depois que todos os locais pagam,
// soma(renda_i × (t - prazo_i)) = renda × (t - prazo medio), entao o retorno continua exato com um prazo so.
export function calcularPrazoMedio(premissas: PremissasCarreira): number {
  const locais = premissas.locais ?? [];
  const renda = calcularRendaCarreira(premissas);
  if (renda <= 0) return locais.length > 0 ? Math.min(...locais.map((local) => n(local.prazoRecebimentoDias))) : 0;
  return locais.reduce((total, local) => total + calcularLiquidoLocal(local) * n(local.prazoRecebimentoDias), 0) / renda;
}


// Custo de vida depois de formado: o informado no passo de atendimentos ou, sem edicao, o dos gastos do curso.
export function calcularCustoVidaFormado(premissas: PremissasCarreira): number {
  return n(premissas.custoVidaFormado ?? premissas.custoVidaMensal);
}

// Retorno: depois da formatura (mes M) o saldo e -Investimento - custo × (t - M) + renda × (t - M - prazo).
// Ele zera em t - M = (Investimento + renda × prazo) ÷ (renda - custo). O tempo de profissao, contado do 1o pagamento,
// e (Investimento + custo × prazo) ÷ (renda - custo). Sem custo de vida, volta ao payback do estudo (Investimento ÷ renda).
export function calcularCarreira(premissas: PremissasCarreira): ResultadoCarreira {
  const meses = mesesDoCurso(premissas);
  let totalMensalidades = 0;
  for (let mes = 0; mes < meses; mes += 1) totalMensalidades += mensalidadeNoMes(premissas, mes);

  const totalCustoVida = n(premissas.custoVidaMensal) * meses;
  const materiais = n(premissas.materiais);
  const preparatorio = n(premissas.preparatorioResidencia);
  const investimentoTotal = totalMensalidades + totalCustoVida + materiais + preparatorio;
  const renda = calcularRendaCarreira(premissas);
  const diasAteRenda = calcularPrazoMedio(premissas);
  const custoVidaFormado = calcularCustoVidaFormado(premissas);
  const sobraMensal = renda - custoVidaFormado;
  const prazoMeses = diasAteRenda / DIAS_POR_MES;
  const mesesPagarFormacao = sobraMensal > 0 ? (investimentoTotal + custoVidaFormado * prazoMeses) / sobraMensal : null;

  return {
    totalMensalidades,
    totalCustoVida,
    materiais,
    preparatorio,
    investimentoTotal,
    rendaLiquidaMensal: renda,
    custoVidaFormado,
    sobraMensal,
    mesesCurso: meses,
    diasAteRenda,
    mesesPagarFormacao,
    retornoDesdeIngressoMeses: mesesPagarFormacao === null ? null : meses + prazoMeses + mesesPagarFormacao,
  };
}

// Tempo para pagar a formacao com outro ganho mensal (faixa de mercado), com o mesmo custo de vida.
export function calcularMesesComRenda(resultado: ResultadoCarreira, renda: number): number | null {
  const sobra = renda - resultado.custoVidaFormado;
  return sobra > 0 ? (resultado.investimentoTotal + resultado.custoVidaFormado * (resultado.diasAteRenda / DIAS_POR_MES)) / sobra : null;
}
/* === CALCULO DA CARREIRA | fim === */

/* === PROJECAO MES A MES DA CARREIRA | inicio === */
// Saldo desde o ingresso: desce durante o curso (gasto) e sobe quando a renda comeca. Cruza o zero no retorno.
export function projetarCarreira(premissas: PremissasCarreira, resultado: ResultadoCarreira): number[] {
  // Cada local comeca a pagar no proprio prazo depois da formatura.
  const entradas = (premissas.locais ?? []).map((local) => ({
    renda: calcularLiquidoLocal(local),
    inicio: resultado.mesesCurso + n(local.prazoRecebimentoDias) / DIAS_POR_MES,
  }));
  const alvo = resultado.retornoDesdeIngressoMeses === null ? resultado.mesesCurso + 120 : resultado.retornoDesdeIngressoMeses + 12;
  const horizonte = Math.min(MESES_MAXIMOS_GRAFICO, Math.ceil(alvo / 12) * 12);
  const saldo: number[] = [];
  let gastoAcumulado = 0;

  for (let mes = 0; mes <= horizonte; mes += 1) {
    // Depois da formatura o custo de vida continua, agora pago pela renda.
    const custoDepois = resultado.custoVidaFormado * Math.max(0, mes - resultado.mesesCurso);
    saldo.push(-gastoAcumulado - custoDepois + entradas.reduce((total, entrada) => total + entrada.renda * Math.max(0, mes - entrada.inicio), 0));
    gastoAcumulado += gastoNoMes(premissas, mes);
  }

  return saldo;
}
/* === PROJECAO MES A MES DA CARREIRA | fim === */
