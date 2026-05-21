import type { CSSProperties, ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  velocidadeSegundos?: number;
}

/* === COMPONENTE MARQUEE | inicio === */
export function Marquee({
  children,
  className = '',
  velocidadeSegundos = 44,
}: MarqueeProps): JSX.Element {
  return (
    <div className={`marquee-container ${className}`} style={{ '--duracao-marquee': `${velocidadeSegundos}s` } as CSSProperties}>
      <div className="marquee-faixa">
        <div className="marquee-grupo">{children}</div>
        <div className="marquee-grupo" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
/* === COMPONENTE MARQUEE | fim === */
