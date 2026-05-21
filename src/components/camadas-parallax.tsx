/* === CAMADAS PARALLAX | inicio === */
export function CamadasParallax(): JSX.Element {
  return (
    <div
      className="camadas-parallax"
      aria-hidden="true"
    >
      <span
        className="parallax-profundidade parallax-plano parallax-plano-a"
        data-parallax-depth="-0.035"
        data-parallax-pointer="10"
      />
      <span
        className="parallax-profundidade parallax-plano parallax-plano-b"
        data-parallax-depth="0.025"
        data-parallax-pointer="7"
        data-parallax-invert="true"
      />
      <span
        className="parallax-profundidade parallax-grade parallax-grade-a"
        data-parallax-depth="-0.018"
        data-parallax-pointer="5"
      />
      <span
        className="parallax-profundidade parallax-grade parallax-grade-b"
        data-parallax-depth="0.04"
        data-parallax-pointer="9"
        data-parallax-invert="true"
      />
      <span
        className="parallax-profundidade parallax-linha parallax-linha-a"
        data-parallax-depth="-0.055"
        data-parallax-pointer="12"
      />
      <span
        className="parallax-profundidade parallax-linha parallax-linha-b"
        data-parallax-depth="0.03"
        data-parallax-pointer="8"
        data-parallax-invert="true"
      />
      <span
        className="parallax-profundidade parallax-chip parallax-chip-a"
        data-parallax-depth="-0.045"
        data-parallax-pointer="13"
      />
      <span
        className="parallax-profundidade parallax-chip parallax-chip-b"
        data-parallax-depth="0.02"
        data-parallax-pointer="6"
        data-parallax-invert="true"
      />
    </div>
  );
}
/* === CAMADAS PARALLAX | fim === */
