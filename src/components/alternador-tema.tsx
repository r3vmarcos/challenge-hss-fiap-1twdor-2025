/* === COMPONENTE ALTERNADOR DE TEMA | inicio === */
interface AlternadorTemaProps {
  temaEscuro: boolean;
  aoAlternar: () => void;
}

export function AlternadorTema({
  temaEscuro,
  aoAlternar,
}: AlternadorTemaProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={aoAlternar}
      title={
        temaEscuro
          ? "Alternar para tema claro"
          : "Alternar para tema escuro"
      }
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hss-violeta/30 bg-white/80 text-hss-roxo shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-neon dark:bg-white/10 dark:text-white"
      aria-label={
        temaEscuro
          ? "Alternar para tema claro"
          : "Alternar para tema escuro"
      }
    >
      {temaEscuro ? (
        <IconeSol />
      ) : (
        <IconeLua />
      )}
    </button>
  );
}

function IconeSol(): JSX.Element {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function IconeLua(): JSX.Element {
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
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
  );
}
/* === COMPONENTE ALTERNADOR DE TEMA | fim === */
