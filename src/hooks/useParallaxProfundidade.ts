import { useEffect } from 'react';

/* === HOOK DE PARALLAX DE PROFUNDIDADE | inicio === */
export function useParallaxProfundidade(): void {
  useEffect(() => {
    const consultaMovimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (consultaMovimentoReduzido.matches) return;

    const elementos = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-depth]'));
    if (!elementos.length) return;

    let ponteiroX = 0;
    let ponteiroY = 0;
    let quadroAgendado = false;

    function aplicarParallax(): void {
      const rolagem = window.scrollY;

      elementos.forEach((elemento) => {
        const profundidade = Number(elemento.dataset.parallaxDepth ?? 0);
        const sensibilidadePonteiro = Number(elemento.dataset.parallaxPointer ?? 0);
        const inverter = elemento.dataset.parallaxInvert === 'true' ? -1 : 1;
        const deslocamentoX = ponteiroX * sensibilidadePonteiro * inverter;
        const deslocamentoY = rolagem * profundidade + ponteiroY * sensibilidadePonteiro * inverter;

        elemento.style.transform = `translate3d(${deslocamentoX.toFixed(2)}px, ${deslocamentoY.toFixed(2)}px, 0)`;
      });

      quadroAgendado = false;
    }

    function solicitarQuadro(): void {
      if (quadroAgendado) return;
      quadroAgendado = true;
      window.requestAnimationFrame(aplicarParallax);
    }

    function aoMoverPonteiro(evento: PointerEvent): void {
      ponteiroX = (evento.clientX / window.innerWidth - 0.5) * 2;
      ponteiroY = (evento.clientY / window.innerHeight - 0.5) * 2;
      solicitarQuadro();
    }

    window.addEventListener('scroll', solicitarQuadro, { passive: true });
    window.addEventListener('pointermove', aoMoverPonteiro, { passive: true });
    window.addEventListener('resize', solicitarQuadro);
    solicitarQuadro();

    return () => {
      window.removeEventListener('scroll', solicitarQuadro);
      window.removeEventListener('pointermove', aoMoverPonteiro);
      window.removeEventListener('resize', solicitarQuadro);
      elementos.forEach((elemento) => {
        elemento.style.transform = '';
      });
    };
  }, []);
}
/* === HOOK DE PARALLAX DE PROFUNDIDADE | fim === */
