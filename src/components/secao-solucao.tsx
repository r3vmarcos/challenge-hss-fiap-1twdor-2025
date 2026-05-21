import { useEffect, useRef, useState } from "react";

/* === DADOS DE BENEFICIOS | inicio === */
const beneficios = [
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

/* === COMPONENTE BENEFICIOS | inicio === */
export function SecaoBeneficios(): JSX.Element {
  const secaoRef = useRef<HTMLElement>(null);
  const [cardsVisiveis, definirCardsVisiveis] = useState(0);

  useEffect(() => {
    function aoRolar(): void {
      const elemento = secaoRef.current;
      if (!elemento) return;

      const topo = elemento.offsetTop;
      const passo = Math.max(window.innerHeight * 0.38, 260);
      const progressoEtapas = Math.max(window.scrollY - topo, 0) / passo;
      definirCardsVisiveis(Math.min(beneficios.length, Math.max(0, Math.floor(progressoEtapas))));
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
    <section ref={secaoRef} id="beneficios" className="relative min-h-[calc(100vh+268vh)] scroll-mt-[74px] bg-[#eef0f7] px-4 sm:px-6 lg:px-8">
      <div className="sticky top-[74px] mx-auto grid h-[calc(100vh-74px)] max-w-[1110px] items-center gap-12 overflow-hidden py-0 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="revelar-scroll self-center lg:-mt-8">
          <h2 className="max-w-[430px] text-[2.5rem] font-black leading-[1.12] tracking-[0.01em] text-[#070814] sm:text-[3.1rem]">
            Benefícios da nossa solução
          </h2>
          <p className="mt-7 max-w-[460px] text-lg font-medium leading-8 text-[#171826]">
            Transforme o credenciamento médico em um processo mais organizado, rastreável e eficiente. Centralize validações, reduza retrabalho e acompanhe cada etapa com mais controle operacional.
          </p>
        </div>

        <div className="grid min-h-[520px] content-center gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {beneficios.map((beneficio, indice) => {
            const visivel = indice < cardsVisiveis;

            return (
              <article
                key={beneficio.titulo}
                className={
                  visivel
                    ? "translate-y-0 rounded-2xl border border-[#d8dbea] bg-white p-6 opacity-100 shadow-[0_16px_34px_rgba(15,23,42,0.07)] transition duration-500"
                    : "translate-y-8 rounded-2xl border border-[#d8dbea] bg-white/40 p-6 opacity-0 shadow-none transition duration-500"
                }
              >
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-hss-violeta/10 text-[#070814]">
                  {beneficio.icone}
                </span>
                <span className="text-xs font-black text-hss-roxo">{String(indice + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-xl font-black leading-tight text-[#070814]">{beneficio.titulo}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[#1f2937]">{beneficio.texto}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
/* === COMPONENTE BENEFICIOS | fim === */

/* === ICONES BENEFICIOS | inicio === */
function IconeFluxo(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v6" /><path d="M6 21v-5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" /><path d="M5 9h14" /><path d="M8 21h.01" /><path d="M12 21h.01" /><path d="M16 21h.01" /></svg>;
}

function IconeCadastro(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h4" /><path d="M7 12h2" /><path d="M13 13a3 3 0 1 0 0-6" /><path d="M15 16h4" /></svg>;
}

function IconeStatus(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16" /><path d="M4 5h4" /><path d="M4 10h10" /><path d="M4 15h7" /><path d="M18 7v10" /><path d="m15 14 3 3 3-3" /></svg>;
}

function IconeMaleta(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1" /><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M3 12h18" /><path d="M9 12v2" /><path d="M15 12v2" /></svg>;
}

function IconeCadeado(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
}

function IconeEscudo(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>;
}
/* === ICONES BENEFICIOS | fim === */

