import type { ItemComparativo } from "@/types/calculadora";

/* === CORES DA REGUA | inicio === */
const COR_SEM = "#f97316";
const COR_COM = "#079879";
// Texto em tons mais escuros das mesmas cores, para contraste AA sobre fundo claro.
const COR_SEM_TEXTO = "#c2410c";
const COR_COM_TEXTO = "#075f50";
// Mesma hachura da regua de prazos: verde quando a HSS melhora o item, laranja quando piora.
const HACHURA_MELHORA = "repeating-linear-gradient(135deg, rgba(7,152,121,0.2) 0 4px, transparent 4px 9px)";
const HACHURA_PIORA = "repeating-linear-gradient(135deg, rgba(249,115,22,0.2) 0 4px, transparent 4px 9px)";
/* === CORES DA REGUA | fim === */

/* === CALCULO DA DIFERENCA | inicio === */
interface Diferenca {
  valor: number;
  melhorou: boolean;
  texto: string;
}

export function calcularDiferenca(item: Pick<ItemComparativo, "semHss" | "comHss" | "formatar" | "menorMelhor">): Diferenca {
  const valor = Math.abs(item.semHss - item.comHss);
  const melhorou = item.menorMelhor ? item.comHss < item.semHss : item.comHss > item.semHss;
  const texto = valor < 1e-9 ? "Igual nos dois fluxos" : `${item.formatar(valor)} ${item.comHss < item.semHss ? "a menos" : "a mais"} com HSS`;
  return { valor, melhorou, texto };
}
/* === CALCULO DA DIFERENCA | fim === */

/* === REGUA DE DIFERENCA | inicio === */
// Duas barras na mesma escala (Sem HSS em cima, Com HSS embaixo). A faixa hachurada na linha Com HSS vai do valor
// com HSS ao valor sem HSS: e a diferenca entre os dois fluxos, medida na propria regua.
export function ReguaDiferenca({
  item,
  tamanho = "normal",
}: {
  item: Pick<ItemComparativo, "rotulo" | "semHss" | "comHss" | "formatar" | "menorMelhor">;
  tamanho?: "normal" | "grande";
}): JSX.Element {
  const sem = Math.max(0, item.semHss);
  const com = Math.max(0, item.comHss);
  const escala = Math.max(sem, com) || 1;
  const diferenca = calcularDiferenca(item);
  const inicioFaixa = (Math.min(sem, com) / escala) * 100;
  const larguraFaixa = (Math.abs(sem - com) / escala) * 100;
  const grande = tamanho === "grande";
  const alturaBarra = grande ? "h-7" : "h-2.5";
  const rotuloNaFaixa = grande && larguraFaixa >= 20 && diferenca.valor > 0;

  const linhas = [
    { id: "sem", nome: "Sem HSS", valor: sem, cor: COR_SEM, corTexto: COR_SEM_TEXTO },
    { id: "com", nome: "Com HSS", valor: com, cor: COR_COM, corTexto: COR_COM_TEXTO },
  ];

  return (
    <figure>
      <div className={grande ? "grid gap-3" : "grid gap-1.5"}>
        {linhas.map((linha) => (
          <div key={linha.id}>
            <div className="flex items-baseline justify-between gap-3">
              <span className={grande ? "text-[0.9375rem] font-medium text-slate-950" : "text-[0.8125rem] text-slate-600"}>{linha.nome}</span>
              <span className={grande ? "text-[1.0625rem] font-bold tabular-nums" : "text-[0.8125rem] font-semibold tabular-nums"} style={{ color: linha.corTexto }}>
                {item.formatar(linha.valor)}
              </span>
            </div>
            <div className={`relative mt-1 w-full overflow-hidden rounded-full bg-hss-violeta/[0.07] ${alturaBarra}`} aria-hidden="true">
              <span
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
                style={{ width: `${(linha.valor / escala) * 100}%`, backgroundColor: linha.cor }}
              />
              {linha.id === "com" && larguraFaixa > 0 ? (
                <span
                  className="absolute inset-y-0 flex items-center justify-center overflow-hidden whitespace-nowrap border-x border-dashed text-[0.8125rem] font-bold tabular-nums"
                  style={{
                    left: `${inicioFaixa}%`,
                    width: `${larguraFaixa}%`,
                    backgroundImage: diferenca.melhorou ? HACHURA_MELHORA : HACHURA_PIORA,
                    borderColor: diferenca.melhorou ? COR_COM : COR_SEM,
                    color: diferenca.melhorou ? COR_COM_TEXTO : COR_SEM_TEXTO,
                    // Quando a barra com HSS e a maior, a faixa fica por cima dela: clareia para a hachura aparecer.
                    backgroundColor: com > sem ? "rgba(255,255,255,0.55)" : undefined,
                  }}
                >
                  {rotuloNaFaixa ? item.formatar(diferenca.valor) : ""}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <figcaption
        className={["font-semibold", grande ? "mt-3 text-[0.9375rem]" : "mt-1.5 text-[0.8125rem]"].join(" ")}
        style={{ color: diferenca.valor < 1e-9 ? "#475569" : diferenca.melhorou ? COR_COM_TEXTO : COR_SEM_TEXTO }}
      >
        {diferenca.texto}
      </figcaption>
    </figure>
  );
}
/* === REGUA DE DIFERENCA | fim === */

/* === GRADE DE COMPARATIVOS | inicio === */
// Cada cartao compara o mesmo item nos dois fluxos.
export function ComparativoItens({ itens, colunas = 3 }: { itens: ItemComparativo[]; colunas?: 2 | 3 }): JSX.Element {
  return (
    <ul className={["grid gap-x-8 gap-y-4 sm:grid-cols-2", colunas === 3 ? "xl:grid-cols-3" : ""].join(" ")}>
      {itens.map((item) => (
        <li key={item.id} className="min-w-0 border-t border-hss-violeta/20 pt-3">
          <p className="text-sm font-semibold leading-5 text-slate-950">{item.rotulo}</p>
          {item.detalhe ? <p className="mt-0.5 text-[0.8125rem] leading-[1.125rem] text-slate-600 [@media(max-height:760px)]:hidden">{item.detalhe}</p> : null}
          <div className="mt-2">
            <ReguaDiferenca item={item} />
          </div>
        </li>
      ))}
    </ul>
  );
}
/* === GRADE DE COMPARATIVOS | fim === */
