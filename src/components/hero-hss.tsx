import medicaHero from '@/assets/medica-hero-hss.png';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ShimmerButton } from '@/components/ui/shimmer-button';

/* === COMPONENTE HERO | inicio === */
interface HeroHssProps {
  diasEconomizados: number;
  prejuizoEstimado: number;
}

export function HeroHss({ diasEconomizados, prejuizoEstimado }: HeroHssProps): JSX.Element {
  const diasBase = Math.max(33, Math.round(diasEconomizados));
  const prejuizoBase = Math.max(504000, Math.round(prejuizoEstimado));

  return (
    <section className="relative isolate min-h-[calc(100vh-74px)] overflow-hidden bg-[#eef0f7]/92 px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-14 lg:pt-20">
      <div className="absolute inset-y-12 right-[4vw] hidden w-[45vw] max-w-[620px] rounded-full bg-[#d7e7fb] lg:block" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-154px)] max-w-[1110px] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="revelar-scroll relative z-20 max-w-[600px]">
          <h1 className="text-[3.15rem] font-black leading-[1.02] tracking-[0.05em] text-[#070814] sm:text-[4.7rem] lg:text-[5.05rem] xl:text-[5.45rem]">
            Digitalize e simplifique o{' '}
            <span className="block text-hss-violeta">CREDENCIAMENTO MÉDICO</span>
          </h1>
          <p className="mt-6 max-w-[520px] text-[1.08rem] font-medium leading-8 text-[#111827] sm:text-[1.22rem]">
            O credenciamento médico como você nunca viu - centralizado, econômico e confiável.
          </p>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <ShimmerButton href="#lead" className="min-w-[220px] px-8 py-4">
              Agendar demonstração
            </ShimmerButton>
            <ShimmerButton href="#roi" variante="contorno" className="min-w-[220px] px-8 py-4">
              Calcular ROI
            </ShimmerButton>
          </div>

          <div className="mt-9 grid max-w-[600px] grid-cols-1 gap-3 rounded-[1.1rem] border border-[#d7d9e8] bg-white/70 px-6 py-4 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur sm:grid-cols-3">
            <MetricaHero valor={<NumberTicker valor={diasBase} sufixo="+" />} texto="dias economizados por médico" />
            <MetricaHero valor={<NumberTicker valor={73} sufixo="%" />} texto="redução estimada do ciclo" />
            <MetricaHero valor={<NumberTicker valor={prejuizoBase} prefixo="R$ " />} texto="prejuízo mensal evitável" compacta />
          </div>
        </div>

        <div className="revelar-scroll relative z-10 flex min-h-[420px] items-end justify-center lg:min-h-[620px] lg:justify-end">
          <div className="absolute inset-x-8 bottom-10 top-0 rounded-full bg-[#d7e7fb] lg:hidden" aria-hidden="true" />
          <img
            src={medicaHero}
            alt="Médica representando o credenciamento digital da Health Sync Solutions"
            className="relative z-10 max-h-[600px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_22px_32px_rgba(15,23,42,0.08)] lg:max-h-[640px] lg:max-w-[560px] xl:max-w-[620px]"
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
      <strong className={compacta ? 'block truncate text-2xl font-black text-hss-roxo' : 'block text-3xl font-black text-hss-roxo'}>
        {valor}
      </strong>
      <span className="mt-1 block text-sm leading-5 text-[#34323e]">{texto}</span>
    </div>
  );
}
/* === METRICA HERO | fim === */
