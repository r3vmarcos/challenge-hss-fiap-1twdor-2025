import { useEffect } from 'react';

/* === HOOK DE REVELACAO NO SCROLL | inicio === */
export function useScrollRevelado(dependencia?: unknown): void {
  useEffect(() => {
    const elementos = Array.from(document.querySelectorAll<HTMLElement>('.revelar-scroll'));
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
          }
        });
      },
      { threshold: 0.18 },
    );

    elementos.forEach((elemento) => observador.observe(elemento));
    return () => observador.disconnect();
  }, [dependencia]);
}
/* === HOOK DE REVELACAO NO SCROLL | fim === */
