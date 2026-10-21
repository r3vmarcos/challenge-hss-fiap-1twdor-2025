import { useEffect, useState } from "react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { LogoOrigami } from "@/components/ui/logo-origami";

/* === COMPONENTE CABECALHO | inicio === */
interface CabecalhoProps {
  dicasHoverAtivas: boolean;
  aoAlternarDicasHover: () => void;
  paginaAdm?: boolean;
}

// Destaque pequeno (roxo e peso 600) para os itens que levam a acao: calculadora e demonstracao.
// Troca peso e cor em vez de somar classes, para nao depender da ordem do CSS gerado.
function comDestaque(classe: string): string {
  return classe.replace("font-normal", "font-semibold").replace("font-bold", "font-semibold").replace("text-[#070814]", "text-hss-roxo");
}

const links: { href: string; label: string; destaque?: boolean }[] = [
  { href: "#beneficios", label: "Benefícios" },
  { href: "#como-funciona", label: "Como funciona?" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#roi", label: "Calculadora ROI", destaque: true },
];

export function Cabecalho({
  paginaAdm = false,
}: CabecalhoProps): JSX.Element {
  const [menuMobileAberto, definirMenuMobileAberto] = useState(false);
  const [paginaRolada, definirPaginaRolada] = useState(false);
  const linksMobile = links;

  // No topo (hero) o cabecalho fica sem borda inferior; ao rolar, a borda aparece para separar do conteudo.
  useEffect(() => {
    function atualizarRolagem(): void {
      definirPaginaRolada(window.scrollY > 8);
    }

    atualizarRolagem();
    window.addEventListener("scroll", atualizarRolagem, { passive: true });
    return () => window.removeEventListener("scroll", atualizarRolagem);
  }, []);

  if (paginaAdm) {
    return (
      <header className="fixed left-0 right-0 top-0 z-[80] border-b border-[#d9dbe7] bg-[#eef0f7]/95 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-2 sm:px-8 lg:px-12 lg:py-3 xl:px-16">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <a href="#topo" className="flex min-w-0 shrink items-center" aria-label="Ir para o início">
              <LogoOrigami />
            </a>

            <ShimmerButton
              href="#topo"
              variante="contorno"
              className="h-10 shrink-0 whitespace-nowrap px-5 text-xs leading-none transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.04] lg:h-11 lg:text-[0.8125rem]"
            >
              Sair
            </ShimmerButton>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={[
        "fixed left-0 right-0 top-0 z-[80] border-b bg-[#eef0f7]/95 backdrop-blur-xl transition-[border-color] duration-1000 ease-in-out",
        paginaRolada ? "border-[#d9dbe7]" : "border-transparent",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 py-2 sm:px-8 lg:px-12 lg:py-3 xl:px-16">
        <div className="flex justify-between items-center gap-1.5 sm:gap-2">
          <a href="#topo" className="flex min-w-0 shrink items-center" aria-label="Ir para o início">
            <LogoOrigami />
          </a>

            <NavPrincipal
              paginaAdm={paginaAdm}
              className="hidden items-center gap-[clamp(0.75rem,1.4vw,1.5rem)] lg:flex"
              linkClassName="whitespace-nowrap text-[clamp(0.75rem,0.95vw,0.8125rem)] font-normal tracking-[0.01em] text-[#070814] transition-[color,transform] duration-200 hover:scale-[1.06] hover:text-hss-violeta"
            />

            {/* No desktop, os dois atalhos ficam dentro da navegação; no tablet e no celular, viram botões no header.
                Em telas bem estreitas, "Agendar demonstração" encurta para "Agendar". */}
            {!paginaAdm ? (
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
                <a
                  href="#roi"
                  className="inline-flex h-9 items-center whitespace-nowrap rounded-full border border-hss-roxo/30 bg-white px-3 text-[0.75rem] font-semibold text-hss-roxo transition-colors hover:border-hss-roxo min-[390px]:text-[0.8125rem] sm:px-4"
                >
                  Calcular ROI
                </a>
                <a
                  href="#lead"
                  className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-hss-roxo px-3 text-[0.75rem] font-semibold text-white transition-colors hover:bg-hss-violeta min-[390px]:text-[0.8125rem] sm:px-4"
                >
                  <span className="min-[430px]:hidden">Agendar</span>
                  <span className="hidden min-[430px]:inline">Agendar demonstração</span>
                </a>
              </div>
            ) : null}

          <div className="flex items-center justify-end gap-1 sm:gap-3">
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
            <a
              href="#adm"
              className="hidden h-10 w-10 items-center justify-center justify-self-end rounded-full border border-[#d8dbe7] bg-white text-hss-roxo shadow-sm hover:-translate-y-0.5 hover:border-hss-violeta/40 hover:shadow-neon sm:inline-flex"
              aria-label="Abrir portal ADM"
              title="Portal ADM"
            >
              <IconePortalAdm />
            </a>
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
                className={[
                  "rounded-xl px-3 py-2 text-sm font-bold hover:bg-hss-violeta/10 hover:text-hss-roxo",
                  link.destaque ? "text-hss-roxo" : "text-[#070814]",
                ].join(" ")}
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
          <a key={link.href} href={link.href} className={link.destaque ? comDestaque(linkClassName) : linkClassName}>
            {link.label}
          </a>
      )}
      <a href="#lead" className={comDestaque(linkClassName)}>
        Agendar demonstração
      </a>
    </nav>
  );
}
/* === NAVEGACAO PRINCIPAL | fim === */

/* === ICONE PORTAL ADM | inicio === */
function IconePortalAdm(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 640 640"
      className="h-5 w-5"
      fill="#291B7F"
    >
      <path d="M256.5 72C322.8 72 376.5 125.7 376.5 192C376.5 258.3 322.8 312 256.5 312C190.2 312 136.5 258.3 136.5 192C136.5 125.7 190.2 72 256.5 72zM226.7 368L286.1 368L287.6 368C274.7 394.8 279.8 426.2 299.1 447.5C278.9 469.8 274.3 503.3 289.7 530.9L312.2 571.3C313.1 572.9 314.1 574.5 315.1 576L78.1 576C61.7 576 48.4 562.7 48.4 546.3C48.4 447.8 128.2 368 226.7 368zM432.6 311.6C432.6 298.3 443.3 287.6 456.6 287.6L504.6 287.6C517.9 287.6 528.6 298.3 528.6 311.6L528.6 317.7C528.6 336.6 552.7 350.5 569.1 341.1L574.1 338.2C585.7 331.5 600.6 335.6 607.1 347.3L629.5 387.5C635.7 398.7 632.1 412.7 621.3 419.5L616.6 422.4C600.4 432.5 600.4 462.3 616.6 472.5L621.2 475.4C632 482.2 635.7 496.2 629.5 507.4L607 547.8C600.5 559.5 585.6 563.7 574 556.9L569.1 554C552.7 544.5 528.6 558.5 528.6 577.4L528.6 583.5C528.6 596.8 517.9 607.5 504.6 607.5L456.6 607.5C443.3 607.5 432.6 596.8 432.6 583.5L432.6 577.6C432.6 558.6 408.4 544.6 391.9 554.1L387.1 556.9C375.5 563.6 360.7 559.5 354.1 547.8L331.5 507.4C325.3 496.2 328.9 482.1 339.8 475.3L344.2 472.6C360.5 462.5 360.5 432.5 344.2 422.4L339.7 419.6C328.8 412.8 325.2 398.7 331.4 387.5L353.9 347.2C360.4 335.5 375.3 331.4 386.8 338.1L391.6 340.9C408.1 350.4 432.3 336.4 432.3 317.4L432.3 311.5zM532.5 447.8C532.5 419.1 509.2 395.8 480.5 395.8C451.8 395.8 428.5 419.1 428.5 447.8C428.5 476.5 451.8 499.8 480.5 499.8C509.2 499.8 532.5 476.5 532.5 447.8z"/>
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
