import { useMemo, useState, type ReactNode } from "react";
import { COR_COM_HSS, COR_SEM_HSS, GraficoAcumulado, GraficoEtapas, type MarcoGrafico, type SerieGrafico } from "@/components/calculadora/graficos-resultado";
import { GraficoComposicao, type DadosComposicao } from "@/components/calculadora/graficos-extras";
import { ComparativoItens, ReguaDiferenca } from "@/components/calculadora/regua-diferenca";
import { TabelaMemoria } from "@/components/calculadora/tabela-memoria";
import { ROTULOS_ORIGEM } from "@/data/configuracoesCredenciamento";
import {
  calcularRendaNoPeriodo,
  calcularRetornoPorMedico,
  calcularRoiHorizontes,
  calcularRoiInstituicao,
  encontrarCruzamentoZero,
  FATOR_CONSERVADOR,
  formatarMoeda,
  formatarNumero,
  formatarPercentual,
  formatarTempo,
  projetarAcumuladoMedico,
  projetarGastoInstituicao,
} from "@/services/calculosRoi";
import { montarMemoriaInstituicao, montarMemoriaMedico } from "@/services/memoriaCalculo";
import type {
  CenarioCredenciamento,
  ItemComparativo,
  PerspectivaRoi,
  PremissasCenario,
  ResultadoInstituicao,
  ResultadoMedico,
} from "@/types/calculadora";

/* === TIPOS DA TELA DE RESULTADO | inicio === */
interface TelaResultadoProps {
  cenario: CenarioCredenciamento;
  perspectiva: PerspectivaRoi;
  resultadoMedico: ResultadoMedico;
  resultadoInstituicao: ResultadoInstituicao;
  premissas: PremissasCenario;
  previaRascunho: boolean;
}

interface ConteudoResultado {
  numeroHeroi: string;
  textoHeroi: string;
  itemHeroi: ItemComparativo;
  // Ids dos itens que aparecem no resumo; a vista "Comparativo" mostra todos.
  itensResumo: string[];
  itens: ItemComparativo[];
  indicadores?: string;
  tituloGrafico: string;
  descricaoGrafico: string;
  series: SerieGrafico[];
  marcos: MarcoGrafico[];
  notaGrafico: string;
  composicao: { titulo: string; descricao: string; dados: DadosComposicao; nota: string };
}
/* === TIPOS DA TELA DE RESULTADO | fim === */

/* === FORMATADORES DOS ITENS | inicio === */
const dias = (valor: number): string => `${formatarNumero(valor)} ${Math.round(valor) === 1 ? "dia" : "dias"}`;
const horas = (valor: number): string => `${formatarNumero(valor)} h`;
// Itens de tempo com valor nulo (sem renda) ficam fora da regua: nao ha prazo para comparar.
const SEM_RETORNO = -1;
const tempo = (valor: number): string => (valor === SEM_RETORNO ? formatarTempo(null) : formatarTempo(valor));
// Horizonte minimo dos graficos para o ponto de retorno aparecer, sem passar de 10 anos.
const MESES_MAXIMOS_GRAFICO = 120;

function horizonteGrafico(premissas: PremissasCenario, ...prazos: (number | null)[]): number {
  const maior = Math.max(0, ...prazos.filter((prazo): prazo is number => prazo !== null));
  return Math.min(MESES_MAXIMOS_GRAFICO, Math.max(premissas.mesesAnalise, Math.ceil(maior * 1.25) + 1));
}
/* === FORMATADORES DOS ITENS | fim === */

/* === TELA DE RESULTADO | inicio === */
type VisaoResultado = "resumo" | "comparativo" | "grafico" | "composicao" | "etapas" | "calculo";

const VISOES: { id: VisaoResultado; nome: string }[] = [
  { id: "resumo", nome: "Resumo" },
  { id: "comparativo", nome: "Sem × Com" },
  { id: "grafico", nome: "Tempo × dinheiro" },
  { id: "composicao", nome: "Composição" },
  { id: "etapas", nome: "Etapas" },
  { id: "calculo", nome: "Cálculo" },
];

// O resultado sempre compara o mesmo item sem HSS e com HSS; as vistas dividem o conteudo para caber na caixa de 90dvh.
export function TelaResultado({ cenario, perspectiva, resultadoMedico, resultadoInstituicao, premissas, previaRascunho }: TelaResultadoProps): JSX.Element {
  const [visao, definirVisao] = useState<VisaoResultado>("resumo");
  const conteudo = useMemo(
    () =>
      perspectiva === "medico"
        ? montarConteudoMedico(resultadoMedico, premissas)
        : montarConteudoInstituicao(resultadoInstituicao, premissas, cenario),
    [perspectiva, resultadoMedico, resultadoInstituicao, premissas, cenario],
  );
  const memoria = useMemo(
    () =>
      perspectiva === "medico"
        ? montarMemoriaMedico(resultadoMedico, premissas)
        : montarMemoriaInstituicao(resultadoInstituicao, premissas, cenario.etapas),
    [perspectiva, resultadoMedico, resultadoInstituicao, premissas, cenario.etapas],
  );
  const itensValidos = conteudo.itens.filter((item) => item.semHss !== SEM_RETORNO && item.comHss !== SEM_RETORNO);
  const itensResumo = conteudo.itensResumo
    .map((id) => itensValidos.find((item) => item.id === id))
    .filter((item): item is ItemComparativo => Boolean(item));

  return (
    // Abaixo de lg os blocos usam a altura natural (max-lg:flex-none) e a area da calculadora rola.
    <div className="flex min-h-0 flex-1 flex-col gap-5 max-lg:flex-none">
      <CabecalhoResultado subtitulo={cenario.nome} visao={visao} visoes={VISOES} aoTrocarVisao={definirVisao} />

      {visao === "resumo" ? (
        <div className="flex min-h-0 flex-1 flex-col [justify-content:safe_center] gap-4 max-lg:flex-none">
          <BlocoHeroi numero={conteudo.numeroHeroi} texto={conteudo.textoHeroi}>
            <p className="mb-3 text-sm font-semibold text-slate-950">{conteudo.itemHeroi.rotulo}</p>
            {conteudo.itemHeroi.semHss === SEM_RETORNO || conteudo.itemHeroi.comHss === SEM_RETORNO ? (
              <p className="text-sm leading-6 text-slate-700">Com as premissas atuais a renda não cobre os custos; ajuste os dados para ver o prazo.</p>
            ) : (
              <ReguaDiferenca item={conteudo.itemHeroi} tamanho="grande" />
            )}
          </BlocoHeroi>

          <ComparativoItens itens={itensResumo} />

          {/* Empilhado: com os textos lado a lado, o aviso ficava espremido em uma coluna e estourava a altura da caixa. */}
          <div className="grid max-w-[110ch] gap-1.5 text-[0.8125rem] leading-5 text-slate-600">
            {conteudo.indicadores ? <p className="font-medium text-slate-950">{conteudo.indicadores}</p> : null}
            <p>
              Prazos: {ROTULOS_ORIGEM[cenario.origemPrazos].toLowerCase()}
              {cenario.origemCriacao === "ia" ? ", montados com a IA a partir das suas respostas" : ""}. {cenario.limite} Simulação com valores editáveis; não é
              promessa de resultado da HSS.
              {previaRascunho ? " Você está vendo o rascunho do Portal ADM salvo neste navegador." : ""}
            </p>
            <button type="button" onClick={() => definirVisao("comparativo")} className="justify-self-start font-semibold text-hss-roxo underline-offset-4 hover:underline">
              Ver todos os itens lado a lado
            </button>
          </div>
        </div>
      ) : null}

      {visao === "comparativo" ? (
        <Cartao titulo="O mesmo item, sem e com a HSS" descricao="Cada régua usa uma escala própria. A faixa hachurada é a diferença entre os dois fluxos.">
          <div className="min-h-0 flex-1 overflow-y-auto max-lg:flex-none max-lg:overflow-visible">
            <ComparativoItens itens={itensValidos} />
          </div>
        </Cartao>
      ) : null}

      {visao === "grafico" ? (
        <Cartao titulo={conteudo.tituloGrafico} descricao={conteudo.descricaoGrafico}>
          <GraficoAcumulado series={conteudo.series} marcos={conteudo.marcos} rotuloAria={`${conteudo.tituloGrafico}.`} />
          <p className="mt-3 border-t border-hss-violeta/15 pt-3 text-sm text-slate-700">{conteudo.notaGrafico}</p>
        </Cartao>
      ) : null}

      {visao === "composicao" ? (
        <Cartao titulo={conteudo.composicao.titulo} descricao={conteudo.composicao.descricao}>
          <GraficoComposicao dados={conteudo.composicao.dados} formatar={formatarMoeda} />
          <p className="mt-3 border-t border-hss-violeta/15 pt-3 text-sm text-slate-700">{conteudo.composicao.nota}</p>
        </Cartao>
      ) : null}

      {visao === "etapas" ? (
        <Cartao titulo="Tempo de cada etapa" descricao="Mesma escala de dias nas duas linhas. Os números indicam as etapas listadas abaixo.">
          <GraficoEtapas etapas={cenario.etapas} mostrarComHss />
        </Cartao>
      ) : null}

      {visao === "calculo" ? (
        <Cartao
          titulo="A conta, passo a passo"
          descricao="Cada linha usa os valores que você informou (ou os de exemplo do caso). As fórmulas seguem o guia de ROI da HSS."
        >
          <TabelaMemoria linhas={memoria} />
        </Cartao>
      ) : null}
    </div>
  );
}
/* === TELA DE RESULTADO | fim === */

/* === CONTEUDO DO MEDICO | inicio === */
function montarConteudoMedico(resultado: ResultadoMedico, premissas: PremissasCenario): ConteudoResultado {
  const { timeline } = resultado;
  const comCurso = resultado.investimentoFormacao > 0;
  const semMeses = comCurso ? resultado.recuperaFormacaoSemHssMeses : resultado.recuperaEntradaSemHssMeses;
  const comMeses = comCurso ? resultado.recuperaFormacaoComHssMeses : resultado.recuperaEntradaComHssMeses;
  const oQue = comCurso ? "o curso de medicina e os custos para começar" : "o que você gastou para começar a atender";
  const renda = calcularRendaNoPeriodo(resultado, premissas);
  const meses = formatarNumero(premissas.mesesAnalise);
  const retrabalhoSem = (premissas.retrabalhoSemHssPercentual / 100) * premissas.custoRetrabalhoMedico;

  const retrabalhoCom = retrabalhoSem - resultado.economiaRetrabalho;
  const entrada = Math.max(0, premissas.custoEntrada);

  const projecao = projetarAcumuladoMedico(resultado, { ...premissas, mesesAnalise: horizonteGrafico(premissas, semMeses, comMeses) });
  const series: SerieGrafico[] = [
    { id: "sem", nome: "Sem HSS", cor: COR_SEM_HSS, valores: projecao.semHss },
    { id: "com", nome: "Com HSS", cor: COR_COM_HSS, valores: projecao.comHss },
  ];

  return {
    numeroHeroi: formatarTempo(comMeses),
    textoHeroi:
      comMeses === null
        ? "Com as premissas atuais a renda não chega a pagar os custos de entrada."
        : `com a HSS para recuperar ${oQue}, contando desde o início do credenciamento. Sem a HSS: ${formatarTempo(semMeses).toLowerCase()}.`,
    itemHeroi: {
      id: "retorno",
      rotulo: comCurso ? "Tempo para recuperar o curso e a entrada" : "Tempo para recuperar o investimento de entrada",
      semHss: semMeses ?? SEM_RETORNO,
      comHss: comMeses ?? SEM_RETORNO,
      formatar: tempo,
      menorMelhor: true,
    },
    itensResumo: ["prazo", "custo-entrada", "renda-periodo"],
    itens: [
      {
        id: "prazo",
        rotulo: "Prazo até poder atender",
        semHss: timeline.diasSemHss,
        comHss: timeline.diasComHss,
        formatar: dias,
        menorMelhor: true,
        detalhe: "Soma das etapas do credenciamento.",
      },
      {
        id: "primeiro-pagamento",
        rotulo: "Dias até o primeiro pagamento",
        semHss: timeline.diasSemHss + premissas.prazoRecebimentoDias,
        comHss: timeline.diasComHss + premissas.prazoRecebimentoDias,
        formatar: dias,
        menorMelhor: true,
        detalhe: `Prazo de liberação mais ${formatarNumero(premissas.prazoRecebimentoDias)} dias entre atender e receber.`,
      },
      {
        id: "custo-entrada",
        rotulo: "Custo para começar",
        semHss: resultado.custoEntradaSemHss,
        comHss: resultado.custoEntradaComHss,
        formatar: formatarMoeda,
        menorMelhor: true,
        detalhe: "Custos de entrada, horas de papelada e retrabalho.",
      },
      {
        id: "papelada",
        rotulo: "Horas com papelada",
        semHss: premissas.horasMedicoSemHss,
        comHss: premissas.horasMedicoSemHss - resultado.horasPoupadas,
        formatar: horas,
        menorMelhor: true,
        detalhe: `Valem ${formatarMoeda(premissas.valorHoraMedico)} por hora do seu tempo.`,
      },
      {
        id: "retrabalho",
        rotulo: "Retrabalho esperado",
        semHss: retrabalhoSem,
        comHss: retrabalhoSem - resultado.economiaRetrabalho,
        formatar: formatarMoeda,
        menorMelhor: true,
        detalhe: "Chance de o dossiê voltar × custo de cada correção.",
      },
      {
        id: "renda-periodo",
        rotulo: `Renda em ${meses} meses`,
        semHss: renda.semHss,
        comHss: renda.comHss,
        formatar: formatarMoeda,
        menorMelhor: false,
        detalhe: premissas.mensalidadeHssMedico > 0 ? "Com HSS, já sem a mensalidade da HSS." : "Começar antes adianta os pagamentos.",
      },
    ],
    tituloGrafico: comCurso ? "Tempo × dinheiro: seu saldo, contando o curso" : "Tempo × dinheiro: seu saldo desde o início do credenciamento",
    descricaoGrafico:
      "Começa negativo pelo que você gasta para entrar, fica parado enquanto espera a liberação e o primeiro pagamento, e sobe com a renda. Cada ponto no zero marca o retorno.",
    series,
    marcos: marcosNoRetorno([
      { serie: series[0], mes: semMeses },
      { serie: series[1], mes: comMeses },
    ]),
    notaGrafico:
      semMeses !== null && comMeses !== null
        ? `A HSS antecipa o retorno em ${formatarTempo(Math.max(0, semMeses - comMeses)).toLowerCase()}: começar a atender ${dias(timeline.diasEconomizados)} antes vale ${formatarMoeda(resultado.margemAntecipada)}.`
        : "Com as premissas atuais o saldo não volta a zero.",
    composicao: {
      titulo: "De que é feito o custo para começar",
      descricao: "Mesma escala nas duas barras. Os custos de entrada são iguais nos dois fluxos; a HSS reduz as horas de papelada e o retrabalho.",
      dados: {
        categorias: ["Custos de entrada", "Horas de papelada", "Retrabalho"],
        linhas: [
          { id: "sem", nome: "Sem HSS", segmentos: [entrada, resultado.custoEntradaSemHss - entrada - retrabalhoSem, retrabalhoSem] },
          { id: "com", nome: "Com HSS", segmentos: [entrada, resultado.custoEntradaComHss - entrada - retrabalhoCom, retrabalhoCom], destaque: true },
        ],
      },
      nota: `Com a HSS você gasta ${formatarMoeda(Math.max(0, resultado.custoEntradaSemHss - resultado.custoEntradaComHss))} a menos para começar a atender.`,
    },
  };
}
/* === CONTEUDO DO MEDICO | fim === */

/* === CONTEUDO DA INSTITUICAO | inicio === */
function montarConteudoInstituicao(resultado: ResultadoInstituicao, premissas: PremissasCenario, cenario: CenarioCredenciamento): ConteudoResultado {
  const { timeline } = resultado;
  const retorno = calcularRetornoPorMedico(resultado, premissas);
  const meses = formatarNumero(premissas.mesesAnalise);
  const horasCom = timeline.hssAtua ? Math.min(premissas.horasEquipeSemHss, premissas.horasEquipeComHss) : premissas.horasEquipeSemHss;
  const gastoPeriodo = projetarGastoInstituicao(resultado, premissas);
  const conservador = calcularRoiInstituicao(cenario.etapas, premissas, FATOR_CONSERVADOR);
  const horizontes = calcularRoiHorizontes(cenario.etapas, premissas);

  const projecao = projetarGastoInstituicao(resultado, { ...premissas, mesesAnalise: horizonteGrafico(premissas, resultado.paybackMeses) });
  // Sem custo inicial as linhas nao se cruzam: a de HSS ja comeca abaixo; a distancia entre elas e a economia.
  const marcos: MarcoGrafico[] = [];

  return {
    numeroHeroi: formatarTempo(resultado.paybackMeses),
    textoHeroi:
      resultado.paybackMeses === null
        ? `O benefício por médico não supera os ${formatarMoeda(premissas.valorCredenciamentoHss)} cobrados pela HSS por credenciamento com as premissas atuais.`
        : `para a HSS se pagar: é o tempo até o primeiro médico credenciado com ela ser liberado e receber. Cada credenciamento custa ${formatarMoeda(premissas.valorCredenciamentoHss)} e rende ${formatarMoeda(resultado.beneficioPorMedico - premissas.valorCredenciamentoHss)} líquidos.`,
    itemHeroi: {
      id: "retorno-medico",
      rotulo: "Tempo até cada médico novo dar retorno",
      semHss: retorno.semHssMeses ?? SEM_RETORNO,
      comHss: retorno.comHssMeses ?? SEM_RETORNO,
      formatar: tempo,
      menorMelhor: true,
    },
    itensResumo: ["prazo", "custo-credenciamento", "gasto-periodo"],
    itens: [
      {
        id: "prazo",
        rotulo: "Prazo para liberar cada médico",
        semHss: timeline.diasSemHss,
        comHss: timeline.diasComHss,
        formatar: dias,
        menorMelhor: true,
        detalhe: "Soma das etapas do credenciamento.",
      },
      {
        id: "custo-credenciamento",
        rotulo: "Custo de cada credenciamento",
        semHss: resultado.custoCredenciamentoSemHss,
        comHss: resultado.custoEquipeComHss + resultado.custoRetrabalhoComHss,
        formatar: formatarMoeda,
        menorMelhor: true,
        detalhe: "Horas da equipe e retrabalho médio por médico.",
      },
      {
        id: "gasto-periodo",
        rotulo: `Gasto com credenciamento em ${meses} meses`,
        semHss: gastoPeriodo.semHss[gastoPeriodo.semHss.length - 1] ?? 0,
        comHss: gastoPeriodo.comHss[gastoPeriodo.comHss.length - 1] ?? 0,
        formatar: formatarMoeda,
        menorMelhor: true,
        detalhe: "Equipe, retrabalho e margem parada. Com HSS, já inclui o valor cobrado pela HSS por credenciamento.",
      },
      {
        id: "horas-equipe",
        rotulo: "Horas da equipe por médico",
        semHss: premissas.horasEquipeSemHss,
        comHss: horasCom,
        formatar: horas,
        menorMelhor: true,
        detalhe: `A ${formatarMoeda(premissas.custoHoraEquipe)} a hora.`,
      },
      {
        id: "margem-parada",
        rotulo: "Margem parada por médico",
        semHss: resultado.margemParadaPorMedicoSemHss,
        comHss: timeline.diasComHss * resultado.margemDiaria,
        formatar: formatarMoeda,
        menorMelhor: true,
        detalhe: `Dias esperando liberação × ${formatarMoeda(resultado.margemDiaria)} de margem por dia.`,
      },
      {
        id: "retorno-medico",
        rotulo: "Tempo até cada médico dar retorno",
        semHss: retorno.semHssMeses ?? SEM_RETORNO,
        comHss: retorno.comHssMeses ?? SEM_RETORNO,
        formatar: tempo,
        menorMelhor: true,
        detalhe: "Liberação, prazo de recebimento e custo do credenciamento pago pela margem do médico.",
      },
    ],
    indicadores: montarIndicadores(resultado, conservador, horizontes, premissas.mesesAnalise),
    tituloGrafico: "Tempo × gasto: quanto o credenciamento custa no acumulado",
    descricaoGrafico:
      "Horas da equipe, retrabalho e a margem que fica parada enquanto os médicos esperam liberação. Com HSS, cada médico soma o valor cobrado pela HSS por credenciamento. A distância entre as linhas é a economia acumulada.",
    series: [
      { id: "sem", nome: "Sem HSS", cor: COR_SEM_HSS, valores: projecao.semHss },
      { id: "com", nome: "Com HSS", cor: COR_COM_HSS, valores: projecao.comHss },
    ],
    marcos,
    notaGrafico:
      resultado.paybackMeses === null
        ? "Com as premissas atuais o benefício por médico não supera o valor cobrado pela HSS por credenciamento."
        : `Em ${meses} meses, a instituição gasta ${formatarMoeda(resultado.beneficioLiquido)} a menos com a HSS (benefício de ${formatarMoeda(resultado.beneficioPeriodo)} menos ${formatarMoeda(resultado.custoHssPeriodo)} da HSS).`,
    composicao: {
      titulo: "De que é feito o custo de cada médico credenciado",
      descricao: "Mesma escala nas duas barras: horas da equipe, retrabalho e a margem que fica parada enquanto o médico espera a liberação.",
      dados: {
        categorias: ["Horas da equipe", "Retrabalho", "Margem parada"],
        linhas: [
          { id: "sem", nome: "Sem HSS", segmentos: [resultado.custoEquipeSemHss, resultado.custoRetrabalhoSemHss, resultado.margemParadaPorMedicoSemHss] },
          {
            id: "com",
            nome: "Com HSS",
            segmentos: [resultado.custoEquipeComHss, resultado.custoRetrabalhoComHss, timeline.diasComHss * resultado.margemDiaria],
            destaque: true,
          },
        ],
      },
      nota: `Cada médico credenciado com a HSS custa ${formatarMoeda(resultado.beneficioPorMedico)} a menos, antes da mensalidade.`,
    },
  };
}
// ROI do periodo analisado, os demais horizontes (sem repetir o periodo) e o ponto de equilibrio em uma frase cada.
function montarIndicadores(
  resultado: ResultadoInstituicao,
  conservador: ResultadoInstituicao,
  horizontes: { meses: number; roiPercentual: number | null }[],
  mesesAnalise: number,
): string {
  const periodo = `ROI de ${formatarPercentual(resultado.roiPercentual)} em ${formatarNumero(mesesAnalise)} meses (${formatarPercentual(conservador.roiPercentual)} no cenário conservador).`;
  const outros = horizontes.filter((item) => item.meses !== mesesAnalise).map((item) => `${formatarPercentual(item.roiPercentual)} em ${item.meses} meses`);
  const textoOutros = outros.length > 0 ? ` Em prazos maiores: ${outros.join(" e ")}.` : "";
  const retorno = resultado.retornoPorRealHss;
  const equilibrio =
    retorno === null
      ? ""
      : retorno <= 1
        ? " Com as premissas atuais, o benefício por médico não cobre o valor do credenciamento HSS."
        : ` Cada R$ 1 pago à HSS por credenciamento volta como R$ ${formatarNumero(retorno)}.`;

  return `${periodo}${textoOutros}${equilibrio}`;
}
/* === CONTEUDO DA INSTITUICAO | fim === */

/* === APOIO | inicio === */
// Marca o retorno no mes exato calculado; a interpolacao entre meses erraria onde a linha muda de inclinacao.
// Sem o valor exato, usa o cruzamento do zero na propria serie.
export function marcosNoRetorno(
  pontos: { serie: SerieGrafico; mes: number | null }[],
  rotular: (mes: number) => string = (mes) => formatarTempo(mes).toLowerCase(),
): MarcoGrafico[] {
  return pontos
    .map(({ serie, mes }) => {
      const limite = serie.valores.length - 1;
      const exato = mes !== null && mes <= limite ? mes : encontrarCruzamentoZero(serie.valores);
      return exato === null ? null : { id: serie.id, mes: exato, valor: 0, cor: serie.cor, rotulo: `${serie.nome}: ${rotular(exato)}` };
    })
    .filter((marco): marco is MarcoGrafico => marco !== null);
}

export function CabecalhoResultado<T extends string>({
  subtitulo,
  visao,
  visoes,
  aoTrocarVisao,
}: {
  subtitulo: string;
  visao: T;
  visoes: { id: T; nome: string }[];
  aoTrocarVisao: (visao: T) => void;
}): JSX.Element {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-600">{subtitulo}</p>
        <h3 data-titulo-passo tabIndex={-1} className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-slate-950 outline-none">
          Seu resultado
        </h3>
      </div>

      {/* Celular: grade de 3 colunas (6 abas = 2 linhas de 3). Tablet: uma linha na largura toda; cada aba cresce a partir do proprio texto (flex-auto), sem sobrepor nem rolar. */}
      <div role="group" aria-label="Vista do resultado" className="flex max-w-full flex-wrap rounded-2xl border border-hss-violeta/20 bg-white p-1 max-sm:grid max-sm:w-full max-sm:grid-cols-3 max-sm:gap-1 sm:w-full sm:flex-nowrap sm:rounded-full lg:w-auto">
        {visoes.map((opcao) => (
          <button
            key={opcao.id}
            type="button"
            aria-pressed={visao === opcao.id}
            onClick={() => aoTrocarVisao(opcao.id)}
            className={
              visao === opcao.id
                ? "shrink-0 whitespace-nowrap rounded-full bg-hss-roxo px-3 py-1.5 text-sm font-semibold text-white max-sm:px-1.5 max-sm:text-center max-sm:leading-tight max-sm:whitespace-normal sm:flex-auto sm:px-2 sm:text-[0.8125rem] lg:flex-none lg:px-4 lg:text-sm"
                : "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-hss-roxo max-sm:px-1.5 max-sm:text-center max-sm:leading-tight max-sm:whitespace-normal sm:flex-auto sm:px-2 sm:text-[0.8125rem] lg:flex-none lg:px-4 lg:text-sm"
            }
          >
            {opcao.nome}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BlocoHeroi({ numero, texto, children }: { numero: string; texto: string; children: ReactNode }): JSX.Element {
  return (
    <div className="grid gap-6 rounded-2xl bg-[#eef0f7] p-5 sm:p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12">
      <div aria-live="polite">
        {/* Textos longos (ex.: "Não atinge nas premissas atuais") usam corpo menor para nao estourar o bloco. */}
        <p
          className={
            numero.length > 14
              ? "text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-slate-950"
              : "text-[2.75rem] font-bold leading-none tracking-[-0.035em] text-[#075f50] tabular-nums sm:text-[3.5rem]"
          }
        >
          {numero}
        </p>
        <p className="mt-3 max-w-[40ch] text-base leading-7 text-slate-700">{texto}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export function Cartao({ titulo, descricao, children }: { titulo: string; descricao?: string; children: ReactNode }): JSX.Element {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border border-hss-violeta/15 bg-white p-4 max-lg:flex-none sm:p-5">
      <h4 className="text-base font-semibold text-slate-950">{titulo}</h4>
      {descricao ? <p className="mt-1 max-w-[80ch] text-sm leading-6 text-slate-600">{descricao}</p> : null}
      <div className="mt-4 flex min-h-0 flex-1 flex-col max-lg:flex-none">{children}</div>
    </section>
  );
}
/* === APOIO | fim === */
