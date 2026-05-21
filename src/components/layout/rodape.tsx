import { useState } from "react";
import logoFiap from "@/assets/logo-fiap.png";
import logoHss from "@/assets/logo-health-sync-solutions.png";
import { fontesConsultadas } from "@/data/conteudoHss";

/* === RODAPE | inicio === */
const redesHss = [
  { label: "Site Health Sync Solutions", href: "https://syncidsolutions.com/", texto: "Site" },
  { label: "LinkedIn Health Sync Solutions", href: "https://www.linkedin.com/company/health-sync-solutions", texto: "LinkedIn" },
  { label: "Facebook Health Sync Solutions", href: "https://www.facebook.com/", texto: "Facebook" },
  { label: "Instagram Health Sync Solutions", href: "https://www.instagram.com/", texto: "Instagram" },
];

const redesFiap = [
  { label: "Site FIAP", href: "https://www.fiap.com.br/", texto: "Site" },
  { label: "LinkedIn FIAP", href: "https://www.linkedin.com/school/fiap/", texto: "LinkedIn" },
  { label: "Facebook FIAP", href: "https://www.facebook.com/fiap", texto: "Facebook" },
  { label: "Instagram FIAP", href: "https://www.instagram.com/fiapoficial/", texto: "Instagram" },
];

export function Rodape(): JSX.Element {
  const [modalFontesAberto, definirModalFontesAberto] = useState(false);

  return (
    <footer className="relative z-10 border-t border-[#d7d9e6] bg-[#eef0f7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1110px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-7">
            <img src={logoHss} alt="Health Sync Solutions" className="h-12 w-48 object-contain object-left" />
            <span className="h-8 w-px bg-[#c8ccdc]" aria-hidden="true" />
            <img src={logoFiap} alt="FIAP" className="h-10 w-28 object-contain object-left" />
          </div>

          <p className="mt-5 max-w-[620px] text-sm font-medium leading-6 text-slate-600">
            Health Sync Solutions - FIAP MedTech Challenge - Landing light com calculadora de ROI por tempo de credenciamento.
          </p>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            © 2026 Health Sync Solutions. Todos os direitos reservados.
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
              <h2 className="text-2xl font-black text-[#070814]">Fontes e referências</h2>
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
  redes: Array<{ label: string; href: string; texto: string }>;
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
            className="inline-flex h-9 items-center justify-center rounded-full border border-hss-violeta/20 bg-white px-3 text-xs font-black text-hss-roxo shadow-sm hover:-translate-y-0.5 hover:shadow-neon"
          >
            {rede.texto}
          </a>
        ))}
      </div>
    </div>
  );
}
/* === RODAPE | fim === */
