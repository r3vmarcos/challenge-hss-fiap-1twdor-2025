import { useEffect, useState } from "react";
import logoFiap from "@/assets/logo-fiap.png";
import logoHss from "@/assets/logo-health-sync-solutions.png";

/* === LOGO ORIGAMI | inicio === */
const logos = [
  { src: logoHss, alt: "Health Sync Solutions", duracaoMs: 5000, classe: "hss" },
  { src: logoFiap, alt: "FIAP", duracaoMs: 2000, classe: "fiap" },
];

export function LogoOrigami(): JSX.Element {
  const [indiceLogo, definirIndiceLogo] = useState(0);
  const logoAtual = logos[indiceLogo];

  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      definirIndiceLogo((indiceAtual) => (indiceAtual + 1) % logos.length);
    }, logoAtual.duracaoMs);

    return () => window.clearTimeout(temporizador);
  }, [logoAtual.duracaoMs]);

  return (
    <span className="logo-origami" aria-label={logoAtual.alt}>
      <span key={`${logoAtual.alt}-sombra`} className="logo-origami-sombra" aria-hidden="true" />
      <span key={logoAtual.alt} className={`logo-origami-face logo-origami-${logoAtual.classe}`}>
        <img src={logoAtual.src} alt={logoAtual.alt} />
      </span>
    </span>
  );
}
/* === LOGO ORIGAMI | fim === */
