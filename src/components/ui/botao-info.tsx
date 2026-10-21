import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/* === COMPONENTE BOTAO INFO | inicio === */
// Explicacao curta de um campo. Abre ao passar o mouse ou focar; o clique fixa aberta.
// Usa posicao fixa calculada pela janela para nunca ser cortada pela caixa da calculadora nem criar rolagem.
interface BotaoInfoProps {
  titulo: string;
  children: ReactNode;
}

const LARGURA_BALAO = 288;

export function BotaoInfo({ titulo, children }: BotaoInfoProps): JSX.Element {
  const idBalao = useId();
  const botaoRef = useRef<HTMLButtonElement>(null);
  const balaoRef = useRef<HTMLDivElement>(null);
  const [aberto, definirAberto] = useState(false);
  const [fixado, definirFixado] = useState(false);
  const [posicao, definirPosicao] = useState({ topo: 0, esquerda: 0, acima: false });

  function abrir(): void {
    const botao = botaoRef.current;
    if (!botao) return;

    const caixa = botao.getBoundingClientRect();
    const esquerda = Math.min(Math.max(8, caixa.left + caixa.width / 2 - LARGURA_BALAO / 2), window.innerWidth - LARGURA_BALAO - 8);
    const acima = window.innerHeight - caixa.bottom < 200;

    definirPosicao({ topo: acima ? caixa.top - 8 : caixa.bottom + 8, esquerda, acima });
    definirAberto(true);
  }

  function fechar(): void {
    definirAberto(false);
    definirFixado(false);
  }

  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento: KeyboardEvent): void {
      if (evento.key === "Escape") {
        fechar();
        botaoRef.current?.focus();
      }
    }

    function aoTocarFora(evento: PointerEvent): void {
      const alvo = evento.target as Node;
      if (botaoRef.current?.contains(alvo) || balaoRef.current?.contains(alvo)) return;
      fechar();
    }

    window.addEventListener("resize", fechar);
    window.addEventListener("scroll", fechar, true);
    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("pointerdown", aoTocarFora);

    return () => {
      window.removeEventListener("resize", fechar);
      window.removeEventListener("scroll", fechar, true);
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("pointerdown", aoTocarFora);
    };
  }, [aberto]);

  return (
    <>
      <button
        ref={botaoRef}
        type="button"
        aria-label={`O que é: ${titulo}`}
        aria-expanded={aberto}
        aria-controls={aberto ? idBalao : undefined}
        onClick={() => {
          if (fixado) {
            fechar();
            return;
          }
          abrir();
          definirFixado(true);
        }}
        onMouseEnter={abrir}
        onMouseLeave={() => {
          if (!fixado) definirAberto(false);
        }}
        onFocus={abrir}
        onBlur={() => {
          if (!fixado) definirAberto(false);
        }}
        className={[
          "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold leading-none transition-colors",
          aberto ? "border-hss-roxo bg-hss-roxo text-white" : "border-hss-roxo/40 text-hss-roxo hover:border-hss-roxo",
        ].join(" ")}
      >
        i
      </button>

      {aberto ? (
        <div
          ref={balaoRef}
          id={idBalao}
          role="note"
          className="fixed z-[130] rounded-xl bg-hss-tinta px-4 py-3 text-left shadow-neon"
          style={{
            top: posicao.topo,
            left: posicao.esquerda,
            width: LARGURA_BALAO,
            transform: posicao.acima ? "translateY(-100%)" : undefined,
          }}
        >
          <strong className="block text-sm font-semibold text-white">{titulo}</strong>
          <div className="mt-1 text-sm leading-6 text-white/85">{children}</div>
        </div>
      ) : null}
    </>
  );
}
/* === COMPONENTE BOTAO INFO | fim === */
