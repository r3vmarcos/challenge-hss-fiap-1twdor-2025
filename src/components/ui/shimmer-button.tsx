import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type VarianteShimmer = 'primario' | 'contorno';
type ElementoShimmer = 'a' | 'button';

type PropriedadesBase = {
  children: ReactNode;
  variante?: VarianteShimmer;
  className?: string;
  as?: ElementoShimmer;
};

type PropriedadesLink = PropriedadesBase & AnchorHTMLAttributes<HTMLAnchorElement> & { as?: 'a' };
type PropriedadesBotao = PropriedadesBase & ButtonHTMLAttributes<HTMLButtonElement> & { as: 'button' };

type PropriedadesShimmerButton = PropriedadesLink | PropriedadesBotao;

/* === COMPONENTE SHIMMER BUTTON | inicio === */
export function ShimmerButton({
  children,
  variante = 'primario',
  className = '',
  as = 'a',
  ...propriedades
}: PropriedadesShimmerButton): JSX.Element {
  const classeBase = [
    'shimmer-button inline-flex',
    variante === 'contorno' ? 'shimmer-button-contorno' : 'shimmer-button-primario',
    className,
  ].join(' ');

  if (as === 'button') {
    const propriedadesBotao = propriedades as ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button type={propriedadesBotao.type ?? 'button'} className={classeBase} {...propriedadesBotao}>
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  const propriedadesLink = propriedades as AnchorHTMLAttributes<HTMLAnchorElement>;

  return (
    <a className={classeBase} {...propriedadesLink}>
      <span className="relative z-10">{children}</span>
    </a>
  );
}
/* === COMPONENTE SHIMMER BUTTON | fim === */
