import { etapasProcesso } from "@/data/dadosLanding";
import { CardSpotlight } from "@/components/ui/card-spotlight";

/* === SECAO COMO FUNCIONA | inicio === */
export function SecaoComoFunciona(): JSX.Element {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-28 bg-[#eef0f7]/92 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1110px] text-center">
        <h2 className="revelar-scroll text-[2.55rem] font-black tracking-[0.01em] text-[#070814] sm:text-[3.25rem]">
          Como funciona?
        </h2>
        <p className="revelar-scroll mx-auto mt-6 max-w-[760px] text-lg font-medium leading-8 text-[#111827]">
          A Health Sync estrutura cada
          etapa do credenciamento médico
          em uma plataforma digital
          única, auditável e rastreável
          - para que instituições e
          médicos assumam o controle do
          processo, economizando tempo e
          com menos burocracia.
        </p>

        <div className="revelar-scroll mt-6 rounded-2xl bg-[#d9dadd]/85 px-6 py-6 text-center backdrop-blur">
          <h3 className="text-[2rem] font-medium tracking-[0.02em] text-[#070814]">
            Etapas do processo de
            credenciamento
          </h3>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {etapasProcesso.map(
              (etapa, indice) => (
                <CardSpotlight
                  key={etapa.titulo}
                  className="min-h-[190px] p-5 text-left"
                >
                  <span className="text-xs font-black text-hss-roxo">
                    0{indice + 1}
                  </span>
                  <h4 className="mt-3 text-sm font-black leading-6 text-[#070814]">
                    {etapa.titulo}
                  </h4>
                  <p className="mt-2 text-xs font-medium leading-5 text-slate-600">
                    {etapa.texto}
                  </p>
                </CardSpotlight>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
/* === SECAO COMO FUNCIONA | fim === */
