import { CardSpotlight } from "@/components/ui/card-spotlight";

/* === SECAO DIFERENCIAL ADM | inicio === */
export function SecaoDiferencialAdm(): JSX.Element {
  return (
    <section id="diferencial" className="scroll-mt-28 bg-[#eef0f7]/92 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1110px]">
        <h2 className="revelar-scroll max-w-[980px] text-[2.25rem] font-black leading-[1.18] text-[#070814] sm:text-[3.45rem]">
          O ADM define as premissas, o usuário informa os valores e o ROI é calculado por tempo.
        </h2>

        <div className="revelar-scroll mt-10 rounded-2xl bg-[#d9dadd]/88 p-8 backdrop-blur sm:p-12">
          <div className="grid gap-5 md:grid-cols-4">
            <CardDiferencial titulo="Tipos ativos" texto="O ADM ativa ou desativa cenários exibidos no site." />
            <CardDiferencial titulo="Tempo sem HSS" texto="Define o ciclo tradicional por credenciamento." />
            <CardDiferencial titulo="Tempo com HSS" texto="Define o ganho estimado do fluxo digital." />
            <CardDiferencial titulo="ROI automático" texto="A calculadora transforma tempo economizado em valor." />
          </div>
        </div>
      </div>
    </section>
  );
}
/* === SECAO DIFERENCIAL ADM | fim === */

/* === CARD DIFERENCIAL | inicio === */
function CardDiferencial({ titulo, texto }: { titulo: string; texto: string }): JSX.Element {
  return (
    <CardSpotlight className="min-h-[168px] p-6">
      <h3 className="text-lg font-black text-[#070814]">{titulo}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{texto}</p>
    </CardSpotlight>
  );
}
/* === CARD DIFERENCIAL | fim === */
