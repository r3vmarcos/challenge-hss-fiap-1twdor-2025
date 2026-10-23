import { useEffect, useRef, useState } from "react";
import { etapasProcesso } from "@/data/dadosLanding";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import mockupIllustration from "@/assets/steps-section-ilustration.png";

/* === ESTILOS DAS ETAPAS | inicio === */
// O destaque (antes fixo na etapa 1) acompanha o mouse e o foco do teclado; a ultima etapa destacada continua destacada.
const CLASSE_BOTAO =
  "grid min-h-[82px] w-full grid-cols-[48px_minmax(0,1fr)] cursor-pointer items-center gap-[18px] rounded-[9px] border px-4 py-[14px] text-left font-[inherit] transition-[background-color,border-color] duration-200 ease-in-out focus-visible:outline-[3px] focus-visible:outline-[#5037e6] focus-visible:outline-offset-[3px] motion-reduce:transition-none max-[460px]:grid-cols-[42px_minmax(0,1fr)] max-[460px]:gap-3 max-[460px]:px-3 max-[460px]:py-[13px]";
const CLASSE_NUMERO =
  "grid h-12 w-12 place-items-center rounded-full text-[1.25rem] font-extrabold transition-[background-color,color] duration-200 ease-in-out motion-reduce:transition-none max-[460px]:h-[42px] max-[460px]:w-[42px] max-[460px]:text-[1.125rem]";
const CLASSE_TITULO = "block text-[0.875rem] font-extrabold leading-[1.4] transition-colors duration-200 ease-in-out motion-reduce:transition-none max-[460px]:text-[0.8125rem]";

const numeroEtapa = (indice: number): string => String(indice + 1).padStart(2, "0");
/* === ESTILOS DAS ETAPAS | fim === */

/* === SECAO COMO FUNCIONA | inicio === */
export function SecaoComoFunciona(): JSX.Element {
  return (
    <section id="como-funciona" lang="pt-BR" className="scroll-mt-28 px-4 py-12 max-[900px]:py-[42px] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] text-center">
        <div className="mb-[34px] max-[900px]:mb-[26px]">
          <h2 className=" mb-[22px] text-[clamp(2rem,4.2vw,3rem)] font-black leading-[1.15] tracking-[0.01em] text-[#080b15] max-[900px]:mb-4">Como funciona?</h2>
          <p className="mx-auto max-w-[1070px] text-base leading-[1.45] text-slate-700 max-[900px]:max-w-[680px] max-[900px]:text-[0.9375rem] max-[900px]:leading-[1.6] max-[460px]:text-[0.875rem]">
            <span className="lg:whitespace-nowrap">A Health Sync estrutura as etapas do credenciamento médico em uma plataforma digital, auditável e rastreável.</span>
            <br />
            <span>As instituições e médicos têm o controle do processo, economizando tempo e com menos burocracia.</span>
          </p>
        </div>

    {/* <h2 className="text-[2.15rem] font-black leading-tight text-[#070814] sm:text-[2.8rem]">
            Benefícios da nossa solução
          </h2>
          <p className="mt-5 text-base font-medium leading-7 text-[#171826] sm:text-lg"></p> */}

        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-center gap-[56px] max-[900px]:grid-cols-1 max-[900px]:gap-6">
          <figure className="mx-0 min-w-0 max-[900px]:mx-auto max-[900px]:max-w-[620px]">
            <img className="block h-auto w-full" src={mockupIllustration} width="607" height="535" loading="lazy" decoding="async" alt="Prévia da plataforma HSS para credenciamento médico, com envio de documentos, checklist, análise com apoio de IA e acompanhamento do processo." />
          </figure>
          <ListaEtapas />
        </div>

        {/* <div className="revelar-scroll mt-6 rounded-2xl border-2 border-[#b3b3b3] bg-[#d9dadd]/85 px-6 py-6 text-center backdrop-blur">
          <h3 className="text-[2rem] font-medium tracking-[0.02em] text-[#070814] rounded-2xl ">Etapas do processo de credenciamento</h3>
          <div className="mt-10 grid items-stretch gap-4 md:grid-cols-5">
            {etapasProcesso.map((etapa, indice) => (
              <div key={etapa.titulo} className="relative h-full">
                <CardSpotlight className="h-full min-h-[190px] p-5 text-left">
                  <h4 className="text-sm font-black leading-6 text-[#070814]">{etapa.titulo}</h4>
                  <p className="mt-2 hyphens-auto text-xs font-medium leading-5 text-slate-600">{etapa.texto}</p>
                </CardSpotlight>

                {indice < etapasProcesso.length - 1 && (
                  <span className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-lg font-black text-hss-roxo/35 md:block">
                    &gt;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div> */}

      </div>
    </section>
  );
}
/* === SECAO COMO FUNCIONA | fim === */

/* === LISTA DE ETAPAS | inicio === */
function ListaEtapas(): JSX.Element {
  const [ativa, definirAtiva] = useState(0);
  const [aberta, definirAberta] = useState<number | null>(null);

  return (
    <>
      <ol
        className="relative m-0 grid list-none gap-4 p-0 before:absolute before:bottom-10 before:left-10 before:top-10 before:w-px before:bg-[#c9cbd6] before:content-[''] max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[620px] max-[900px]:gap-3 max-[460px]:before:left-[33px]"
        aria-label="Etapas do processo de credenciamento"
      >
        {etapasProcesso.map((etapa, indice) => {
          const destacada = indice === ativa;
          return (
            <li key={etapa.titulo} className="relative">
              <button
                type="button"
                onMouseEnter={() => definirAtiva(indice)}
                onFocus={() => definirAtiva(indice)}
                onClick={() => definirAberta(indice)}
                aria-haspopup="dialog"
                className={[CLASSE_BOTAO, destacada ? "border-[#7156ff] bg-[#ece8ff]" : "border-[#cdd0d9] bg-white"].join(" ")}
              >
                <span className={[CLASSE_NUMERO, destacada ? "bg-[#5037e6] text-white" : "bg-[#ebe6ff] text-[#5037e6]"].join(" ")} aria-hidden="true">
                  {numeroEtapa(indice)}
                </span>
                <span className="min-w-0">
                  <span className={[CLASSE_TITULO, destacada ? "text-[#281b75]" : "text-[#252837]"].join(" ")}>
                    <span className="sr-only">Etapa {indice + 1}: </span>
                    {etapa.titulo}
                  </span>
                  <span className="mt-[3px] block text-[0.8125rem] leading-[1.5] text-[#4f5465] max-[460px]:text-[0.75rem]">{etapa.resumo}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <ModalEtapa
        indice={aberta}
        aoTrocar={(indice) => {
          definirAberta(indice);
          definirAtiva(indice);
        }}
        aoFechar={() => definirAberta(null)}
      />
    </>
  );
}
/* === LISTA DE ETAPAS | fim === */

/* === MODAL DA ETAPA | inicio === */
// <dialog> nativo: Esc fecha, o foco fica dentro do modal e volta ao item da lista ao fechar.
function ModalEtapa({
  indice,
  aoTrocar,
  aoFechar,
}: {
  indice: number | null;
  aoTrocar: (indice: number) => void;
  aoFechar: () => void;
}): JSX.Element {
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const etapa = indice === null ? null : etapasProcesso[indice];
  const total = etapasProcesso.length;

  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    if (indice !== null && !dialogo.open) dialogo.showModal();
    if (indice === null && dialogo.open) dialogo.close();
  }, [indice]);

  return (
    <dialog
      ref={dialogoRef}
      aria-labelledby="modal-etapa-titulo"
      onClose={aoFechar}
      // Clique no fundo escuro (fora da caixa) fecha o modal.
      onClick={(evento) => {
        if (evento.target === dialogoRef.current) dialogoRef.current?.close();
      }}
      className="m-auto w-[min(34rem,calc(100vw-2rem))] max-w-none rounded-2xl border border-[#7156ff]/40 bg-white p-0 text-left shadow-[0_24px_60px_rgba(40,27,117,0.25)] backdrop:bg-[#080711]/45 backdrop:backdrop-blur-[2px]"
    >
      {etapa && indice !== null ? (
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#5037e6] text-[1.25rem] font-extrabold text-white" aria-hidden="true">
                {numeroEtapa(indice)}
              </span>
              <div>
                <p className="text-[0.8125rem] text-[#4f5465]">
                  Etapa {indice + 1} de {total}
                </p>
                <h3 id="modal-etapa-titulo" className="text-[1.125rem] font-extrabold leading-snug text-[#281b75]">
                  {etapa.titulo}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dialogoRef.current?.close()}
              aria-label="Fechar explicação da etapa"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#cdd0d9] text-[1.125rem] leading-none text-[#281b75] hover:border-[#7156ff] hover:bg-[#ece8ff]"
            >
              ×
            </button>
          </div>

          <dl className="mt-5 grid gap-4 text-[0.875rem] leading-[1.6]">
            <div>
              <dt className="font-extrabold text-[#252837]">O que acontece</dt>
              <dd className="mt-1 text-[#4f5465]">{etapa.texto}</dd>
            </div>
            <div className="rounded-xl bg-[#e8f5f2] px-4 py-3">
              <dt className="font-extrabold text-[#075f50]">Com a HSS</dt>
              <dd className="mt-1 text-[#2f4f49]">{etapa.comHss}</dd>
            </div>
            <div>
              <dt className="font-extrabold text-[#252837]">O que continua com a instituição</dt>
              <dd className="mt-1 text-[#4f5465]">{etapa.limite}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#e3e4ec] pt-4">
            <button
              type="button"
              disabled={indice === 0}
              onClick={() => aoTrocar(indice - 1)}
              className="text-[0.875rem] font-bold text-[#5037e6] hover:underline disabled:cursor-not-allowed disabled:text-[#a5a8b8] disabled:no-underline"
            >
              Etapa anterior
            </button>
            <button
              type="button"
              disabled={indice === total - 1}
              onClick={() => aoTrocar(indice + 1)}
              className="text-[0.875rem] font-bold text-[#5037e6] hover:underline disabled:cursor-not-allowed disabled:text-[#a5a8b8] disabled:no-underline"
            >
              Próxima etapa
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
/* === MODAL DA ETAPA | fim === */
