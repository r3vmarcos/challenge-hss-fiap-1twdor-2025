import medicaHero from "@/assets/medica-hero-hss.png";
import { NumberTicker } from "@/components/ui/number-ticker";
import { CLASSE_BOTAO_CELULAR, ShimmerButton } from "@/components/ui/shimmer-button";

/* === COMPONENTE HERO | inicio === */
export function HeroHss(): JSX.Element {
  return (
    // Em telas menores, a hero cresce com o conteudo para manter os botoes visiveis sem cortar a imagem.
    <section className="relative isolate mx-auto min-h-[calc(100vh-74px)] w-full max-w-[1480px] overflow-hidden px-4 pb-10 pt-10 max-lg:h-auto max-lg:min-h-0 max-lg:overflow-visible max-lg:py-5 sm:px-8 md:pb-12 md:pt-14 max-lg:md:py-8 lg:px-12 lg:pb-10 lg:pt-8 xl:px-16">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-132px)] w-full max-w-[1480px] items-center gap-7 max-lg:flex max-lg:h-auto max-lg:min-h-0 max-lg:flex-col max-lg:gap-4 md:gap-8 lg:grid-cols-[minmax(680px,0.55fr)_minmax(0,0.45fr)] lg:gap-8">
        {/* No celular e no tablet a coluna de texto vira "contents": titulo, texto, imagem e botoes entram nessa ordem no grid. */}
        <div className="revelar-scroll relative z-20 w-full max-w-[860px] min-w-0 max-lg:mx-auto max-lg:text-center max-lg:contents">
          <h1 className="max-w-full max-lg:order-1 max-lg:shrink-0 text-[1.2rem] font-black leading-[1.15] tracking-normal text-[#070814] min-[380px]:text-[1.65rem] sm:text-[2.55rem] md:text-[3.15rem] lg:text-[3rem] xl:text-[3.25rem] 2xl:text-[3.5rem]">
            <span className="block whitespace-nowrap">Digitalize e simplifique o</span>
            <span className="block whitespace-nowrap text-hss-violeta">CREDENCIAMENTO</span>
            <span className="block text-hss-violeta">MÉDICO</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[min(31rem,100%)] max-lg:order-2 max-lg:mt-0 max-lg:shrink-0 text-base font-medium leading-7 text-[#111827] sm:text-[1.08rem] md:text-[1.16rem] lg:mx-0 lg:mt-6 lg:text-[1.22rem] lg:leading-8 xl:max-w-[36rem] xl:text-[1.4rem] xl:leading-9">
            O credenciamento médico como você nunca viu. Centralizado, econômico e confiável.
          </p>

          <div className="mt-6 flex w-full flex-col justify-center gap-2 max-lg:order-4 sm:gap-3 max-lg:mt-0 max-lg:shrink-0 sm:flex-row lg:mt-7 lg:justify-start lg:gap-4">
            <ShimmerButton href="#lead" className={`${CLASSE_BOTAO_CELULAR} max-sm:py-3.5 max-sm:text-base sm:max-lg:mx-0 sm:max-lg:py-3.5 sm:max-lg:text-base lg:w-auto lg:min-w-[220px] lg:px-8 lg:py-4 lg:text-base`}>
              Agendar demonstração
            </ShimmerButton>
            <ShimmerButton href="#roi" variante="contorno" className={`${CLASSE_BOTAO_CELULAR} max-sm:py-3.5 max-sm:text-base sm:max-lg:mx-0 sm:max-lg:py-3.5 sm:max-lg:text-base lg:w-auto lg:min-w-[220px] lg:px-8 lg:py-4 lg:text-base`}>
              Calcular ROI
            </ShimmerButton>
          </div>

          {/* <div className="mt-7 grid w-full max-w-[700px] grid-cols-1 gap-2 rounded-[1.1rem] border border-[#d7d9e8] bg-white/70 px-5 py-3 text-center shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur max-lg:mx-auto sm:grid-cols-3 lg:mt-8 lg:px-4 lg:py-4">
            <MetricaHero valor={<NumberTicker valor={33} sufixo="+" />} texto="Dias economizados" />
            <MetricaHero valor={<NumberTicker valor={73} sufixo="%" />} texto="Redução estimada" />
            <MetricaHero valor={<NumberTicker valor={504000} prefixo="R$ " />} texto="Prejuízo mensal evitável" />
          </div> */}
        </div>

        <div className="revelar-scroll relative z-10 flex min-h-0 max-lg:order-3 max-lg:w-full max-lg:flex-none items-center justify-center overflow-visible lg:absolute lg:inset-y-0 lg:right-[-5rem] lg:w-[56%] lg:justify-center xl:right-[-4rem]">
          <img
            src={medicaHero}
            alt="Médica representando o credenciamento digital da Health Sync Solutions"
            className="relative z-10 h-auto w-[70%] max-w-[430px] object-contain max-lg:max-w-full sm:max-w-[540px] md:max-w-[650px] lg:max-w-[820px] xl:max-w-[980px] 2xl:max-w-[1080px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24  sm:h-32 lg:h-40"
          />
        </div>
      </div>
    </section>
  );
}
/* === COMPONENTE HERO | fim === */

/* === METRICA HERO | inicio === */
function MetricaHero({ valor, texto }: { valor: JSX.Element; texto: string }): JSX.Element {
  return (
    <div className="min-w-0 px-2">
      <strong className="block whitespace-nowrap text-[1.7rem] font-black leading-none text-hss-roxo sm:text-[1.9rem]">{valor}</strong>
      <span className="mt-1 block text-sm leading-5 text-[#34323e]">{texto}</span>
    </div>
  );
}
/* === METRICA HERO | fim === */
