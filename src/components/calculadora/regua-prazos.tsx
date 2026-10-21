/* === COMPONENTE REGUA DE PRAZOS | inicio === */
interface ReguaPrazosProps {
  diasSemHss: number;
  diasComHss: number;
  mostrarComHss?: boolean;
  animar?: boolean;
  compacta?: boolean;
}

export function ReguaPrazos({
  diasSemHss,
  diasComHss,
  mostrarComHss = true,
  animar = false,
  compacta = false,
}: ReguaPrazosProps): JSX.Element {
  const total = Math.max(1, diasSemHss, diasComHss);
  const economia = Math.max(0, diasSemHss - diasComHss);
  const marcas = [0, Math.round(total / 3), Math.round((total * 2) / 3), total];

  return (
    <div>
      <div className={compacta ? 'grid gap-3' : 'grid gap-4'}>
        <LinhaPrazo rotulo="Sem HSS" dias={diasSemHss} total={total} corBarra="bg-[#f97316]" corTexto="text-[#c2410c]" atraso="0.25s" animar={animar} />
        {mostrarComHss ? (
          <LinhaPrazo
            rotulo="Com HSS"
            dias={diasComHss}
            total={total}
            corBarra="bg-[#079879]"
            corTexto="text-[#075f50]"
            atraso="0.7s"
            animar={animar}
            economia={economia}
          />
        ) : null}
      </div>

      {compacta ? null : (
        <>
          <div
            aria-hidden="true"
            className="mt-3 h-2"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, rgba(41,27,127,0.32) 0 1px, transparent 1px ${100 / total}%)`,
            }}
          />
          <div aria-hidden="true" className="mt-1.5 flex justify-between text-[0.8125rem] font-medium text-slate-600">
            {marcas.map((marca, indice) => (
              <span key={`${marca}-${indice}`}>
                {marca}
                {indice === marcas.length - 1 ? ' dias' : ''}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
/* === COMPONENTE REGUA DE PRAZOS | fim === */

/* === LINHA DA REGUA | inicio === */
function LinhaPrazo({
  rotulo,
  dias,
  total,
  corBarra,
  corTexto,
  atraso,
  animar,
  economia,
}: {
  rotulo: string;
  dias: number;
  total: number;
  corBarra: string;
  corTexto: string;
  atraso: string;
  animar: boolean;
  economia?: number;
}): JSX.Element {
  const larguraBarra = (dias / total) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-slate-950">{rotulo}</span>
        <span className={`text-sm font-semibold ${corTexto}`}>{dias} dias</span>
      </div>
      <div className="regua-trilho mt-1.5" aria-hidden="true">
        <span
          className={`${animar ? 'regua-barra' : 'regua-barra regua-barra-estatica'} ${corBarra}`}
          style={{ width: `${larguraBarra}%`, animationDelay: atraso }}
        />
        {economia ? (
          <span
            className="regua-economia absolute inset-y-0 right-0 flex items-center justify-end overflow-hidden whitespace-nowrap pr-3 text-xs font-semibold text-[#075f50]"
            style={{ left: `${larguraBarra}%` }}
          >
            {economia} dias a menos
          </span>
        ) : null}
      </div>
    </div>
  );
}
/* === LINHA DA REGUA | fim === */
