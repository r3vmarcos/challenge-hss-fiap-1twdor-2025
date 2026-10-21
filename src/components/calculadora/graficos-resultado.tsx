import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from "react";
import { encontrarCruzamentoZero, formatarMoeda, formatarNumero, obterDiasComHssEtapa } from "@/services/calculosRoi";
import type { EtapaCenario } from "@/types/calculadora";

/* === CORES DOS GRAFICOS | inicio === */
// Laranja e teal da paleta do projeto. Toda serie tem legenda e rotulo direto para nao depender so da cor.
export const COR_SEM_HSS = "#f97316";
export const COR_COM_HSS = "#079879";
// Rotulos em texto usam tons mais escuros das mesmas cores, para contraste AA sobre fundo claro.
const CORES_TEXTO: Record<string, string> = { [COR_SEM_HSS]: "#c2410c", [COR_COM_HSS]: "#075f50" };
const corTexto = (cor: string): string => CORES_TEXTO[cor] ?? cor;
const COR_SEM_REDUCAO = "#aab6c5";
const COR_TINTA = "#080711";
const COR_TINTA_SECUNDARIA = "#475569";
const COR_GRADE = "rgba(41,27,127,0.08)";
const COR_BASE_ZERO = "rgba(41,27,127,0.35)";
/* === CORES DOS GRAFICOS | fim === */

/* === MEDIDA DE LARGURA | inicio === */
function useTamanho<T extends HTMLElement>(): [RefObject<T>, { largura: number; altura: number }] {
  const referencia = useRef<T>(null);
  const [tamanho, definirTamanho] = useState({ largura: 0, altura: 0 });

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return;

    const caixa = elemento.getBoundingClientRect();
    definirTamanho({ largura: caixa.width, altura: caixa.height });
    const observador = new ResizeObserver(([entrada]) =>
      definirTamanho({ largura: entrada.contentRect.width, altura: entrada.contentRect.height }),
    );
    observador.observe(elemento);

    return () => observador.disconnect();
  }, []);

  return [referencia, tamanho];
}

const formatadorCompacto = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

function passoRedondo(intervalo: number, divisoes: number): number {
  const bruto = intervalo / divisoes || 1;
  const potencia = 10 ** Math.floor(Math.log10(bruto));
  const fracao = bruto / potencia;
  const base = fracao <= 1 ? 1 : fracao <= 2 ? 2 : fracao <= 2.5 ? 2.5 : fracao <= 5 ? 5 : 10;
  return base * potencia;
}
/* === MEDIDA DE LARGURA | fim === */

/* === LEGENDA | inicio === */
export function Legenda({ itens }: { itens: { nome: string; cor: string }[] }): JSX.Element {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] text-slate-950">
      {itens.map((item) => (
        <li key={item.nome} className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.cor }} />
          {item.nome}
        </li>
      ))}
    </ul>
  );
}
/* === LEGENDA | fim === */

/* === GRAFICO DE ETAPAS NO TEMPO | inicio === */
export function GraficoEtapas({ etapas, mostrarComHss }: { etapas: EtapaCenario[]; mostrarComHss: boolean }): JSX.Element {
  const [referenciaTrilho, { largura: larguraTrilho }] = useTamanho<HTMLDivElement>();
  const totalSem = etapas.reduce((total, etapa) => total + etapa.diasSemHss, 0);
  const totalCom = etapas.reduce((total, etapa) => total + obterDiasComHssEtapa(etapa), 0);
  const escala = Math.max(1, totalSem);
  const existeEtapaSemReducao = etapas.some((etapa) => obterDiasComHssEtapa(etapa) >= etapa.diasSemHss);

  const linhas = [
    {
      id: "sem",
      nome: "Sem HSS",
      total: totalSem,
      segmentos: etapas.map((etapa, indice) => ({ indice, etapa, dias: etapa.diasSemHss, cor: COR_SEM_HSS, textoClaro: true })),
    },
    ...(mostrarComHss
      ? [
          {
            id: "com",
            nome: "Com HSS",
            total: totalCom,
            segmentos: etapas.map((etapa, indice) => {
              const dias = obterDiasComHssEtapa(etapa);
              const acelerada = dias < etapa.diasSemHss;
              return { indice, etapa, dias, cor: acelerada ? COR_COM_HSS : COR_SEM_REDUCAO, textoClaro: acelerada };
            }),
          },
        ]
      : []),
  ];

  const itensLegenda = [
    { nome: "Sem HSS", cor: COR_SEM_HSS },
    ...(mostrarComHss ? [{ nome: "Com HSS: etapa acelerada", cor: COR_COM_HSS }] : []),
    ...(mostrarComHss && existeEtapaSemReducao ? [{ nome: "Etapa que a HSS não acelera", cor: COR_SEM_REDUCAO }] : []),
  ];

  return (
    <figure>
      {itensLegenda.length > 1 ? <Legenda itens={itensLegenda} /> : null}

      <div className="mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)_3.75rem] items-center gap-x-3 gap-y-3">
        {linhas.map((linha, indiceLinha) => (
          <div key={linha.id} className="contents">
            <span className="text-sm font-medium text-slate-950">{linha.nome}</span>
            <div ref={indiceLinha === 0 ? referenciaTrilho : undefined} className="flex h-7 w-full">
              {linha.segmentos
                .filter((segmento) => segmento.dias > 0)
                .map((segmento, posicao, visiveis) => {
                  const larguraPx = (segmento.dias / escala) * larguraTrilho;
                  const descricao = `${segmento.indice + 1}. ${segmento.etapa.nome}: ${segmento.dias} dias`;

                  return (
                    <span
                      key={segmento.etapa.id}
                      title={descricao}
                      className={[
                        "flex h-full items-center justify-center border-r-2 border-white text-xs font-semibold",
                        posicao === 0 ? "rounded-l-[4px]" : "",
                        posicao === visiveis.length - 1 ? "rounded-r-[4px] border-r-0" : "",
                        segmento.textoClaro ? "text-white" : "text-slate-950",
                      ].join(" ")}
                      style={{ width: `${(segmento.dias / escala) * 100}%`, backgroundColor: segmento.cor }}
                    >
                      {larguraPx >= 24 ? segmento.indice + 1 : ""}
                    </span>
                  );
                })}
            </div>
            <span className="text-right text-sm font-semibold tabular-nums text-slate-950">{linha.total} dias</span>
          </div>
        ))}

        <span />
        <div aria-hidden="true" className="flex justify-between border-t border-hss-violeta/20 pt-1.5 text-[0.8125rem] tabular-nums text-slate-600">
          <span>0</span>
          <span>{Math.round(escala / 2)}</span>
          <span>{escala} dias</span>
        </div>
        <span />
      </div>

      <figcaption className="sr-only">
        Duração de cada etapa do credenciamento. Sem HSS: {totalSem} dias. {mostrarComHss ? `Com HSS: ${totalCom} dias.` : ""} A lista abaixo traz os
        valores de cada etapa.
      </figcaption>

      <ol className="mt-5 grid gap-x-8 gap-y-2 border-t border-hss-violeta/15 pt-4 text-sm sm:grid-cols-2">
        {etapas.map((etapa, indice) => {
          const diasCom = obterDiasComHssEtapa(etapa);

          return (
            <li key={etapa.id} className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 text-slate-950">
                <span className="font-semibold tabular-nums">{indice + 1}.</span> {etapa.nome}
              </span>
              <span className="shrink-0 tabular-nums text-slate-600">
                {mostrarComHss && diasCom < etapa.diasSemHss ? `${etapa.diasSemHss} → ${diasCom} dias` : `${etapa.diasSemHss} dias`}
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
/* === GRAFICO DE ETAPAS NO TEMPO | fim === */

/* === GRAFICO ACUMULADO | inicio === */
export interface SerieGrafico {
  id: string;
  nome: string;
  cor: string;
  valores: number[];
}

// Ponto marcado no grafico (ex.: mes em que o saldo volta a zero ou em que as linhas se cruzam).
export interface MarcoGrafico {
  id: string;
  mes: number;
  valor: number;
  cor: string;
  rotulo: string;
}

// Faixa de meses destacada ao fundo (ex.: anos de curso).
export interface FaixaGrafico {
  inicio: number;
  fim: number;
  rotulo: string;
}

export function GraficoAcumulado({
  series,
  rotuloAria,
  marcos,
  faixas = [],
  unidadeX = "mes",
}: {
  series: SerieGrafico[];
  rotuloAria: string;
  marcos?: MarcoGrafico[];
  faixas?: FaixaGrafico[];
  unidadeX?: "mes" | "ano";
}): JSX.Element {
  const [referencia, { largura, altura: alturaDisponivel }] = useTamanho<HTMLDivElement>();
  const [indiceFoco, definirIndiceFoco] = useState<number | null>(null);
  const [verTabela, definirVerTabela] = useState(false);

  const meses = Math.max(1, ...series.map((serie) => serie.valores.length - 1));
  const valores = series.flatMap((serie) => serie.valores);
  const minimoBruto = Math.min(0, ...valores);
  const maximoBruto = Math.max(0, ...valores);
  // Poucas marcas (3 divisoes) para o grafico respirar.
  const passo = passoRedondo(maximoBruto - minimoBruto, 3);
  const minimo = Math.floor(minimoBruto / passo) * passo;
  const maximo = Math.max(passo, Math.ceil(maximoBruto / passo) * passo);
  const marcasY: number[] = [];
  for (let valor = minimo; valor <= maximo + passo / 2; valor += passo) marcasY.push(valor);

  const passoX = unidadeX === "ano" ? (meses <= 180 ? 48 : meses <= 300 ? 96 : 120) : meses <= 12 ? 6 : meses <= 24 ? 12 : 24;
  const marcasX: number[] = [];
  for (let mes = 0; mes <= meses; mes += passoX) marcasX.push(mes);
  if (marcasX[marcasX.length - 1] !== meses && meses - marcasX[marcasX.length - 1] >= passoX / 2) marcasX.push(meses);
  const rotuloX = (mes: number): string =>
    mes === 0 ? "início" : unidadeX === "ano" ? `ano ${formatarNumero(mes / 12)}` : `mês ${mes}`;
  const rotuloMesFoco = (mes: number): string =>
    mes === 0 ? "Início" : unidadeX === "ano" ? `Mês ${mes} (ano ${formatarNumero(mes / 12)})` : `Mês ${mes}`;

  const altura = Math.max(180, Math.floor(alturaDisponivel));
  const rotulosFinais = largura >= 520;
  const margem = { topo: 16, direita: rotulosFinais ? 118 : 16, base: 32, esquerda: 64 };
  const larguraPlot = Math.max(10, largura - margem.esquerda - margem.direita);
  const alturaPlot = altura - margem.topo - margem.base;
  const x = (mes: number): number => margem.esquerda + (mes / meses) * larguraPlot;
  const y = (valor: number): number => margem.topo + ((maximo - valor) / (maximo - minimo)) * alturaPlot;

  // Rotulos no fim de cada linha (nome + valor); se ficarem perto demais, afasta um do outro em vez de esconder.
  const finais = series.map((serie) => y(serie.valores[serie.valores.length - 1] ?? 0));
  const posicoesRotulo = [...finais];
  if (posicoesRotulo.length === 2 && Math.abs(posicoesRotulo[0] - posicoesRotulo[1]) < 34) {
    const meio = (posicoesRotulo[0] + posicoesRotulo[1]) / 2;
    const acima = posicoesRotulo[0] <= posicoesRotulo[1] ? 0 : 1;
    posicoesRotulo[acima] = meio - 17;
    posicoesRotulo[1 - acima] = meio + 17;
  }

  // Area entre as duas linhas: a diferenca entre sem e com HSS, sombreada.
  const areaDiferenca =
    series.length === 2
      ? [
          ...series[0].valores.map((valor, mes) => `${mes === 0 ? "M" : "L"}${x(mes)},${y(valor)}`),
          ...series[1].valores.map((valor, mes) => [mes, valor] as const).reverse().map(([mes, valor]) => `L${x(mes)},${y(valor)}`),
          "Z",
        ].join(" ")
      : null;

  // Sem marcos explicitos, marca o mes em que cada serie volta a zero.
  const pontosMarcados: MarcoGrafico[] =
    marcos ??
    series
      .map((serie) => {
        const mes = encontrarCruzamentoZero(serie.valores);
        return mes === null ? null : { id: serie.id, cor: serie.cor, mes, valor: 0, rotulo: "" };
      })
      .filter((item): item is MarcoGrafico => item !== null);

  function aoMoverPonteiro(evento: PointerEvent<SVGSVGElement>): void {
    const caixa = evento.currentTarget.getBoundingClientRect();
    const posicao = (evento.clientX - caixa.left - margem.esquerda) / larguraPlot;
    definirIndiceFoco(Math.min(meses, Math.max(0, Math.round(posicao * meses))));
  }

  function aoTeclar(evento: KeyboardEvent<SVGSVGElement>): void {
    if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
    evento.preventDefault();
    const atual = indiceFoco ?? 0;
    definirIndiceFoco(Math.min(meses, Math.max(0, atual + (evento.key === "ArrowRight" ? 1 : -1))));
  }

  const larguraDica = 188;
  const esquerdaDica =
    indiceFoco === null ? 0 : Math.min(Math.max(0, x(indiceFoco) - larguraDica / 2), Math.max(0, largura - larguraDica));

  return (
    <figure className="flex min-h-0 flex-1 flex-col max-lg:flex-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {series.length > 1 && !rotulosFinais ? <Legenda itens={series.map((serie) => ({ nome: serie.nome, cor: serie.cor }))} /> : <span />}
        <button
          type="button"
          onClick={() => definirVerTabela(!verTabela)}
          className="text-sm font-semibold text-hss-roxo underline-offset-4 hover:underline"
        >
          {verTabela ? "Ver gráfico" : unidadeX === "ano" ? "Ver tabela ano a ano" : "Ver tabela mês a mês"}
        </button>
      </div>

      <div ref={referencia} className={verTabela ? "relative mt-3 hidden" : "relative mt-3 min-h-[180px] flex-1 max-lg:h-64 max-lg:flex-none"}>
        {largura > 0 && !verTabela ? (
          <svg
            width={largura}
            height={altura}
            role="img"
            aria-label={`${rotuloAria} Use as setas para percorrer os meses; a tabela abaixo traz todos os valores.`}
            tabIndex={0}
            onPointerMove={aoMoverPonteiro}
            onPointerLeave={() => definirIndiceFoco(null)}
            onFocus={() => definirIndiceFoco(meses)}
            onBlur={() => definirIndiceFoco(null)}
            onKeyDown={aoTeclar}
            className="absolute inset-0 block touch-none rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-violeta"
          >
            {faixas.map((faixa) => (
              <g key={faixa.rotulo}>
                <rect
                  x={x(Math.max(0, faixa.inicio))}
                  y={margem.topo}
                  width={Math.max(0, x(Math.min(meses, faixa.fim)) - x(Math.max(0, faixa.inicio)))}
                  height={alturaPlot}
                  fill="rgba(41,27,127,0.05)"
                />
                <text x={x(Math.max(0, faixa.inicio)) + 8} y={margem.topo + 14} fontSize={12} fontWeight={600} fill={COR_TINTA_SECUNDARIA}>
                  {faixa.rotulo}
                </text>
              </g>
            ))}

            {marcasY.map((valor) => (
              <g key={valor}>
                <line
                  x1={margem.esquerda}
                  x2={margem.esquerda + larguraPlot}
                  y1={y(valor)}
                  y2={y(valor)}
                  stroke={valor === 0 ? COR_BASE_ZERO : COR_GRADE}
                  strokeWidth={1}
                />
                <text x={margem.esquerda - 8} y={y(valor)} dy="0.32em" textAnchor="end" fontSize={12} fill={COR_TINTA_SECUNDARIA}>
                  {formatadorCompacto.format(valor)}
                </text>
              </g>
            ))}

            {marcasX.map((mes) => (
              <text key={mes} x={x(mes)} y={altura - 10} textAnchor="middle" fontSize={12} fill={COR_TINTA_SECUNDARIA}>
                {rotuloX(mes)}
              </text>
            ))}

            {areaDiferenca ? <path d={areaDiferenca} fill={COR_COM_HSS} fillOpacity={0.1} stroke="none" /> : null}

            {series.map((serie) => (
              <path
                key={serie.id}
                d={serie.valores.map((valor, mes) => `${mes === 0 ? "M" : "L"}${x(mes)},${y(valor)}`).join(" ")}
                fill="none"
                stroke={serie.cor}
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {pontosMarcados.map((marco, indice) => (
              <g key={marco.id}>
                <line
                  x1={x(marco.mes)}
                  x2={x(marco.mes)}
                  y1={y(marco.valor)}
                  y2={margem.topo + alturaPlot}
                  stroke={marco.cor}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <circle cx={x(marco.mes)} cy={y(marco.valor)} r={5} fill={marco.cor} stroke="#fff" strokeWidth={2} />
                {marco.rotulo ? (
                  <text
                    x={x(marco.mes)}
                    y={y(marco.valor) + (indice % 2 === 0 ? -12 : 20)}
                    textAnchor={x(marco.mes) > margem.esquerda + larguraPlot * 0.8 ? "end" : x(marco.mes) < margem.esquerda + larguraPlot * 0.2 ? "start" : "middle"}
                    fontSize={12}
                    fontWeight={600}
                    fill={corTexto(marco.cor)}
                    paintOrder="stroke"
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    {marco.rotulo}
                  </text>
                ) : null}
              </g>
            ))}

            {series.map((serie, indice) => {
              const ultimo = serie.valores[serie.valores.length - 1] ?? 0;
              return (
                <g key={`${serie.id}-fim`}>
                  <circle cx={x(meses)} cy={y(ultimo)} r={4} fill={serie.cor} stroke="#fff" strokeWidth={2} />
                  {rotulosFinais ? (
                    <text x={x(meses) + 10} y={posicoesRotulo[indice]} fontSize={12} fontWeight={600} fill={corTexto(serie.cor)}>
                      <tspan x={x(meses) + 10} dy="-0.25em">
                        {serie.nome}
                      </tspan>
                      <tspan x={x(meses) + 10} dy="1.2em" fill={COR_TINTA}>
                        {formatadorCompacto.format(ultimo)}
                      </tspan>
                    </text>
                  ) : null}
                </g>
              );
            })}

            {indiceFoco !== null ? (
              <g pointerEvents="none">
                <line x1={x(indiceFoco)} x2={x(indiceFoco)} y1={margem.topo} y2={margem.topo + alturaPlot} stroke={COR_BASE_ZERO} strokeWidth={1} />
                {series.map((serie) => (
                  <circle
                    key={`${serie.id}-foco`}
                    cx={x(indiceFoco)}
                    cy={y(serie.valores[indiceFoco] ?? 0)}
                    r={5}
                    fill={serie.cor}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </g>
            ) : null}
          </svg>
        ) : null}

        {indiceFoco !== null && largura > 0 ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 rounded-xl border border-hss-violeta/15 bg-white px-3 py-2 text-[0.8125rem] shadow-suave"
            style={{ left: esquerdaDica, width: larguraDica }}
          >
            <p className="font-semibold text-slate-950">{rotuloMesFoco(indiceFoco)}</p>
            {series.map((serie) => (
              <p key={serie.id} className="mt-1 flex items-center justify-between gap-2 text-slate-950">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: serie.cor }} />
                  {serie.nome}
                </span>
                <span className="font-semibold tabular-nums">{formatarMoeda(serie.valores[indiceFoco] ?? 0)}</span>
              </p>
            ))}
          </div>
        ) : null}
      </div>

      {verTabela ? (
        // A tabela e a alternativa acessivel ao grafico; so ela pode rolar, e apenas em periodos longos.
        <div className="mt-3 min-h-0 flex-1 overflow-auto rounded-xl border border-hss-violeta/15 max-lg:max-h-80 max-lg:flex-none">
          <table className="w-full text-left text-[0.8125rem]">
            <thead className="sticky top-0 bg-[#eef0f7] text-slate-950">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {unidadeX === "ano" ? "Ano" : "Mês"}
                </th>
                {series.map((serie) => (
                  <th key={serie.id} scope="col" className="px-3 py-2 text-right font-semibold">
                    {serie.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums text-slate-950">
              {/* Em anos, a tabela mostra um valor a cada 12 meses. */}
              {Array.from({ length: meses + 1 }, (_, mes) => mes)
                .filter((mes) => unidadeX === "mes" || mes % 12 === 0 || mes === meses)
                .map((mes) => (
                <tr key={mes} className="border-t border-hss-violeta/15">
                  <th scope="row" className="px-3 py-1 font-medium">
                    {unidadeX === "ano" ? (mes === 0 ? "Início" : `Ano ${formatarNumero(mes / 12)}`) : mes === 0 ? "Início" : mes}
                  </th>
                  {series.map((serie) => (
                    <td key={serie.id} className="px-3 py-1 text-right">
                      {formatarMoeda(serie.valores[mes] ?? 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </figure>
  );
}
/* === GRAFICO ACUMULADO | fim === */

/* === GRAFICO DE BARRAS | inicio === */
export function GraficoBarras({ itens, cor }: { itens: { rotulo: string; valor: number; detalhe?: string }[]; cor: string }): JSX.Element {
  const maior = Math.max(1, ...itens.map((item) => Math.abs(item.valor)));

  return (
    <ul className="grid gap-5">
      {itens.map((item) => (
        <li key={item.rotulo}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-slate-950">{item.rotulo}</span>
            <span className="shrink-0 font-semibold tabular-nums text-slate-950">{formatarMoeda(item.valor)}</span>
          </div>
          {item.detalhe ? <p className="text-[0.8125rem] leading-5 text-slate-600">{item.detalhe}</p> : null}
          <div className="mt-1.5 h-3 w-full" aria-hidden="true">
            <div
              className="h-full rounded-r-[4px]"
              style={{ width: `${Math.max(item.valor > 0 ? 1 : 0, (Math.abs(item.valor) / maior) * 100)}%`, backgroundColor: cor }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
/* === GRAFICO DE BARRAS | fim === */
