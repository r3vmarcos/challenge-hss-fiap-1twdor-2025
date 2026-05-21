import { useEffect, useRef, useState } from "react";
import { ganhosComHss, problemasSemHss } from "@/data/dadosLanding";

/* === SECAO PROCESSO COMPARATIVO | inicio === */
export function SecaoProcessoComparativo(): JSX.Element {
  const semHssRef = useRef<HTMLDivElement>(null);
  const comHssRef = useRef<HTMLDivElement>(null);
  const [ativoSemHss, definirAtivoSemHss] = useState(0);
  const [ativoComHss, definirAtivoComHss] = useState(0);

  useEffect(() => {
    function calcularIndice(elemento: HTMLDivElement | null, total: number): number {
      if (!elemento) return 0;

      const topo = elemento.offsetTop;
      const passo = Math.max(window.innerHeight * 0.38, 240);
      const progressoEtapas = Math.max(window.scrollY - topo, 0) / passo;
      return Math.min(total - 1, Math.floor(progressoEtapas));
    }

    function aoRolar(): void {
      definirAtivoSemHss(calcularIndice(semHssRef.current, problemasSemHss.length));
      definirAtivoComHss(calcularIndice(comHssRef.current, ganhosComHss.length));
    }

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <section className="bg-[#eef0f7]/92 px-4 sm:px-6 lg:px-8">
      <BlocoProcesso
        refBloco={semHssRef}
        titulo="Sem HSS - processo tradicional"
        descricao="O processo depende de e-mails, conferências manuais e cobranças recorrentes. Quanto mais lento o ciclo, maior o prejuízo por médico parado."
        etiqueta="Etapa tradicional"
        itens={problemasSemHss}
        indiceAtivo={ativoSemHss}
        invertido={false}
      />

      <BlocoProcesso
        refBloco={comHssRef}
        titulo="Com HSS - processo digital"
        descricao="O ADM define os tempos por cenário e a calculadora usa essas premissas para estimar economia, receita antecipada e ROI."
        etiqueta="Ganho digital"
        itens={ganhosComHss}
        indiceAtivo={ativoComHss}
        invertido
      />
    </section>
  );
}
/* === SECAO PROCESSO COMPARATIVO | fim === */

/* === BLOCO PROCESSO | inicio === */
function BlocoProcesso({
  refBloco,
  titulo,
  descricao,
  etiqueta,
  itens,
  indiceAtivo,
  invertido,
}: {
  refBloco: React.RefObject<HTMLDivElement>;
  titulo: string;
  descricao: string;
  etiqueta: string;
  itens: string[];
  indiceAtivo: number;
  invertido: boolean;
}): JSX.Element {
  return (
    <div ref={refBloco} className="relative min-h-[calc(100vh+152vh)]">
      <div className="sticky top-[74px] mx-auto grid h-[90vh] max-w-[1110px] items-center gap-8 overflow-hidden py-6 lg:grid-cols-2">
        <div className={invertido ? "order-2 space-y-3 lg:order-1" : "space-y-3"}>
          {itens.map((item, indice) => (
            <CartaoPasso
              key={item}
              etiqueta={etiqueta}
              item={item}
              indice={indice}
              ativo={indice === indiceAtivo}
            />
          ))}
        </div>

        <article className={invertido ? "order-1 rounded-2xl bg-[#d9dadd]/88 p-7 backdrop-blur lg:order-2" : "rounded-2xl bg-[#d9dadd]/88 p-7 backdrop-blur"}>
          <h2 className="text-[1.55rem] font-black text-[#070814] sm:text-[1.85rem]">{titulo}</h2>
          <p className="mt-4 max-w-[500px] text-sm font-medium leading-7 text-slate-600 sm:text-base">
            {descricao}
          </p>

          <div className="mt-5 space-y-3">
            {itens.map((item, indice) => {
              const ativo = indice === indiceAtivo;

              return (
                <div
                  key={item}
                  className={
                    ativo
                      ? "rounded-2xl bg-hss-roxo px-5 py-3 text-sm font-bold leading-6 text-white shadow-[0_18px_42px_rgba(75,50,216,0.28)] transition"
                      : "rounded-2xl bg-[#c9cacc]/90 px-5 py-3 text-sm font-semibold leading-6 text-slate-600 transition"
                  }
                >
                  <span className={ativo ? "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-white/70" : "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-slate-500"}>
                    {etiqueta} {String(indice + 1).padStart(2, "0")}
                  </span>
                  {item}
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </div>
  );
}
/* === BLOCO PROCESSO | fim === */

/* === CARTAO PASSO | inicio === */
function CartaoPasso({
  etiqueta,
  item,
  indice,
  ativo,
}: {
  etiqueta: string;
  item: string;
  indice: number;
  ativo: boolean;
}): JSX.Element {
  return (
    <article
      className={
        ativo
          ? "rounded-2xl border border-hss-violeta bg-white p-5 shadow-[0_18px_42px_rgba(75,50,216,0.18)] transition"
          : "rounded-2xl border border-[#d8dbea] bg-white/65 p-5 opacity-60 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition"
      }
    >
      <span className={ativo ? "text-xs font-black text-hss-roxo" : "text-xs font-black text-slate-400"}>
        {etiqueta} {String(indice + 1).padStart(2, "0")}
      </span>
      <p className={ativo ? "mt-2 text-base font-black leading-6 text-[#070814]" : "mt-2 text-base font-bold leading-6 text-slate-500"}>
        {item}
      </p>
    </article>
  );
}
/* === CARTAO PASSO | fim === */
