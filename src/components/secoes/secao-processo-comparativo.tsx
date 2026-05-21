/* === IMPORTAÇÕES | inicio === */
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ganhosComHss,
  problemasSemHss,
} from "@/data/dadosLanding";
/* === IMPORTAÇÕES | fim === */

/* === TIPOS | inicio === */
type EstadoTravamento =
  | "antes"
  | "travado"
  | "depois";

type BlocoProcessoProps = {
  id: string;
  titulo: string;
  descricao: string;
  etiqueta: string;
  itens: string[];
  invertido: boolean;
};
/* === TIPOS | fim === */

/* === CONSTANTES DO SCROLL-DRIVEN | inicio === */
const ALTURA_CABECALHO = 74;
const PERCENTUAL_PASSO_CARD = 0.24;
const PASSO_MINIMO_CARD = 170;
/* === CONSTANTES DO SCROLL-DRIVEN | fim === */

/* === FUNÇÕES AUXILIARES | inicio === */
function obterTopoAbsoluto(
  elemento: HTMLElement,
): number {
  const retangulo =
    elemento.getBoundingClientRect();

  return retangulo.top + window.scrollY;
}
/* === FUNÇÕES AUXILIARES | fim === */

/* === SEÇÃO PROCESSO COMPARATIVO | inicio === */
export function SecaoProcessoComparativo(): JSX.Element {
  return (
    <section className="relative bg-[#eef0f7]/92">
      <BlocoProcessoTravado
        id="processo-sem-hss"
        titulo="Sem HSS - processo tradicional"
        descricao="O processo depende de e-mails, conferências manuais e cobranças recorrentes. Quanto mais lento o ciclo, maior o prejuízo por médico parado."
        etiqueta="Etapa tradicional"
        itens={problemasSemHss}
        invertido={false}
      />

      <BlocoProcessoTravado
        id="processo-com-hss"
        titulo="Com HSS - processo digital"
        descricao="O ADM define os tempos por cenário e a calculadora usa essas premissas para estimar economia, receita antecipada e ROI."
        etiqueta="Ganho digital"
        itens={ganhosComHss}
        invertido
      />
    </section>
  );
}
/* === SEÇÃO PROCESSO COMPARATIVO | fim === */

/* === BLOCO PROCESSO TRAVADO | inicio === */
function BlocoProcessoTravado({
  id,
  titulo,
  descricao,
  etiqueta,
  itens,
  invertido,
}: BlocoProcessoProps): JSX.Element {
  const blocoRef =
    useRef<HTMLDivElement | null>(null);

  const [
    cardsVisiveis,
    definirCardsVisiveis,
  ] = useState<number>(0);
  const [
    estadoTravamento,
    definirEstadoTravamento,
  ] =
    useState<EstadoTravamento>("antes");
  const [
    alturaScrollInterno,
    definirAlturaScrollInterno,
  ] = useState<number>(980);

  /* === ALTURA DO BLOCO SCROLL-DRIVEN | inicio === */
  useEffect(() => {
    function atualizarAlturaScrollInterno(): void {
      const passoPorCard = Math.max(
        window.innerHeight *
          PERCENTUAL_PASSO_CARD,
        PASSO_MINIMO_CARD,
      );

      const folgaFinal = Math.max(
        window.innerHeight * 0.2,
        180,
      );
      const novaAltura = Math.ceil(
        itens.length * passoPorCard +
          folgaFinal,
      );

      definirAlturaScrollInterno(
        novaAltura,
      );
    }

    atualizarAlturaScrollInterno();

    window.addEventListener(
      "resize",
      atualizarAlturaScrollInterno,
    );

    return () => {
      window.removeEventListener(
        "resize",
        atualizarAlturaScrollInterno,
      );
    };
  }, [itens.length]);
  /* === ALTURA DO BLOCO SCROLL-DRIVEN | fim === */

  /* === CONTROLE DE TRAVAMENTO E CARDS | inicio === */
  useEffect(() => {
    let quadroAnimacao = 0;

    function atualizarScrollDriven(): void {
      const bloco = blocoRef.current;

      if (!bloco) {
        return;
      }

      const topoDoBloco =
        obterTopoAbsoluto(bloco);
      const inicioTravamento =
        topoDoBloco - ALTURA_CABECALHO;
      const fimTravamento =
        inicioTravamento +
        alturaScrollInterno;

      const scrollAtual =
        window.scrollY;

      const passoPorCard = Math.max(
        window.innerHeight *
          PERCENTUAL_PASSO_CARD,
        PASSO_MINIMO_CARD,
      );

      const progressoDentroDoBloco =
        Math.max(
          scrollAtual -
            inicioTravamento,
          0,
        );
      const quantidadeCalculada =
        Math.floor(
          progressoDentroDoBloco /
            passoPorCard,
        );

      const novaQuantidadeVisivel =
        Math.min(
          itens.length,
          Math.max(
            0,
            quantidadeCalculada,
          ),
        );

      definirCardsVisiveis(
        (quantidadeAtual) => {
          if (
            quantidadeAtual ===
            novaQuantidadeVisivel
          ) {
            return quantidadeAtual;
          }

          return novaQuantidadeVisivel;
        },
      );

      if (
        scrollAtual < inicioTravamento
      ) {
        definirEstadoTravamento(
          (estadoAtual) => {
            if (
              estadoAtual === "antes"
            ) {
              return estadoAtual;
            }

            return "antes";
          },
        );

        return;
      }

      if (
        scrollAtual >= fimTravamento
      ) {
        definirEstadoTravamento(
          (estadoAtual) => {
            if (
              estadoAtual === "depois"
            ) {
              return estadoAtual;
            }

            return "depois";
          },
        );

        return;
      }

      definirEstadoTravamento(
        (estadoAtual) => {
          if (
            estadoAtual === "travado"
          ) {
            return estadoAtual;
          }

          return "travado";
        },
      );
    }

    function aoRolar(): void {
      window.cancelAnimationFrame(
        quadroAnimacao,
      );

      quadroAnimacao =
        window.requestAnimationFrame(
          () => {
            atualizarScrollDriven();
          },
        );
    }

    window.requestAnimationFrame(() => {
      atualizarScrollDriven();
    });

    window.addEventListener(
      "scroll",
      aoRolar,
      { passive: true },
    );
    window.addEventListener(
      "resize",
      aoRolar,
    );

    return () => {
      window.cancelAnimationFrame(
        quadroAnimacao,
      );
      window.removeEventListener(
        "scroll",
        aoRolar,
      );
      window.removeEventListener(
        "resize",
        aoRolar,
      );
    };
  }, [
    alturaScrollInterno,
    itens.length,
  ]);
  /* === CONTROLE DE TRAVAMENTO E CARDS | fim === */

  /* === CLASSES DE POSIÇÃO | inicio === */
  const classeConteudoTravado =
    estadoTravamento === "travado"
      ? "fixed left-0 right-0 top-[74px] z-30"
      : estadoTravamento === "depois"
        ? "absolute bottom-0 left-0 right-0 z-20"
        : "absolute left-0 right-0 top-0 z-20";
  /* === CLASSES DE POSIÇÃO | fim === */

  return (
    <div
      ref={blocoRef}
      id={id}
      className="relative scroll-mt-[74px] bg-[#eef0f7] px-4 sm:px-6 lg:px-8"
      style={{
        minHeight: `calc(100vh + ${alturaScrollInterno}px)`,
      }}
    >
      <div
        className={
          classeConteudoTravado
        }
      >
        <div className="mx-auto grid h-[calc(100vh-74px)] max-w-[1110px] items-center gap-8 overflow-hidden px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* === LISTA ANIMADA | inicio === */}
          <div
            className={
              invertido
                ? "order-2 space-y-3 lg:order-1"
                : "space-y-3"
            }
          >
            {itens.map(
              (item, indice) => {
                const visivel =
                  indice <
                  cardsVisiveis;

                return (
                  <CartaoPassoAnimado
                    key={item}
                    etiqueta={etiqueta}
                    item={item}
                    indice={indice}
                    visivel={visivel}
                    totalItens={
                      itens.length
                    }
                  />
                );
              },
            )}
          </div>
          {/* === LISTA ANIMADA | fim === */}

          {/* === TEXTO E CARDS DE STATUS | inicio === */}
          <article
            className={
              invertido
                ? "order-1 rounded-2xl bg-[#eef0f7]/70 p-7 backdrop-blur lg:order-2"
                : "rounded-2xl bg-[#eef0f7]/70 p-7 backdrop-blur"
            }
          >
            <h2 className="text-[1.55rem] font-black leading-tight text-[#070814] sm:text-[1.85rem]">
              {titulo}
            </h2>

            <p className="mt-4 max-w-[500px] text-sm font-medium leading-7 text-slate-600 sm:text-base">
              {descricao}
            </p>

            <div className="mt-5 space-y-3">
              {itens.map(
                (item, indice) => {
                  const carregado =
                    indice <
                    cardsVisiveis;
                  const ativo =
                    cardsVisiveis > 0
                      ? indice ===
                        Math.min(
                          cardsVisiveis -
                            1,
                          itens.length -
                            1,
                        )
                      : false;

                  return (
                    <div
                      key={item}
                      className={
                        ativo
                          ? "rounded-2xl bg-hss-roxo px-5 py-3 text-sm font-bold leading-6 text-white shadow-[0_18px_42px_rgba(75,50,216,0.28)] transition"
                          : carregado
                            ? "rounded-2xl bg-white px-5 py-3 text-sm font-bold leading-6 text-[#070814] shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition"
                            : "rounded-2xl bg-[#c9cacc]/90 px-5 py-3 text-sm font-semibold leading-6 text-slate-600 transition"
                      }
                    >
                      <span
                        className={
                          ativo
                            ? "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-white/70"
                            : carregado
                              ? "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-hss-roxo"
                              : "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-slate-500"
                        }
                      >
                        {etiqueta}{" "}
                        {String(
                          indice + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>
                      {item}
                    </div>
                  );
                },
              )}
            </div>
          </article>
          {/* === TEXTO E CARDS DE STATUS | fim === */}
        </div>
      </div>
    </div>
  );
}
/* === BLOCO PROCESSO TRAVADO | fim === */

/* === CARTÃO PASSO ANIMADO | inicio === */
function CartaoPassoAnimado({
  etiqueta,
  item,
  indice,
  visivel,
  totalItens,
}: {
  etiqueta: string;
  item: string;
  indice: number;
  visivel: boolean;
  totalItens: number;
}): JSX.Element {
  return (
    <article
      className={[
        "rounded-2xl border bg-white p-5",
        "shadow-[0_18px_42px_rgba(75,50,216,0.10)]",
        "transition-[opacity,transform,filter] duration-500 ease-out",
        visivel
          ? "translate-x-0 border-hss-violeta opacity-100 blur-0"
          : "translate-x-[130px] border-[#d8dbea] opacity-0 blur-[2px]",
      ].join(" ")}
      style={{
        transitionDelay: visivel
          ? `${indice * 55}ms`
          : `${(totalItens - indice) * 35}ms`,
      }}
    >
      <span className="text-xs font-black text-hss-roxo">
        {etiqueta}{" "}
        {String(indice + 1).padStart(
          2,
          "0",
        )}
      </span>

      <p className="mt-2 text-base font-black leading-6 text-[#070814]">
        {item}
      </p>
    </article>
  );
}
/* === CARTÃO PASSO ANIMADO | fim === */
