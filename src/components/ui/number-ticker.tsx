import { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  valor: number;
  duracao?: number;
  prefixo?: string;
  sufixo?: string;
  casasDecimais?: number;
  className?: string;
  compactar?: boolean;
}

/* === COMPONENTE NUMBER TICKER | inicio === */
export function NumberTicker({
  valor,
  duracao = 1200,
  prefixo = '',
  sufixo = '',
  casasDecimais = 0,
  className = '',
  compactar = false,
}: NumberTickerProps): JSX.Element {
  const referencia = useRef<HTMLSpanElement | null>(null);
  const [valorAtual, definirValorAtual] = useState(0);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return;

    const respeitaReducaoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (respeitaReducaoMovimento) {
      definirValorAtual(valor);
      return;
    }

    let quadro = 0;
    let inicio: number | null = null;

    const animar = (tempo: number): void => {
      if (inicio === null) inicio = tempo;
      const progresso = Math.min((tempo - inicio) / duracao, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      definirValorAtual(valor * suavizado);
      if (progresso < 1) quadro = window.requestAnimationFrame(animar);
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
          quadro = window.requestAnimationFrame(animar);
          observador.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observador.observe(elemento);

    return () => {
      observador.disconnect();
      window.cancelAnimationFrame(quadro);
    };
  }, [duracao, valor]);

  const numeroFormatado = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: casasDecimais,
    minimumFractionDigits: casasDecimais,
    notation: compactar ? 'compact' : 'standard',
  }).format(valorAtual);

  return (
    <span ref={referencia} className={className}>
      {prefixo}{numeroFormatado}{sufixo}
    </span>
  );
}
/* === COMPONENTE NUMBER TICKER | fim === */
