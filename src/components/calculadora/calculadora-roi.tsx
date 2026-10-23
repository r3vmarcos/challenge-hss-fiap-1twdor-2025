import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CampoNumerico } from "@/components/calculadora/campo-numerico";
import { CampoDaPremissa } from "@/components/calculadora/campo-premissa";
import { ChatIaCarreira, ChatIaCenario } from "@/components/calculadora/chat-ia-cenario";
import { TelaResultado } from "@/components/calculadora/tela-resultado";
import { TelaResultadoCarreira } from "@/components/calculadora/tela-resultado-carreira";
import { CAMPOS_PREMISSAS } from "@/data/camposPremissas";
import { CAMPO_CUSTO_VIDA_FORMADO, CAMPOS_CARREIRA, CAMPOS_CURSO, CAMPOS_LOCAL, locaisValidos, MAXIMO_LOCAIS, novoLocal, PERFIS_CARREIRA } from "@/data/carreiraMedica";
import { filtrarCenariosPublicos, normalizarCenario, normalizarCenarios } from "@/data/configuracoesCredenciamento";
import { useCenariosPublicos } from "@/hooks/useCenariosCredenciamento";
import { GIROS_PARA_SAIR, useEncaixeMagnetico } from "@/hooks/useEncaixeMagnetico";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import imagemRoiCarreira from "@/assets/img-roi-carreira.webp";
import imagemRoiCorporativo from "@/assets/img-roi-corporativo.webp";
import imagemRoiInicial from "@/assets/img-roi-inicial.webp";
import imagemRoiMedico from "@/assets/img-roi-medico.webp";
import { calcularCarreira, calcularCustoVidaFormado } from "@/services/calculosCarreira";
import { ID_PERFIL_IA } from "@/services/iaCenarios";
import { calcularConsultasMes, calcularRoiInstituicao, calcularRoiMedico, calcularTimeline, formatarMoeda, formatarNumero, formatarTempo } from "@/services/calculosRoi";
import type {
  CampoCarreira,
  LocalAtendimento,
  CampoPremissa,
  CenarioCredenciamento,
  PerfilCarreira,
  PerspectivaRoi,
  PremissasCarreira,
  PremissasCenario,
  ResultadoInstituicao,
  ResultadoMedico,
  TipoCalculadora,
} from "@/types/calculadora";

/* === ROTEIRO DO PASSO A PASSO | inicio === */
type IdPasso = "cenario" | "perfil" | "dados" | "curso" | "atendimentos";

interface DefinicaoPasso {
  id: IdPasso;
  nome: string;
  pergunta: string;
  descricao: string;
}

const CALCULADORAS: { valor: TipoCalculadora; titulo: string; destaque: string; descricao: string }[] = [
  {
    valor: "medico",
    titulo: "ROI do médico com a HSS",
    destaque: "médico",
    descricao: "Em quanto tempo você recupera o que gasta para começar a atender, sem e com a HSS, nos casos mais comuns de credenciamento.",
  },
  {
    valor: "corporativo",
    titulo: "ROI corporativo com a HSS",
    destaque: "corporativo",
    descricao: "Para hospitais, clínicas e pronto atendimentos: em quanto tempo a HSS se paga e quanto o credenciamento custa sem e com ela.",
  },
  {
    valor: "carreira",
    titulo: "ROI da carreira médica",
    destaque: "carreira",
    descricao: "Quanto custa a graduação em medicina e quantos anos de profissão pagam esse investimento.",
  },
];

// Imagem da faixa da direita: uma na tela inicial e uma por calculadora.
const IMAGENS_CALCULADORA: Record<TipoCalculadora, string> = {
  medico: imagemRoiMedico,
  corporativo: imagemRoiCorporativo,
  carreira: imagemRoiCarreira,
};

const ROTULOS_CALCULADORA: Record<TipoCalculadora, string> = {
  medico: "ROI do médico",
  corporativo: "ROI corporativo",
  carreira: "ROI da carreira",
};

// Medico e corporativo: dois passos curtos (escolher o caso e informar so os dados principais); o resto vem do ADM
// (referencias de mercado) e aparece, com a conta inteira, na aba "Cálculo" do resultado.
// Carreira: perfil, gastos do curso e atendimentos.
const PASSOS: Record<TipoCalculadora, DefinicaoPasso[]> = {
  medico: [
    { id: "cenario", nome: "Onde atender", pergunta: "Onde você vai se credenciar?", descricao: "Os casos mais comuns, cada um com etapas e prazos próprios. Não achou o seu? Monte com a IA." },
    { id: "dados", nome: "Seus dados", pergunta: "Conte só o principal", descricao: "Pense em uma semana normal depois de liberado: quantas consultas você faz, quanto recebe por elas e quanto gasta para começar. Com isso calculamos em quanto tempo você recupera o investimento, sem e com a HSS." },
  ],
  corporativo: [
    { id: "cenario", nome: "Processo", pergunta: "Qual processo você quer simular?", descricao: "Os processos mais comuns de hospitais, clínicas e pronto atendimentos. Não achou o seu? Monte com a IA." },
    { id: "dados", nome: "Seus dados", pergunta: "Conte só o principal", descricao: "Use a média dos últimos meses: quantos médicos entram por mês, a agenda de cada um e quanto fica com a instituição por consulta. Com isso calculamos em quanto tempo a HSS se paga." },
  ],
  carreira: [
    { id: "perfil", nome: "Formação", pergunta: "Qual perfil de formação se parece com o seu?", descricao: "Os quatro perfis do estudo de custos da graduação em medicina (2025-2026). Não achou o seu? Monte com a IA. Nos próximos passos você ajusta os gastos do curso e os seus atendimentos." },
    { id: "curso", nome: "Gastos do curso", pergunta: "Ajuste os gastos do curso", descricao: "Mensalidade, custo de vida, materiais e preparatório nos anos de graduação, já preenchidos com os valores do perfil. Use o botão \"i\" para ver as faixas de mercado." },
    { id: "atendimentos", nome: "Seus atendimentos", pergunta: "Como serão os seus atendimentos?", descricao: "Pense em um mês normal depois de formado: quantos pacientes você atende por plantão, quantos plantões faz e quanto recebe por atendimento. Com isso calculamos o seu ganho líquido." },
  ],
};

const PERSPECTIVA_DA_CALCULADORA: Record<Exclude<TipoCalculadora, "carreira">, PerspectivaRoi> = {
  medico: "medico",
  corporativo: "instituicao",
};

// Rotulos na voz de cada perfil; sem entrada aqui, vale o rotulo do catalogo.
const ROTULOS_VISITANTE: Record<PerspectivaRoi, Partial<Record<CampoPremissa, string>>> = {
  medico: {
    parcelaMedicoPercentual: "Parte que fica com você",
    custoEntrada: "Custos para entrar",
    impostosPercentual: "Impostos sobre o que recebe",
    custoConsultaMedico: "Seu custo por consulta",
    valorHoraMedico: "Quanto vale uma hora sua",
    mensalidadeHssMedico: "Mensalidade da HSS para você",
    ocupacaoPercentual: "Quanto da agenda deve lotar",
    horasMedicoSemHss: "Suas horas com papelada, sem HSS",
    horasMedicoComHss: "Suas horas com papelada, com HSS",
    custoRetrabalhoMedico: "Custo de cada retrabalho",
  },
  instituicao: {
    consultasPorDia: "Consultas por dia, por médico",
    parcelaMedicoPercentual: "Parte repassada ao médico",
    ocupacaoPercentual: "Ocupação esperada da agenda",
    mesesAnalise: "Período da análise",
    custoRetrabalhoInstituicao: "Custo de cada retrabalho",
  },
};

const CHAVE_PREMISSAS_VISITANTE = "hss_roi_v5_premissas";
const CHAVE_CENARIOS_IA = "hss_roi_v4_cenarios_ia";
const CHAVE_PREMISSAS_CARREIRA = "hss_roi_v6_premissas_carreira";
const CHAVE_PERFIL_CARREIRA_IA = "hss_roi_v6_perfil_carreira_ia";
const CHAVE_PRAZOS_EM_BRANCO = "hss_roi_v6_prazos_em_branco";

// ==CENARIO E PERFIL EM BRANCO==
// Primeira opcao das listas: o visitante preenche do zero. Os campos visiveis comecam em 0; os demais
// (impostos, horas, retrabalho, precos da HSS) seguem a referencia do primeiro caso do ADM.
const PREFIXO_EM_BRANCO = "em-branco";
const ID_PERFIL_EM_BRANCO = "em-branco";

interface PrazosEmBranco {
  semHss: number;
  comHss: number;
}

function ehEmBranco(id: string): boolean {
  return id.startsWith(PREFIXO_EM_BRANCO);
}

function montarCenarioEmBranco(base: CenarioCredenciamento | undefined, perspectiva: PerspectivaRoi, prazos: PrazosEmBranco): CenarioCredenciamento {
  const modelo = base ?? normalizarCenario({});
  const visiveis = modelo.camposVisitante[perspectiva];
  const premissas = { ...modelo.premissas };
  visiveis.forEach((campo) => {
    premissas[campo] = 0;
  });

  return {
    ...modelo,
    id: `${PREFIXO_EM_BRANCO}-${perspectiva}`,
    nome: "Cenário em branco",
    resumoSite: "Preencha do zero os prazos e os seus dados.",
    limite: "Prazos informados por você.",
    perspectivas: [perspectiva],
    origemPrazos: "hipotese",
    origemCriacao: "adm",
    etapas: [
      {
        id: "etapa-1",
        nome: "Credenciamento",
        diasSemHss: prazos.semHss,
        diasComHss: Math.min(prazos.comHss, prazos.semHss),
        hssAtua: prazos.comHss < prazos.semHss,
        nota: "Prazo total informado pelo visitante.",
      },
    ],
    premissas,
  };
}

const PERFIL_EM_BRANCO: PerfilCarreira = {
  id: ID_PERFIL_EM_BRANCO,
  nome: "Perfil em branco",
  resumo: "Preencha do zero os gastos do curso e os seus atendimentos.",
  premissas: {
    mensalidadeInicial: 0,
    reajusteAnualPercentual: 0,
    anosCurso: 6,
    custoVidaMensal: 0,
    materiais: 0,
    preparatorioResidencia: 0,
    locais: [
      { id: "local-1", nome: "Local 1", atendimentosPorDia: 0, diasAtendimentoMes: 0, valorAtendimento: 0, parcelaMedicoPercentual: 0, impostosPercentual: 0, prazoRecebimentoDias: 30 },
    ],
    custoVidaFormado: 0,
  },
  investimentoReferencia: 0,
};
/* === ROTEIRO DO PASSO A PASSO | fim === */

/* === COMPONENTE PRINCIPAL DA CALCULADORA | inicio === */
export function CalculadoraRoi(_props: { dicasHoverAtivas: boolean }): JSX.Element {
  const { cenarios, origem } = useCenariosPublicos();
  const [tipoSalvo, definirTipo] = useLocalStorage<TipoCalculadora>("hss_roi_v6_calculadora", "medico");
  const [idCenarioMedico, definirIdCenarioMedico] = useLocalStorage<string>("hss_roi_v2_cenario_medico", "");
  const [idCenarioInstituicao, definirIdCenarioInstituicao] = useLocalStorage<string>("hss_roi_v2_cenario_instituicao", "");
  const [premissasSalvas, definirPremissasSalvas] = useLocalStorage<Record<string, Partial<PremissasCenario>>>(CHAVE_PREMISSAS_VISITANTE, {});
  const [cenariosIaBrutos, definirCenariosIa] = useLocalStorage<unknown>(CHAVE_CENARIOS_IA, []);
  const [idPerfilCarreira, definirIdPerfilCarreira] = useLocalStorage<string>("hss_roi_v6_perfil_carreira", PERFIS_CARREIRA[2].id);
  const [premissasCarreiraSalvas, definirPremissasCarreiraSalvas] = useLocalStorage<Record<string, Partial<PremissasCarreira>>>(
    CHAVE_PREMISSAS_CARREIRA,
    {},
  );
  // Perfil de formacao montado com a IA: um so por visitante, guardado no navegador como os cenarios da IA.
  const [perfilIaCarreira, definirPerfilIaCarreira] = useLocalStorage<PerfilCarreira | null>(CHAVE_PERFIL_CARREIRA_IA, null);
  const [prazosEmBranco, definirPrazosEmBranco] = useLocalStorage<PrazosEmBranco>(CHAVE_PRAZOS_EM_BRANCO, { semHss: 0, comHss: 0 });
  // Etapa 0 = escolha da calculadora; 1 e 2 = perguntas; 3 = tela de resultado.
  const [etapa, definirEtapa] = useState(0);
  const [maiorEtapaVisitada, definirMaiorEtapaVisitada] = useState(0);
  const [chatAberto, definirChatAberto] = useState(false);
  // 1 = avancando (conteudo entra pela direita); -1 = voltando (entra pela esquerda).
  const [direcaoPasso, definirDirecaoPasso] = useState(1);
  const caixaRef = useRef<HTMLDivElement>(null);
  const areaConteudoRef = useRef<HTMLDivElement>(null);
  const primeiraRenderizacaoRef = useRef(true);
  const { encaixado, girosDados, centralizar } = useEncaixeMagnetico(caixaRef);

  const tipo: TipoCalculadora = tipoSalvo === "corporativo" || tipoSalvo === "carreira" ? tipoSalvo : "medico";
  const ehCarreira = tipo === "carreira";
  const perspectiva: PerspectivaRoi = tipo === "carreira" ? "medico" : PERSPECTIVA_DA_CALCULADORA[tipo];
  const passos = PASSOS[tipo];
  // Medico e corporativo tem 2 passos; carreira tem 3. O resultado vem logo depois do ultimo passo.
  const totalPassos = passos.length;
  const etapaResultado = totalPassos + 1;

  // Carreira: perfil escolhido com as edicoes do visitante (sem comparacao com a HSS).
  const perfilCarreira =
    idPerfilCarreira === ID_PERFIL_EM_BRANCO
      ? PERFIL_EM_BRANCO
      : idPerfilCarreira === ID_PERFIL_IA && perfilIaCarreira
        ? perfilIaCarreira
        : (PERFIS_CARREIRA.find((item) => item.id === idPerfilCarreira) ?? PERFIS_CARREIRA[2]);
  const premissasCarreira = useMemo<PremissasCarreira>(
    () => {
      const salvas = premissasCarreiraSalvas[perfilCarreira.id];
      return { ...perfilCarreira.premissas, ...salvas, locais: locaisValidos(salvas?.locais ?? perfilCarreira.premissas.locais) };
    },
    [perfilCarreira, premissasCarreiraSalvas],
  );
  const carreiraEditada = Boolean(premissasCarreiraSalvas[perfilCarreira.id]);
  // Cenarios montados com a IA ficam so neste navegador e aparecem junto dos cenarios ativos do ADM.
  const cenariosIa = useMemo(() => normalizarCenarios(cenariosIaBrutos) ?? [], [cenariosIaBrutos]);
  const publicos = useMemo(() => filtrarCenariosPublicos([...cenarios, ...cenariosIa], perspectiva), [cenarios, cenariosIa, perspectiva]);
  const cenarioEmBranco = useMemo(
    () => montarCenarioEmBranco(filtrarCenariosPublicos(cenarios, perspectiva)[0], perspectiva, prazosEmBranco),
    [cenarios, perspectiva, prazosEmBranco],
  );
  const disponiveis = useMemo(() => [cenarioEmBranco, ...publicos], [cenarioEmBranco, publicos]);
  const idSelecionado = perspectiva === "medico" ? idCenarioMedico : idCenarioInstituicao;
  // Sem escolha salva, comeca no primeiro caso real, nao no cenario em branco.
  const cenario = disponiveis.find((item) => item.id === idSelecionado) ?? publicos[0] ?? cenarioEmBranco;

  // Edicoes do visitante ficam guardadas por cenario e valem para os dois perfis; sem edicao, valem os valores do ADM.
  const premissas = useMemo<PremissasCenario | null>(
    () => (cenario ? { ...cenario.premissas, ...premissasSalvas[cenario.id] } : null),
    [cenario, premissasSalvas],
  );
  const resultadoMedico = useMemo(() => (cenario && premissas ? calcularRoiMedico(cenario.etapas, premissas) : null), [cenario, premissas]);
  const resultadoInstituicao = useMemo(
    () => (cenario && premissas ? calcularRoiInstituicao(cenario.etapas, premissas) : null),
    [cenario, premissas],
  );
  const possuiEdicao = ehCarreira ? carreiraEditada : cenario ? Boolean(premissasSalvas[cenario.id]) : false;

  // Com a caixa ocupando quase toda a tela (travada ou nao), o cabecalho fixo sai para nao cobrir a calculadora.
  useEffect(() => {
    const caixa = caixaRef.current;
    if (!caixa) return;

    const observador = new IntersectionObserver(
      ([entrada]) => document.body.classList.toggle("calculadora-em-tela", entrada.intersectionRatio >= 0.85),
      { threshold: [0, 0.85, 1] },
    );
    observador.observe(caixa);

    return () => {
      observador.disconnect();
      document.body.classList.remove("calculadora-em-tela");
    };
  }, []);

  // A cada troca de etapa, leva o foco ao titulo (sem mexer no foco no carregamento da pagina).
  useEffect(() => {
    if (primeiraRenderizacaoRef.current) {
      primeiraRenderizacaoRef.current = false;
      return;
    }

    areaConteudoRef.current?.scrollTo({ top: 0 });
    // Se o visitante rolou a pagina, a navegacao interna (voltar, proximo, trocar, nova simulacao) traz a caixa de volta a tela.
    centralizar();
    areaConteudoRef.current?.querySelector<HTMLElement>("[data-titulo-passo]")?.focus({ preventScroll: true });
  }, [etapa]);

  function irPara(proxima: number): void {
    definirDirecaoPasso(proxima >= etapa ? 1 : -1);
    definirChatAberto(false);
    definirEtapa(proxima);
    definirMaiorEtapaVisitada((atual) => Math.max(atual, proxima));
  }

  function handleEscolherCalculadora(valor: TipoCalculadora): void {
    // Voltando a mesma calculadora, mantem os passos ja visitados.
    definirMaiorEtapaVisitada(valor === tipo ? Math.max(1, maiorEtapaVisitada) : 1);
    definirTipo(valor);
    definirDirecaoPasso(1);
    definirEtapa(1);
  }

  function atualizarPremissaCarreira(campo: CampoCarreira, valor: number): void {
    definirPremissasCarreiraSalvas({
      ...premissasCarreiraSalvas,
      [perfilCarreira.id]: { ...premissasCarreiraSalvas[perfilCarreira.id], [campo]: valor },
    });
  }

  // Locais de atendimento (medico que atende em mais de um lugar): a lista inteira fica salva junto das edicoes do perfil.
  function atualizarLocaisCarreira(locais: LocalAtendimento[]): void {
    definirPremissasCarreiraSalvas({
      ...premissasCarreiraSalvas,
      [perfilCarreira.id]: { ...premissasCarreiraSalvas[perfilCarreira.id], locais },
    });
  }

  // Custo de vida depois de formado: sem edicao, acompanha o custo de vida dos gastos do curso.
  function atualizarCustoVidaFormado(valor: number): void {
    definirPremissasCarreiraSalvas({
      ...premissasCarreiraSalvas,
      [perfilCarreira.id]: { ...premissasCarreiraSalvas[perfilCarreira.id], custoVidaFormado: valor },
    });
  }

  function selecionarCenario(id: string): void {
    if (perspectiva === "medico") {
      definirIdCenarioMedico(id);
      return;
    }

    definirIdCenarioInstituicao(id);
  }

  function atualizarPremissa(campo: CampoPremissa, valor: number): void {
    if (!cenario) return;
    definirPremissasSalvas({ ...premissasSalvas, [cenario.id]: { ...premissasSalvas[cenario.id], [campo]: valor } });
  }

  function restaurarValoresCenario(): void {
    if (!ehCarreira && cenario && ehEmBranco(cenario.id)) definirPrazosEmBranco({ semHss: 0, comHss: 0 });
    if (ehCarreira) {
      const { [perfilCarreira.id]: _removido, ...restante } = premissasCarreiraSalvas;
      definirPremissasCarreiraSalvas(restante);
      return;
    }
    if (!cenario) return;
    const { [cenario.id]: _removido, ...restante } = premissasSalvas;
    definirPremissasSalvas(restante);
  }

  function handleUsarCenarioIa(novo: CenarioCredenciamento): void {
    // O cenario do visitante fica so no perfil em que ele foi montado.
    const comPerfil: CenarioCredenciamento = { ...novo, perspectivas: [perspectiva] };
    definirCenariosIa([...cenariosIa, comPerfil]);
    selecionarCenario(comPerfil.id);
    definirChatAberto(false);
  }

  function handleComecarDoZero(): void {
    if (ehCarreira) definirIdPerfilCarreira(ID_PERFIL_EM_BRANCO);
    else selecionarCenario(cenarioEmBranco.id);
    irPara(etapa + 1);
  }

  function handleUsarPerfilIa(perfil: PerfilCarreira): void {
    // Um perfil novo da IA substitui o anterior e descarta as edicoes feitas sobre ele.
    const { [ID_PERFIL_IA]: _removido, ...restante } = premissasCarreiraSalvas;
    definirPremissasCarreiraSalvas(restante);
    definirPerfilIaCarreira(perfil);
    definirIdPerfilCarreira(ID_PERFIL_IA);
    definirChatAberto(false);
  }

  function handleRemoverPerfilIa(): void {
    const { [ID_PERFIL_IA]: _removido, ...restante } = premissasCarreiraSalvas;
    definirPremissasCarreiraSalvas(restante);
    definirPerfilIaCarreira(null);
    if (idPerfilCarreira === ID_PERFIL_IA) definirIdPerfilCarreira(PERFIS_CARREIRA[2].id);
  }

  function handleRemoverCenarioIa(id: string): void {
    definirCenariosIa(cenariosIa.filter((item) => item.id !== id));
    const { [id]: _removido, ...restante } = premissasSalvas;
    definirPremissasSalvas(restante);
  }

  const passoAtual = etapa >= 1 && etapa <= totalPassos ? passos[etapa - 1] : null;
  const simulacaoPronta = !chatAberto && (ehCarreira || Boolean(cenario && premissas && resultadoMedico && resultadoInstituicao));

  // Desktop: caixa de 90svh centralizada. Tablet e celular (abaixo de lg): a caixa ocupa a tela inteira (100dvh),
  // acompanhando a area visivel quando a barra do navegador aparece ou some.
  return (
    <section id="roi" className="flex min-h-[100svh] scroll-mt-0 items-center justify-center py-[5svh] max-lg:min-h-[100dvh] max-lg:py-0">
      <div
        ref={caixaRef}
        data-tema-calculadora={etapa > 0 ? tipo : undefined}
        className="relative flex h-[90svh] w-[90dvw] flex-col overflow-hidden rounded-[1.35rem] max-lg:h-[100dvh] max-lg:w-full max-lg:rounded-none max-lg:border-x-0 border border-blue-900/35 bg-[#eef1f7]/95 shadow-suave backdrop-blur"
      >
        <FundoParallaxCalculadora />

        {/* No resultado a imagem sai para os graficos usarem a largura toda sem rolagem. */}
        {etapa !== etapaResultado ? (
        <>
        {/* Tamanho relativo a caixa (nao a area de conteudo), para ficar igual em todas as telas mesmo com a barra de passos.
            A mascara esfuma as laterais (esquerda e direita) para a foto se fundir ao fundo. */}
        <img
          src={etapa === 0 ? imagemRoiInicial : IMAGENS_CALCULADORA[tipo]}
          alt=""
          aria-hidden="true"
          className={[
            "pointer-events-none absolute z-10 hidden h-[78%] w-[36%] object-contain object-right-bottom xl:block",
            // Laterais esfumadas em todas; as da tela inicial e da carreira tambem esfumam a base, e a do medico esfuma mais a direita e a base (mesa cortada na borda).
            etapa === 0 || tipo === "carreira" ? "mascara-imagem-laterais-base" : tipo === "medico" ? "mascara-imagem-direita-base" : "mascara-imagem-laterais",
            // Distancia da base e da direita: o corporativo sobe mais e encosta na direita; inicial, medico e carreira ficam um pouco acima da base e afastados da direita.
            etapa > 0 && tipo === "corporativo" ? "bottom-[6%] right-0" : "bottom-[4%] right-[1.5%]",
          ].join(" ")}
        />
        </>
        ) : null}

        <CabecalhoCalculadora
          passos={passos}
          etapa={etapa}
          maiorEtapaVisitada={maiorEtapaVisitada}
          tipo={tipo}
          aoIrPara={irPara}
        />

        {/* No xl a faixa da direita fica reservada para a imagem; conteudo + rodape usam o restante. */}
        <div className={["relative flex min-h-0 flex-1 flex-col", etapa === etapaResultado ? "" : "xl:pr-[38%]"].join(" ")}>

        {/* A rolagem interna so existe como reserva para telas muito baixas; o conteudo foi dimensionado para caber. */}
        <div ref={areaConteudoRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* A chave muda a cada passo: o conteudo novo entra deslizando pelo lado da navegacao (avancar = direita). */}
          <div key={`${tipo}-${etapa}-${chatAberto ? "chat" : "passo"}`} className={[
              "flex min-h-0 flex-1 flex-col",
              // No tablet/celular o passo usa a altura natural (a area rola), exceto o chat: ele precisa caber na tela
              // para o historico rolar por dentro e as sugestoes e o campo ficarem sempre visiveis.
              chatAberto ? "" : "max-lg:min-h-fit",
              direcaoPasso > 0 ? "animar-passo-avancar" : "animar-passo-voltar"].join(" ")}>
          {etapa === 0 ? (
            <TelaInicial tipoAtual={maiorEtapaVisitada > 0 ? tipo : null} aoEscolher={handleEscolherCalculadora} />
          ) : null}

          {passoAtual && passoAtual.id === "cenario" && chatAberto ? (
            <div className="mx-auto flex min-h-0 w-full max-w-[52rem] flex-1 flex-col px-5 py-5 sm:px-8">
              <ChatIaCenario
                perspectiva={perspectiva}
                textoUsar="Usar na calculadora"
                aoUsarCenario={handleUsarCenarioIa}
                aoFechar={() => definirChatAberto(false)}
              />
            </div>
          ) : null}

          {passoAtual && passoAtual.id === "perfil" && chatAberto ? (
            <div className="mx-auto flex min-h-0 w-full max-w-[52rem] flex-1 flex-col px-5 py-5 sm:px-8">
              <ChatIaCarreira aoUsarPerfil={handleUsarPerfilIa} aoFechar={() => definirChatAberto(false)} />
            </div>
          ) : null}

          {passoAtual && !((passoAtual.id === "cenario" || passoAtual.id === "perfil") && chatAberto) ? (
            <div className="flex flex-1 flex-col [justify-content:safe_center]">
              <div className={`mx-auto w-full max-w-[68rem] px-5 py-4 sm:px-8`}>
                <h3 data-titulo-passo tabIndex={-1} className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-slate-950 outline-none sm:text-[1.75rem]">
                  {passoAtual.pergunta}
                </h3>
                {passoAtual.descricao ? <p className="mt-1.5 text-base leading-7 text-slate-700 [@media(max-height:820px)]:hidden">{passoAtual.descricao}</p> : null}

                <div className="mt-4 [@media(max-height:820px)]:mt-3">
                  {passoAtual.id === "perfil" ? (
                    <ListaPerfisCarreira
                      selecionado={perfilCarreira.id}
                      perfilIa={perfilIaCarreira}
                      aoSelecionar={definirIdPerfilCarreira}
                      aoAbrirChat={() => definirChatAberto(true)}
                      aoRemoverIa={handleRemoverPerfilIa}
                      aoComecarDoZero={handleComecarDoZero}
                    />
                  ) : ehCarreira ? (
                    passoAtual.id === "curso" ? (
                      <CamposCarreira campos={CAMPOS_CURSO} conferencia="curso" premissas={premissasCarreira} atualizar={atualizarPremissaCarreira} />
                    ) : (
                      <CamposAtendimentos premissas={premissasCarreira} atualizarLocais={atualizarLocaisCarreira} atualizarCustoVida={atualizarCustoVidaFormado} />
                    )
                  ) : passoAtual.id === "cenario" ? (
                    <ListaCenarios
                      cenarios={disponiveis}
                      selecionado={cenario?.id ?? ""}
                      perspectiva={perspectiva}
                      aoSelecionar={selecionarCenario}
                      aoAbrirChat={() => definirChatAberto(true)}
                      aoRemoverIa={handleRemoverCenarioIa}
                      aoComecarDoZero={handleComecarDoZero}
                    />
                  ) : cenario && premissas && resultadoMedico && resultadoInstituicao ? (
                    <CamposVisitante
                      prazos={ehEmBranco(cenario.id) ? prazosEmBranco : undefined}
                      aoMudarPrazos={definirPrazosEmBranco}
                      campos={cenario.camposVisitante[perspectiva]}
                      perspectiva={perspectiva}
                      premissas={premissas}
                      resultadoMedico={resultadoMedico}
                      resultadoInstituicao={resultadoInstituicao}
                      atualizar={atualizarPremissa}
                    />
                  ) : null}
                </div>

                {possuiEdicao && (passoAtual.id === "dados" || passoAtual.id === "curso" || passoAtual.id === "atendimentos") ? (
                  <button type="button" onClick={restaurarValoresCenario} className="mt-3 text-sm font-semibold text-hss-roxo underline-offset-4 hover:underline">
                    {ehCarreira ? "Voltar aos valores deste perfil" : "Voltar aos valores de exemplo deste caso"}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {etapa === etapaResultado && ehCarreira ? (
            <div className="mx-auto flex min-h-0 w-full max-w-[1240px] flex-1 flex-col px-4 py-4 max-lg:flex-none sm:px-8 sm:py-5">
              <TelaResultadoCarreira perfil={perfilCarreira} premissas={premissasCarreira} editado={carreiraEditada} />
            </div>
          ) : null}

          {etapa === etapaResultado && !ehCarreira && cenario && premissas && resultadoMedico && resultadoInstituicao ? (
            <div className="mx-auto flex min-h-0 w-full max-w-[1240px] flex-1 flex-col px-4 py-4 max-lg:flex-none sm:px-8 sm:py-5">
              <TelaResultado
                cenario={cenario}
                perspectiva={perspectiva}
                resultadoMedico={resultadoMedico}
                resultadoInstituicao={resultadoInstituicao}
                premissas={premissas}
                previaRascunho={origem === "rascunho"}
              />
            </div>
          ) : null}
          </div>
        </div>

        {etapa > 0 ? (
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-hss-violeta/15 px-5 py-2 sm:px-8">
            {etapa === etapaResultado ? (
              <>
                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-3 [&>button]:justify-center">
                  <button type="button" onClick={() => irPara(1)} className={classeBotaoSecundario}>
                    Ajustar respostas
                  </button>
                  <button type="button" onClick={() => irPara(0)} className={classeBotaoSecundario}>
                    Nova simulação
                  </button>
                </div>
                <a href="#lead" className={`${classeBotaoPrimario} w-full justify-center whitespace-nowrap sm:w-auto`}>
                  Agendar demonstração
                </a>
              </>
            ) : (
              <>
                <button type="button" onClick={() => irPara(etapa - 1)} className={classeBotaoSecundario}>
                  {etapa === 1 ? (
                    "Trocar calculadora"
                  ) : (
                    <>
                      Voltar<span className="hidden sm:inline">: {passos[etapa - 2].nome}</span>
                    </>
                  )}
                </button>
                <button type="button" onClick={() => irPara(etapa + 1)} disabled={!simulacaoPronta} className={classeBotaoPrimario}>
                  {etapa === totalPassos ? (
                    "Ver resultado"
                  ) : (
                    <>
                      Próximo<span className="hidden sm:inline">: {passos[etapa].nome}</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        ) : null}
        </div>

        <DicaSaida encaixado={encaixado} girosDados={girosDados} comRodape={etapa > 0} />
      </div>
    </section>
  );
}

const classeBotaoPrimario =
  "inline-flex items-center justify-center text-center rounded-full bg-hss-roxo px-4 py-3 text-sm leading-tight font-semibold sm:px-6 sm:py-2 sm:text-sm text-white shadow-neon transition hover:-translate-y-0.5 hover:bg-hss-violeta disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50";
const classeBotaoSecundario =
  "inline-flex items-center justify-center text-center rounded-full border border-hss-violeta/20 bg-white px-4 py-3 text-sm leading-tight font-semibold sm:whitespace-nowrap [.a11y-fonte-large_&]:whitespace-normal [.a11y-fonte-xlarge_&]:whitespace-normal sm:px-5 sm:py-2 sm:text-sm text-hss-roxo transition-colors hover:border-hss-violeta/50 hover:bg-hss-lavanda/10";
/* === COMPONENTE PRINCIPAL DA CALCULADORA | fim === */

/* === DICA DE SAIDA DO ENCAIXE | inicio === */
function DicaSaida({ encaixado, girosDados, comRodape }: { encaixado: boolean; girosDados: number; comRodape: boolean }): JSX.Element | null {
  const [mostrarInicial, definirMostrarInicial] = useState(false);

  // Ao encaixar, explica por alguns segundos como sair; depois so reaparece quando o visitante comeca a girar a roda.
  useEffect(() => {
    if (!encaixado) {
      definirMostrarInicial(false);
      return;
    }

    definirMostrarInicial(true);
    const temporizador = window.setTimeout(() => definirMostrarInicial(false), 2600);
    return () => window.clearTimeout(temporizador);
  }, [encaixado]);

  if (!encaixado || (!mostrarInicial && girosDados === 0)) return null;

  const restantes = GIROS_PARA_SAIR - girosDados;
  const texto =
    girosDados === 0 ? `Gire a roda do mouse ${GIROS_PARA_SAIR} vezes para sair da calculadora` : `Gire mais ${restantes} ${restantes === 1 ? "vez" : "vezes"} para sair`;

  return (
    <div
      role="status"
      className={[
        "pointer-events-none absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full bg-hss-tinta [@media(pointer:coarse)]:hidden px-4 py-2 text-[0.8125rem] font-medium text-white shadow-neon",
        comRodape ? "bottom-[4.75rem]" : "bottom-5",
      ].join(" ")}
    >
      <span className="flex gap-1" aria-hidden="true">
        {Array.from({ length: GIROS_PARA_SAIR }, (_, indice) => (
          <span key={indice} className={indice < girosDados ? "h-1.5 w-1.5 rounded-full bg-white" : "h-1.5 w-1.5 rounded-full bg-white/30"} />
        ))}
      </span>
      {texto}
    </div>
  );
}
/* === DICA DE SAIDA DO ENCAIXE | fim === */

/* === CABECALHO DA CALCULADORA | inicio === */
function CabecalhoCalculadora({
  passos,
  etapa,
  maiorEtapaVisitada,
  tipo,
  aoIrPara,
}: {
  passos: DefinicaoPasso[];
  etapa: number;
  maiorEtapaVisitada: number;
  tipo: TipoCalculadora;
  aoIrPara: (etapa: number) => void;
}): JSX.Element {
  const itens = [...passos.map((passo) => passo.nome), "Resultado"];
  const totalPassos = passos.length;
  const etapaResultado = totalPassos + 1;
  const textoEtapa = etapa === etapaResultado ? "Resultado" : etapa > 0 ? `Passo ${etapa} de ${totalPassos}` : "";

  return (
    <header className="shrink-0 border-b border-hss-violeta/15 bg-gradient-to-r from-blue-900/15 via-blue-900/5 to-white px-5 pt-4 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <h2 className="text-[clamp(1.125rem,4.6vw,1.625rem)] lg:text-[2.75rem] font-extrabold leading-tight tracking-[0.02em] text-slate-800">Calculadora ROI</h2>
        {etapa > 0 ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="whitespace-nowrap font-semibold text-slate-950">{textoEtapa}</span>
            {/* So informativo: trocar de calculadora fica no botao "Trocar calculadora" do rodape. */}
            <span className="text-slate-600">
              Calculadora: <span className="font-semibold text-slate-950">{ROTULOS_CALCULADORA[tipo]}</span>
            </span>
          </div>
        ) : null}
      </div>

      {etapa > 0 ? (
        <nav aria-label="Progresso da simulação">
          <ol className={["mt-2 grid gap-1.5", itens.length === 4 ? "grid-cols-4" : "grid-cols-3"].join(" ")}>
            {itens.map((nome, indice) => {
              const numero = indice + 1;
              const atual = numero === etapa;
              const liberado = numero <= maiorEtapaVisitada;

              return (
                <li key={nome}>
                  <button
                    type="button"
                    disabled={!liberado}
                    aria-current={atual ? "step" : undefined}
                    aria-label={numero === etapaResultado ? "Ir para o resultado" : `Ir para o passo ${numero}: ${nome}`}
                    onClick={() => aoIrPara(numero)}
                    className="block w-full pb-2 pt-1.5 text-left disabled:cursor-not-allowed"
                  >
                    <span
                      aria-hidden="true"
                      className={["block h-1.5 rounded-full", numero <= etapa ? "bg-hss-roxo" : liberado ? "bg-hss-roxo/35" : "bg-hss-violeta/10"].join(" ")}
                    />
                    <span aria-hidden="true" className={["mt-1 hidden truncate text-[0.8125rem] lg:block", atual ? "font-semibold text-slate-950" : "text-slate-600"].join(" ")}>
                      {nome}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      ) : (
        <div className="pb-4" />
      )}
    </header>
  );
}
/* === CABECALHO DA CALCULADORA | fim === */

/* === FUNDO PARALLAX DA CALCULADORA | inicio === */
// Camadas discretas atras do conteudo; o movimento vem do useParallaxProfundidade (atributos data-parallax-*).
function FundoParallaxCalculadora(): JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <span className="parallax-profundidade calc-parallax-grade" data-parallax-depth="-0.012" data-parallax-pointer="6" />
      <span className="parallax-profundidade calc-parallax-brilho calc-parallax-brilho-a" data-parallax-depth="0.015" data-parallax-pointer="10" data-parallax-invert="true" />
      <span className="parallax-profundidade calc-parallax-brilho calc-parallax-brilho-b" data-parallax-depth="-0.02" data-parallax-pointer="8" />
      <span className="parallax-profundidade calc-parallax-plano calc-parallax-plano-a" data-parallax-depth="-0.03" data-parallax-pointer="14" />
      <span className="parallax-profundidade calc-parallax-plano calc-parallax-plano-b" data-parallax-depth="0.025" data-parallax-pointer="11" data-parallax-invert="true" />
      <span className="parallax-profundidade calc-parallax-anel" data-parallax-depth="0.018" data-parallax-pointer="18" data-parallax-invert="true" />
    </div>
  );
}
/* === FUNDO PARALLAX DA CALCULADORA | fim === */

/* === FUNDO DOS CARTOES | inicio === */
// Degrade discreto do branco para a cor de cada calculadora; o hover mantem o preenchimento solido da marca.
const FUNDO_CARTAO_CALCULADORA: Record<TipoCalculadora, string> = {
  medico: "border-sky-200 bg-gradient-to-r from-white to-sky-100 hover:border-sky-600 hover:from-sky-600 hover:to-sky-600",
  corporativo: "border-violet-300 bg-gradient-to-r from-white to-violet-200 hover:border-violet-600 hover:from-violet-600 hover:to-violet-600",
  carreira: "border-orange-300 bg-gradient-to-r from-white to-orange-200 hover:border-orange-600 hover:from-orange-600 hover:to-orange-600",
};

// Mesma cor do hover de cada cartao, aplicada a palavra destacada do titulo.
const COR_DESTAQUE_CALCULADORA: Record<TipoCalculadora, string> = {
  medico: "text-sky-600",
  corporativo: "text-violet-600",
  carreira: "text-orange-600",
};
/* === FUNDO DOS CARTOES | fim === */

/* === TITULO COM DESTAQUE | inicio === */
// Destaca em maiusculas e cor a palavra que identifica a calculadora (medico, corporativo, carreira).
function TituloComDestaque({ titulo, destaque, classeCor }: { titulo: string; destaque: string; classeCor: string }): JSX.Element {
  const posicao = titulo.indexOf(destaque);
  if (posicao < 0) return <>{titulo}</>;

  return (
    <>
      {titulo.slice(0, posicao)}
      <span className={["uppercase tracking-[0.04em] group-hover:text-white", classeCor].join(" ")}>{destaque}</span>
      {titulo.slice(posicao + destaque.length)}
    </>
  );
}
/* === TITULO COM DESTAQUE | fim === */

/* === TELA INICIAL | inicio === */
function TelaInicial({
  tipoAtual,
  aoEscolher,
}: {
  tipoAtual: TipoCalculadora | null;
  aoEscolher: (valor: TipoCalculadora) => void;
}): JSX.Element {
  return (
        <div className="flex flex-1 [align-items:safe_center] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[46rem] xl:mx-0">
        <h3 data-titulo-passo tabIndex={-1} className="text-[1.75rem] font-semibold leading-tight tracking-[-0.025em] text-slate-950 outline-none sm:text-[2.25rem]">
          Qual retorno você quer calcular?
        </h3>
        <p className="mt-3 max-w-[58ch] text-base leading-7 text-slate-700">
          Três calculadoras, já preenchidas com valores de mercado.
          <br />
          Ao final, você vê em quanto tempo o investimento retorna.
        </p>

        <ul className="mt-7 grid gap-3">
          {CALCULADORAS.map((opcao) => {
            const carreira = opcao.valor === "carreira";
            return (
              <li key={opcao.valor}>
                <button
                  type="button"
                  onClick={() => aoEscolher(opcao.valor)}
                  className={[
                    "group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors sm:gap-5 sm:p-5",
                    FUNDO_CARTAO_CALCULADORA[opcao.valor],
                  ].join(" ")}
                >
                  <span className="min-w-0 flex-1">
                    <strong className="block text-lg font-semibold text-slate-950 group-hover:text-white">
                      <TituloComDestaque titulo={opcao.titulo} destaque={opcao.destaque} classeCor={COR_DESTAQUE_CALCULADORA[opcao.valor]} />
                    </strong>
                    <span className="mt-1 block text-sm leading-6 text-slate-600 group-hover:text-white/85">{opcao.descricao}</span>
                  </span>
                  <span
                    className={[
                      "hidden shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold sm:inline-flex",
                      carreira ? "text-hss-violeta" : "text-hss-roxo",
                    ].join(" ")}
                  >
                    {tipoAtual === opcao.valor ? "Continuar" : "Começar"} →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
/* === TELA INICIAL | fim === */

/* === LISTA DE CENARIOS | inicio === */
function ListaCenarios({
  cenarios,
  selecionado,
  perspectiva,
  aoSelecionar,
  aoAbrirChat,
  aoRemoverIa,
  aoComecarDoZero,
}: {
  cenarios: CenarioCredenciamento[];
  selecionado: string;
  perspectiva: PerspectivaRoi;
  aoSelecionar: (id: string) => void;
  aoAbrirChat: () => void;
  aoRemoverIa: (id: string) => void;
  aoComecarDoZero: () => void;
}): JSX.Element {
  // Uma coluna, em grupos: os cenarios do visitante (em branco e IA) primeiro, depois os do ADM e, por ultimo, o atalho da IA.
  // O cenario em branco so aparece como opcao depois de usado; antes disso, e o botao "Faça seu cenário do início".
  const personalizados = cenarios.filter((cenario) => (ehEmBranco(cenario.id) && cenario.id === selecionado) || cenario.origemCriacao === "ia");
  const atuais = cenarios.filter((cenario) => !ehEmBranco(cenario.id) && cenario.origemCriacao !== "ia");

  function renderizarCenario(cenario: CenarioCredenciamento): JSX.Element {
    const timeline = calcularTimeline(cenario.etapas);
    const daIa = cenario.origemCriacao === "ia";

    return (
      <OpcaoLista
        key={cenario.id}
        nomeGrupo={`cenario-${perspectiva}`}
        valor={cenario.id}
        ativo={cenario.id === selecionado}
        titulo={cenario.nome}
        destaque={
          ehEmBranco(cenario.id) && timeline.diasSemHss === 0
            ? "Preencha do zero"
            : timeline.diasEconomizados > 0
              ? `${timeline.diasSemHss} → ${timeline.diasComHss} dias`
              : `${timeline.diasSemHss} dias, sem redução`
        }
        resumo={cenario.resumoSite}
        aoSelecionar={aoSelecionar}
        aoRemover={daIa ? () => aoRemoverIa(cenario.id) : undefined}
      />
    );
  }

  return (
    <div className="grid gap-3">
      <GrupoLista titulo="Cenário personalizado" radio={personalizados.length > 0}>
        <BotaoComecarDoZero texto="Faça seu cenário do início" aoClicar={aoComecarDoZero} />
        {personalizados.map(renderizarCenario)}
      </GrupoLista>

      <GrupoLista titulo="Cenários atuais" radio={atuais.length > 0}>
        {atuais.length > 0 ? (
          atuais.map(renderizarCenario)
        ) : (
          <p className="rounded-2xl border border-dashed border-hss-violeta/30 p-4 text-sm leading-6 text-slate-700">
            Nenhum caso está ativo para este perfil. Monte um com a IA ou ative um cenário no Portal ADM.
          </p>
        )}
      </GrupoLista>

      <GrupoLista titulo="Cenário com IA" radio={false}>
        <BotaoMontarComIa titulo="Montar meu cenário com IA" texto="O assistente faz algumas perguntas e monta as etapas e os valores do seu caso." aoClicar={aoAbrirChat} />
      </GrupoLista>
    </div>
  );
}
/* === LISTA DE CENARIOS | fim === */

/* === ITENS DAS LISTAS | inicio === */
// Peças comuns da lista de cenarios e da lista de perfis da carreira.
function GrupoLista({ titulo, radio = true, children }: { titulo: string; radio?: boolean; children: ReactNode }): JSX.Element {
  return (
    // Sem titulo visivel: os grupos sao separados por uma linha; o titulo fica so para leitores de tela.
    <section aria-label={titulo} className="border-t border-hss-violeta/15 pt-3 first:border-t-0 first:pt-0">
      <div className="grid min-w-0 gap-1.5" role={radio ? "radiogroup" : undefined} aria-label={radio ? titulo : undefined}>
        {children}
      </div>
    </section>
  );
}

function OpcaoLista({
  nomeGrupo,
  valor,
  ativo,
  titulo,
  destaque,
  resumo,
  aoSelecionar,
  aoRemover,
}: {
  nomeGrupo: string;
  valor: string;
  ativo: boolean;
  titulo: string;
  destaque: string;
  resumo?: string;
  aoSelecionar: (valor: string) => void;
  aoRemover?: () => void;
}): JSX.Element {
  return (
    <label
      className={[
        "flex w-full min-w-0 cursor-pointer items-start gap-2.5 rounded-2xl border px-3 py-2.5 transition-colors sm:py-1.5",
        ativo ? "border-hss-violeta bg-hss-lavanda/10 ring-4 ring-hss-lavanda/30" : "border-hss-violeta/20 bg-white hover:border-hss-violeta/50",
      ].join(" ")}
    >
      <input
        type="radio"
        name={nomeGrupo}
        value={valor}
        checked={ativo}
        onChange={() => aoSelecionar(valor)}
        className="mt-1 h-4 w-4 shrink-0 accent-[#291B7F]"
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-4">
          <strong className="min-w-0 text-sm font-semibold leading-5 text-slate-950">{titulo}</strong>
          <span className="min-w-0 text-[0.8125rem] font-medium tabular-nums text-slate-600">{destaque}</span>
        </span>
        {/* Resumo so em telas altas: em notebooks a lista inteira precisa caber sem rolagem. */}
        {resumo ? <span className="mt-0.5 block text-[0.8125rem] sm:truncate leading-[1.125rem] text-slate-600 [@media(max-height:940px)]:hidden">{resumo}</span> : null}
      </span>
      {aoRemover ? (
        <button
          type="button"
          onClick={(evento) => {
            evento.preventDefault();
            aoRemover();
          }}
          aria-label={`Remover "${titulo}"`}
          className="self-start text-[0.8125rem] font-semibold text-[#c2410c] hover:underline"
        >
          Remover
        </button>
      ) : null}
    </label>
  );
}

// Leva direto ao passo de preenchimento com tudo zerado.
function BotaoComecarDoZero({ texto, aoClicar }: { texto: string; aoClicar: () => void }): JSX.Element {
  return (
    <button
      type="button"
      onClick={aoClicar}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-hss-roxo bg-white px-5 py-3 text-center text-sm font-semibold text-hss-roxo transition-colors hover:bg-hss-roxo hover:text-white sm:w-auto sm:justify-self-start sm:py-2"
    >
      {texto}
      <span aria-hidden="true">→</span>
    </button>
  );
}

function BotaoMontarComIa({ titulo, texto, aoClicar }: { titulo: string; texto: string; aoClicar: () => void }): JSX.Element {
  return (
    <button
      type="button"
      onClick={aoClicar}
      className="flex min-w-0 flex-wrap items-baseline gap-x-3 rounded-2xl border border-dashed border-hss-roxo/40 bg-white px-3 py-2.5 text-left hover:border-hss-roxo hover:bg-hss-roxo/[0.04] sm:py-1.5"
    >
      <strong className="text-sm font-semibold text-hss-roxo">{titulo}</strong>
      <span className="min-w-0 text-[0.8125rem] leading-5 text-slate-600 sm:truncate">{texto}</span>
    </button>
  );
}
/* === ITENS DAS LISTAS | fim === */

/* === CAMPOS DO VISITANTE | inicio === */
const ORDEM_CAMPOS = Object.keys(CAMPOS_PREMISSAS) as CampoPremissa[];

function CamposVisitante({
  prazos,
  aoMudarPrazos,
  campos,
  perspectiva,
  premissas,
  resultadoMedico,
  resultadoInstituicao,
  atualizar,
}: {
  prazos?: PrazosEmBranco;
  aoMudarPrazos: (prazos: PrazosEmBranco) => void;
  campos: CampoPremissa[];
  perspectiva: PerspectivaRoi;
  premissas: PremissasCenario;
  resultadoMedico: ResultadoMedico;
  resultadoInstituicao: ResultadoInstituicao;
  atualizar: (campo: CampoPremissa, valor: number) => void;
}): JSX.Element {
  // Ordem do catalogo, independente da ordem em que o ADM marcou os campos.
  const visiveis = ORDEM_CAMPOS.filter((campo) => campos.includes(campo));

  return (
    <GradeCampos>
      {prazos ? (
        <>
          <CampoNumerico
            id="branco-prazo-sem"
            label="Prazo do credenciamento sem HSS"
            info="Quantos dias, somando todas as etapas, o credenciamento leva hoje."
            sufixo="dias"
            valor={prazos.semHss}
            aoMudar={(valor) => aoMudarPrazos({ ...prazos, semHss: valor })}
          />
          <CampoNumerico
            id="branco-prazo-com"
            label="Prazo do credenciamento com HSS"
            info="Sua hipótese de prazo com a HSS. Não pode passar do prazo sem HSS."
            sufixo="dias"
            max={prazos.semHss}
            valor={prazos.comHss}
            aoMudar={(valor) => aoMudarPrazos({ ...prazos, comHss: valor })}
          />
        </>
      ) : null}
      {visiveis.map((campo) => (
        <CampoDaPremissa
          key={campo}
          campo={campo}
          rotulo={ROTULOS_VISITANTE[perspectiva][campo]}
          premissas={premissas}
          aoMudar={atualizar}
          prefixoId={perspectiva === "medico" ? "med" : "inst"}
        />
      ))}
      <Conferencia>
        {perspectiva === "medico"
          ? `Cerca de ${formatarNumero(calcularConsultasMes(premissas))} consultas por mês: você fica com ${formatarMoeda(resultadoMedico.margemPorConsulta)} por consulta, cerca de ${formatarMoeda(resultadoMedico.rendaMensal)} por mês.${
              resultadoMedico.investimentoFormacao > 0 ? ` Investimento no curso: ${formatarMoeda(resultadoMedico.investimentoFormacao)}.` : ""
            }`
          : `A instituição fica com ${formatarNumero(resultadoInstituicao.parcelaInstituicaoPercentual)}%: margem de ${formatarMoeda(resultadoInstituicao.margemPorConsulta)} por consulta e ${formatarMoeda(resultadoInstituicao.margemDiaria)} por dia, por médico.`}
      </Conferencia>
      <p className="text-[0.8125rem] leading-5 text-slate-600 min-[360px]:col-span-2 lg:col-span-3">
        Impostos, horas de papelada, retrabalho e os demais valores usam referências de mercado.
      </p>
    </GradeCampos>
  );
}
/* === CAMPOS DO VISITANTE | fim === */

/* === PERFIS DA CARREIRA | inicio === */
function ListaPerfisCarreira({
  selecionado,
  perfilIa,
  aoSelecionar,
  aoAbrirChat,
  aoRemoverIa,
  aoComecarDoZero,
}: {
  selecionado: string;
  perfilIa: PerfilCarreira | null;
  aoSelecionar: (id: string) => void;
  aoAbrirChat: () => void;
  aoRemoverIa: () => void;
  aoComecarDoZero: () => void;
}): JSX.Element {
  function renderizarPerfil(perfil: PerfilCarreira): JSX.Element {
    const resultado = calcularCarreira(perfil.premissas);
    const daIa = perfil.id === ID_PERFIL_IA;

    return (
      <OpcaoLista
        key={perfil.id}
        nomeGrupo="perfil-carreira"
        valor={perfil.id}
        ativo={perfil.id === selecionado}
        titulo={perfil.nome}
        destaque={
          perfil.id === ID_PERFIL_EM_BRANCO
            ? "Preencha do zero"
            : `${formatarMoeda(resultado.investimentoTotal)} em ${formatarNumero(perfil.premissas.anosCurso)} anos · retorno em ${formatarTempo(resultado.mesesPagarFormacao).toLowerCase()}`
        }
        resumo={perfil.resumo}
        aoSelecionar={aoSelecionar}
        aoRemover={daIa ? aoRemoverIa : undefined}
      />
    );
  }

  return (
    <div className="grid gap-3">
      <GrupoLista titulo="Perfil personalizado" radio={selecionado === ID_PERFIL_EM_BRANCO || Boolean(perfilIa)}>
        <BotaoComecarDoZero texto="Faça seu perfil do início" aoClicar={aoComecarDoZero} />
        {selecionado === ID_PERFIL_EM_BRANCO ? renderizarPerfil(PERFIL_EM_BRANCO) : null}
        {perfilIa ? renderizarPerfil(perfilIa) : null}
      </GrupoLista>

      <GrupoLista titulo="Perfis atuais">{PERFIS_CARREIRA.map(renderizarPerfil)}</GrupoLista>

      <GrupoLista titulo="Perfil com IA" radio={false}>
        <BotaoMontarComIa
          titulo={perfilIa ? "Montar outro perfil com IA" : "Montar meu perfil com IA"}
          texto="O assistente pergunta sobre o curso e os seus atendimentos e preenche os valores."
          aoClicar={aoAbrirChat}
        />
      </GrupoLista>
    </div>
  );
}

function CamposCarreira({
  campos,
  conferencia,
  premissas,
  atualizar,
}: {
  campos: CampoCarreira[];
  conferencia: "curso" | "atendimentos";
  premissas: PremissasCarreira;
  atualizar: (campo: CampoCarreira, valor: number) => void;
}): JSX.Element {
  const resultado = calcularCarreira(premissas);

  return (
    <GradeCampos>
      {campos.map((campo) => {
        const definicao = CAMPOS_CARREIRA[campo];
        return (
          <CampoNumerico
            key={campo}
            id={`carreira-${campo}`}
            label={definicao.rotulo}
            info={
              <>
                <span className="block">{definicao.info}</span>
                <span className="mt-2 block border-t border-white/15 pt-2 text-white/70">No cálculo: {definicao.entraEm}</span>
              </>
            }
            prefixo={definicao.prefixo}
            sufixo={definicao.sufixo}
            min={definicao.min}
            max={definicao.max}
            passo={campo === "reajusteAnualPercentual" ? 0.1 : 1}
            valor={premissas[campo]}
            aoMudar={(valor) => atualizar(campo, valor)}
          />
        );
      })}
      <Conferencia>
        {conferencia === "curso"
          ? `Investimento total estimado: ${formatarMoeda(resultado.investimentoTotal)} em ${formatarNumero(resultado.mesesCurso / 12)} anos, sendo ${formatarMoeda(
              resultado.totalMensalidades,
            )} em mensalidades e ${formatarMoeda(resultado.totalCustoVida)} de custo de vida.`
          : `Ganho líquido de cerca de ${formatarMoeda(resultado.rendaLiquidaMensal)} por mês. Com ele, o investimento de ${formatarMoeda(
              resultado.investimentoTotal,
            )} volta em ${formatarTempo(resultado.mesesPagarFormacao).toLowerCase()} de profissão.`}
      </Conferencia>
    </GradeCampos>
  );
}
/* === PERFIS DA CARREIRA | fim === */

/* === ATENDIMENTOS DA CARREIRA | inicio === */
// Passo "Seus atendimentos": um bloco por local (medico que atende em mais de um lugar, ate MAXIMO_LOCAIS),
// cada um com todos os campos, inclusive impostos e prazo de pagamento. O ganho so aparece no resultado.
function CamposAtendimentos({
  premissas,
  atualizarLocais,
  atualizarCustoVida,
}: {
  premissas: PremissasCarreira;
  atualizarLocais: (locais: LocalAtendimento[]) => void;
  atualizarCustoVida: (valor: number) => void;
}): JSX.Element {
  const { locais } = premissas;

  function mudarLocal(id: string, mudanca: Partial<LocalAtendimento>): void {
    atualizarLocais(locais.map((local) => (local.id === id ? { ...local, ...mudanca } : local)));
  }

  return (
    <div className="grid gap-4">
      <ul className="grid gap-3" aria-label="Locais de atendimento">
        {locais.map((local, indice) => {
          const nomeVisivel = local.nome.trim() || `Local ${indice + 1}`;
          return (
            <li key={local.id} className="rounded-2xl border border-hss-violeta/15 bg-white p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <label className="flex min-w-[10rem] flex-1">
                  <span className="sr-only">Nome do local {indice + 1}</span>
                  <input
                    type="text"
                    value={local.nome}
                    maxLength={40}
                    placeholder={`Local ${indice + 1}`}
                    onChange={(evento) => mudarLocal(local.id, { nome: evento.target.value })}
                    className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-1.5 py-1 text-base font-semibold text-slate-950 outline-none transition hover:border-hss-violeta/20 focus:border-hss-violeta focus:ring-4 focus:ring-hss-lavanda/30"
                  />
                </label>
                {locais.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => atualizarLocais(locais.filter((item) => item.id !== local.id))}
                    aria-label={`Remover ${nomeVisivel}`}
                    className="text-[0.8125rem] font-semibold text-[#c2410c] hover:underline"
                  >
                    Remover
                  </button>
                ) : null}
              </div>

              <div className="mt-3 grid gap-x-4 gap-y-3 min-[360px]:grid-cols-2 lg:grid-cols-3">
                {CAMPOS_LOCAL.map((campo) => {
                  const definicao = CAMPOS_CARREIRA[campo];
                  return (
                    <CampoNumerico
                      key={campo}
                      id={`${local.id}-${campo}`}
                      label={definicao.rotulo}
                      info={
                        <>
                          <span className="block">{definicao.info}</span>
                          <span className="mt-2 block border-t border-white/15 pt-2 text-white/70">No cálculo: {definicao.entraEm}</span>
                        </>
                      }
                      prefixo={definicao.prefixo}
                      sufixo={definicao.sufixo}
                      min={definicao.min}
                      max={definicao.max}
                      valor={local[campo]}
                      aoMudar={(valor) => mudarLocal(local.id, { [campo]: valor })}
                    />
                  );
                })}
                {/* Custo de vida e da pessoa, nao do local: aparece uma vez, no primeiro local. */}
                {indice === 0 ? (
                  <CampoNumerico
                    id="carreira-custoVidaFormado"
                    label={CAMPO_CUSTO_VIDA_FORMADO.rotulo}
                    info={
                      <>
                        <span className="block">{CAMPO_CUSTO_VIDA_FORMADO.info}</span>
                        <span className="mt-2 block border-t border-white/15 pt-2 text-white/70">No cálculo: {CAMPO_CUSTO_VIDA_FORMADO.entraEm}</span>
                      </>
                    }
                    prefixo={CAMPO_CUSTO_VIDA_FORMADO.prefixo}
                    valor={calcularCustoVidaFormado(premissas)}
                    aoMudar={atualizarCustoVida}
                  />
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {locais.length < MAXIMO_LOCAIS ? (
        <button
          type="button"
          onClick={() => atualizarLocais([...locais, novoLocal(locais.length + 1)])}
          className="rounded-2xl border border-dashed border-hss-roxo/40 bg-white px-4 py-3 text-left text-sm font-semibold text-hss-roxo transition-colors hover:border-hss-roxo hover:bg-hss-lavanda/10"
        >
          Adicionar outro local de atendimento
          <span className="block text-[0.8125rem] font-normal text-slate-600">Para quem atende em mais de um hospital, clínica ou pronto atendimento.</span>
        </button>
      ) : (
        <p className="text-[0.8125rem] text-slate-600">Limite de {MAXIMO_LOCAIS} locais atingido.</p>
      )}
    </div>
  );
}
/* === ATENDIMENTOS DA CARREIRA | fim === */

/* === CAMPOS DE APOIO | inicio === */
// Duas colunas a partir de 360px para que cada passo caiba inteiro na caixa de 90dvh, sem rolagem.
function GradeCampos({ children }: { children: ReactNode }): JSX.Element {
  return <div className="grid gap-x-6 gap-y-4 min-[360px]:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Conferencia({ children }: { children: ReactNode }): JSX.Element {
  return (
    <p className="rounded-2xl border border-hss-violeta/15 bg-hss-roxo/10 px-4 py-3 text-sm leading-6 text-slate-950 min-[360px]:col-span-2 lg:col-span-3" aria-live="polite">
      {children}
    </p>
  );
}
/* === CAMPOS DE APOIO | fim === */
