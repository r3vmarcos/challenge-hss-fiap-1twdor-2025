import type { ReactNode } from "react";
import { BotaoInfo } from "@/components/ui/botao-info";

/* === COMPONENTE CAMPO NUMERICO | inicio === */
interface CampoNumericoProps {
  id: string;
  label: string;
  valor: number;
  ajuda?: string;
  info?: ReactNode;
  prefixo?: string;
  sufixo?: string;
  min?: number;
  max?: number;
  passo?: number;
  desativado?: boolean;
  aoMudar: (valor: number) => void;
}

export function CampoNumerico({
  id,
  label,
  valor,
  ajuda,
  info,
  prefixo,
  sufixo,
  min = 0,
  max,
  passo = 1,
  desativado = false,
  aoMudar,
}: CampoNumericoProps): JSX.Element {
  const idAjuda = ajuda ? `${id}-ajuda` : undefined;

  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-1.5 mt-auto">
        <div className="flex items-end justify-between gap-2">
          <label htmlFor={id} className="block whitespace-pre-line text-sm font-semibold leading-5 text-slate-950">
            {label}
          </label>
          {info ? <BotaoInfo titulo={label}>{info}</BotaoInfo> : null}
        </div>
        {ajuda ? (
          <p id={idAjuda} className="mt-0.5 text-[0.8125rem] leading-5 text-slate-600">
            {ajuda}
          </p>
        ) : null}
      </div>
      {/* O mt-auto do rotulo encosta rotulo e campo na base: alinham mesmo quando um rotulo vizinho quebra em duas linhas. */}
      <div
        className={[
          "flex h-11 shrink-0 items-center gap-2 rounded-xl border px-3",
          desativado
            ? "border-hss-violeta/10 bg-hss-violeta/5"
            : "border-hss-violeta/15 bg-[#f3f4f6] transition focus-within:border-hss-violeta focus-within:bg-white focus-within:ring-4 focus-within:ring-hss-lavanda/30",
        ].join(" ")}
      >
        {prefixo ? <span className="text-sm font-medium text-slate-600">{prefixo}</span> : null}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={passo}
          disabled={desativado}
          aria-describedby={idAjuda}
          value={Number.isFinite(valor) ? valor : 0}
          onChange={(evento) => {
            const convertido = Number(evento.target.value);
            const limitado = max !== undefined ? Math.min(max, convertido) : convertido;
            aoMudar(Number.isFinite(limitado) ? Math.max(min, limitado) : min);
          }}
          className="w-full min-w-0 bg-transparent text-base font-semibold tabular-nums text-slate-950 shadow-none outline-none hover:shadow-none focus:shadow-none disabled:text-slate-600"
        />
        {sufixo ? <span className="shrink-0 text-sm font-medium text-slate-600">{sufixo}</span> : null}
      </div>
    </div>
  );
}
/* === COMPONENTE CAMPO NUMERICO | fim === */
