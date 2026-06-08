import { etapasProcesso } from "@/data/dadosLanding";
import { CardSpotlight } from "@/components/ui/card-spotlight";

/* === SECAO COMO FUNCIONA | inicio === */
export function SecaoComoFunciona(): JSX.Element {
  return (
    <section id="como-funciona" lang="pt-BR" className="scroll-mt-28 bg-[#eef0f7]/92 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1110px] text-center">
        <h2 className="revelar-scroll text-[2.55rem] font-black tracking-[0.01em] text-[#070814] sm:text-[3.25rem]">Como funciona?</h2>
        <p className="revelar-scroll mx-auto mt-4 max-w-[1040px] text-base font-medium leading-8 text-[#111827] lg:text-lg">
          <span className="lg:whitespace-nowrap">A Health Sync estrutura as etapas do credenciamento médico em uma plataforma digital, auditável e rastreável.</span>
          <br />
          <span>As instituições e médicos têm o controle do processo, economizando tempo e com menos burocracia.</span>
        </p>

        <div className="revelar-scroll mt-6 rounded-2xl border-2 border-[#b3b3b3] bg-[#d9dadd]/85 px-6 py-6 text-center backdrop-blur">
          <h3 className="text-[2rem] font-medium tracking-[0.02em] text-[#070814] rounded-2xl ">Etapas do processo de credenciamento</h3>
          <div className="mt-10 grid items-stretch gap-4 md:grid-cols-5">
            {etapasProcesso.map((etapa, indice) => (
              <div key={etapa.titulo} className="relative h-full">
                <CardSpotlight className="h-full min-h-[190px] p-5 text-left">
                  <h4 className="text-sm font-black leading-6 text-[#070814]">{etapa.titulo}</h4>
                  <p className="mt-2 hyphens-auto text-xs font-medium leading-5 text-slate-600">{etapa.texto}</p>
                </CardSpotlight>

                {indice < etapasProcesso.length - 1 && (
                  <span className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-lg font-black text-hss-roxo/35 md:block">
                    &gt;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
/* === SECAO COMO FUNCIONA | fim === */
