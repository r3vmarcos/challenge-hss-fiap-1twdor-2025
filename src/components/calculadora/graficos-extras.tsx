import { Legenda } from "@/components/calculadora/graficos-resultado";

/* === CORES DOS GRAFICOS EXTRAS | inicio === */
// Categorias usam as cores da marca via variaveis CSS, entao acompanham o tema de cada calculadora.
export const COR_TEMA_ESCURO = "rgb(var(--hss-roxo))";
const CORES_CATEGORIAS = ["rgb(var(--hss-roxo))", "rgb(var(--hss-violeta))", "rgb(var(--hss-lavanda))", "#cbd5e1"];
const TEXTO_CATEGORIAS = ["#fff", "#fff", "#080711", "#080711"];
/* === CORES DOS GRAFICOS EXTRAS | fim === */

/* === TIPOS DOS GRAFICOS EXTRAS | inicio === */
export interface DadosComposicao {
  categorias: string[];
  linhas: { id: string; nome: string; segmentos: number[]; destaque?: boolean }[];
}

export interface DadosColunas {
  categorias: { rotulo: string; destaque?: boolean }[];
  series: { nome: string; cor: string; valores: (number | null)[] }[];
}
/* === TIPOS DOS GRAFICOS EXTRAS | fim === */

/* === GRAFICO DE COMPOSICAO | inicio === */
// Barras empilhadas na mesma escala: cada linha mostra de que partes o total e feito.
export function GraficoComposicao({ dados, formatar }: { dados: DadosComposicao; formatar: (valor: number) => string }): JSX.Element {
  const totais = dados.linhas.map((linha) => linha.segmentos.reduce((soma, valor) => soma + Math.max(0, valor), 0));
  const maior = Math.max(1, ...totais);

  return (
    <figure className="flex min-h-0 flex-1 flex-col max-lg:flex-none">
      <Legenda itens={dados.categorias.map((nome, indice) => ({ nome, cor: CORES_CATEGORIAS[indice % CORES_CATEGORIAS.length] }))} />

      <ul className="mt-5 grid gap-4">
        {dados.linhas.map((linha, indiceLinha) => (
          <li key={linha.id}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className={linha.destaque ? "font-semibold text-slate-950" : "text-slate-950"}>{linha.nome}</span>
              <span className="shrink-0 font-semibold tabular-nums text-slate-950">{formatar(totais[indiceLinha])}</span>
            </div>
            <div className="mt-1.5 flex h-8 w-full" role="img" aria-label={`${linha.nome}: ${formatar(totais[indiceLinha])}. A tabela abaixo traz cada parte.`}>
              {linha.segmentos.map((valor, indice) => {
                const largura = (Math.max(0, valor) / maior) * 100;
                if (largura <= 0) return null;
                return (
                  <span
                    key={dados.categorias[indice]}
                    title={`${dados.categorias[indice]}: ${formatar(valor)}`}
                    className="flex h-full items-center justify-center border-r-2 border-white text-[0.8125rem] font-semibold first:rounded-l-[4px] last:rounded-r-[4px] last:border-r-0"
                    style={{
                      width: `${largura}%`,
                      backgroundColor: CORES_CATEGORIAS[indice % CORES_CATEGORIAS.length],
                      color: TEXTO_CATEGORIAS[indice % TEXTO_CATEGORIAS.length],
                    }}
                  >
                    {totais[indiceLinha] > 0 && valor / totais[indiceLinha] >= 0.12 ? `${Math.round((valor / totais[indiceLinha]) * 100)}%` : ""}
                  </span>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[18rem] border-t border-hss-violeta/15 text-sm">
        <thead>
          <tr className="text-left text-[0.8125rem] text-slate-600">
            <th className="py-2 font-medium">Parte</th>
            {dados.linhas.map((linha) => (
              <th key={linha.id} className="py-2 text-right font-medium">
                {linha.nome}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.categorias.map((categoria, indice) => (
            <tr key={categoria} className="border-t border-hss-violeta/10">
              <td className="py-1.5 text-slate-950">{categoria}</td>
              {dados.linhas.map((linha) => (
                <td key={linha.id} className="py-1.5 text-right tabular-nums text-slate-950">
                  {formatar(linha.segmentos[indice] ?? 0)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  );
}
/* === GRAFICO DE COMPOSICAO | fim === */

/* === GRAFICO DE COLUNAS | inicio === */
// Colunas agrupadas com base no zero (aceita valores negativos). A categoria em destaque e a situacao atual do visitante.
export function GraficoColunas({
  dados,
  formatar,
  rotuloAria,
}: {
  dados: DadosColunas;
  formatar: (valor: number) => string;
  rotuloAria: string;
}): JSX.Element {
  const valores = dados.series.flatMap((serie) => serie.valores.filter((valor): valor is number => valor !== null));
  const maximo = Math.max(0, ...valores);
  const minimo = Math.min(0, ...valores);
  const intervalo = Math.max(1, maximo - minimo);
  const posicaoZero = (maximo / intervalo) * 100;
  const muitasColunas = dados.categorias.length > 10;

  return (
    <figure className="flex min-h-0 flex-1 flex-col max-lg:flex-none">
      {dados.series.length > 1 ? <Legenda itens={dados.series.map((serie) => ({ nome: serie.nome, cor: serie.cor }))} /> : null}

      <div className="relative mt-6 min-h-[12rem] flex-1 max-lg:h-56 max-lg:flex-none" role="img" aria-label={rotuloAria}>
        <span aria-hidden="true" className="absolute inset-x-0 border-t border-hss-roxo/35" style={{ top: `${posicaoZero}%` }} />
        <div className="absolute inset-0 flex gap-1.5 sm:gap-3">
          {dados.categorias.map((categoria, indiceCategoria) => (
            <div
              key={categoria.rotulo}
              className={["relative flex flex-1 gap-1 rounded-md px-0.5", categoria.destaque ? "bg-hss-violeta/[0.08]" : ""].join(" ")}
            >
              {dados.series.map((serie) => {
                const valor = serie.valores[indiceCategoria];
                const altura = valor === null ? 0 : (Math.abs(valor) / intervalo) * 100;
                const topo = valor === null ? posicaoZero : valor >= 0 ? posicaoZero - altura : posicaoZero;

                return (
                  <div key={serie.nome} className="relative flex-1">
                    <span
                      title={`${categoria.rotulo} · ${serie.nome}: ${valor === null ? "sem retorno" : formatar(valor)}`}
                      className={["absolute inset-x-0", valor !== null && valor < 0 ? "rounded-b-[4px]" : "rounded-t-[4px]"].join(" ")}
                      style={{ top: `${topo}%`, height: `${Math.max(valor === null ? 0 : 0.5, altura)}%`, backgroundColor: serie.cor }}
                    />
                    {!muitasColunas ? (
                      <span
                        className="absolute inset-x-[-1.5rem] text-center text-[0.8125rem] font-semibold tabular-nums text-slate-950"
                        style={valor !== null && valor < 0 ? { top: `calc(${topo + altura}% + 0.25rem)` } : { top: `calc(${topo}% - 1.35rem)` }}
                      >
                        {valor === null ? "—" : formatar(valor)}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex gap-1.5 border-t border-hss-violeta/15 pt-2 sm:gap-3">
        {dados.categorias.map((categoria) => (
          <span
            key={categoria.rotulo}
            className={["flex-1 text-center text-[0.8125rem] leading-4", categoria.destaque ? "font-semibold text-slate-950" : "text-slate-600"].join(" ")}
          >
            {categoria.rotulo}
          </span>
        ))}
      </div>
    </figure>
  );
}
/* === GRAFICO DE COLUNAS | fim === */
