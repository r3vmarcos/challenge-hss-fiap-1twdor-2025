import medicaHero from "@/assets/medica-hero-hss.png";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";

/* === COMPONENTE HERO | inicio === */
interface HeroHssProps {
  diasEconomizados: number;
  prejuizoEstimado: number;
}

export function HeroHss(_props: HeroHssProps): JSX.Element {
  return (
    <section className="relative isolate mx-auto min-h-[calc(100vh-74px)] w-full max-w-[1320px] overflow-hidden bg-[#eef0f7]/92 px-4 pb-10 pt-10 sm:px-8 md:pb-12 md:pt-14 lg:px-12 lg:pb-10 lg:pt-8 xl:px-16">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-132px)] w-full max-w-[1240px] items-center gap-7 md:gap-8 lg:grid-cols-[minmax(680px,0.58fr)_minmax(0,0.42fr)] lg:gap-8">
        <div className="revelar-scroll relative z-20 w-full max-w-[720px] min-w-0 max-lg:mx-auto max-lg:text-center">
          <h1 className="max-w-full text-[1.35rem] font-black leading-[1.05] tracking-normal text-[#070814] min-[380px]:text-[1.65rem] sm:text-[2.55rem] md:text-[3.15rem] lg:text-[3.05rem] xl:text-[3.25rem]">
            <span className="block whitespace-nowrap">Digitalize e simplifique</span>
            <span className="block whitespace-nowrap">
              o <span className="text-hss-violeta">CREDENCIAMENTO</span>
            </span>
            <span className="block text-hss-violeta">MÉDICO</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[min(31rem,100%)] text-base font-medium leading-7 text-[#111827] sm:text-[1.08rem] md:text-[1.16rem] lg:mx-0 lg:mt-6 lg:text-[1.22rem] lg:leading-8">
            O credenciamento médico como você nunca viu. Centralizado, econômico e confiável.
          </p>

          <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:flex-row lg:mt-7 lg:justify-start lg:gap-4">
            <ShimmerButton href="#lead" className="w-full px-6 py-4 sm:w-auto sm:min-w-[220px] sm:px-8">
              Agendar demonstração
            </ShimmerButton>
            <ShimmerButton href="#roi" variante="contorno" className="w-full px-6 py-4 sm:w-auto sm:min-w-[220px] sm:px-8">
              Calcular ROI
            </ShimmerButton>
          </div>

          <div className="mt-7 grid w-full max-w-[700px] grid-cols-1 gap-2 rounded-[1.1rem] border border-[#d7d9e8] bg-white/70 px-5 py-3 text-center shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur max-lg:mx-auto sm:grid-cols-3 lg:mt-8 lg:px-4 lg:py-4">
            <MetricaHero valor={<NumberTicker valor={33} sufixo="+" />} texto="Dias economizados" />
            <MetricaHero valor={<NumberTicker valor={73} sufixo="%" />} texto="Redução estimada" />
            <MetricaHero valor={<NumberTicker valor={504000} prefixo="R$ " />} texto="Prejuízo mensal evitável" />
          </div>
        </div>

        <div className="revelar-scroll relative z-10 flex min-h-[330px] items-center justify-center overflow-visible sm:min-h-[430px] md:min-h-[530px] lg:absolute lg:inset-y-0 lg:right-[-5rem] lg:min-h-0 lg:w-[58%] lg:justify-center xl:right-[-6rem]">
          <img
            src={medicaHero}
            alt="Médica representando o credenciamento digital da Health Sync Solutions"
            className="relative z-10 w-full max-w-[430px] object-contain sm:max-w-[540px] md:max-w-[650px] lg:max-w-[760px] xl:max-w-[820px]"
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
