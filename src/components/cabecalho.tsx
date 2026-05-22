import { useState } from "react";
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
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#roi", label: "Calculadora ROI", destaque: true },
];

export function Cabecalho({
  paginaAdm = false,
}: CabecalhoProps): JSX.Element {
  const [menuMobileAberto, definirMenuMobileAberto] = useState(false);
  const linksMobile = links.filter((link) => !link.destaque);

  return (
    <header className="fixed left-0 right-0 top-0 z-[80] border-b border-[#d9dbe7] bg-[#eef0f7]/95 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1110px] px-2 py-2 sm:px-6 lg:px-0 lg:py-3">
        <div className="flex min-w-0 items-center justify-between gap-1.5 sm:gap-2">
          <a href="#topo" className="flex min-w-0 shrink items-center" aria-label="Ir para o início">
            <LogoOrigami />
          </a>

          <NavPrincipal
            paginaAdm={paginaAdm}
            className="hidden items-center gap-6 lg:flex"
            linkClassName="text-[13px] font-normal tracking-[0.01em] text-[#070814] hover:text-hss-violeta"
          />

          <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-3">
            {!paginaAdm ? (
              <ShimmerButton
                href="#roi"
                variante="contorno"
                className="shrink-0 whitespace-nowrap px-2 py-2 text-[9px] leading-none min-[390px]:px-2.5 min-[390px]:text-[10px] sm:px-4 sm:text-xs lg:hidden"
              >
                Calculadora ROI
              </ShimmerButton>
            ) : null}

            <ShimmerButton href="#lead" className="shrink-0 whitespace-nowrap px-2 py-2 text-[9px] leading-none min-[390px]:px-2.5 min-[390px]:text-[10px] sm:px-4 sm:text-xs lg:px-6 lg:py-3 lg:text-[13px]">
              Agendar demonstração
            </ShimmerButton>

            <a
              href="#adm"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#d8dbe7] bg-white text-hss-roxo shadow-sm hover:-translate-y-0.5 hover:border-hss-violeta/40 hover:shadow-neon sm:inline-flex"
              aria-label="Abrir portal ADM"
              title="Portal ADM"
            >
              <IconePortalAdm />
            </a>

            {!paginaAdm ? (
              <button
                type="button"
                onClick={() => definirMenuMobileAberto((aberto) => !aberto)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8dbe7] bg-white text-hss-roxo shadow-sm lg:hidden"
                aria-label={menuMobileAberto ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuMobileAberto}
                aria-controls="menu-mobile-principal"
              >
                <IconeMenu aberto={menuMobileAberto} />
              </button>
            ) : null}
          </div>
        </div>

        {!paginaAdm ? (
          <nav
            id="menu-mobile-principal"
            className={[
              "mt-2 grid gap-1.5 overflow-hidden rounded-2xl border border-[#d9dbe7] bg-white/95 p-2 shadow-sm transition-all lg:hidden",
              menuMobileAberto
                ? "max-h-64 opacity-100"
                : "max-h-0 border-transparent p-0 opacity-0",
            ].join(" ")}
            aria-label="Navegação mobile"
          >
            {linksMobile.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => definirMenuMobileAberto(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-[#070814] hover:bg-hss-violeta/10 hover:text-hss-roxo"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#adm"
              onClick={() => definirMenuMobileAberto(false)}
              className="rounded-xl px-3 py-2 text-sm font-bold text-hss-roxo hover:bg-hss-violeta/10 sm:hidden"
            >
              Portal ADM
            </a>
          </nav>
        ) : null}
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

/* === ICONE MENU MOBILE | inicio === */
function IconeMenu({ aberto }: { aberto: boolean }): JSX.Element {
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
      {aberto ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}
/* === ICONE MENU MOBILE | fim === */
