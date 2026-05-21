import {
  useEffect,
  useRef,
  useState,
} from "react";

/* === TIPOS MENU ACESSIBILIDADE | inicio === */
type TamanhoFonte =
  | "small"
  | "medium"
  | "large"
  | "xlarge";

type FamiliaFonte =
  | "lexend"
  | "poppins"
  | "inter";

type ModoDaltonismo =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia";

type AlturaLinha =
  | "normal"
  | "loose"
  | "veryLoose";

type TamanhoCursor =
  | "normal"
  | "large";

type ConfiguracoesAcessibilidade = {
  altoContraste: boolean;
  tamanhoFonte: TamanhoFonte;
  familiaFonte: FamiliaFonte;
  leitorHover: boolean;
  modoDaltonismo: ModoDaltonismo;
  alturaLinha: AlturaLinha;
  tamanhoCursor: TamanhoCursor;
};
/* === TIPOS MENU ACESSIBILIDADE | fim === */

/* === CONFIGURACOES MENU ACESSIBILIDADE | inicio === */
const configuracoesPadrao: ConfiguracoesAcessibilidade = {
  altoContraste: false,
  tamanhoFonte: "medium",
  familiaFonte: "lexend",
  leitorHover: false,
  modoDaltonismo: "none",
  alturaLinha: "normal",
  tamanhoCursor: "normal",
};

const chaveStorage =
  "hss_configuracoes_acessibilidade";
/* === CONFIGURACOES MENU ACESSIBILIDADE | fim === */

/* === MENU ACESSIBILIDADE | inicio === */
export function MenuAcessibilidade(): JSX.Element {
  const [
    menuAberto,
    definirMenuAberto,
  ] = useState(false);
  const [
    configuracoes,
    definirConfiguracoes,
  ] = useState<ConfiguracoesAcessibilidade>(() => {
    const salvas =
      window.localStorage.getItem(chaveStorage);

    if (!salvas) {
      return configuracoesPadrao;
    }

    try {
      return {
        ...configuracoesPadrao,
        ...JSON.parse(salvas),
      } as ConfiguracoesAcessibilidade;
    } catch {
      return configuracoesPadrao;
    }
  });
  const [
    botaoVisivel,
    definirBotaoVisivel,
  ] = useState(true);
  const temporizadorScrollRef =
    useRef<number | null>(null);
  const botaoAcessibilidadeVisivel =
    menuAberto || botaoVisivel;

  useEffect(() => {
    function aoRolar(): void {
      if (menuAberto) {
        return;
      }

      definirBotaoVisivel(false);

      if (temporizadorScrollRef.current) {
        window.clearTimeout(
          temporizadorScrollRef.current,
        );
      }

      temporizadorScrollRef.current =
        window.setTimeout(() => {
          definirBotaoVisivel(true);
        }, 3000);
    }

    window.addEventListener("scroll", aoRolar, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        aoRolar,
      );

      if (temporizadorScrollRef.current) {
        window.clearTimeout(
          temporizadorScrollRef.current,
        );
      }
    };
  }, [menuAberto]);

  useEffect(() => {
    window.localStorage.setItem(
      chaveStorage,
      JSON.stringify(configuracoes),
    );
  }, [configuracoes]);

  useEffect(() => {
    const corpo = document.body;

    corpo.classList.remove(
      "a11y-contraste",
      "a11y-fonte-small",
      "a11y-fonte-medium",
      "a11y-fonte-large",
      "a11y-fonte-xlarge",
      "a11y-font-lexend",
      "a11y-font-poppins",
      "a11y-font-inter",
      "a11y-linha-normal",
      "a11y-linha-loose",
      "a11y-linha-veryLoose",
      "a11y-cursor-large",
      "a11y-protanopia",
      "a11y-deuteranopia",
      "a11y-tritanopia",
    );

    corpo.classList.add(
      `a11y-fonte-${configuracoes.tamanhoFonte}`,
      `a11y-font-${configuracoes.familiaFonte}`,
      `a11y-linha-${configuracoes.alturaLinha}`,
    );

    if (configuracoes.altoContraste) {
      corpo.classList.add("a11y-contraste");
    }

    if (configuracoes.tamanhoCursor === "large") {
      corpo.classList.add("a11y-cursor-large");
    }

    if (
      configuracoes.modoDaltonismo !==
      "none"
    ) {
      corpo.classList.add(
        `a11y-${configuracoes.modoDaltonismo}`,
      );
    }
  }, [configuracoes]);

  useEffect(() => {
    if (!configuracoes.leitorHover) {
      window.speechSynthesis.cancel();
      return;
    }

    const tagsValidas = [
      "P",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "BUTTON",
      "A",
      "SPAN",
      "LABEL",
      "LI",
      "STRONG",
    ];

    function aoPassarMouse(
      evento: MouseEvent,
    ): void {
      const alvo =
        evento.target as HTMLElement;

      if (
        alvo.closest(
          "[data-a11y-menu]",
        )
      ) {
        return;
      }

      if (
        !tagsValidas.includes(
          alvo.tagName,
        ) &&
        !alvo.getAttribute("aria-label")
      ) {
        return;
      }

      const texto =
        alvo.getAttribute("aria-label") ??
        alvo.innerText ??
        alvo.textContent;

      if (!texto?.trim()) {
        return;
      }

      window.speechSynthesis.cancel();

      const fala =
        new SpeechSynthesisUtterance(
          texto.trim(),
        );
      fala.lang = "pt-BR";
      window.speechSynthesis.speak(fala);
      alvo.classList.add("a11y-lendo");
    }

    function aoSairMouse(
      evento: MouseEvent,
    ): void {
      const alvo =
        evento.target as HTMLElement;

      alvo.classList.remove("a11y-lendo");
      window.speechSynthesis.cancel();
    }

    document.addEventListener(
      "mouseover",
      aoPassarMouse,
    );
    document.addEventListener(
      "mouseout",
      aoSairMouse,
    );

    return () => {
      document.removeEventListener(
        "mouseover",
        aoPassarMouse,
      );
      document.removeEventListener(
        "mouseout",
        aoSairMouse,
      );
      window.speechSynthesis.cancel();
    };
  }, [configuracoes.leitorHover]);

  function atualizarConfiguracao<
    Chave extends keyof ConfiguracoesAcessibilidade,
  >(
    chave: Chave,
    valor: ConfiguracoesAcessibilidade[Chave],
  ): void {
    definirConfiguracoes(
      (atuais) => ({
        ...atuais,
        [chave]: valor,
      }),
    );
  }

  function alternarConfiguracao(
    chave:
      | "altoContraste"
      | "leitorHover",
  ): void {
    definirConfiguracoes(
      (atuais) => ({
        ...atuais,
        [chave]: !atuais[chave],
      }),
    );
  }

  return (
    <>
      <FiltrosDaltonismo />
      <button
        type="button"
        data-a11y-menu
        onClick={() =>
          definirMenuAberto(
            (aberto) => !aberto,
          )
        }
        className={[
          "fixed right-3 top-1/2 z-[120] inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_18px_42px_rgba(15,23,42,0.24)] transition md:right-5",
          menuAberto
            ? "-translate-x-[23.5rem] bg-hss-roxo text-white max-sm:-translate-x-[calc(100vw-4.5rem)]"
            : "bg-hss-roxo text-white",
          botaoAcessibilidadeVisivel
            ? "opacity-100"
            : "pointer-events-none translate-x-20 opacity-0",
        ].join(" ")}
        aria-expanded={menuAberto}
        aria-haspopup="dialog"
        aria-label={
          menuAberto
            ? "Fechar menu de acessibilidade"
            : "Abrir menu de acessibilidade"
        }
        title="Acessibilidade"
      >
        <IconeAjustes />
      </button>

      {menuAberto ? (
        <button
          type="button"
          data-a11y-menu
          className="fixed inset-0 z-[100] bg-hss-tinta/35 backdrop-blur-[1px]"
          aria-label="Fechar menu de acessibilidade"
          onClick={() =>
            definirMenuAberto(false)
          }
        />
      ) : null}

      <aside
        data-a11y-menu
        className={[
          "fixed bottom-0 right-0 top-auto z-[110] w-full max-w-[22rem] rounded-t-2xl border border-[#d8dbea] bg-white text-[#070814] shadow-[0_28px_90px_rgba(15,23,42,0.25)] transition-transform sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-l-2xl sm:rounded-tr-none",
          menuAberto
            ? "translate-y-0 sm:translate-x-0 sm:-translate-y-1/2"
            : "translate-y-full sm:translate-x-full sm:-translate-y-1/2",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Opções de acessibilidade"
      >
        <div className="flex max-h-[calc(100vh-1rem)] flex-col overflow-hidden p-3 sm:max-h-[92vh]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-black">
              <IconeAjustes />
              Acessibilidade
            </h2>
            <button
              type="button"
              onClick={() =>
                definirMenuAberto(false)
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hss-violeta/20 text-sm font-black text-hss-roxo"
              aria-label="Fechar menu de acessibilidade"
            >
              x
            </button>
          </div>

          <div className="mt-3 grid gap-2 text-[13px]">
            <ControleToggle
              titulo="Alto contraste"
              ativo={
                configuracoes.altoContraste
              }
              aoAlternar={() =>
                alternarConfiguracao(
                  "altoContraste",
                )
              }
            />

            <ControleToggle
              titulo="Leitura por hover"
              ativo={
                configuracoes.leitorHover
              }
              aoAlternar={() =>
                alternarConfiguracao(
                  "leitorHover",
                )
              }
            />

            <ControleToggle
              titulo="Cursor grande"
              ativo={
                configuracoes.tamanhoCursor ===
                "large"
              }
              aoAlternar={() =>
                atualizarConfiguracao(
                  "tamanhoCursor",
                  configuracoes.tamanhoCursor ===
                    "large"
                    ? "normal"
                    : "large",
                )
              }
            />

            <GrupoOpcoes
              titulo="Tamanho do texto"
              opcoes={[
                ["small", "A-"],
                ["medium", "A"],
                ["large", "A+"],
                ["xlarge", "A++"],
              ]}
              valorAtual={
                configuracoes.tamanhoFonte
              }
              aoEscolher={(valor) =>
                atualizarConfiguracao(
                  "tamanhoFonte",
                  valor as TamanhoFonte,
                )
              }
            />

            <GrupoOpcoes
              titulo="Fonte"
              opcoes={[
                ["lexend", "Lexend"],
                ["poppins", "Poppins"],
                ["inter", "Inter"],
              ]}
              valorAtual={
                configuracoes.familiaFonte
              }
              aoEscolher={(valor) =>
                atualizarConfiguracao(
                  "familiaFonte",
                  valor as FamiliaFonte,
                )
              }
            />

            <GrupoOpcoes
              titulo="Espaçamento de linhas"
              opcoes={[
                ["normal", "Normal"],
                ["loose", "Largo"],
                ["veryLoose", "Muito largo"],
              ]}
              valorAtual={
                configuracoes.alturaLinha
              }
              aoEscolher={(valor) =>
                atualizarConfiguracao(
                  "alturaLinha",
                  valor as AlturaLinha,
                )
              }
            />

            <label className="grid gap-1 rounded-2xl border border-hss-violeta/15 bg-[#f8f8fc] p-2.5">
              <span className="font-black">
                Daltonismo
              </span>
              <select
                value={
                  configuracoes.modoDaltonismo
                }
                onChange={(evento) =>
                  atualizarConfiguracao(
                    "modoDaltonismo",
                    evento.target
                      .value as ModoDaltonismo,
                  )
                }
                className="rounded-xl border border-hss-violeta/20 bg-white px-3 py-1.5 text-sm font-bold outline-none"
                aria-label="Selecionar filtro de daltonismo"
              >
                <option value="none">
                  Desativado
                </option>
                <option value="protanopia">
                  Protanopia
                </option>
                <option value="deuteranopia">
                  Deuteranopia
                </option>
                <option value="tritanopia">
                  Tritanopia
                </option>
              </select>
            </label>

            <button
              type="button"
              onClick={() =>
                definirConfiguracoes(
                  configuracoesPadrao,
                )
              }
              className="rounded-2xl border border-hss-violeta/25 bg-white px-4 py-2 text-sm font-black text-hss-roxo hover:-translate-y-0.5 hover:shadow-neon"
            >
              Restaurar padrões
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
/* === MENU ACESSIBILIDADE | fim === */

/* === CONTROLES MENU ACESSIBILIDADE | inicio === */
function ControleToggle({
  titulo,
  ativo,
  aoAlternar,
}: {
  titulo: string;
  ativo: boolean;
  aoAlternar: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={aoAlternar}
      className="flex items-center justify-between gap-3 rounded-2xl border border-hss-violeta/15 bg-[#f8f8fc] p-2.5 text-left font-black"
      aria-pressed={ativo}
    >
      <span>{titulo}</span>
      <span
        className={
          ativo
            ? "flex h-6 w-11 items-center justify-end rounded-full bg-hss-roxo p-1"
            : "flex h-6 w-11 items-center justify-start rounded-full bg-slate-300 p-1"
        }
        aria-hidden="true"
      >
        <span className="h-4 w-4 rounded-full bg-white" />
      </span>
    </button>
  );
}

function GrupoOpcoes({
  titulo,
  opcoes,
  valorAtual,
  aoEscolher,
}: {
  titulo: string;
  opcoes: Array<[string, string]>;
  valorAtual: string;
  aoEscolher: (valor: string) => void;
}): JSX.Element {
  return (
    <div className="rounded-2xl border border-hss-violeta/15 bg-[#f8f8fc] p-2.5">
      <p className="font-black">{titulo}</p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {opcoes.map(([valor, rotulo]) => (
          <button
            key={valor}
            type="button"
            onClick={() =>
              aoEscolher(valor)
            }
            className={
              valorAtual === valor
                ? "rounded-full bg-hss-roxo px-2.5 py-1 text-xs font-black text-white"
                : "rounded-full border border-hss-violeta/20 bg-white px-2.5 py-1 text-xs font-black text-hss-roxo"
            }
            aria-pressed={
              valorAtual === valor
            }
          >
            {rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}
/* === CONTROLES MENU ACESSIBILIDADE | fim === */

/* === FILTROS DALTONISMO | inicio === */
function FiltrosDaltonismo(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      data-a11y-menu
      className="pointer-events-none fixed h-0 w-0"
    >
      <defs>
        <filter id="a11y-protanopia">
          <feColorMatrix
            type="matrix"
            values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"
          />
        </filter>
        <filter id="a11y-deuteranopia">
          <feColorMatrix
            type="matrix"
            values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"
          />
        </filter>
        <filter id="a11y-tritanopia">
          <feColorMatrix
            type="matrix"
            values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
/* === FILTROS DALTONISMO | fim === */

/* === ICONES MENU ACESSIBILIDADE | inicio === */
function IconeAjustes(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="4" r="1" />
      <path d="m18 19 1-7-6 1" />
      <path d="m5 8 3-3 5.5 3-2.36 3.5" />
      <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
      <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
    </svg>
  );
}
/* === ICONES MENU ACESSIBILIDADE | fim === */
