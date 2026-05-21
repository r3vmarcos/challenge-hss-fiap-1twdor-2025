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
          ? "rounded-[1.1rem] bg-hss-roxo p-3 text-white shadow-neon"
          : "rounded-[1.1rem] border border-hss-violeta/15 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/10"
      }
    >
      <p
        className={
          destaque
            ? "text-[10px] font-black uppercase tracking-[0.14em] text-hss-lavanda"
            : "text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
        }
      >
        {titulo}
      </p>
      <strong
        className={
          destaque
            ? "mt-1 block text-2xl font-black text-white"
            : "mt-1 block text-2xl font-black text-hss-roxo dark:text-white"
        }
      >
        {valor}
      </strong>
      <p
        className={
          destaque
            ? "mt-1 text-xs leading-4 text-white/75"
            : "mt-1 text-xs leading-4 text-slate-500 dark:text-slate-300"
        }
      >
        {detalhe}
      </p>
    </article>
  );
}
/* === COMPONENTE CARTAO RESULTADO | fim === */
