import logoFiap from "@/assets/logo-fiap.png";
import logoHss from "@/assets/logo-health-sync-solutions.png";
import { fontesConsultadas } from "@/data/conteudoHss";

/* === RODAPE | inicio === */
const redesSociais = [
  { label: "Site HSS", href: "https://syncidsolutions.com/", texto: "Site" },
  { label: "LinkedIn HSS", href: "https://www.linkedin.com/company/health-sync-solutions", texto: "in" },
  { label: "FIAP", href: "https://www.fiap.com.br/", texto: "FIAP" },
];

export function Rodape(): JSX.Element {
  return (
    <footer className="relative z-10 border-t border-[#d7d9e6] bg-[#eef0f7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1110px] gap-8 md:grid-cols-[1fr_auto] md:items-center">
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

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex items-center gap-3">
            {redesSociais.map((rede) => (
              <a
                key={rede.label}
                href={rede.href}
                target="_blank"
                rel="noreferrer"
                aria-label={rede.label}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-hss-violeta/20 bg-white px-3 text-xs font-black text-hss-roxo shadow-sm hover:-translate-y-0.5 hover:shadow-neon"
              >
                {rede.texto}
              </a>
            ))}
          </div>

          <details className="max-w-xl text-sm text-slate-500">
            <summary className="cursor-pointer font-black text-hss-roxo">Fontes e referências</summary>
            <ul className="mt-3 list-inside list-disc space-y-1">
              {fontesConsultadas.map((fonte) => (
                <li key={fonte}>{fonte}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </footer>
  );
}
/* === RODAPE | fim === */
