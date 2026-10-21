import { depoimentos } from "@/data/dadosLanding";
import { Marquee } from "@/components/ui/marquee";

/* === SECAO DEPOIMENTOS | inicio === */
export function SecaoDepoimentos(): JSX.Element {
  return (
    <section id="depoimentos" className="scroll-mt-28 overflow-hidden px-4 py-12 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="revelar-scroll text-[clamp(2rem,4.2vw,3rem)] font-black uppercase leading-[1.15] tracking-[0.01em] text-[#070814]">Depoimentos</h2>
        <p className="revelar-scroll mt-2 text-base font-bold text-slate-500 sm:mt-3 sm:text-lg">O que nossos clientes estão dizendo:</p>
      </div>

      <Marquee className="mt-6 sm:mt-12" velocidadeSegundos={58}>
        {depoimentos.map((depoimento) => (
          <article key={`${depoimento.nome}-${depoimento.cargo}`} className="w-[260px] shrink-0 rounded-lg bg-white p-5 sm:w-[330px] sm:p-8 shadow-[0_16px_38px_rgba(15,23,42,0.08)]">
            <p className="min-h-[96px] text-sm font-medium leading-6 sm:min-h-[112px] sm:text-base sm:leading-7 text-[#070814]">{depoimento.texto}</p>
            <div className="mt-5 flex items-center gap-3 sm:mt-10 sm:gap-4">
              <span className="flex h-10 w-10 items-center sm:h-12 sm:w-12 justify-center overflow-hidden rounded-full p-1 shadow-[0_10px_24px_rgba(15,23,42,0.10)]" style={{ backgroundColor: depoimento.cor }}>
                <img src={depoimento.foto} alt="" className="h-full w-full rounded-full object-cover" loading="lazy" />
              </span>
              <div>
                <strong className="block text-sm font-black text-[#070814]">{depoimento.nome}</strong>
                <span className="text-sm font-medium text-slate-500">{depoimento.cargo}</span>
              </div>
            </div>
          </article>
        ))}
      </Marquee>
    </section>
  );
}
/* === SECAO DEPOIMENTOS | fim === */
