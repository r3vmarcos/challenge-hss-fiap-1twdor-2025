import { useEffect, useRef, useState, type RefObject } from 'react';

/* === CONSTANTES DO ENCAIXE | inicio === */
export const GIROS_PARA_SAIR = 3;
const DELTA_POR_GIRO = 90;
const ZONA_CAPTURA = 0.3;
const TEMPO_ANIMACAO_MS = 700;
const TEMPO_ZERAR_GIROS_MS = 1200;
const TECLAS_ROLAGEM: Record<string, number> = { ArrowDown: 1, PageDown: 1, ' ': 1, End: 1, ArrowUp: -1, PageUp: -1, Home: -1 };
// Classe ja existente no CSS: esconde o cabecalho fixo enquanto a calculadora ocupa a tela.
const CLASSE_CORPO = 'calculadora-travada';
/* === CONSTANTES DO ENCAIXE | fim === */

/* === APOIO | inicio === */
function podeRolarDentro(alvo: EventTarget | null, limite: HTMLElement, direcao: number): boolean {
  let elemento = alvo instanceof HTMLElement ? alvo : null;

  while (elemento && elemento !== limite.parentElement) {
    const estilo = window.getComputedStyle(elemento);
    const rolavel = /(auto|scroll)/.test(estilo.overflowY) && elemento.scrollHeight > elemento.clientHeight + 1;

    if (rolavel) {
      const noTopo = elemento.scrollTop <= 0;
      const noFim = elemento.scrollTop + elemento.clientHeight >= elemento.scrollHeight - 1;
      if ((direcao < 0 && !noTopo) || (direcao > 0 && !noFim)) return true;
    }

    elemento = elemento.parentElement;
  }

  return false;
}

function campoDeTexto(alvo: EventTarget | null): boolean {
  return alvo instanceof HTMLElement && /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(alvo.tagName);
}
/* === APOIO | fim === */

/* === HOOK DE ENCAIXE MAGNETICO | inicio === */
// Ao parar a rolagem perto do elemento (ou chegar nele por link), centraliza-o na tela e segura a pagina.
// Para sair, o visitante gira a roda do mouse GIROS_PARA_SAIR vezes seguidas na mesma direcao.
// So vale para ponteiro fino (mouse/trackpad); em telas de toque a rolagem continua livre.
// Retorna tambem `centralizar`, para recolocar a caixa na tela apos acoes de navegacao da calculadora.
export function useEncaixeMagnetico(referencia: RefObject<HTMLElement>): { encaixado: boolean; girosDados: number; centralizar: () => void } {
  const [encaixado, definirEncaixado] = useState(false);
  const centralizarRef = useRef<() => void>(() => {
    // Reserva para telas de toque, onde o encaixe nao e ativado: apenas rola ate a caixa.
    referencia.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  const [girosDados, definirGirosDados] = useState(0);
  const estado = useRef({ encaixado: false, armado: true, animando: false, acumulado: 0, direcao: 0, ultimoGiro: 0, giros: 0 });

  useEffect(() => {
    // Toque (tablet/celular): sem encaixe; o link "#roi" so alinha a caixa no centro da tela, inclusive quando o hash ja e #roi.
    if (!window.matchMedia('(pointer: fine)').matches) {
      let temporizadorToque = 0;
      let temporizadorAjuste = 0;
      const centralizarAgora = (comportamento: ScrollBehavior): void => {
        const caixa = referencia.current;
        if (!caixa) return;
        const retangulo = caixa.getBoundingClientRect();
        const distancia = retangulo.top - (window.innerHeight - retangulo.height) / 2;
        if (Math.abs(distancia) > 2) window.scrollBy({ top: distancia, behavior: comportamento });
      };
      // Ao terminar a rolagem suave, corrige a posicao: imagens e secoes que aparecem no caminho mudam a altura da pagina
      // e a caixa parava fora do centro.
      const ajustarNoFim = (): void => {
        window.clearTimeout(temporizadorAjuste);
        temporizadorAjuste = window.setTimeout(() => {
          window.removeEventListener('scroll', ajustarNoFim);
          centralizarAgora('instant');
        }, 180);
      };
      const aoTocarLink = (evento: MouseEvent): void => {
        const alvo = evento.target instanceof Element ? evento.target.closest('a[href="#roi"]') : null;
        if (!alvo) return;
        window.clearTimeout(temporizadorToque);
        temporizadorToque = window.setTimeout(() => {
          centralizarAgora('smooth');
          window.addEventListener('scroll', ajustarNoFim, { passive: true });
          ajustarNoFim();
        }, 60);
      };
      document.addEventListener('click', aoTocarLink);
      return () => {
        window.clearTimeout(temporizadorToque);
        window.clearTimeout(temporizadorAjuste);
        window.removeEventListener('scroll', ajustarNoFim);
        document.removeEventListener('click', aoTocarLink);
      };
    }

    const comportamento: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const s = estado.current;
    let temporizadorAnimacao = 0;
    let temporizadorFimRolagem = 0;
    let temporizadorZerar = 0;

    function distanciaAteEncaixe(): number | null {
      const elemento = referencia.current;
      if (!elemento) return null;

      const caixa = elemento.getBoundingClientRect();
      return caixa.top - Math.max(0, (window.innerHeight - caixa.height) / 2);
    }

    function marcarAnimacao(): void {
      s.animando = true;
      window.clearTimeout(temporizadorAnimacao);
      temporizadorAnimacao = window.setTimeout(() => {
        s.animando = false;
      }, TEMPO_ANIMACAO_MS);
    }

    function atualizarGiros(giros: number): void {
      if (s.giros === giros) return;
      s.giros = giros;
      definirGirosDados(giros);
    }

    function encaixar(distancia: number): void {
      s.encaixado = true;
      s.acumulado = 0;
      atualizarGiros(0);
      definirEncaixado(true);
      document.body.classList.add(CLASSE_CORPO);
      marcarAnimacao();
      if (Math.abs(distancia) > 1) window.scrollBy({ top: distancia, behavior: comportamento });
    }

    function liberar(direcaoSaida: number | null): void {
      s.encaixado = false;
      s.armado = false;
      s.acumulado = 0;
      atualizarGiros(0);
      definirEncaixado(false);
      document.body.classList.remove(CLASSE_CORPO);

      if (direcaoSaida !== null) {
        marcarAnimacao();
        window.scrollBy({ top: direcaoSaida * window.innerHeight * 0.6, behavior: comportamento });
      }
    }

    function avaliarPosicao(): void {
      if (s.animando) return;
      const distancia = distanciaAteEncaixe();
      if (distancia === null) return;

      const zona = window.innerHeight * ZONA_CAPTURA;

      if (s.encaixado) {
        // Saiu por outro caminho (link, barra de rolagem): solta sem mexer na pagina.
        if (Math.abs(distancia) > zona) liberar(null);
        return;
      }

      if (!s.armado) {
        if (Math.abs(distancia) > zona * 1.5) s.armado = true;
        return;
      }

      if (Math.abs(distancia) < zona) encaixar(distancia);
    }

    function aoRolar(): void {
      window.clearTimeout(temporizadorFimRolagem);
      temporizadorFimRolagem = window.setTimeout(avaliarPosicao, 140);
      if (!s.armado && !s.animando) avaliarPosicao();
    }

    function registrarGiro(delta: number): void {
      if (s.animando || delta === 0) return;

      const direcao = Math.sign(delta);
      const agora = performance.now();

      if (direcao !== s.direcao || agora - s.ultimoGiro > TEMPO_ZERAR_GIROS_MS) {
        s.acumulado = 0;
        s.direcao = direcao;
      }

      s.ultimoGiro = agora;
      s.acumulado += Math.abs(delta);
      atualizarGiros(Math.min(GIROS_PARA_SAIR, Math.floor(s.acumulado / DELTA_POR_GIRO)));

      window.clearTimeout(temporizadorZerar);
      temporizadorZerar = window.setTimeout(() => {
        s.acumulado = 0;
        atualizarGiros(0);
      }, TEMPO_ZERAR_GIROS_MS);

      if (s.acumulado >= GIROS_PARA_SAIR * DELTA_POR_GIRO) liberar(direcao);
    }

    function aoGirar(evento: WheelEvent): void {
      const elemento = referencia.current;
      if (!s.encaixado || evento.ctrlKey || !elemento) return;
      if (podeRolarDentro(evento.target, elemento, Math.sign(evento.deltaY))) return;

      evento.preventDefault();
      const fator = evento.deltaMode === 1 ? 40 : evento.deltaMode === 2 ? window.innerHeight : 1;
      registrarGiro(evento.deltaY * fator);
    }

    function aoTeclar(evento: KeyboardEvent): void {
      const direcao = TECLAS_ROLAGEM[evento.key];
      if (!s.encaixado || !direcao || campoDeTexto(evento.target) || evento.altKey || evento.ctrlKey || evento.metaKey) return;

      evento.preventDefault();
      registrarGiro(direcao * DELTA_POR_GIRO);
    }

    function centralizarCaixa(): void {
      const distancia = distanciaAteEncaixe();
      if (distancia === null) return;
      s.armado = true;
      encaixar(distancia);
    }

    // Links para a calculadora (ex.: menu "Calculadora ROI") tambem recentralizam, mesmo com o hash ja igual.
    let temporizadorLink = 0;
    function aoClicarLink(evento: MouseEvent): void {
      const alvo = evento.target instanceof Element ? evento.target.closest('a[href="#roi"]') : null;
      if (!alvo) return;
      window.clearTimeout(temporizadorLink);
      temporizadorLink = window.setTimeout(centralizarCaixa, 60);
    }

    // Interagir com qualquer campo ou botao da caixa fora de posicao tambem a realinha na tela.
    function aoInteragirNaCaixa(): void {
      const distancia = distanciaAteEncaixe();
      if (distancia === null || (s.encaixado && Math.abs(distancia) <= 2)) return;
      centralizarCaixa();
    }

    const caixaAtual = referencia.current;
    centralizarRef.current = centralizarCaixa;
    caixaAtual?.addEventListener('focusin', aoInteragirNaCaixa);
    caixaAtual?.addEventListener('pointerdown', aoInteragirNaCaixa);
    document.addEventListener('click', aoClicarLink);
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('wheel', aoGirar, { passive: false });
    window.addEventListener('keydown', aoTeclar);
    window.addEventListener('resize', avaliarPosicao);
    avaliarPosicao();

    return () => {
      window.clearTimeout(temporizadorAnimacao);
      window.clearTimeout(temporizadorFimRolagem);
      window.clearTimeout(temporizadorZerar);
      window.clearTimeout(temporizadorLink);
      caixaAtual?.removeEventListener('focusin', aoInteragirNaCaixa);
      caixaAtual?.removeEventListener('pointerdown', aoInteragirNaCaixa);
      document.removeEventListener('click', aoClicarLink);
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('wheel', aoGirar);
      window.removeEventListener('keydown', aoTeclar);
      window.removeEventListener('resize', avaliarPosicao);
      document.body.classList.remove(CLASSE_CORPO);
    };
  }, [referencia]);

  return { encaixado, girosDados, centralizar: () => centralizarRef.current() };
}
/* === HOOK DE ENCAIXE MAGNETICO | fim === */
