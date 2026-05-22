/* === IMPORTAÇÕES | inicio === */
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ganhosComHss,
  informacoesComHss,
  informacoesSemHss,
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
  informacoes: string[];
  invertido: boolean;
};

type TemaProcesso = "sem" | "com";
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
        informacoes={informacoesSemHss}
        invertido={false}
      />

      <BlocoProcessoTravado
        id="processo-com-hss"
        titulo="Com HSS - processo digital"
        descricao="O ADM define os tempos por cenário e a calculadora usa essas premissas para estimar economia, receita antecipada e ROI."
        etiqueta="Ganho digital"
        itens={ganhosComHss}
        informacoes={informacoesComHss}
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
  informacoes,
  invertido,
}: BlocoProcessoProps): JSX.Element {
  const blocoRef =
    useRef<HTMLDivElement | null>(null);
  const tema: TemaProcesso = invertido ? "com" : "sem";
  const [
    layoutCompacto,
    definirLayoutCompacto,
  ] = useState(false);

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

  /* === LAYOUT RESPONSIVO | inicio === */
  useEffect(() => {
    function atualizarLayout(): void {
      definirLayoutCompacto(
        window.innerWidth < 1024,
      );
    }

    atualizarLayout();

    window.addEventListener(
      "resize",
      atualizarLayout,
    );

    return () => {
      window.removeEventListener(
        "resize",
        atualizarLayout,
      );
    };
  }, []);
  /* === LAYOUT RESPONSIVO | fim === */

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
  if (layoutCompacto) {
    return (
      <div
        id={id}
        className="max-w-full scroll-mt-[74px] overflow-hidden bg-[#eef0f7] px-3 py-14 sm:px-6 md:py-18"
      >
        <div className="mx-auto grid w-full max-w-[720px] min-w-0 gap-6">
          <article className="min-w-0">
            <h2 className="text-[1.35rem] font-black leading-tight text-[#070814] sm:text-[2rem]">
              <TituloProcesso titulo={titulo} tema={tema} />
            </h2>
            <p className="mt-4 text-sm font-medium leading-7 text-slate-600 sm:text-base">
              {descricao}
            </p>
          </article>

          <div className="grid min-w-0 gap-3">
            {informacoes.map((item, indice) => (
              <article
                key={item}
                className={
                  tema === "sem"
                    ? "min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#fdba74] bg-white p-4 shadow-[0_14px_34px_rgba(249,115,22,0.10)]"
                    : "min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#93c5fd] bg-white p-4 shadow-[0_14px_34px_rgba(37,99,235,0.10)]"
                }
              >
                <span
                  className={
                    tema === "sem"
                      ? "block text-xs font-black uppercase tracking-[0.14em] text-[#ea580c]"
                      : "block text-xs font-black uppercase tracking-[0.14em] text-[#1d4ed8]"
                  }
                >
                  {etiqueta}{" "}
                  {String(indice + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 min-w-0 max-w-full break-words text-sm font-black leading-6 text-[#070814] [overflow-wrap:anywhere] sm:text-base">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
                ? "order-2 space-y-3 lg:order-2"
                : "order-2 space-y-3 lg:order-1"
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
                    tema={tema}
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
                ? "order-1 rounded-2xl bg-[#eef0f7]/70 p-7 backdrop-blur lg:order-1"
                : "order-1 rounded-2xl bg-[#eef0f7]/70 p-7 backdrop-blur lg:order-2"
            }
          >
            <h2 className="whitespace-nowrap text-[1.35rem] font-black leading-tight text-[#070814] sm:text-[1.65rem] xl:text-[1.85rem]">
              <TituloProcesso titulo={titulo} tema={tema} />
            </h2>

            <p className="mt-4 max-w-[500px] text-sm font-medium leading-7 text-slate-600 sm:text-base">
              {descricao}
            </p>

            <div className="mt-5 space-y-3">
              {informacoes.map(
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
                          informacoes.length -
                            1,
                        )
                      : false;

                  return (
                    <div
                      key={item}
                      className={
                        ativo
                          ? tema === "sem"
                            ? "rounded-2xl border border-[#f97316] bg-[#f97316] px-5 py-3 text-sm font-bold leading-6 text-white shadow-[0_18px_42px_rgba(249,115,22,0.22)] transition"
                            : "rounded-2xl border border-[#2563eb] bg-[#2563eb] px-5 py-3 text-sm font-bold leading-6 text-white shadow-[0_18px_42px_rgba(37,99,235,0.22)] transition"
                          : carregado
                            ? tema === "sem"
                              ? "rounded-2xl border border-[#fed7aa] bg-white px-5 py-3 text-sm font-bold leading-6 text-[#070814] shadow-[0_12px_28px_rgba(249,115,22,0.10)] transition"
                              : "rounded-2xl border border-[#bfdbfe] bg-white px-5 py-3 text-sm font-bold leading-6 text-[#070814] shadow-[0_12px_28px_rgba(37,99,235,0.10)] transition"
                            : tema === "sem"
                              ? "rounded-2xl border border-[#fed7aa] bg-[#ffedd5]/85 px-5 py-3 text-sm font-semibold leading-6 text-slate-600 transition"
                              : "rounded-2xl border border-[#bfdbfe] bg-[#dbeafe]/85 px-5 py-3 text-sm font-semibold leading-6 text-slate-600 transition"
                      }
                    >
                      <span
                        className={
                          ativo
                            ? "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-white/70"
                            : carregado
                              ? tema === "sem"
                                ? "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-[#ea580c]"
                                : "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-[#1d4ed8]"
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

/* === TITULO PROCESSO | inicio === */
function TituloProcesso({
  titulo,
  tema,
}: {
  titulo: string;
  tema: TemaProcesso;
}): JSX.Element {
  const [primeiraPalavra, ...restante] = titulo.split(" ");

  return (
    <>
      <span
        className={
          tema === "sem"
            ? "font-black uppercase text-[#f97316]"
            : "font-black uppercase text-[#2563eb]"
        }
      >
        {primeiraPalavra}
      </span>{" "}
      {restante.join(" ")}
    </>
  );
}
/* === TITULO PROCESSO | fim === */

/* === CARTÃO PASSO ANIMADO | inicio === */
function CartaoPassoAnimado({
  etiqueta,
  item,
  indice,
  visivel,
  totalItens,
  tema,
}: {
  etiqueta: string;
  item: string;
  indice: number;
  visivel: boolean;
  totalItens: number;
  tema: TemaProcesso;
}): JSX.Element {
  return (
    <article
      className={[
        "rounded-2xl border bg-white p-5",
        tema === "sem"
          ? "shadow-[0_18px_42px_rgba(249,115,22,0.10)]"
          : "shadow-[0_18px_42px_rgba(37,99,235,0.10)]",
        "transition-[opacity,transform,filter] duration-500 ease-out",
        visivel
          ? tema === "sem"
            ? "translate-x-0 border-[#fdba74] opacity-100 blur-0"
            : "translate-x-0 border-[#93c5fd] opacity-100 blur-0"
          : tema === "sem"
            ? "translate-x-[130px] border-[#fed7aa] opacity-0 blur-[2px]"
            : "translate-x-[130px] border-[#bfdbfe] opacity-0 blur-[2px]",
      ].join(" ")}
      style={{
        transitionDelay: visivel
          ? `${indice * 55}ms`
          : `${(totalItens - indice) * 35}ms`,
      }}
    >
      <span
        className={
          tema === "sem"
            ? "text-xs font-black text-[#ea580c]"
            : "text-xs font-black text-[#1d4ed8]"
        }
      >
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
