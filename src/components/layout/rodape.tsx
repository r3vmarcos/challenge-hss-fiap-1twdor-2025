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

export function Rodape(): JSX.Element {
  const [modalFontesAberto, definirModalFontesAberto] = useState(false);

  return (
    <footer className="relative z-10 border-t border-[#d7d9e6] bg-[#eef0f7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1110px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-7">
            <img
              src={logoHss}
              alt="Health Sync Solutions"
              className="h-12 w-48 object-contain object-left"
            />
            <span className="h-8 w-px bg-[#c8ccdc]" aria-hidden="true" />
            <img
              src={logoFiap}
              alt="FIAP"
              className="h-10 w-28 object-contain object-left"
            />
          </div>

          <p className="mt-5 max-w-[620px] text-sm font-medium leading-6 text-slate-600">
            Health Sync Solutions - FIAP MedTech Challenge.
          </p>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            © 2026 Health Sync Solutions. Todos os direitos reservados.
          </p>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            © 2026 FIAP. Todos os direitos reservados.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <GrupoRedes titulo="Health Sync Solutions" redes={redesHss} />
          <GrupoRedes titulo="FIAP" redes={redesFiap} />

          <button
            type="button"
            onClick={() => definirModalFontesAberto(true)}
            className="w-fit rounded-full border border-hss-violeta/20 bg-white px-5 py-3 text-sm font-black text-hss-roxo shadow-sm hover:-translate-y-0.5 hover:shadow-neon sm:col-span-2"
          >
            Fontes e referências
          </button>
        </div>
      </div>

      {modalFontesAberto ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-hss-tinta/70 px-4 backdrop-blur-sm">
          <div className="max-h-[82vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-hss-violeta/20 bg-white p-6 shadow-neon">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black text-[#070814]">
                Fontes e referências
              </h2>
              <button
                type="button"
                onClick={() => definirModalFontesAberto(false)}
                aria-label="Fechar fontes e referências"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hss-violeta/20 text-xl font-black text-hss-roxo"
              >
                x
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
      <h3 className="text-sm font-black text-[#070814]">{titulo}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {redes.map((rede) => (
          <a
            key={rede.label}
            href={rede.href}
            target="_blank"
            rel="noreferrer"
            aria-label={rede.label}
            title={rede.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hss-violeta/20 bg-white text-hss-roxo shadow-sm hover:-translate-y-0.5 hover:shadow-neon"
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
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M6.94 8.98H3.75v10.27h3.19V8.98ZM5.34 7.58a1.84 1.84 0 1 0 0-3.68 1.84 1.84 0 0 0 0 3.68ZM20.25 13.56c0-3.1-1.66-4.54-3.86-4.54a3.32 3.32 0 0 0-3.01 1.66h-.04v-1.7h-3.06v10.27h3.19v-5.08c0-1.34.25-2.64 1.91-2.64 1.64 0 1.66 1.53 1.66 2.72v5h3.21v-5.69Z" />
      </svg>
    );
  }

  if (tipo === "facebook") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M14.2 8.36V6.9c0-.71.47-.88.8-.88h2.03V2.9l-2.79-.01c-3.1 0-3.8 2.32-3.8 3.8v1.67H8.66v3.22h1.78v9.53h3.76v-9.53h2.53l.33-3.22H14.2Z" />
      </svg>
    );
  }

  if (tipo === "instagram") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
/* === RODAPE | fim === */
