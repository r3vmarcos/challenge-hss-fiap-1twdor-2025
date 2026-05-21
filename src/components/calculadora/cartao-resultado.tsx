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
          ? "rounded-[1.75rem] bg-hss-roxo p-5 text-white shadow-neon"
          : "rounded-[1.75rem] border border-hss-violeta/15 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/10"
      }
    >
      <p
        className={
          destaque
            ? "text-xs font-black uppercase tracking-[0.18em] text-hss-lavanda"
            : "text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
        }
      >
        {titulo}
      </p>
      <strong
        className={
          destaque
            ? "mt-2 block text-3xl font-black text-white"
            : "mt-2 block text-3xl font-black text-hss-roxo dark:text-white"
        }
      >
        {valor}
      </strong>
      <p
        className={
          destaque
            ? "mt-2 text-sm leading-6 text-white/75"
            : "mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300"
        }
      >
        {detalhe}
      </p>
    </article>
  );
}
/* === COMPONENTE CARTAO RESULTADO | fim === */
