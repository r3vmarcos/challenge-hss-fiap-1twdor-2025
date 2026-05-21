import { useEffect, useMemo, useState } from "react";
import { Cabecalho } from "@/components/cabecalho";
import { CamadasParallax } from "@/components/camadas-parallax";
import { Rodape } from "@/components/layout/rodape";
import { PaginaAdm } from "@/components/paginas/pagina-adm";
import { PaginaLanding } from "@/components/paginas/pagina-landing";
import { dadosBaseHero } from "@/data/dadosLanding";
import { useParallaxProfundidade } from "@/hooks/useParallaxProfundidade";
import { useScrollRevelado } from "@/hooks/useScrollRevelado";
import { calcularRoiEmpresa } from "@/services/calculosRoi";

/* === COMPONENTE APP | inicio === */
export default function App(): JSX.Element {
  const [hashAtual, definirHashAtual] = useState(() => window.location.hash);
  const [dicasHoverAtivas, definirDicasHoverAtivas] = useState(false);
  const resultadoHero = useMemo(() => calcularRoiEmpresa(dadosBaseHero), []);
  const paginaAdm = hashAtual === "#adm";

  useScrollRevelado(hashAtual);
  useParallaxProfundidade();

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    function aoMudarHash(): void {
      definirHashAtual(window.location.hash);
    }

    window.addEventListener("hashchange", aoMudarHash);
    return () => window.removeEventListener("hashchange", aoMudarHash);
  }, []);

  useEffect(() => {
    const idDestino = hashAtual.slice(1);

    window.requestAnimationFrame(() => {
      if (!idDestino || idDestino === "topo" || idDestino === "adm") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      document.getElementById(idDestino)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [hashAtual]);

  return (
    <div id="topo" className="relative isolate min-h-screen overflow-hidden bg-[#eef0f7] font-sans text-[#070814]">
      <CamadasParallax />
      <Cabecalho
        dicasHoverAtivas={dicasHoverAtivas}
        aoAlternarDicasHover={() => definirDicasHoverAtivas(!dicasHoverAtivas)}
        paginaAdm={paginaAdm}
      />
      <main className="relative z-10 pt-[74px] lg:pt-[73px]">
        {paginaAdm ? (
          <PaginaAdm />
        ) : (
          <PaginaLanding
            diasEconomizados={resultadoHero.tempoEconomizadoPorMedicoDias}
            prejuizoEstimado={resultadoHero.prejuizoMensalSemHss}
            dicasHoverAtivas={dicasHoverAtivas}
          />
        )}
      </main>
      <div className="relative z-10">
        <Rodape />
      </div>
    </div>
  );
}
/* === COMPONENTE APP | fim === */
