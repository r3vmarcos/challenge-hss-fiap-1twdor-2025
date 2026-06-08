import { depoimentos } from "@/data/dadosLanding";
import { Marquee } from "@/components/ui/marquee";

/* === SECAO DEPOIMENTOS | inicio === */
export function SecaoDepoimentos(): JSX.Element {
  return (
    <section id="depoimentos" className="scroll-mt-28 overflow-hidden bg-[#eef0f7]/92 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1110px]">
        <h2 className="revelar-scroll text-[2.75rem] font-black text-[#070814] sm:text-[3.5rem]">Depoimentos</h2>
        <p className="revelar-scroll mt-3 text-lg font-bold text-slate-500">O que nossos clientes estão dizendo:</p>
      </div>

      <Marquee className="mt-12" velocidadeSegundos={58}>
        {depoimentos.map((depoimento) => (
          <article key={`${depoimento.nome}-${depoimento.cargo}`} className="w-[330px] shrink-0 rounded-lg bg-white p-8 shadow-[0_16px_38px_rgba(15,23,42,0.08)]">
            <p className="min-h-[112px] text-base font-medium leading-7 text-[#070814]">{depoimento.texto}</p>
            <div className="mt-10 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full p-1 shadow-[0_10px_24px_rgba(15,23,42,0.10)]" style={{ backgroundColor: depoimento.cor }}>
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
