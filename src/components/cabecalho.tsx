import { ShimmerButton } from "@/components/ui/shimmer-button";
import { LogoOrigami } from "@/components/ui/logo-origami";

/* === COMPONENTE CABECALHO | inicio === */
interface CabecalhoProps {
  dicasHoverAtivas: boolean;
  aoAlternarDicasHover: () => void;
  paginaAdm?: boolean;
}

const links = [
  { href: "#beneficios", label: "Benefícios" },
  { href: "#como-funciona", label: "Como funciona?" },
  { href: "#diferencial", label: "Diferencial" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#roi", label: "Calculadora ROI", destaque: true },
];

export function Cabecalho({
  paginaAdm = false,
}: CabecalhoProps): JSX.Element {
  return (
    <header className="fixed left-0 right-0 top-0 z-[80] border-b border-[#d9dbe7] bg-[#eef0f7]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1110px] px-4 py-3 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between gap-4">
          <a href="#topo" className="flex items-center" aria-label="Ir para o início">
            <LogoOrigami />
          </a>

          <NavPrincipal
            paginaAdm={paginaAdm}
            className="hidden items-center gap-6 lg:flex"
            linkClassName="text-[13px] font-normal tracking-[0.01em] text-[#070814] hover:text-hss-violeta"
          />

          <div className="flex items-center gap-3">
            <ShimmerButton href="#lead" className="hidden px-6 py-3 text-[13px] sm:inline-flex">
              Agendar demonstração
            </ShimmerButton>
            <a
              href="#adm"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8dbe7] bg-white text-hss-roxo shadow-sm hover:-translate-y-0.5 hover:border-hss-violeta/40 hover:shadow-neon"
              aria-label="Abrir portal ADM"
              title="Portal ADM"
            >
              <IconePortalAdm />
            </a>
          </div>
        </div>

        <NavPrincipal
          paginaAdm={paginaAdm}
          className="scrollbar-hss mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden"
          linkClassName="shrink-0 rounded-full border border-[#d9dbe7] bg-white px-4 py-2 text-xs font-normal text-[#070814] shadow-sm"
        />
      </div>
    </header>
  );
}
/* === COMPONENTE CABECALHO | fim === */

/* === NAVEGACAO PRINCIPAL | inicio === */
function NavPrincipal({
  paginaAdm,
  className,
  linkClassName,
}: {
  paginaAdm: boolean;
  className: string;
  linkClassName: string;
}): JSX.Element {
  if (paginaAdm) {
    return (
      <nav className={className} aria-label="Navegação principal">
        <a href="#topo" className={linkClassName}>
          Landing
        </a>
      </nav>
    );
  }

  return (
    <nav className={className} aria-label="Navegação principal">
      {links.map((link) =>
        link.destaque ? (
          <ShimmerButton
            key={link.href}
            href={link.href}
            variante="contorno"
            className="shrink-0 px-5 py-2 text-[13px]"
          >
            {link.label}
          </ShimmerButton>
        ) : (
          <a key={link.href} href={link.href} className={linkClassName}>
            {link.label}
          </a>
        ),
      )}
    </nav>
  );
}
/* === NAVEGACAO PRINCIPAL | fim === */

/* === ICONE PORTAL ADM | inicio === */
function IconePortalAdm(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 18v2" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  );
}
/* === ICONE PORTAL ADM | fim === */
