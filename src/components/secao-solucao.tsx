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
    destaque: true,
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
  return (
    <section id="beneficios" className="scroll-mt-28 bg-[#eef0f7] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1110px] gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="revelar-scroll">
          <h2 className="max-w-[430px] text-[2.35rem] font-black leading-[1.12] tracking-[0.01em] text-[#070814] sm:text-[3rem]">
            Benefícios da nossa solução
          </h2>
          <p className="mt-7 max-w-[420px] text-lg font-medium leading-8 text-[#171826]">
            Transforme o credenciamento médico em um processo mais organizado, rastreável e eficiente. Centralize validações, reduza retrabalho e acompanhe cada etapa com mais controle operacional.
          </p>
          <a
            href="#lead"
            className="mt-7 inline-flex min-w-[320px] items-center justify-center rounded-[1.35rem] bg-hss-roxo px-8 py-4 text-sm font-black text-white shadow-[0_14px_32px_rgba(41,27,127,0.18)] hover:-translate-y-0.5"
          >
            Agendar demonstração
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {beneficios.map((beneficio) => (
            <article
              key={beneficio.titulo}
              className={
                beneficio.destaque
                  ? "revelar-scroll rounded-none bg-white p-7"
                  : "revelar-scroll rounded-2xl border border-[#d8dbea] bg-white p-7 shadow-[0_12px_28px_rgba(15,23,42,0.04)]"
              }
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center text-[#070814]">{beneficio.icone}</div>
              <h3 className="text-xl font-black leading-tight text-[#070814]">{beneficio.titulo}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-[#1f2937]">{beneficio.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
/* === COMPONENTE BENEFICIOS | fim === */

/* === ICONES BENEFICIOS | inicio === */
function IconeFluxo(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v6" /><path d="M6 21v-5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" /><path d="M5 9h14" /><path d="M8 21h.01" /><path d="M12 21h.01" /><path d="M16 21h.01" /></svg>;
}

function IconeCadastro(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h4" /><path d="M7 12h2" /><path d="M13 13a3 3 0 1 0 0-6" /><path d="M15 16h4" /></svg>;
}

function IconeStatus(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16" /><path d="M4 5h4" /><path d="M4 10h10" /><path d="M4 15h7" /><path d="M18 7v10" /><path d="m15 14 3 3 3-3" /></svg>;
}

function IconeMaleta(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1" /><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M3 12h18" /><path d="M9 12v2" /><path d="M15 12v2" /></svg>;
}

function IconeCadeado(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
}

function IconeEscudo(): JSX.Element {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>;
}
/* === ICONES BENEFICIOS | fim === */
