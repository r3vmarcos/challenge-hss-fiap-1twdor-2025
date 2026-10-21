import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ROTULOS_PERSPECTIVA } from "@/data/configuracoesCredenciamento";
import { calcularCarreira } from "@/services/calculosCarreira";
import { calcularTimeline, formatarMoeda, formatarTempo } from "@/services/calculosRoi";
import { enviarMensagensIa, enviarMensagensIaCarreira } from "@/services/iaCenarios";
import type { CenarioCredenciamento, MensagemChatIa, PerfilCarreira, PerspectivaRoi } from "@/types/calculadora";

/* === CONSTANTES DO CHAT | inicio === */
const SAUDACAO: MensagemChatIa = {
  autor: "ia",
  texto:
    "Olá! Vou montar um cenário de credenciamento com você, com poucas perguntas. As contas ficam por conta da calculadora. Para começar: onde vai acontecer o credenciamento?",
};

const SUGESTOES_INICIAIS = ["Hospital", "Clínica", "Convênio", "Operadora"];

const SAUDACAO_CARREIRA: MensagemChatIa = {
  autor: "ia",
  texto:
    "Olá! Vou montar o seu perfil de formação em medicina, com poucas perguntas. As contas ficam por conta da calculadora. Para começar: a universidade é pública ou particular, e fica em capital ou no interior?",
};

const SUGESTOES_CARREIRA = ["Pública", "Particular no interior", "Particular na capital", "Ainda não sei"];
// Sugestao composta (com numeros ou varios dados separados por virgula) vale ser ajustada antes de enviar;
// uma opcao simples ("Hospital", "Convênio") so precisa do clique.
function sugestaoEditavel(sugestao: string): boolean {
  return /\d/.test(sugestao) || sugestao.includes(",");
}
function telaDeToque(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}
/* === CONSTANTES DO CHAT | fim === */

/* === CHATS POR MODO | inicio === */
interface ChatIaCenarioProps {
  perspectiva: PerspectivaRoi | null;
  textoUsar: string;
  aoUsarCenario: (cenario: CenarioCredenciamento) => void;
  aoFechar: () => void;
}

export function ChatIaCenario({ perspectiva, textoUsar, aoUsarCenario, aoFechar }: ChatIaCenarioProps): JSX.Element {
  return (
    <ChatIa
      titulo="Montar cenário com IA"
      saudacao={SAUDACAO}
      sugestoesIniciais={SUGESTOES_INICIAIS}
      enviar={async (historico) => {
        const resposta = await enviarMensagensIa(historico, perspectiva);
        return { mensagem: resposta.mensagem, sugestoes: resposta.sugestoes, proposta: resposta.cenario };
      }}
      renderizarProposta={(cenario, aoContinuar) => (
        <PropostaCenario cenario={cenario} textoUsar={textoUsar} aoUsar={() => aoUsarCenario(cenario)} aoContinuar={aoContinuar} />
      )}
      aoFechar={aoFechar}
    />
  );
}

export function ChatIaCarreira({ aoUsarPerfil, aoFechar }: { aoUsarPerfil: (perfil: PerfilCarreira) => void; aoFechar: () => void }): JSX.Element {
  return (
    <ChatIa
      titulo="Montar meu perfil com IA"
      saudacao={SAUDACAO_CARREIRA}
      sugestoesIniciais={SUGESTOES_CARREIRA}
      enviar={async (historico) => {
        const resposta = await enviarMensagensIaCarreira(historico);
        return { mensagem: resposta.mensagem, sugestoes: resposta.sugestoes, proposta: resposta.perfil };
      }}
      renderizarProposta={(perfil, aoContinuar) => <PropostaPerfil perfil={perfil} aoUsar={() => aoUsarPerfil(perfil)} aoContinuar={aoContinuar} />}
      aoFechar={aoFechar}
    />
  );
}
/* === CHATS POR MODO | fim === */

/* === COMPONENTE CHAT IA | inicio === */
// Conversa generica: cada modo informa a saudacao, como enviar e como mostrar a proposta final da IA.
interface ChatIaProps<T> {
  titulo: string;
  saudacao: MensagemChatIa;
  sugestoesIniciais: string[];
  enviar: (historico: MensagemChatIa[]) => Promise<{ mensagem: string; sugestoes: string[]; proposta: T | null }>;
  renderizarProposta: (proposta: T, aoContinuar: () => void) => ReactNode;
  aoFechar: () => void;
}

function ChatIa<T>({ titulo, saudacao, sugestoesIniciais, enviar, renderizarProposta, aoFechar }: ChatIaProps<T>): JSX.Element {
  const [mensagens, definirMensagens] = useState<MensagemChatIa[]>([saudacao]);
  const [sugestoes, definirSugestoes] = useState<string[]>(sugestoesIniciais);
  const [texto, definirTexto] = useState("");
  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState("");
  const [propostaAtual, definirPropostaAtual] = useState<T | null>(null);
  const historicoRef = useRef<HTMLOListElement>(null);
  const entradaRef = useRef<HTMLInputElement>(null);

  // Mantem a ultima mensagem visivel dentro do historico, sem rolar a pagina. Roda depois do layout (rAF) e tambem
  // quando as sugestoes ou o erro aparecem, porque eles diminuem a altura do historico.
  useEffect(() => {
    const quadro = window.requestAnimationFrame(() => {
      const historico = historicoRef.current;
      if (historico) historico.scrollTo({ top: historico.scrollHeight, behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(quadro);
  }, [mensagens, carregando, propostaAtual, sugestoes, erro]);

  useEffect(() => {
    // Em tela de toque o foco automatico abriria o teclado: quem abre e o visitante, tocando no campo.
    if (!telaDeToque()) entradaRef.current?.focus({ preventScroll: true });
  }, []);

  async function enviarMensagem(conteudo: string): Promise<void> {
    const limpo = conteudo.trim();
    if (!limpo || carregando) return;

    if (telaDeToque()) enquadrarCalculadora();
    const historico: MensagemChatIa[] = [...mensagens, { autor: "visitante", texto: limpo }];
    definirMensagens(historico);
    definirTexto("");
    definirSugestoes([]);
    definirErro("");
    definirPropostaAtual(null);
    definirCarregando(true);

    try {
      const resposta = await enviar(historico);
      definirMensagens([...historico, { autor: "ia", texto: resposta.mensagem }]);
      definirSugestoes(resposta.sugestoes);
      definirPropostaAtual(resposta.proposta);
    } catch (falha) {
      definirErro(falha instanceof Error ? falha.message : "O assistente não respondeu.");
      // Devolve o texto para o visitante tentar de novo sem redigitar.
      definirMensagens(mensagens);
      definirTexto(limpo);
    } finally {
      definirCarregando(false);
      if (!telaDeToque()) entradaRef.current?.focus({ preventScroll: true });
      // No toque, a resposta (e as sugestoes) chega com a calculadora de volta enquadrada na tela.
      else if (document.activeElement !== entradaRef.current) entradaRef.current?.closest("#roi")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleSubmit(evento: FormEvent<HTMLFormElement>): void {
    evento.preventDefault();
    void enviarMensagem(texto);
  }

  function handleEditarSugestao(sugestao: string): void {
    definirTexto(sugestao);
    const entrada = entradaRef.current;
    if (!entrada) return;
    entrada.focus({ preventScroll: true });
    // Cursor no fim do texto colado, pronto para ajustar.
    window.requestAnimationFrame(() => entrada.setSelectionRange(sugestao.length, sugestao.length));
  }

  // Ao enviar no toque: fecha o teclado e, quando ele sumir, volta a encaixar a calculadora inteira na tela.
  function enquadrarCalculadora(): void {
    entradaRef.current?.blur();
    window.setTimeout(() => entradaRef.current?.closest("#roi")?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
  }

  // Quando o teclado abre (toque), leva o campo e a ultima mensagem para a area visivel, acima do teclado.
  function handleFocarEntrada(): void {
    if (!telaDeToque()) return;
    window.setTimeout(() => {
      const historico = historicoRef.current;
      if (historico) historico.scrollTop = historico.scrollHeight;
      entradaRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 300);
  }

  function handleRecomecar(): void {
    definirMensagens([saudacao]);
    definirSugestoes(sugestoesIniciais);
    definirPropostaAtual(null);
    definirErro("");
    definirTexto("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <h3 data-titulo-passo tabIndex={-1} className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-slate-950 outline-none">
            {titulo}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">O assistente pergunta; a calculadora faz as contas. Tudo pode ser ajustado depois.</p>
        </div>
        <div className="flex gap-2">
          {mensagens.length > 1 ? (
            <button type="button" onClick={handleRecomecar} className={classeBotaoSecundario}>
              Recomeçar
            </button>
          ) : null}
          <button type="button" onClick={aoFechar} className={classeBotaoSecundario}>
            Voltar à lista
          </button>
        </div>
      </div>

      <ol ref={historicoRef} aria-live="polite" className="mt-4 flex min-h-[10rem] flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-[#eef0f7] p-4">
        {mensagens.map((mensagem, indice) => (
          <li
            key={`${indice}-${mensagem.autor}`}
            className={
              mensagem.autor === "ia"
                ? "max-w-[85%] self-start whitespace-pre-line rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm leading-6 text-slate-950"
                : "max-w-[85%] self-end whitespace-pre-line rounded-2xl rounded-br-md bg-hss-roxo px-4 py-2.5 text-sm leading-6 text-white"
            }
          >
            <span className="sr-only">{mensagem.autor === "ia" ? "Assistente: " : "Você: "}</span>
            {mensagem.texto}
          </li>
        ))}
        {carregando ? (
          <li className="self-start rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-slate-600" role="status">
            Pensando…
          </li>
        ) : null}
        {propostaAtual ? renderizarProposta(propostaAtual, () => definirPropostaAtual(null)) : null}
      </ol>

      {erro ? (
        <p role="alert" className="mt-3 shrink-0 rounded-xl bg-[#ffedd5] px-4 py-2.5 text-sm font-medium text-[#c2410c]">
          {erro}
        </p>
      ) : null}

      {sugestoes.length > 0 && !carregando ? (
        <div className="mt-3 flex shrink-0 flex-wrap gap-2" aria-label="Respostas rápidas">
          {/* Opcao simples: um botao so, que envia. Opcao composta (numeros, varios dados): o lapis fundido ao lado
              copia a sugestao para o campo, para o visitante ajustar antes de enviar. */}
          {sugestoes.map((sugestao) =>
            sugestaoEditavel(sugestao) ? (
              <span
                key={sugestao}
                className="inline-flex items-stretch overflow-hidden rounded-full border border-hss-violeta/20 bg-white text-hss-roxo transition hover:border-hss-violeta"
              >
                <button type="button" onClick={() => void enviarMensagem(sugestao)} className="py-1.5 pl-3.5 pr-2 text-sm font-medium transition hover:bg-hss-lavanda/10">
                  {sugestao}
                </button>
                <button
                  type="button"
                  onClick={() => handleEditarSugestao(sugestao)}
                  aria-label={`Editar antes de enviar: ${sugestao}`}
                  title="Editar antes de enviar"
                  className="flex items-center border-l border-hss-violeta/15 px-2.5 transition hover:bg-hss-lavanda/10"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
              </span>
            ) : (
              <button
                key={sugestao}
                type="button"
                onClick={() => void enviarMensagem(sugestao)}
                className="rounded-full border border-hss-violeta/20 bg-white px-3.5 py-1.5 text-sm font-medium text-hss-roxo transition hover:border-hss-violeta hover:bg-hss-lavanda/10"
              >
                {sugestao}
              </button>
            ),
          )}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-3 flex shrink-0 gap-2">
        <label htmlFor="chatIaTexto" className="sr-only">
          Sua resposta
        </label>
        <input
          ref={entradaRef}
          id="chatIaTexto"
          value={texto}
          maxLength={2000}
          autoComplete="off"
          placeholder="Escreva sua resposta…"
          onChange={(evento) => definirTexto(evento.target.value)}
          onFocus={handleFocarEntrada}
          className="h-11 min-w-0 flex-1 rounded-full border border-hss-violeta/15 bg-[#f3f4f6] px-4 text-base text-slate-950 outline-none transition focus:border-hss-violeta focus:bg-white focus:ring-4 focus:ring-hss-lavanda/30"
        />
        <button type="submit" disabled={carregando || !texto.trim()} className={classeBotaoPrimario}>
          Enviar
        </button>
      </form>
    </div>
  );
}
/* === COMPONENTE CHAT IA | fim === */

/* === PROPOSTA DE CENARIO | inicio === */
function PropostaCenario({
  cenario,
  textoUsar,
  aoUsar,
  aoContinuar,
}: {
  cenario: CenarioCredenciamento;
  textoUsar: string;
  aoUsar: () => void;
  aoContinuar: () => void;
}): JSX.Element {
  const timeline = calcularTimeline(cenario.etapas);

  return (
    <li className="w-full rounded-2xl border border-[#079879]/40 bg-white p-4">
      <p className="text-[0.8125rem] font-semibold text-[#075f50]">Cenário pronto</p>
      <strong className="mt-1 block text-base font-semibold text-slate-950">{cenario.nome}</strong>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        {cenario.etapas.length} etapas: <span className="font-semibold text-[#c2410c]">{timeline.diasSemHss} dias sem HSS</span> e{" "}
        <span className="font-semibold text-[#075f50]">{timeline.diasComHss} com HSS</span>. Perfis: {cenario.perspectivas.map((p) => ROTULOS_PERSPECTIVA[p]).join(" e ")}.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={aoUsar} className={classeBotaoPrimario}>
          {textoUsar}
        </button>
        <button type="button" onClick={aoContinuar} className={classeBotaoSecundario}>
          Continuar ajustando
        </button>
      </div>
    </li>
  );
}
/* === PROPOSTA DE CENARIO | fim === */

/* === PROPOSTA DE PERFIL | inicio === */
function PropostaPerfil({ perfil, aoUsar, aoContinuar }: { perfil: PerfilCarreira; aoUsar: () => void; aoContinuar: () => void }): JSX.Element {
  const resultado = calcularCarreira(perfil.premissas);

  return (
    <li className="w-full rounded-2xl border border-hss-violeta/40 bg-white p-4">
      <p className="text-[0.8125rem] font-semibold text-hss-roxo">Perfil pronto</p>
      <strong className="mt-1 block text-base font-semibold text-slate-950">{perfil.nome}</strong>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Investimento de {formatarMoeda(resultado.investimentoTotal)} em {perfil.premissas.anosCurso} anos, ganho líquido de{" "}
        {formatarMoeda(resultado.rendaLiquidaMensal)} por mês e retorno em {formatarTempo(resultado.mesesPagarFormacao).toLowerCase()} de profissão.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={aoUsar} className={classeBotaoPrimario}>
          Usar na calculadora
        </button>
        <button type="button" onClick={aoContinuar} className={classeBotaoSecundario}>
          Continuar ajustando
        </button>
      </div>
    </li>
  );
}
/* === PROPOSTA DE PERFIL | fim === */

/* === CLASSES DO CHAT | inicio === */
const classeBotaoPrimario =
  "inline-flex items-center rounded-full bg-hss-roxo px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-hss-violeta disabled:cursor-not-allowed disabled:opacity-50";
const classeBotaoSecundario =
  "inline-flex items-center rounded-full border border-hss-violeta/20 bg-white px-5 py-2.5 text-sm font-semibold text-hss-roxo transition-colors hover:border-hss-violeta/50 hover:bg-hss-lavanda/10";
/* === CLASSES DO CHAT | fim === */
