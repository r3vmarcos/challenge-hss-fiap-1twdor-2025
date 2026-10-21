import { useState } from "react";
import logoFiap from "@/assets/logo-fiap.png";
import logoHss from "@/assets/logo-health-sync-solutions.png";
import { fontesConsultadas } from "@/data/conteudoHss";

/* === RODAPE | inicio === */
const redesHss = [
  {
    label: "Site Health Sync Solutions",
    href: "https://syncidsolutions.com/",
    tipo: "site",
  },
  {
    label: "LinkedIn Health Sync Solutions",
    href: "https://www.linkedin.com/company/health-sync-solutions",
    tipo: "linkedin",
  },
  {
    label: "Facebook Health Sync Solutions",
    href: "https://www.facebook.com/",
    tipo: "facebook",
  },
  {
    label: "Instagram Health Sync Solutions",
    href: "https://www.instagram.com/",
    tipo: "instagram",
  },
];

const redesFiap = [
  {
    label: "Site FIAP",
    href: "https://www.fiap.com.br/",
    tipo: "site",
  },
  {
    label: "LinkedIn FIAP",
    href: "https://www.linkedin.com/school/fiap/",
    tipo: "linkedin",
  },
  {
    label: "Facebook FIAP",
    href: "https://www.facebook.com/fiap",
    tipo: "facebook",
  },
  {
    label: "Instagram FIAP",
    href: "https://www.instagram.com/fiapoficial/",
    tipo: "instagram",
  },
];

// Atalhos para as secoes da landing, na mesma ordem do menu do cabecalho.
const linksNavegacao = [
  { href: "#beneficios", label: "Benefícios" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#roi", label: "Calculadora ROI" },
  { href: "#lead", label: "Agendar demonstração" },
];

const classeBotaoRodape =
  "inline-flex w-fit items-center gap-2 rounded-full border border-hss-violeta/20 bg-white/80 px-3.5 py-1 text-[0.8125rem] font-semibold text-hss-roxo transition hover:border-hss-violeta/50 hover:bg-white";

export function Rodape(): JSX.Element {
  const [modalFontesAberto, definirModalFontesAberto] = useState(false);

  return (
    <footer className="relative z-10 border-t border-[#d7d9e6] bg-white/40 px-4 pt-7 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Marca: logos e proposta curta. */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex flex-wrap items-center gap-6">
            <img src={logoHss} alt="Health Sync Solutions" className="h-11 w-44 object-contain object-left" />
            <span className="h-8 w-px bg-[#c8ccdc]" aria-hidden="true" />
            <img src={logoFiap} alt="FIAP" className="h-9 w-24 object-contain object-left" />
          </div>
          <p className="mt-3 max-w-[34ch] text-sm leading-6 text-slate-600">
            Credenciamento médico digital: centralizado, econômico e confiável. Projeto do FIAP MedTech Challenge.
          </p>
        </div>

        <nav aria-label="Seções do site">
          <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-slate-950">Navegação</h3>
          <ul className="mt-2 grid gap-0">
            {linksNavegacao.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-[0.8125rem] leading-[1.125rem] text-slate-600 transition-colors hover:text-hss-roxo">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <GrupoRedes titulo="Health Sync Solutions" redes={redesHss} />
        <GrupoRedes titulo="FIAP" redes={redesFiap} />
      </div>

      {/* Barra inferior: direitos a esquerda, fontes e codigo a direita. */}
      <div className="mx-auto mt-4 flex max-w-[1200px] flex-col gap-2 border-t border-[#d7d9e6] py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-slate-500">
          <p>© 2026 Health Sync Solutions. Todos os direitos reservados.</p>
          <p>© 2026 FIAP. Todos os direitos reservados.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => definirModalFontesAberto(true)} className={classeBotaoRodape}>
            Fontes e referências
          </button>
          <a href="https://github.com/r3vmarcos/challenge-hss-fiap-1twdor-2025" target="_blank" rel="noreferrer" className={classeBotaoRodape}>
            <IconeRede tipo="github" />
            GitHub
          </a>
        </div>
      </div>

      {modalFontesAberto ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-hss-tinta/70 px-4 backdrop-blur-sm"
          onClick={() => definirModalFontesAberto(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-fontes"
            onClick={(evento) => evento.stopPropagation()}
            className="max-h-[82vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-hss-violeta/20 bg-white p-6 shadow-neon"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="titulo-fontes" className="text-2xl font-black text-[#070814]">
                Fontes e referências
              </h2>
              <button
                type="button"
                onClick={() => definirModalFontesAberto(false)}
                aria-label="Fechar fontes e referências"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hss-violeta/20 text-xl font-semibold text-hss-roxo hover:bg-hss-lavanda/10"
              >
                ×
              </button>
            </div>

            <ul className="mt-5 list-inside list-disc space-y-2 text-sm font-medium leading-6 text-slate-600">
              {fontesConsultadas.map((fonte) => (
                <li key={fonte}>{fonte}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </footer>
  );
}

function GrupoRedes({
  titulo,
  redes,
}: {
  titulo: string;
  redes: Array<{
    label: string;
    href: string;
    tipo: string;
  }>;
}): JSX.Element {
  return (
    <div>
      <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-slate-950">{titulo}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {redes.map((rede) => (
          <a
            key={rede.label}
            href={rede.href}
            target="_blank"
            rel="noreferrer"
            aria-label={rede.label}
            title={rede.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hss-violeta/20 bg-white/80 text-hss-roxo transition hover:border-hss-violeta hover:bg-hss-roxo hover:text-white"
          >
            <IconeRede tipo={rede.tipo} />
          </a>
        ))}
      </div>
    </div>
  );
}

function IconeRede({ tipo }: { tipo: string }): JSX.Element {
  if (tipo === "linkedin") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M6.94 8.98H3.75v10.27h3.19V8.98ZM5.34 7.58a1.84 1.84 0 1 0 0-3.68 1.84 1.84 0 0 0 0 3.68ZM20.25 13.56c0-3.1-1.66-4.54-3.86-4.54a3.32 3.32 0 0 0-3.01 1.66h-.04v-1.7h-3.06v10.27h3.19v-5.08c0-1.34.25-2.64 1.91-2.64 1.64 0 1.66 1.53 1.66 2.72v5h3.21v-5.69Z" />
      </svg>
    );
  }

  if (tipo === "facebook") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63a21 21 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.15H7.92v2.94h2.54V21h3.04Z" />
      </svg>
    );
  }

  if (tipo === "github") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    );
  }

  if (tipo === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
/* === RODAPE | fim === */
