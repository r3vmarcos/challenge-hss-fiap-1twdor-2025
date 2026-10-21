import { useEffect, useRef, useState } from "react";
import { Cabecalho } from "@/components/cabecalho";
import { CamadasParallax } from "@/components/camadas-parallax";
import { Rodape } from "@/components/layout/rodape";
import { MenuAcessibilidade } from "@/components/menu-acessibilidade";
import { PaginaAdm } from "@/components/paginas/pagina-adm";
import { PaginaLanding } from "@/components/paginas/pagina-landing";
import { useParallaxProfundidade } from "@/hooks/useParallaxProfundidade";
import { useScrollRevelado } from "@/hooks/useScrollRevelado";

/* === COMPONENTE APP | inicio === */
export default function App(): JSX.Element {
  // Ao atualizar a pagina, comeca sempre na hero: o hash de secao e descartado (o #adm e mantido).
  const [hashAtual, definirHashAtual] = useState(() => {
    const hash = window.location.hash;
    if (hash && hash !== "#adm") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      return "";
    }
    return hash;
  });
  const [dicasHoverAtivas, definirDicasHoverAtivas] = useState(false);
  const primeiraRolagemRef = useRef(true);
  const paginaAdm = hashAtual === "#adm";

  useScrollRevelado(hashAtual);
  useParallaxProfundidade();

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // "instant" ignora o scroll-behavior: smooth do CSS; com rolagem suave, o encaixe da calculadora
    // podia capturar a pagina no caminho e esconder o cabecalho.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.body.classList.remove("calculadora-travada", "calculadora-em-tela");
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
      if (primeiraRolagemRef.current) {
        primeiraRolagemRef.current = false;
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }

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
          <PaginaLanding dicasHoverAtivas={dicasHoverAtivas} />
        )}
      </main>
      <div className="relative z-10">
        <Rodape />
      </div>
      <MenuAcessibilidade />
    </div>
  );
}
/* === COMPONENTE APP | fim === */
