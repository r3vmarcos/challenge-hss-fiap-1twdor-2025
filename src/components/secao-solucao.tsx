import { useEffect, useRef, useState } from "react";

/* === TIPOS | inicio === */
type EstadoTravamento = "antes" | "travado" | "depois";

type Beneficio = {
  icone: JSX.Element;
  titulo: string;
  texto: string;
};
/* === TIPOS | fim === */

/* === DADOS DE BENEFICIOS | inicio === */
const beneficios: Beneficio[] = [
  {
    icone: <IconeFluxo />,
    titulo: "Fluxo 100% digital",
    texto: "Menos papel e contratações muito mais rápidas.",
  },
  {
    icone: <IconeCadastro />,
    titulo: "Cadastro único",
    texto: "O fornecedor preenche uma vez; a empresa acessa sempre atualizado.",
  },
  {
    icone: <IconeStatus />,
    titulo: "Status em tempo real",
    texto: "Transparência total para os dois lados acompanharem o processo.",
  },
  {
    icone: <IconeMaleta />,
    titulo: "Fim do retrabalho",
    texto: "Filtros automáticos eliminam vai e vem de documentos errados.",
  },
  {
    icone: <IconeCadeado />,
    titulo: "Segurança e compliance",
    texto: "Histórico imutável e auditável para segurança jurídica e fiscal.",
  },
  {
    icone: <IconeEscudo />,
    titulo: "Proteção contra riscos",
    texto: "Dados protegidos pela LGPD e segurança corporativa contra fraudes.",
  },
];
/* === DADOS DE BENEFICIOS | fim === */

/* === CONSTANTES DE LAYOUT | inicio === */
const ALTURA_CABECALHO = 74;
const OFFSET_ENTRADA_SECAO = 0;
const PERCENTUAL_PASSO_BENEFICIO = 0.24;
const PASSO_MINIMO_BENEFICIO = 165;
/* === CONSTANTES DE LAYOUT | fim === */

/* === COMPONENTE BENEFICIOS | inicio === */
export function SecaoBeneficios(): JSX.Element {
  const secaoRef = useRef<HTMLElement | null>(null);
  const [cardsVisiveis, definirCardsVisiveis] = useState<number>(0);
  const [estadoTravamento, definirEstadoTravamento] = useState<EstadoTravamento>("antes");
  const [alturaScrollInterno, definirAlturaScrollInterno] = useState<number>(2600);
  const [layoutCompacto, definirLayoutCompacto] = useState(false);

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

  /* === CALCULO DE ALTURA DA AREA SCROLL-DRIVEN | inicio === */
  useEffect(() => {
    function atualizarAlturaScrollInterno(): void {
      const passoPorCard = Math.max(window.innerHeight * PERCENTUAL_PASSO_BENEFICIO, PASSO_MINIMO_BENEFICIO);
      const folgaFinal = Math.max(window.innerHeight * 0.24, 170);
      const novaAltura = Math.ceil(beneficios.length * passoPorCard + folgaFinal);

      definirAlturaScrollInterno(novaAltura);
    }

    atualizarAlturaScrollInterno();

    window.addEventListener("resize", atualizarAlturaScrollInterno);

    return () => {
      window.removeEventListener("resize", atualizarAlturaScrollInterno);
    };
  }, []);
  /* === CALCULO DE ALTURA DA AREA SCROLL-DRIVEN | fim === */

  /* === CONTROLE DE SCROLL-DRIVEN E TRAVAMENTO | inicio === */
  useEffect(() => {
    let quadroAnimacao = 0;

    function atualizarScrollDriven(): void {
      const secao = secaoRef.current;

      if (!secao) {
        return;
      }

      const topoDaSecao = secao.offsetTop + OFFSET_ENTRADA_SECAO;
      const inicioTravamento = topoDaSecao - ALTURA_CABECALHO;
      const fimTravamento = inicioTravamento + alturaScrollInterno;

      const scrollAtual = window.scrollY;
      const passoPorCard = Math.max(window.innerHeight * PERCENTUAL_PASSO_BENEFICIO, PASSO_MINIMO_BENEFICIO);
      const progresso = Math.max(scrollAtual - inicioTravamento, 0);

      const quantidadeCalculada = Math.floor(progresso / passoPorCard);

      const novaQuantidadeVisivel = Math.min(beneficios.length, Math.max(0, quantidadeCalculada));

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

    atualizarScrollDriven();

    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);

    return () => {
      window.cancelAnimationFrame(quadroAnimacao);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, [alturaScrollInterno]);
  /* === CONTROLE DE SCROLL-DRIVEN E TRAVAMENTO | fim === */

  if (layoutCompacto) {
    return (
      <section id="beneficios" className="scroll-mt-[74px] bg-[#eef0f7] px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-[2.15rem] font-black leading-tight text-[#070814] sm:text-[2.8rem]">Benefícios da nossa solução</h2>
          <p className="mt-5 text-base font-medium leading-7 text-[#171826] sm:text-lg">
            Transforme o credenciamento médico em um processo mais organizado, rastreável e eficiente. Centralize validações, reduza retrabalho e acompanhe cada etapa com mais
            controle operacional.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {beneficios.map((beneficio, indice) => (
              <article key={beneficio.titulo} className="rounded-2xl border border-[#d8dbea] bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.07)]">
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-hss-violeta/10 text-[#070814]">{beneficio.icone}</span>
                <span className="text-xs font-black text-hss-roxo">{String(indice + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-black leading-tight text-[#070814]">{beneficio.titulo}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-[#1f2937]">{beneficio.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* === CLASSES DO CONTEUDO TRAVADO | inicio === */
  const classeConteudoTravado =
    estadoTravamento === "travado"
      ? "fixed left-0 right-0 top-[74px] z-30"
      : estadoTravamento === "depois"
        ? "absolute bottom-0 left-0 right-0 z-20"
        : "absolute left-0 right-0 top-0 z-20";
  /* === CLASSES DO CONTEUDO TRAVADO | fim === */

  return (
    <section
      ref={secaoRef}
      id="beneficios"
      className="relative scroll-mt-[74px] bg-[#eef0f7] px-4 sm:px-6 lg:px-8"
      style={{
        minHeight: `calc(100vh + ${alturaScrollInterno}px)`,
      }}
    >
      {/* === CONTAINER FIXO/ABSOLUTO CONTROLADO POR SCROLL | inicio === */}
      <div className={classeConteudoTravado}>
        <div className="mx-auto grid h-[calc(100vh-74px)] max-w-[1110px] items-center gap-12 overflow-hidden px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-2">
          {/* === TEXTO TRAVADO NO MEIO DA TELA | inicio === */}
          <div className="self-center">
            <h2 className="max-w-[450px] text-[2.5rem] font-black leading-[1.12] tracking-[0.01em] text-[#070814] sm:text-[3.1rem]">Benefícios da nossa solução</h2>

            <p className="mt-7 max-w-[460px] text-lg font-medium leading-8 text-[#171826]">
              Transforme o credenciamento médico em um processo mais organizado, rastreável e eficiente. Centralize validações, reduza retrabalho e acompanhe cada etapa com mais
              controle operacional.
            </p>
          </div>
          {/* === TEXTO TRAVADO NO MEIO DA TELA | fim === */}

          {/* === CARDS ANIMADOS VINDO DA DIREITA | inicio === */}
          <div className="grid min-h-[560px] content-center gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {beneficios.map((beneficio, indice) => {
              const visivel = indice < cardsVisiveis;

              return (
                <article
                  key={beneficio.titulo}
                  className={[
                    "rounded-2xl border border-[#d8dbea] bg-white p-6",
                    "shadow-[0_16px_34px_rgba(15,23,42,0.07)]",
                    "transition-[opacity,transform] duration-500 ease-out",
                    visivel ? "translate-x-0 opacity-100" : "translate-x-[140px] opacity-0",
                  ].join(" ")}
                  style={{
                    transitionDelay: visivel ? `${indice * 45}ms` : `${(beneficios.length - indice) * 24}ms`,
                  }}
                >
                  <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-hss-violeta/10 text-[#070814]">{beneficio.icone}</span>
                  <span className="text-[1em] font-black text-hss-roxo">{String(indice + 1).padStart(2, "0")}</span>

                  <h3 className="mt-2 text-xl font-black leading-tight text-[#070814]">{beneficio.titulo}</h3>

                  <p className="mt-2 text-sm font-medium leading-6 text-[#1f2937]">{beneficio.texto}</p>
                </article>
              );
            })}
          </div>
          {/* === CARDS ANIMADOS VINDO DA DIREITA | fim === */}
        </div>
      </div>
      {/* === CONTAINER FIXO/ABSOLUTO CONTROLADO POR SCROLL | fim === */}
    </section>
  );
}
/* === COMPONENTE BENEFICIOS | fim === */

/* === ALIAS DE COMPATIBILIDADE | inicio === */
export const SecaoSolucao = SecaoBeneficios;
/* === ALIAS DE COMPATIBILIDADE | fim === */

/* === ICONES | inicio === */
function IconeFluxo(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v6" />
      <path d="M6 21v-5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" />
      <path d="M5 9h14" />
      <path d="M8 21h.01" />
      <path d="M12 21h.01" />
      <path d="M16 21h.01" />
    </svg>
  );
}

function IconeCadastro(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h4" />
      <path d="M7 12h2" />
      <path d="M13 13a3 3 0 1 0 0-6" />
      <path d="M15 16h4" />
    </svg>
  );
}

function IconeStatus(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19h16" />
      <path d="M4 5h4" />
      <path d="M4 10h10" />
      <path d="M4 15h7" />
      <path d="M18 7v10" />
      <path d="m15 14 3 3 3-3" />
    </svg>
  );
}

function IconeMaleta(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 6V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M3 12h18" />
      <path d="M9 12v2" />
      <path d="M15 12v2" />
    </svg>
  );
}

function IconeCadeado(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function IconeEscudo(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
/* === ICONES | fim === */
