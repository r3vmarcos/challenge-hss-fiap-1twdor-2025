/* === COMPONENTE CAMPO NUMERICO | inicio === */
interface CampoNumericoProps {
  id: string;
  label: string;
  valor: number;
  ajuda?: string;
  prefixo?: string;
  sufixo?: string;
  min?: number;
  max?: number;
  passo?: number;
  aoMudar: (valor: number) => void;
}
export function CampoNumerico({
  id,
  label,
  valor,
  ajuda,
  prefixo,
  sufixo,
  min = 0,
  max,
  passo = 1,
  aoMudar,
}: CampoNumericoProps): JSX.Element {
  return (
    <label
      htmlFor={id}
      className="block rounded-2xl border border-hss-violeta/15 bg-white/75 p-2.5 shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <span className="block text-xs font-extrabold text-slate-800 dark:text-white">
        {label}
      </span>
      {ajuda ? (
        <span className="mt-0.5 block text-[11px] leading-4 text-slate-500 dark:text-slate-400">
          {ajuda}
        </span>
      ) : null}
      <div className="mt-1.5 flex items-center gap-1.5 rounded-xl border border-hss-violeta/20 bg-white px-2 py-1.5 dark:border-white/10 dark:bg-hss-tinta/70">
        {prefixo ? (
          <span className="text-xs font-bold text-slate-400">
            {prefixo}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={passo}
          value={
            Number.isFinite(valor)
              ? valor
              : 0
          }
          onChange={(evento) =>
            aoMudar(
              Number(
                evento.target.value,
              ),
            )
          }
          className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none dark:text-white"
        />
        {sufixo ? (
          <span className="text-xs font-bold text-slate-400">
            {sufixo}
          </span>
        ) : null}
      </div>
    </label>
  );
}
/* === COMPONENTE CAMPO NUMERICO | fim === */
