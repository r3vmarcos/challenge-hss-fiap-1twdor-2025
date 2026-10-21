import { CampoNumerico } from "@/components/calculadora/campo-numerico";
import { BotaoInfo } from "@/components/ui/botao-info";
import { CAMPOS_PREMISSAS } from "@/data/camposPremissas";
import type { CampoPremissa, PremissasCenario } from "@/types/calculadora";

/* === TIPOS DO CAMPO DE PREMISSA | inicio === */
type AoMudarPremissa = (campo: CampoPremissa, valor: number) => void;
/* === TIPOS DO CAMPO DE PREMISSA | fim === */

/* === EXPLICACAO DO CAMPO | inicio === */
export function ExplicacaoCampo({ campo }: { campo: CampoPremissa }): JSX.Element {
  const definicao = CAMPOS_PREMISSAS[campo];

  return (
    <>
      <span className="block">{definicao.info}</span>
      <span className="mt-2 block border-t border-white/15 pt-2 text-white/70">No cálculo: {definicao.entraEm}</span>
    </>
  );
}
/* === EXPLICACAO DO CAMPO | fim === */

/* === CAMPO DE PREMISSA | inicio === */
// Campo numerico ligado ao catalogo: rotulo, unidade, limites e explicacao vem de CAMPOS_PREMISSAS.
export function CampoDaPremissa({
  campo,
  premissas,
  aoMudar,
  rotulo,
  prefixoId = "premissa",
}: {
  campo: CampoPremissa;
  premissas: PremissasCenario;
  aoMudar: AoMudarPremissa;
  rotulo?: string;
  prefixoId?: string;
}): JSX.Element {
  const definicao = CAMPOS_PREMISSAS[campo];

  return (
    <CampoNumerico
      id={`${prefixoId}-${campo}`}
      label={rotulo ?? definicao.rotulo}
      info={<ExplicacaoCampo campo={campo} />}
      prefixo={definicao.prefixo}
      sufixo={definicao.sufixo}
      min={definicao.min}
      max={definicao.max}
      valor={premissas[campo]}
      aoMudar={(valor) => aoMudar(campo, valor)}
    />
  );
}
/* === CAMPO DE PREMISSA | fim === */

/* === PAR SEM HSS / COM HSS | inicio === */
export function ParSemComPremissa({
  titulo,
  campoSem,
  campoCom,
  premissas,
  aoMudar,
  prefixoId = "premissa",
}: {
  titulo: string;
  campoSem: CampoPremissa;
  campoCom: CampoPremissa;
  premissas: PremissasCenario;
  aoMudar: AoMudarPremissa;
  prefixoId?: string;
}): JSX.Element {
  const idTitulo = `${prefixoId}-${campoSem}-titulo`;
  const definicaoSem = CAMPOS_PREMISSAS[campoSem];

  return (
    <div role="group" aria-labelledby={idTitulo} className="min-w-0 min-[360px]:col-span-2 md:col-span-1">
      <div className="flex items-center justify-between gap-2">
        <p id={idTitulo} className="text-sm font-semibold leading-5 text-slate-950">
          {titulo}
        </p>
        <BotaoInfo titulo={titulo}>{definicaoSem.info}</BotaoInfo>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-2.5 border-l-2 border-hss-violeta/15 pl-2.5">
        <CampoDaPremissa campo={campoSem} rotulo="Sem HSS" premissas={premissas} aoMudar={aoMudar} prefixoId={prefixoId} />
        <CampoDaPremissa campo={campoCom} rotulo="Com HSS" premissas={premissas} aoMudar={aoMudar} prefixoId={prefixoId} />
      </div>
    </div>
  );
}
/* === PAR SEM HSS / COM HSS | fim === */
