import { CalculadoraRoi } from "@/components/calculadora/calculadora-roi";
import { FormularioLead } from "@/components/formulario-lead";
import { HeroHss } from "@/components/hero-hss";
import { SecaoBeneficios } from "@/components/secao-solucao";
import { SecaoComoFunciona } from "@/components/secoes/secao-como-funciona";
import { SecaoDepoimentos } from "@/components/secoes/secao-depoimentos";
import { SecaoProcessoComparativo } from "@/components/secoes/secao-processo-comparativo";

/* === PAGINA LANDING | inicio === */
interface PaginaLandingProps {
  dicasHoverAtivas: boolean;
}

export function PaginaLanding({ dicasHoverAtivas }: PaginaLandingProps): JSX.Element {
  return (
    <>
      <HeroHss />
      <SecaoBeneficios />
      <SecaoComoFunciona />
      <SecaoProcessoComparativo />
      <SecaoDepoimentos />
      <CalculadoraRoi dicasHoverAtivas={dicasHoverAtivas} />
      <FormularioLead visaoPadrao="empresa" />
    </>
  );
}
/* === PAGINA LANDING | fim === */
