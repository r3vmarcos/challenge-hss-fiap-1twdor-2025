import medicaHero from "@/assets/medica-hero-hss.png";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";

/* === COMPONENTE HERO | inicio === */
interface HeroHssProps {
  diasEconomizados: number;
  prejuizoEstimado: number;
}

export function HeroHss({ diasEconomizados, prejuizoEstimado }: HeroHssProps): JSX.Element {
  const diasBase = Math.max(33, Math.round(diasEconomizados));
  const prejuizoBase = Math.max(504000, Math.round(prejuizoEstimado));

  return (
    <section className="relative isolate min-h-[calc(100vh-74px)] w-full max-w-full overflow-hidden bg-[#eef0f7]/92 px-3 pb-10 pt-10 sm:px-6 md:pb-12 md:pt-14 lg:px-8 lg:pb-14 lg:pt-20">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-154px)] w-full max-w-[1110px] items-center gap-8 md:gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <div className="revelar-scroll relative z-20 w-full max-w-[560px] min-w-0 max-lg:mx-auto max-lg:text-center">
          <h1 className="max-w-full text-[1.95rem] font-black leading-[1.05] tracking-normal text-[#070814] min-[380px]:text-[2.05rem] sm:text-[3.1rem] md:text-[3.45rem] lg:text-[4rem] lg:tracking-[0.03em] xl:text-[4.28rem]">
            Digitalize e simplifique o{" "}
            <span className="block max-w-full break-words text-hss-violeta">CREDENCIAMENTO MÉDICO</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[min(31rem,100%)] text-base font-medium leading-7 text-[#111827] sm:text-[1.08rem] md:text-[1.16rem] lg:mx-0 lg:mt-6 lg:text-[1.22rem] lg:leading-8">
            O credenciamento médico como você nunca viu - centralizado, econômico e confiável.
          </p>

          <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:flex-row lg:mt-7 lg:justify-start lg:gap-4">
            <ShimmerButton href="#lead" className="w-full px-6 py-4 sm:w-auto sm:min-w-[220px] sm:px-8">
              Agendar demonstração
            </ShimmerButton>
            <ShimmerButton href="#roi" variante="contorno" className="w-full px-6 py-4 sm:w-auto sm:min-w-[220px] sm:px-8">
              Calcular ROI
            </ShimmerButton>
          </div>

          <div className="mt-7 grid w-full max-w-[600px] grid-cols-1 gap-3 rounded-[1.1rem] border border-[#d7d9e8] bg-white/70 px-5 py-3 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur max-lg:mx-auto sm:grid-cols-3 lg:mt-9 lg:px-6 lg:py-4">
            <MetricaHero valor={<NumberTicker valor={diasBase} sufixo="+" />} texto="dias economizados por médico" />
            <MetricaHero valor={<NumberTicker valor={73} sufixo="%" />} texto="redução estimada do ciclo" />
            <MetricaHero valor={<NumberTicker valor={prejuizoBase} prefixo="R$ " />} texto="prejuízo mensal evitável" compacta />
          </div>
        </div>

        <div className="revelar-scroll relative z-10 flex min-h-[330px] items-end justify-center overflow-hidden sm:min-h-[410px] md:min-h-[500px] lg:min-h-[620px] lg:overflow-visible">
          <div
            className="absolute bottom-0 left-1/2 z-0 h-[92%] w-[96vw] max-w-[650px] -translate-x-1/2 rounded-full bg-[#d7e7fb] sm:h-[94%] lg:bottom-8 lg:top-0 lg:h-auto lg:w-[48vw]"
            aria-hidden="true"
          />
          <img
            src={medicaHero}
            alt="Médica representando o credenciamento digital da Health Sync Solutions"
            className="relative z-10 max-h-[350px] w-auto max-w-[92vw] object-contain object-bottom drop-shadow-[0_22px_32px_rgba(15,23,42,0.08)] sm:max-h-[430px] md:max-h-[510px] lg:-ml-4 lg:max-h-[610px] lg:max-w-[540px] xl:max-h-[630px] xl:max-w-[590px]"
            style={{
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, black 10%, black 86%, transparent 100%), linear-gradient(180deg, black 0%, black 78%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
              maskImage:
                "linear-gradient(90deg, transparent 0%, black 10%, black 86%, transparent 100%), linear-gradient(180deg, black 0%, black 78%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
/* === COMPONENTE HERO | fim === */

/* === METRICA HERO | inicio === */
function MetricaHero({ valor, texto, compacta = false }: { valor: JSX.Element; texto: string; compacta?: boolean }): JSX.Element {
  return (
    <div className="min-w-0 pr-3">
      <strong className={compacta ? "block truncate text-2xl font-black text-hss-roxo" : "block text-3xl font-black text-hss-roxo"}>
        {valor}
      </strong>
      <span className="mt-1 block text-sm leading-5 text-[#34323e]">{texto}</span>
    </div>
  );
}
/* === METRICA HERO | fim === */
