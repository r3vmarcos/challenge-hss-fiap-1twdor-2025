import type { HTMLAttributes, ReactNode } from 'react';

interface CardSpotlightProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  as?: 'article' | 'div';
}

/* === COMPONENTE CARD SPOTLIGHT | inicio === */
export function CardSpotlight({
  children,
  className = '',
  as = 'article',
  ...propriedades
}: CardSpotlightProps): JSX.Element {
  const Componente = as;

  return (
    <Componente className={`card-spotlight ${className}`} {...propriedades}>
      <span className="card-spotlight-brilho" aria-hidden="true" />
      <span className="relative z-10 block">{children}</span>
    </Componente>
  );
}
/* === COMPONENTE CARD SPOTLIGHT | fim === */
