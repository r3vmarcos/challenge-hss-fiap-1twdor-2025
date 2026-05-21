import { ganhosComHss, problemasSemHss } from "@/data/dadosLanding";
import { CardSpotlight } from "@/components/ui/card-spotlight";

/* === SECAO PROCESSO COMPARATIVO | inicio === */
export function SecaoProcessoComparativo(): JSX.Element {
  return (
    <section className="bg-[#eef0f7]/92 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1110px] gap-16 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6 lg:sticky lg:top-28">
          {problemasSemHss.map((problema, indice) => (
            <CardSpotlight key={problema} className="revelar-scroll p-8">
              <span className="text-xs font-black text-hss-roxo">Etapa tradicional 0{indice + 1}</span>
              <p className="mt-3 text-lg font-black leading-7 text-[#070814]">{problema}</p>
            </CardSpotlight>
          ))}
        </div>

        <article className="revelar-scroll rounded-2xl bg-[#d9dadd]/88 p-8 backdrop-blur lg:mt-8">
          <h2 className="text-[1.75rem] font-black text-[#070814]">Sem HSS - processo tradicional</h2>
          <p className="mt-4 max-w-[450px] text-base font-medium leading-7 text-slate-600">
            O processo depende de e-mails, conferências manuais e cobranças recorrentes. Quanto mais lento o ciclo, maior o prejuízo por médico parado.
          </p>
          <div className="mt-7 space-y-5">
            {problemasSemHss.map((problema) => (
              <div key={problema} className="rounded-2xl bg-[#c9cacc]/90 px-6 py-4 text-sm font-bold text-slate-700">
                {problema}
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mx-auto mt-28 grid max-w-[1110px] gap-16 lg:grid-cols-2 lg:items-start">
        <article className="revelar-scroll rounded-2xl bg-[#d9dadd]/88 p-8 backdrop-blur lg:sticky lg:top-28">
          <h2 className="text-[1.75rem] font-black text-[#070814]">Com HSS - processo digital</h2>
          <p className="mt-4 max-w-[450px] text-base font-medium leading-7 text-slate-600">
            O ADM define os tempos por cenário e a calculadora usa essas premissas para estimar economia, receita antecipada e ROI.
          </p>
          <div className="mt-7 space-y-5">
            {ganhosComHss.map((ganho) => (
              <div key={ganho} className="rounded-2xl bg-[#c9cacc]/90 px-6 py-4 text-sm font-bold text-slate-700">
                {ganho}
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-6">
          {ganhosComHss.map((ganho, indice) => (
            <CardSpotlight key={ganho} className="revelar-scroll p-8">
              <span className="text-xs font-black text-hss-roxo">Ganho digital 0{indice + 1}</span>
              <p className="mt-3 text-lg font-black leading-7 text-[#070814]">{ganho}</p>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
/* === SECAO PROCESSO COMPARATIVO | fim === */
