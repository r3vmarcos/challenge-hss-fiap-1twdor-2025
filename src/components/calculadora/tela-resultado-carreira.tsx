import { useMemo, useState } from "react";
import { COR_TEMA_ESCURO, GraficoColunas, GraficoComposicao } from "@/components/calculadora/graficos-extras";
import { GraficoAcumulado, type SerieGrafico } from "@/components/calculadora/graficos-resultado";
import { TabelaMemoria } from "@/components/calculadora/tabela-memoria";
import { BlocoHeroi, CabecalhoResultado, Cartao, marcosNoRetorno } from "@/components/calculadora/tela-resultado";
import { comAtendimentosDe, FAIXA_GANHO_MERCADO, PERFIS_CARREIRA } from "@/data/carreiraMedica";
import { calcularCarreira, calcularMesesComRenda, projetarCarreira } from "@/services/calculosCarreira";
import { formatarMoeda, formatarNumero, formatarTempo } from "@/services/calculosRoi";
import { ID_PERFIL_IA } from "@/services/iaCenarios";
import { montarMemoriaCarreira } from "@/services/memoriaCalculo";
import type { PerfilCarreira, PremissasCarreira, ResultadoCarreira } from "@/types/calculadora";

/* === CONSTANTES DA TELA DE CARREIRA | inicio === */
type VisaoCarreira = "resumo" | "grafico" | "ano-a-ano" | "ganho" | "composicao" | "calculo";

const VISOES: { id: VisaoCarreira; nome: string }[] = [
  { id: "resumo", nome: "Resumo" },
  { id: "grafico", nome: "Tempo × gasto" },
  { id: "ano-a-ano", nome: "Ano a ano" },
  { id: "ganho", nome: "Seu ganho" },
  { id: "composicao", nome: "Composição" },
  { id: "calculo", nome: "Cálculo" },
];

// A carreira nao compara fluxos sem/com HSS: a serie usa a cor da marca, nao o verde/laranja semanticos.
const COR_SALDO = "#291B7F";
const COR_FAIXA = "#aab6c5";
// Partes do investimento em tons da marca: sao categorias de um mesmo total.
const CORES_COMPOSICAO = ["#291B7F", "#4B32D8", "#8D7BFF", "#CFCAF2"];
const COR_TEXTO_CLARO = ["#fff", "#fff", "#080711", "#080711"];
/* === CONSTANTES DA TELA DE CARREIRA | fim === */

/* === TELA DE RESULTADO DA CARREIRA | inicio === */
// Tempo de retorno do investimento na formacao com o ganho liquido calculado a partir dos atendimentos.
export function TelaResultadoCarreira({
  perfil,
  premissas,
  editado,
}: {
  perfil: PerfilCarreira;
  premissas: PremissasCarreira;
  editado: boolean;
}): JSX.Element {
  const [visao, definirVisao] = useState<VisaoCarreira>("resumo");
  const resultado = useMemo(() => calcularCarreira(premissas), [premissas]);
  const projecao = useMemo(() => projetarCarreira(premissas, resultado), [premissas, resultado]);
  const memoria = useMemo(() => montarMemoriaCarreira(resultado, premissas), [resultado, premissas]);

  const serie: SerieGrafico = { id: "saldo", nome: "Seu saldo", cor: COR_SALDO, valores: projecao };
  const marcos = marcosNoRetorno([{ serie, mes: resultado.retornoDesdeIngressoMeses }], (mes) => `retorno no ano ${formatarNumero(mes / 12)}`);

  const indicadores = [
    { rotulo: "Investimento na formação", valor: formatarMoeda(resultado.investimentoTotal), detalhe: `${formatarNumero(resultado.mesesCurso / 12)} anos de curso.` },
    {
      rotulo: "Retorno desde o ingresso",
      valor: formatarTempo(resultado.retornoDesdeIngressoMeses),
      detalhe: "Curso, primeiro pagamento e tempo para pagar a formação.",
    },
    {
      rotulo: "Custo médio por mês de curso",
      valor: formatarMoeda(resultado.investimentoTotal / resultado.mesesCurso),
      detalhe: editado
        ? "Com os valores que você ajustou."
        : perfil.id === ID_PERFIL_IA
          ? "Com os valores montados pela IA."
          : `Referência do estudo para este perfil: ${formatarMoeda(perfil.investimentoReferencia)} no total.`,
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 max-lg:flex-none">
      <CabecalhoResultado subtitulo={`Carreira médica: ${perfil.nome}`} visao={visao} visoes={VISOES} aoTrocarVisao={definirVisao} />

      {visao === "resumo" ? (
        <div className="flex min-h-0 flex-1 flex-col [justify-content:safe_center] gap-4 max-lg:flex-none">
          <BlocoHeroi
            numero={resultado.mesesPagarFormacao === null ? "Sem sobra no mês" : formatarTempo(resultado.mesesPagarFormacao)}
            texto={
              resultado.mesesPagarFormacao === null
                ? `O ganho líquido de ${formatarMoeda(resultado.rendaLiquidaMensal)} por mês não cobre o custo de vida de ${formatarMoeda(
                    resultado.custoVidaFormado,
                  )}. Ajuste os atendimentos ou o custo de vida para ver o tempo de retorno.`
                : `de profissão para o retorno do investimento de ${formatarMoeda(resultado.investimentoTotal)}. Você ganha ${formatarMoeda(
                    resultado.rendaLiquidaMensal,
                  )} líquidos por mês e, depois do custo de vida de ${formatarMoeda(resultado.custoVidaFormado)}, sobram ${formatarMoeda(
                    resultado.sobraMensal,
                  )} para pagar a formação.`
            }
          >
            <FaixaMercado resultado={resultado} rendaAtual={resultado.rendaLiquidaMensal} />
          </BlocoHeroi>

          <dl className="grid gap-3 sm:grid-cols-3">
            {indicadores.map((indicador) => (
              <div key={indicador.rotulo} className="rounded-2xl border border-hss-violeta/15 bg-white p-4">
                <dt className="text-sm text-slate-600">{indicador.rotulo}</dt>
                <dd className="mt-1.5 text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-slate-950">{indicador.valor}</dd>
                <dd className="mt-1 text-[0.8125rem] leading-5 text-slate-600">{indicador.detalhe}</dd>
              </div>
            ))}
          </dl>

          <p className="text-[0.8125rem] leading-5 text-slate-600">
            Fonte: estudo de custos da graduação em medicina 2025-2026 (ganho líquido do generalista de R$ 10 mil a R$ 15 mil por mês). Valores nominais, sem
            inflação sobre o ganho. Simulação, não é promessa de resultado.
          </p>
        </div>
      ) : null}

      {visao === "grafico" ? (
        <Cartao
          titulo="Tempo × gasto: seu saldo desde o ingresso no curso"
          descricao="O saldo desce durante o curso (mensalidades, custo de vida, materiais e preparatório) e sobe com o ganho depois de formado, já descontado o custo de vida. O ponto no zero marca o retorno do investimento."
        >
          <GraficoAcumulado
            series={[serie]}
            marcos={marcos}
            faixas={[{ inicio: 0, fim: resultado.mesesCurso, rotulo: `Curso (${formatarNumero(resultado.mesesCurso / 12)} anos)` }]}
            unidadeX="ano"
            rotuloAria="Saldo acumulado da carreira médica desde o ingresso no curso."
          />
          <p className="mt-3 border-t border-hss-violeta/15 pt-3 text-sm text-slate-700">
            Maior gasto acumulado, na formatura: {formatarMoeda(resultado.investimentoTotal)}. Sobrando {formatarMoeda(resultado.sobraMensal)} por mês
            (ganho líquido menos custo de vida), o saldo volta a zero {formatarTempo(resultado.mesesPagarFormacao).toLowerCase()} depois do primeiro pagamento.
          </p>
        </Cartao>
      ) : null}

      {visao === "ano-a-ano" ? <VistaAnoAAno projecao={projecao} resultado={resultado} /> : null}

      {visao === "ganho" ? <VistaGanho resultado={resultado} /> : null}

      {visao === "composicao" ? <VistaComposicao resultado={resultado} premissas={premissas} perfilAtual={perfil.id} /> : null}

      {visao === "calculo" ? (
        <Cartao titulo="A conta, passo a passo" descricao="Cada linha usa os valores que você informou (ou os do perfil escolhido).">
          <TabelaMemoria linhas={memoria} />
        </Cartao>
      ) : null}
    </div>
  );
}
/* === TELA DE RESULTADO DA CARREIRA | fim === */

/* === FAIXA DE GANHO DO MERCADO | inicio === */
// Tempo de retorno no inicio, na media e no topo da faixa de ganho do mercado, junto do ganho calculado (em destaque).
function FaixaMercado({ resultado, rendaAtual }: { resultado: ResultadoCarreira; rendaAtual: number }): JSX.Element {
  const linhas = [
    ...FAIXA_GANHO_MERCADO.map((faixa) => ({ ...faixa, atual: false })),
    { id: "seu", rotulo: "Seus atendimentos", valor: rendaAtual, atual: true },
  ]
    .map((linha) => ({ ...linha, meses: calcularMesesComRenda(resultado, linha.valor) }))
    .sort((a, b) => a.valor - b.valor);
  const maior = Math.max(1, ...linhas.map((linha) => linha.meses ?? 0));

  return (
    <figure>
      <p className="mb-3 text-sm font-semibold text-slate-950">Tempo de retorno conforme o ganho mensal</p>
      <ul className="grid gap-3">
        {linhas.map((linha) => (
          <li key={linha.id}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className={linha.atual ? "font-semibold text-slate-950" : "text-slate-950"}>
                {linha.rotulo}: {formatarMoeda(linha.valor)}
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-slate-950">{formatarTempo(linha.meses)}</span>
            </div>
            <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-hss-violeta/[0.07]" aria-hidden="true">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{ width: `${((linha.meses ?? 0) / maior) * 100}%`, backgroundColor: linha.atual ? COR_SALDO : COR_FAIXA }}
              />
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 text-[0.8125rem] leading-5 text-slate-600">Com o mesmo custo de vida: quanto maior o ganho, menor o tempo para recuperar o investimento.</figcaption>
    </figure>
  );
}
/* === FAIXA DE GANHO DO MERCADO | fim === */

/* === VISTA DE COMPOSICAO | inicio === */
function VistaComposicao({
  resultado,
  premissas,
  perfilAtual,
}: {
  resultado: ResultadoCarreira;
  premissas: PremissasCarreira;
  perfilAtual: string;
}): JSX.Element {
  const partes = [
    { nome: "Mensalidades", valor: resultado.totalMensalidades },
    { nome: "Custo de vida", valor: resultado.totalCustoVida },
    { nome: "Materiais e equipamentos", valor: resultado.materiais },
    { nome: "Preparatório de residência", valor: resultado.preparatorio },
  ];
  const total = Math.max(1, resultado.investimentoTotal);

  // Os quatro perfis do estudo com o mesmo ganho informado, para comparar o tempo de retorno.
  // O perfil escolhido usa os valores que o visitante editou.
  const perfis = PERFIS_CARREIRA.map((perfil) => {
    if (perfil.id === perfilAtual) {
      return { id: perfil.id, nome: perfil.nome, investimento: resultado.investimentoTotal, meses: resultado.mesesPagarFormacao };
    }
    const calculo = calcularCarreira(comAtendimentosDe(perfil.premissas, premissas));
    return { id: perfil.id, nome: perfil.nome, investimento: calculo.investimentoTotal, meses: calculo.mesesPagarFormacao };
  });
  const maiorInvestimento = Math.max(1, ...perfis.map((perfil) => perfil.investimento));

  return (
    <div className="grid min-h-0 flex-1 gap-5 max-lg:flex-none lg:grid-cols-2">
      <Cartao titulo="Para onde vai o investimento" descricao={`Total de ${formatarMoeda(resultado.investimentoTotal)} nos anos de curso.`}>
        <div className="flex h-8 w-full overflow-hidden rounded-lg" role="img" aria-label="Composição do investimento; a lista abaixo traz os valores.">
          {partes.map((parte, indice) =>
            parte.valor > 0 ? (
              <span
                key={parte.nome}
                className="flex items-center justify-center border-r-2 border-white text-xs font-semibold last:border-r-0"
                style={{ width: `${(parte.valor / total) * 100}%`, backgroundColor: CORES_COMPOSICAO[indice], color: COR_TEXTO_CLARO[indice] }}
              >
                {parte.valor / total >= 0.08 ? `${Math.round((parte.valor / total) * 100)}%` : ""}
              </span>
            ) : null,
          )}
        </div>
        <ul className="mt-5 grid gap-3">
          {partes.map((parte, indice) => (
            <li key={parte.nome} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-slate-950">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CORES_COMPOSICAO[indice] }} />
                {parte.nome}
              </span>
              <span className="shrink-0 tabular-nums text-slate-950">
                <strong className="font-semibold">{formatarMoeda(parte.valor)}</strong>
                <span className="ml-2 text-slate-600">{formatarNumero((parte.valor / total) * 100)}%</span>
              </span>
            </li>
          ))}
        </ul>
      </Cartao>

      <Cartao
        titulo="Os quatro perfis do estudo"
        descricao={`Investimento e tempo de retorno, todos com o ganho de ${formatarMoeda(resultado.rendaLiquidaMensal)} por mês e o custo de vida de cada perfil depois de formado.`}
      >
        <ul className="grid gap-4">
          {perfis.map((perfil) => {
            const atual = perfil.id === perfilAtual;
            return (
              <li key={perfil.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className={atual ? "font-semibold text-slate-950" : "text-slate-950"}>
                    {perfil.nome}
                    {atual ? <span className="ml-2 text-[0.8125rem] font-semibold text-hss-roxo">seu perfil</span> : null}
                  </span>
                  <span className="shrink-0 tabular-nums text-slate-950">
                    <strong className="font-semibold">{formatarMoeda(perfil.investimento)}</strong>
                    <span className="ml-2 text-slate-600">{perfil.meses === null ? "sem retorno" : formatarTempo(perfil.meses)}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-3 w-full" aria-hidden="true">
                  <div
                    className="h-full rounded-r-[4px]"
                    style={{ width: `${(perfil.investimento / maiorInvestimento) * 100}%`, backgroundColor: atual ? COR_SALDO : COR_FAIXA }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Cartao>
    </div>
  );
}
/* === VISTA DE COMPOSICAO | fim === */

/* === VISTA ANO A ANO | inicio === */
// Saldo no fim de cada ano desde o ingresso: negativo durante o curso, volta a subir com o ganho depois de formado.
function VistaAnoAAno({ projecao, resultado }: { projecao: number[]; resultado: ResultadoCarreira }): JSX.Element {
  const anos = Math.max(1, Math.ceil((projecao.length - 1) / 12));
  const anoRetorno = resultado.retornoDesdeIngressoMeses === null ? null : Math.ceil(resultado.retornoDesdeIngressoMeses / 12);
  const valores = Array.from({ length: anos }, (_, indice) => projecao[Math.min(projecao.length - 1, (indice + 1) * 12)] ?? 0);
  const anosCurso = Math.round(resultado.mesesCurso / 12);

  return (
    <Cartao
      titulo="Seu saldo no fim de cada ano"
      descricao={`Desde o ingresso no curso. Os ${formatarNumero(anosCurso)} primeiros anos são de curso; a coluna destacada é o ano em que o saldo volta a zero.`}
    >
      <GraficoColunas
        dados={{
          categorias: valores.map((_, indice) => ({ rotulo: `${indice + 1}º`, destaque: indice + 1 === anoRetorno })),
          series: [{ nome: "Saldo", cor: COR_TEMA_ESCURO, valores }],
        }}
        formatar={formatarMoeda}
        rotuloAria="Saldo acumulado no fim de cada ano desde o ingresso no curso."
      />
      <p className="mt-3 border-t border-hss-violeta/15 pt-3 text-sm text-slate-700">
        {anoRetorno === null
          ? "Com as premissas atuais o saldo não volta a zero no período mostrado."
          : `O saldo fica positivo no ${anoRetorno}º ano depois do ingresso. No pior momento, a formatura, o saldo é de ${formatarMoeda(-resultado.investimentoTotal)}.`}
      </p>
    </Cartao>
  );
}
/* === VISTA ANO A ANO | fim === */

/* === VISTA DO GANHO | inicio === */
// Quanto do ganho liquido mensal vai para o custo de vida e quanto sobra para pagar a formacao, no seu caso e na faixa do mercado.
function VistaGanho({ resultado }: { resultado: ResultadoCarreira }): JSX.Element {
  const custoVida = resultado.custoVidaFormado;
  const linhas = [
    ...FAIXA_GANHO_MERCADO.map((faixa) => ({ id: faixa.id, nome: `${faixa.rotulo}`, renda: faixa.valor, destaque: false })),
    { id: "seu", nome: "Seus atendimentos", renda: resultado.rendaLiquidaMensal, destaque: true },
  ].sort((a, b) => a.renda - b.renda);

  return (
    <Cartao
      titulo="Para onde vai o ganho de cada mês"
      descricao={`Ganho líquido mensal dividido entre o custo de vida (${formatarMoeda(custoVida)}) e o que sobra para pagar a formação, comparado à faixa do mercado.`}
    >
      <GraficoComposicao
        dados={{
          categorias: ["Custo de vida", "Sobra para pagar a formação"],
          linhas: linhas.map((linha) => ({
            id: linha.id,
            nome: linha.nome,
            segmentos: [Math.min(custoVida, linha.renda), Math.max(0, linha.renda - custoVida)],
            destaque: linha.destaque,
          })),
        }}
        formatar={formatarMoeda}
      />
      <p className="mt-3 border-t border-hss-violeta/15 pt-3 text-sm text-slate-700">
        {resultado.sobraMensal > 0
          ? `Sobram ${formatarMoeda(resultado.sobraMensal)} por mês: ${formatarNumero((resultado.sobraMensal / Math.max(1, resultado.rendaLiquidaMensal)) * 100)}% do seu ganho vai para pagar a formação.`
          : "Com as premissas atuais o ganho não cobre o custo de vida, então nada sobra para pagar a formação."}
      </p>
    </Cartao>
  );
}
/* === VISTA DO GANHO | fim === */
