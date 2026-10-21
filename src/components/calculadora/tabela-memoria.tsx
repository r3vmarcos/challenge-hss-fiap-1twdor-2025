import type { LinhaMemoria } from "@/types/calculadora";

/* === TABELA DA MEMORIA DE CALCULO | inicio === */
// Usada na vista "Cálculo" do resultado e na prévia do Portal ADM. Rola por dentro quando faltar altura.
export function TabelaMemoria({ linhas, compacta = false }: { linhas: LinhaMemoria[]; compacta?: boolean }): JSX.Element {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="sr-only">
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Conta</th>
            <th scope="col">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.rotulo} className={["border-b border-hss-violeta/15 last:border-0", linha.destaque ? "bg-hss-violeta/[0.06]" : ""].join(" ")}>
              <th scope="row" className={["py-2 pl-2 pr-3 align-top font-semibold text-slate-950", compacta ? "w-[38%]" : "w-[24%]"].join(" ")}>
                {linha.rotulo}
                {compacta ? <span className="mt-0.5 block text-[0.8125rem] font-normal leading-5 text-slate-600">{linha.formula}</span> : null}
              </th>
              {compacta ? null : <td className="py-2 pr-3 align-top text-[0.8125rem] leading-5 text-slate-600 sm:text-sm">{linha.formula}</td>}
              <td className="py-2 pr-2 text-right align-top font-semibold tabular-nums text-slate-950">{linha.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
/* === TABELA DA MEMORIA DE CALCULO | fim === */
