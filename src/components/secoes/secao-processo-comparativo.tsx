/* === IMPORTAÇÕES | inicio === */
import { useEffect, useRef, useState } from "react";
import { ganhosComHss, informacoesComHss, informacoesSemHss, problemasSemHss } from "@/data/dadosLanding";
/* === IMPORTAÇÕES | fim === */

/* === TIPOS | inicio === */
type EstadoTravamento = "antes" | "travado" | "depois";

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
function obterTopoAbsoluto(elemento: HTMLElement): number {
  const retangulo = elemento.getBoundingClientRect();

  return retangulo.top + window.scrollY;
}

function separarTituloDescricao(texto: string): { titulo: string; descricao: string } {
  const indiceSeparador = texto.indexOf(". ");

  if (indiceSeparador < 0) {
    return { titulo: texto, descricao: "" };
  }

  return {
    titulo: texto.slice(0, indiceSeparador),
    descricao: texto.slice(indiceSeparador + 2),
  };
}

function obterEtiquetaVisivel(etiqueta: string, indice: number, tema: TemaProcesso): string {
  void indice;
  void tema;

  return etiqueta;
}
/* === FUNÇÕES AUXILIARES | fim === */

/* === SEÇÃO PROCESSO COMPARATIVO | inicio === */
export function SecaoProcessoComparativo(): JSX.Element {
  return (
    <section className="relative bg-[#eef0f7]/92">
      <BlocoProcessoTravado
        id="processo-sem-hss"
        titulo="Sem HSS • processos tradicionais"
        descricao="Processos descentralizados tornam o credenciamento lento, manual e difícil de auditar."
        etiqueta="Etapa tradicional"
        itens={problemasSemHss}
        informacoes={informacoesSemHss}
        invertido={false}
      />

      <BlocoProcessoTravado
        id="processo-com-hss"
        titulo="Com HSS • processo digital"
        descricao="O fluxo digital centraliza a operação, calcula impacto financeiro e dá autonomia para ajustar cenários em tempo real."
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
function BlocoProcessoTravado({ id, titulo, descricao, etiqueta, itens, informacoes, invertido }: BlocoProcessoProps): JSX.Element {
  const blocoRef = useRef<HTMLDivElement | null>(null);
  const tema: TemaProcesso = invertido ? "com" : "sem";
  const [layoutCompacto, definirLayoutCompacto] = useState(false);

  const [cardsVisiveis, definirCardsVisiveis] = useState<number>(0);
  const [estadoTravamento, definirEstadoTravamento] = useState<EstadoTravamento>("antes");
  const [alturaScrollInterno, definirAlturaScrollInterno] = useState<number>(980);

  /* === LAYOUT RESPONSIVO | inicio === */
  useEffect(() => {
    function atualizarLayout(): void {
      definirLayoutCompacto(window.innerWidth < 1024);
    }

    atualizarLayout();

    window.addEventListener("resize", atualizarLayout);

    return () => {
      window.removeEventListener("resize", atualizarLayout);
    };
  }, []);
  /* === LAYOUT RESPONSIVO | fim === */

  /* === ALTURA DO BLOCO SCROLL-DRIVEN | inicio === */
  useEffect(() => {
    function atualizarAlturaScrollInterno(): void {
      const passoPorCard = Math.max(window.innerHeight * PERCENTUAL_PASSO_CARD, PASSO_MINIMO_CARD);

      const folgaFinal = Math.max(window.innerHeight * 0.2, 180);
      const novaAltura = Math.ceil(itens.length * passoPorCard + folgaFinal);

      definirAlturaScrollInterno(novaAltura);
    }

    atualizarAlturaScrollInterno();

    window.addEventListener("resize", atualizarAlturaScrollInterno);

    return () => {
      window.removeEventListener("resize", atualizarAlturaScrollInterno);
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

      const topoDoBloco = obterTopoAbsoluto(bloco);
      const inicioTravamento = topoDoBloco - ALTURA_CABECALHO;
      const fimTravamento = inicioTravamento + alturaScrollInterno;

      const scrollAtual = window.scrollY;

      const passoPorCard = Math.max(window.innerHeight * PERCENTUAL_PASSO_CARD, PASSO_MINIMO_CARD);

      const progressoDentroDoBloco = Math.max(scrollAtual - inicioTravamento, 0);
      const quantidadeCalculada = Math.floor(progressoDentroDoBloco / passoPorCard);

      const novaQuantidadeVisivel = Math.min(itens.length, Math.max(0, quantidadeCalculada));

      definirCardsVisiveis((quantidadeAtual) => {
        if (quantidadeAtual === novaQuantidadeVisivel) {
          return quantidadeAtual;
        }

        return novaQuantidadeVisivel;
      });

      if (scrollAtual < inicioTravamento) {
        definirEstadoTravamento((estadoAtual) => {
          if (estadoAtual === "antes") {
            return estadoAtual;
          }

          return "antes";
        });

        return;
      }

      if (scrollAtual >= fimTravamento) {
        definirEstadoTravamento((estadoAtual) => {
          if (estadoAtual === "depois") {
            return estadoAtual;
          }

          return "depois";
        });

        return;
      }

      definirEstadoTravamento((estadoAtual) => {
        if (estadoAtual === "travado") {
          return estadoAtual;
        }

        return "travado";
      });
    }

    function aoRolar(): void {
      window.cancelAnimationFrame(quadroAnimacao);

      quadroAnimacao = window.requestAnimationFrame(() => {
        atualizarScrollDriven();
      });
    }

    window.requestAnimationFrame(() => {
      atualizarScrollDriven();
    });

    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);

    return () => {
      window.cancelAnimationFrame(quadroAnimacao);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, [alturaScrollInterno, itens.length]);
  /* === CONTROLE DE TRAVAMENTO E CARDS | fim === */

  /* === CLASSES DE POSIÇÃO | inicio === */
  if (layoutCompacto) {
    return (
      <div id={id} className="max-w-full scroll-mt-[74px] overflow-hidden bg-[#f7f3ee] px-3 py-14 sm:px-6 md:py-18">
        <div className="mx-auto grid w-full max-w-[720px] min-w-0 gap-6">
          <article className="min-w-0">
            <h2 className="text-[1.35rem] font-black leading-tight text-[#070814] sm:text-[2rem]">
              <TituloProcesso titulo={titulo} tema={tema} />
            </h2>
            <p className="mt-4 text-sm font-medium leading-7 text-slate-600 sm:text-base">{descricao}</p>
          </article>

          <div className="grid min-w-0 gap-3">
            {informacoes.map((item, indice) => {
              const conteudo = separarTituloDescricao(item);

              return (
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
                      tema === "sem" ? "block text-xs font-black uppercase tracking-[0.14em] text-[#ea580c]" : "block text-xs font-black uppercase tracking-[0.14em] text-[#1d4ed8]"
                    }
                  >
                    {obterEtiquetaVisivel(etiqueta, indice, tema)}
                  </span>
                  <strong className="mt-2 block min-w-0 max-w-full break-words text-sm font-black leading-5 text-[#070814] [overflow-wrap:anywhere] sm:text-base">{conteudo.titulo}</strong>
                  {conteudo.descricao ? <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{conteudo.descricao}</p> : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const classeConteudoTravado =
    estadoTravamento === "travado"
      ? "fixed left-0 right-0 top-[74px] z-30"
      : estadoTravamento === "depois"
        ? "absolute bottom-[74px] left-0 right-0 z-20"
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
      <div className={classeConteudoTravado}>
        <div className="mx-auto flex h-[calc(100vh-74px)] max-w-[1160px] flex-col justify-center overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
          {/* === CABECALHO DO BLOCO | inicio === */}
          <div className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] gap-x-3">
            <article className={invertido ? "col-start-3 rounded-2xl bg-[#eef0f7]/70 p-4 backdrop-blur" : "col-start-1 rounded-2xl bg-[#eef0f7]/70 p-4 backdrop-blur"}>
              <h2 className="whitespace-nowrap text-[1.25rem] font-black leading-tight text-[#070814] sm:text-[1.5rem] xl:text-[1.7rem]">
                <TituloProcesso titulo={titulo} tema={tema} />
              </h2>

              <p className="mt-5 max-w-[500px] text-sm font-medium leading-6 text-slate-600">{descricao}</p>
            </article>
          </div>
          {/* === CABECALHO DO BLOCO | fim === */}

          {/* === PARES ALINHADOS | inicio === */}
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-stretch gap-x-3 gap-y-2">
            {itens.map((item, indice) => {
              const carregado = indice < cardsVisiveis;
              const ativo = cardsVisiveis > 0 ? indice === Math.min(cardsVisiveis - 1, itens.length - 1) : false;
              const textoEsquerda = invertido ? informacoes[indice] : item;
              const textoDireita = invertido ? item : informacoes[indice];
              const esquerdaCarregada = invertido ? carregado : true;
              const direitaCarregada = invertido ? true : carregado;
              const esquerdaAtiva = invertido ? ativo : false;
              const direitaAtiva = invertido ? false : ativo;

              return (
                <div key={`${item}-${informacoes[indice]}`} className="contents">
                  <CartaoComparativoAlinhado texto={textoEsquerda} etiqueta={etiqueta} indice={indice} tema={tema} ativo={esquerdaAtiva} carregado={esquerdaCarregada} />
                  <span
                    className={[
                      "self-center text-center text-2xl font-black transition-[opacity,transform] duration-300",
                      tema === "sem" ? "text-[#f97316]" : "text-[#2563eb]",
                      carregado ? "scale-100 opacity-60" : "scale-75 opacity-0",
                    ].join(" ")}
                  >
                    {invertido ? "<" : ">"}
                  </span>
                  <CartaoComparativoAlinhado texto={textoDireita} etiqueta={etiqueta} indice={indice} tema={tema} ativo={direitaAtiva} carregado={direitaCarregada} />
                </div>
              );
            })}
          </div>
          {/* === PARES ALINHADOS | fim === */}
        </div>
      </div>
    </div>
  );
}
/* === BLOCO PROCESSO TRAVADO | fim === */

/* === TITULO PROCESSO | inicio === */
function TituloProcesso({ titulo, tema }: { titulo: string; tema: TemaProcesso }): JSX.Element {
  const [primeiraPalavra, ...restante] = titulo.split(" ");

  return (
    <>
      <span className={tema === "sem" ? "font-black uppercase text-[#f97316]" : "font-black uppercase text-[#2563eb]"}>{primeiraPalavra}</span> {restante.join(" ")}
    </>
  );
}
/* === TITULO PROCESSO | fim === */

/* === CARTAO COMPARATIVO ALINHADO | inicio === */
function CartaoComparativoAlinhado({
  etiqueta,
  texto,
  indice,
  tema,
  ativo,
  carregado,
}: {
  etiqueta: string;
  texto: string;
  indice: number;
  tema: TemaProcesso;
  ativo: boolean;
  carregado: boolean;
}): JSX.Element {
  const conteudo = separarTituloDescricao(texto);

  return (
    <article
      className={[
        "h-full rounded-2xl border px-4 py-3 text-[0.78rem] leading-5",
        "transition-[opacity,transform,background-color,border-color,color] duration-500 ease-out",
        ativo
          ? tema === "sem"
            ? "border-[#f97316] bg-[#f97316] text-white shadow-[0_18px_42px_rgba(249,115,22,0.22)]"
            : "border-[#2563eb] bg-[#2563eb] text-white shadow-[0_18px_42px_rgba(37,99,235,0.22)]"
          : carregado
            ? tema === "sem"
              ? "border-[#fdba74] bg-white text-[#070814] shadow-[0_12px_28px_rgba(249,115,22,0.10)]"
              : "border-[#93c5fd] bg-white text-[#070814] shadow-[0_12px_28px_rgba(37,99,235,0.10)]"
            : tema === "sem"
              ? "border-[#fed7aa] bg-[#ffedd5]/85 text-slate-600"
              : "border-[#bfdbfe] bg-[#dbeafe]/85 text-slate-600",
        carregado ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-[2px]",
      ].join(" ")}
    >
      <span
        className={
          ativo
            ? "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-white/70"
            : tema === "sem"
              ? "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-[#ea580c]"
              : "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-[#1d4ed8]"
        }
      >
        {obterEtiquetaVisivel(etiqueta, indice, tema)}
      </span>
      <strong className={ativo ? "block text-sm font-black leading-5 text-white" : "block text-sm font-black leading-5 text-[#070814]"}>{conteudo.titulo}</strong>
      {conteudo.descricao ? <p className={ativo ? "mt-1 text-xs font-semibold leading-5 text-white" : "mt-1 text-xs font-semibold leading-5 text-slate-600"}>{conteudo.descricao}</p> : null}
    </article>
  );
}
/* === CARTAO COMPARATIVO ALINHADO | fim === */
