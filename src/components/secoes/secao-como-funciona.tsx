import { etapasProcesso } from "@/data/dadosLanding";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import mockupIllustration from "@/assets/steps-section-ilustration 1.png";

/* === SECAO COMO FUNCIONA | inicio === */
export function SecaoComoFunciona(): JSX.Element {
  return (
    <section id="como-funciona" lang="pt-BR" className="scroll-mt-28 bg-[#e9eaf2] px-4 py-12 max-[900px]:py-[42px] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] text-center">
        <div className="mb-[34px] max-[900px]:mb-[26px]">
          <h2 className=" mb-[22px] text-[clamp(34px,4.2vw,48px)] font-black leading-[1.15] tracking-[-1.5px] text-[#080b15] max-[900px]:mb-4 max-[460px]:text-[32px]">Como funciona?</h2>
          <p className="mx-auto max-w-[1070px] text-[18px] leading-[1.45] text-[#161a29] max-[900px]:max-w-[680px] max-[900px]:text-[15px] max-[900px]:leading-[1.6] max-[460px]:text-[14px]">
            <span className="lg:whitespace-nowrap">A Health Sync estrutura as etapas do credenciamento médico em uma plataforma digital, auditável e rastreável.</span>
            <br />
            <span>As instituições e médicos têm o controle do processo, economizando tempo e com menos burocracia.</span>
          </p>
        </div>

    {/* <h2 className="text-[2.15rem] font-black leading-tight text-[#070814] sm:text-[2.8rem]">
            Benefícios da nossa solução
          </h2>
          <p className="mt-5 text-base font-medium leading-7 text-[#171826] sm:text-lg"></p> */}

        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-center gap-[56px] max-[900px]:grid-cols-1 max-[900px]:gap-6">
          <figure className="mx-0 min-w-0 max-[900px]:mx-auto max-[900px]:max-w-[620px]">
            <img className="block h-auto w-full" src={mockupIllustration} width="607" height="535" loading="lazy" decoding="async" alt="Prévia da plataforma HSS para credenciamento médico, com envio de documentos, checklist, análise com apoio de IA e acompanhamento do processo." />
          </figure>
          <ol className="relative m-0 grid list-none gap-4 p-0 before:absolute before:bottom-10 before:left-10 before:top-10 before:w-px before:bg-[#c9cbd6] before:content-[''] max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[620px] max-[900px]:gap-3 max-[460px]:before:left-[33px]" aria-label="Etapas do processo de credenciamento">
            <li className="relative" aria-current="step">
              <button className="grid min-h-[82px] w-full grid-cols-[48px_minmax(0,1fr)] cursor-pointer items-center gap-[18px] rounded-[9px] border border-[#7156ff] bg-[#ece8ff] px-4 py-[14px] text-left font-[inherit] transition-[background-color,border-color] duration-200 ease-in-out focus-visible:outline-[3px] focus-visible:outline-[#5037e6] focus-visible:outline-offset-[3px] motion-reduce:transition-none max-[460px]:grid-cols-[42px_minmax(0,1fr)] max-[460px]:gap-3 max-[460px]:px-3 max-[460px]:py-[13px]" type="button" aria-pressed="true">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#5037e6] text-[20px] font-extrabold text-white transition-[background-color,color] duration-200 ease-in-out motion-reduce:transition-none max-[460px]:h-[42px] max-[460px]:w-[42px] max-[460px]:text-[18px]" aria-hidden="true">01</span>
                <span className="min-w-0"><span className="block text-[14px] font-extrabold leading-[1.4] text-[#281b75] transition-colors duration-200 ease-in-out motion-reduce:transition-none max-[460px]:text-[13px]">Pré-cadastro do médico</span><span className="mt-[3px] block text-[13px] leading-[1.5] text-[#4f5465] max-[460px]:text-[12px]">Dados básicos, vínculo e tipo de credenciamento.</span></span>
              </button>
            </li>
            <li className="relative">
              <button className="grid min-h-[82px] w-full grid-cols-[48px_minmax(0,1fr)] cursor-pointer items-center gap-[18px] rounded-[9px] border border-[#cdd0d9] bg-white px-4 py-[14px] text-left font-[inherit] transition-[background-color,border-color] duration-200 ease-in-out focus-visible:outline-[3px] focus-visible:outline-[#5037e6] focus-visible:outline-offset-[3px] motion-reduce:transition-none max-[460px]:grid-cols-[42px_minmax(0,1fr)] max-[460px]:gap-3 max-[460px]:px-3 max-[460px]:py-[13px]" type="button" aria-pressed="false">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ebe6ff] text-[20px] font-extrabold text-[#5037e6] transition-[background-color,color] duration-200 ease-in-out motion-reduce:transition-none max-[460px]:h-[42px] max-[460px]:w-[42px] max-[460px]:text-[18px]" aria-hidden="true">02</span>
                <span className="min-w-0"><span className="block text-[14px] font-extrabold leading-[1.4] text-[#252837] transition-colors duration-200 ease-in-out motion-reduce:transition-none max-[460px]:text-[13px]">Envio e triagem documental</span><span className="mt-[3px] block text-[13px] leading-[1.5] text-[#4f5465] max-[460px]:text-[12px]">Documentos reunidos e conferidos conforme o cenário.</span></span>
              </button>
            </li>
            <li className="relative">
              <button className="grid min-h-[82px] w-full grid-cols-[48px_minmax(0,1fr)] cursor-pointer items-center gap-[18px] rounded-[9px] border border-[#cdd0d9] bg-white px-4 py-[14px] text-left font-[inherit] transition-[background-color,border-color] duration-200 ease-in-out focus-visible:outline-[3px] focus-visible:outline-[#5037e6] focus-visible:outline-offset-[3px] motion-reduce:transition-none max-[460px]:grid-cols-[42px_minmax(0,1fr)] max-[460px]:gap-3 max-[460px]:px-3 max-[460px]:py-[13px]" type="button" aria-pressed="false">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ebe6ff] text-[20px] font-extrabold text-[#5037e6] transition-[background-color,color] duration-200 ease-in-out motion-reduce:transition-none max-[460px]:h-[42px] max-[460px]:w-[42px] max-[460px]:text-[18px]" aria-hidden="true">03</span>
                <span className="min-w-0"><span className="block text-[14px] font-extrabold leading-[1.4] text-[#252837] transition-colors duration-200 ease-in-out motion-reduce:transition-none max-[460px]:text-[13px]">Validação de CRM, RQE e certidões</span><span className="mt-[3px] block text-[13px] leading-[1.5] text-[#4f5465] max-[460px]:text-[12px]">Conferência das credenciais e certidões do médico.</span></span>
              </button>
            </li>
            <li className="relative">
              <button className="grid min-h-[82px] w-full grid-cols-[48px_minmax(0,1fr)] cursor-pointer items-center gap-[18px] rounded-[9px] border border-[#cdd0d9] bg-white px-4 py-[14px] text-left font-[inherit] transition-[background-color,border-color] duration-200 ease-in-out focus-visible:outline-[3px] focus-visible:outline-[#5037e6] focus-visible:outline-offset-[3px] motion-reduce:transition-none max-[460px]:grid-cols-[42px_minmax(0,1fr)] max-[460px]:gap-3 max-[460px]:px-3 max-[460px]:py-[13px]" type="button" aria-pressed="false">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ebe6ff] text-[20px] font-extrabold text-[#5037e6] transition-[background-color,color] duration-200 ease-in-out motion-reduce:transition-none max-[460px]:h-[42px] max-[460px]:w-[42px] max-[460px]:text-[18px]" aria-hidden="true">04</span>
                <span className="min-w-0"><span className="block text-[14px] font-extrabold leading-[1.4] text-[#252837] transition-colors duration-200 ease-in-out motion-reduce:transition-none max-[460px]:text-[13px]">Análise técnica e aprovação interna</span><span className="mt-[3px] block text-[13px] leading-[1.5] text-[#4f5465] max-[460px]:text-[12px]">Validação pelas áreas responsáveis da instituição.</span></span>
              </button>
            </li>
            <li className="relative">
              <button className="grid min-h-[82px] w-full grid-cols-[48px_minmax(0,1fr)] cursor-pointer items-center gap-[18px] rounded-[9px] border border-[#cdd0d9] bg-white px-4 py-[14px] text-left font-[inherit] transition-[background-color,border-color] duration-200 ease-in-out focus-visible:outline-[3px] focus-visible:outline-[#5037e6] focus-visible:outline-offset-[3px] motion-reduce:transition-none max-[460px]:grid-cols-[42px_minmax(0,1fr)] max-[460px]:gap-3 max-[460px]:px-3 max-[460px]:py-[13px]" type="button" aria-pressed="false">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ebe6ff] text-[20px] font-extrabold text-[#5037e6] transition-[background-color,color] duration-200 ease-in-out motion-reduce:transition-none max-[460px]:h-[42px] max-[460px]:w-[42px] max-[460px]:text-[18px]" aria-hidden="true">05</span>
                <span className="min-w-0"><span className="block text-[14px] font-extrabold leading-[1.4] text-[#252837] transition-colors duration-200 ease-in-out motion-reduce:transition-none max-[460px]:text-[13px]">Liberação operacional para atuação</span><span className="mt-[3px] block text-[13px] leading-[1.5] text-[#4f5465] max-[460px]:text-[12px]">Liberação para agenda, plantão ou procedimento.</span></span>
              </button>
            </li>
          </ol>
        </div>

        {/* <div className="revelar-scroll mt-6 rounded-2xl border-2 border-[#b3b3b3] bg-[#d9dadd]/85 px-6 py-6 text-center backdrop-blur">
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
        </div> */}

      </div>
    </section>
  );
}
/* === SECAO COMO FUNCIONA | fim === */
