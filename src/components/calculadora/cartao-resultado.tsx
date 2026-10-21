/* === COMPONENTE CARTAO RESULTADO | inicio === */
interface CartaoResultadoProps {
  titulo: string;
  valor: string;
  detalhe: string;
  destaque?: boolean;
}
export function CartaoResultado({
  titulo,
  valor,
  detalhe,
  destaque = false,
}: CartaoResultadoProps): JSX.Element {
  return (
    <article
      className={
        destaque
          ? "rounded-[1.35rem] bg-hss-roxo p-3.5 text-white"
          : "rounded-2xl border border-hss-violeta/15 bg-white p-3"
      }
    >
      <p
        className={
          destaque
            ? "text-[0.8125rem] font-medium text-white/75"
            : "text-[0.8125rem] font-medium text-slate-600"
        }
      >
        {titulo}
      </p>
      <strong
        className={
          destaque
            ? "mt-1 block text-3xl font-semibold tracking-[-0.02em] text-white"
            : "mt-1 block text-xl font-semibold tracking-[-0.01em] text-slate-950"
        }
      >
        {valor}
      </strong>
      <p
        className={
          destaque
            ? "mt-1 text-[0.8125rem] leading-4 text-white/75"
            : "mt-1 text-[0.8125rem] leading-4 text-slate-600"
        }
      >
        {detalhe}
      </p>
    </article>
  );
}
/* === COMPONENTE CARTAO RESULTADO | fim === */
