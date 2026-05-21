import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CampoNumerico } from "@/components/calculadora/campo-numerico";
import { CartaoResultado } from "@/components/calculadora/cartao-resultado";
import {
  CONFIGURACOES_CREDENCIAMENTO_PADRAO,
  buscarConfiguracaoCredenciamento,
  filtrarConfiguracoesPublicas,
  normalizarConfiguracoesCredenciamento,
} from "@/data/configuracoesCredenciamento";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  calcularRoiEmpresa,
  calcularRoiMedico,
  formatarMoeda,
  formatarNumero,
} from "@/services/calculosRoi";
import type {
  ConfiguracaoCredenciamento,
  DadosEmpresaRoi,
  DadosMedicoRoi,
  EtapaCalculadora,
  ResultadoEmpresaRoi,
  ResultadoMedicoRoi,
  VisaoCalculadora,
} from "@/types/calculadora";

/* === VALORES INICIAIS | inicio === */
const dadosEmpresaIniciais: DadosEmpresaRoi =
  {
    nomeInstituicao: "Hospital exemplo",
    porteInstituicao: "Médio porte",
    profissionaisSaude: 120,
    atendimentosMes: 8500,
    ticketMedioAtendimento: 280,
    margemMediaAtendimento: 95,
    medicosCredenciadosMes: 12,
    valorMensalPorMedicoLiberado: 30000,
    tempoCredenciamentoAtualDias: 45,
    tempoCredenciamentoComHssDias: 14,
    horasAdministrativasSemana: 110,
    custoHoraAdministrativo: 48,
    reducaoAdministrativaPercentual: 42,
    taxaNoShowAtual: 16,
    taxaNoShowComHss: 11,
    reducaoGlosasPercentual: 52,
    custoGlosasMensal: 24000,
    custoMensalHss: 8500,
    custoImplantacaoHss: 18000,
    mesesAnalise: 12,
    tipoCredenciamentoId:
      "hospital-contratando-hss",
    tipoCredenciamentoNome:
      "Hospital contratando HSS",
    cenarioRoi:
      "hospital_contratando_hss",
    horasAdministrativasPorCredenciamento: 22,
    taxaRetrabalhoDocumental: 24,
    custoRetrabalhoPorMedico: 520,
    taxaDocumentosVencidos: 10,
    custoDocumentoVencido: 260,
    margemLiquidaPercentual: 35,
  };

const dadosMedicoIniciais: DadosMedicoRoi =
  {
    nomeMedico: "Médico exemplo",
    especialidade: "Clínica médica",
    receitaMensalEsperadaHospital: 18000,
    mesesAnalise: 12,
    custoCrmAnual: 948,
    custoCursos: 2230,
    custoDocumentos: 250,
    custoCertificadoDigital: 0,
    custoVacinasExames: 420,
    custoSeguroAnual: 1800,
    custoPjPrimeiroAno: 4200,
    horasPerdidasProcesso: 18,
    valorHoraMedica: 180,
    tempoCredenciamentoTradicionalDias: 45,
    tempoCredenciamentoDigitalDias: 14,
    custoTaxasHospitalares: 0,
    tipoCredenciamentoId:
      "medico-hospital",
    tipoCredenciamentoNome:
      "Médico atendendo em hospital",
    cenarioRoi: "medico_hospital",
    percentualRepasseClinica: 0,
    custoOperacionalMensal: 1200,
    investimentoInicial: 4000,
  };

const etapas = [
  {
    numero: 1 as EtapaCalculadora,
    nome: "Cenário",
  },
  {
    numero: 2 as EtapaCalculadora,
    nome: "Tempo",
  },
  {
    numero: 3 as EtapaCalculadora,
    nome: "Valores",
  },
  {
    numero: 4 as EtapaCalculadora,
    nome: "Custos",
  },
  {
    numero: 5 as EtapaCalculadora,
    nome: "Resultado",
  },
];

const descricoesEtapas: Record<EtapaCalculadora, string> = {
  1: "Define a visão da simulação e o tipo de cenário configurado no ADM. Aqui entram instituição, porte, volume de médicos ou dados iniciais do médico.",
  2: "Compara o tempo atual sem HSS com o tempo estimado no fluxo digital. A diferença alimenta dias economizados e receita antecipada.",
  3: "Reúne valores de receita, margem, atendimentos, repasses e no-show usados para transformar o ganho operacional em dinheiro.",
  4: "Concentra custos da HSS, implantação, retrabalho, documentos vencidos, glosas, cursos, CRM e demais despesas do cenário.",
  5: "Mostra o resumo do cálculo: ROI, benefícios, custos, payback, prejuízo evitado e leitura final do cenário.",
};
/* === VALORES INICIAIS | fim === */

/* === COMPONENTE PRINCIPAL DA CALCULADORA | inicio === */
export function CalculadoraRoi({
  dicasHoverAtivas,
}: {
  dicasHoverAtivas: boolean;
}): JSX.Element {
  const secaoCalculadoraRef = useRef<HTMLElement>(null);
  const ultimoEncaixeRef = useRef(0);
  const [visao, definirVisao] =
    useLocalStorage<VisaoCalculadora>(
      "hss_roi_visao",
      "empresa",
    );
  const [
    dadosEmpresa,
    definirDadosEmpresa,
  ] = useLocalStorage<DadosEmpresaRoi>(
    "hss_roi_empresa",
    dadosEmpresaIniciais,
  );
  const [
    dadosMedico,
    definirDadosMedico,
  ] = useLocalStorage<DadosMedicoRoi>(
    "hss_roi_medico",
    dadosMedicoIniciais,
  );
  const [configuracoesSalvas] =
    useLocalStorage<
      ConfiguracaoCredenciamento[]
    >(
      "hss_adm_configuracoes_credenciamento",
      CONFIGURACOES_CREDENCIAMENTO_PADRAO,
    );
  const [
    etapaAtual,
    definirEtapaAtual,
  ] = useState<EtapaCalculadora>(1);

  const configuracoes = useMemo(
    () =>
      normalizarConfiguracoesCredenciamento(
        configuracoesSalvas,
      ),
    [configuracoesSalvas],
  );
  const configuracoesEmpresa = useMemo(
    () =>
      filtrarConfiguracoesPublicas(
        configuracoes,
        "empresa",
      ),
    [configuracoes],
  );
  const configuracoesMedico = useMemo(
    () =>
      filtrarConfiguracoesPublicas(
        configuracoes,
        "medico",
      ),
    [configuracoes],
  );
  const resultadoEmpresa = useMemo(
    () =>
      calcularRoiEmpresa(dadosEmpresa),
    [dadosEmpresa],
  );
  const resultadoMedico = useMemo(
    () =>
      calcularRoiMedico(dadosMedico),
    [dadosMedico],
  );
  const configuracaoEmpresaAtual =
    buscarConfiguracaoCredenciamento(
      configuracoesEmpresa,
      dadosEmpresa.tipoCredenciamentoId,
    );
  const configuracaoMedicoAtual =
    buscarConfiguracaoCredenciamento(
      configuracoesMedico,
      dadosMedico.tipoCredenciamentoId,
    );

  useEffect(() => {
    const elemento = secaoCalculadoraRef.current;
    if (!elemento) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        const agora = Date.now();
        const podeEncaixar =
          entrada.isIntersecting &&
          entrada.intersectionRatio >= 0.5 &&
          agora - ultimoEncaixeRef.current > 1600;

        if (!podeEncaixar) return;

        ultimoEncaixeRef.current = agora;
        elemento.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
      {
        threshold: [0, 0.5, 0.75, 1],
      },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (
      visao === "empresa" &&
      !configuracoesEmpresa.some(
        (configuracao) =>
          configuracao.id ===
          dadosEmpresa.tipoCredenciamentoId,
      )
    ) {
      const primeira =
        configuracoesEmpresa[0];
      if (primeira)
        definirDadosEmpresa(
          aplicarConfiguracaoNaEmpresa(
            dadosEmpresa,
            primeira,
          ),
        );
    }

    if (
      visao === "medico" &&
      !configuracoesMedico.some(
        (configuracao) =>
          configuracao.id ===
          dadosMedico.tipoCredenciamentoId,
      )
    ) {
      const primeira =
        configuracoesMedico[0];
      if (primeira)
        definirDadosMedico(
          aplicarConfiguracaoNoMedico(
            dadosMedico,
            primeira,
          ),
        );
    }
  }, [
    configuracoesEmpresa,
    configuracoesMedico,
    dadosEmpresa,
    dadosMedico,
    definirDadosEmpresa,
    definirDadosMedico,
    visao,
  ]);

  const composicaoVisual =
    visao === "empresa"
      ? {
          valores: [
            resultadoEmpresa.economiaAdministrativaMensal,
            resultadoEmpresa.economiaNoShowMensal,
            resultadoEmpresa.economiaGlosasMensal,
            resultadoEmpresa.receitaAntecipadaMensal,
          ],
          rotulos: [
            "Admin",
            "No-show",
            "Retrabalho",
            "Receita antecipada",
          ],
          descricoes: [
            "Economia mensal estimada com redução de horas administrativas no credenciamento.",
            "Economia mensal estimada pela redução de no-show após o fluxo digital.",
            "Economia mensal estimada com menos retrabalho documental, glosas e pendências.",
            "Receita antecipada pela entrada mais rápida do médico na operação.",
          ],
        }
      : {
          valores: [
            resultadoMedico.custoInicialTotal,
            resultadoMedico.receitaAntecipada,
            resultadoMedico.receitaLiquidaMensal,
          ],
          rotulos: [
            "Custo inicial",
            "Receita antecipada",
            "Líquido mensal",
          ],
          descricoes: [
            "Soma dos custos de entrada, documentação, estrutura e tempo perdido pelo médico.",
            "Receita antecipada pela redução do tempo até começar a atender.",
            "Receita mensal estimada após repasses e custos operacionais.",
          ],
        };

  function atualizarEmpresa(
    campo: keyof DadosEmpresaRoi,
    valor: string | number,
  ): void {
    definirDadosEmpresa({
      ...dadosEmpresa,
      [campo]: valor,
    });
  }

  function atualizarMedico(
    campo: keyof DadosMedicoRoi,
    valor: string | number,
  ): void {
    definirDadosMedico({
      ...dadosMedico,
      [campo]: valor,
    });
  }

  function aplicarConfiguracaoAtual(
    configuracao: ConfiguracaoCredenciamento,
  ): void {
    if (visao === "empresa") {
      definirDadosEmpresa(
        aplicarConfiguracaoNaEmpresa(
          dadosEmpresa,
          configuracao,
        ),
      );
      return;
    }

    definirDadosMedico(
      aplicarConfiguracaoNoMedico(
        dadosMedico,
        configuracao,
      ),
    );
  }

  return (
    <section
      ref={secaoCalculadoraRef}
      id="roi"
      className="calculadora-magnetica flex h-[calc(100vh-74px)] w-screen scroll-mt-[74px] items-start px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex h-full w-full max-w-[100vw] flex-col xl:max-w-[1440px]">
        <div className="revelar-scroll flex flex-col gap-3">
          <div className="w-full">
            <span className="text-sm font-black uppercase tracking-[0.26em] text-hss-violeta dark:text-hss-lavanda">
              Calculadora de ROI por
              cenário
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              O ADM define as premissas,
              o usuário informa os
              valores e o ROI - 
              calculado por tempo.
            </h2>
            <p className="mt-3 max-w-5xl text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
              A calculadora considera
              cenários como empresa
              contratando HSS, hospital
              credenciando médico,
              médico atendendo em
              clínica, médico atendendo
              em hospital e consultório
              próprio.
            </p>
          </div>
          <a
            href="#adm"
            className="inline-flex rounded-full border border-hss-violeta/20 bg-white/80 px-6 py-3 text-sm font-black text-hss-roxo shadow-sm transition hover:-translate-y-1 hover:shadow-neon dark:bg-white/10 dark:text-white"
          >
            Configurar cenários no ADM
          </a>
        </div>

        <div className="revelar-scroll mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-hss-violeta/15 bg-white/90 p-4 shadow-suave backdrop-blur dark:border-white/10 dark:bg-white/10 sm:p-5">
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Calcule agora o ROI
          </h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <BotaoVisao
              ativo={
                visao === "empresa"
              }
              titulo="Empresa / Hospital / Clínica"
              subtitulo="Calcula benefício de contratar a HSS, reduzir tempo e credenciar médicos mais rápido."
              aoClicar={() =>
                definirVisao("empresa")
              }
            />
            <BotaoVisao
              ativo={visao === "medico"}
              titulo="Médico"
              subtitulo="Calcula ROI do médico em hospital, clínica particular ou consultório próprio."
              aoClicar={() =>
                definirVisao("medico")
              }
            />
          </div>

          <div className="mt-4">
            <CampoSelectConfiguracao
              configuracoes={
                visao === "empresa"
                  ? configuracoesEmpresa
                  : configuracoesMedico
              }
              valor={
                visao === "empresa"
                  ? configuracaoEmpresaAtual.id
                  : configuracaoMedicoAtual.id
              }
              aoMudar={
                aplicarConfiguracaoAtual
              }
            />
          </div>

          <NavegacaoEtapas
            etapaAtual={etapaAtual}
            aoMudar={definirEtapaAtual}
            dicasHoverAtivas={dicasHoverAtivas}
          />

          <div className="hidden">
            {etapas.map((etapa) => (
              <button
                type="button"
                key={etapa.numero}
                onClick={() =>
                  definirEtapaAtual(
                    etapa.numero,
                  )
                }
                className={
                  etapaAtual ===
                  etapa.numero
                    ? "w-full rounded-full bg-hss-roxo px-3 py-3 text-center text-sm font-black text-white shadow-neon transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-hss-lavanda/40"
                    : "w-full rounded-full border border-hss-violeta/15 bg-white px-3 py-3 text-center text-sm font-bold text-slate-600 transition hover:-translate-y-1 hover:border-hss-violeta/40 hover:bg-hss-violeta/10 hover:text-hss-roxo dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }
              >
                {String(
                  etapa.numero,
                ).padStart(2, "0")}{" "}
                - {etapa.nome}
              </button>
            ))}
          </div>

          <div className="mt-4 grid min-h-0 flex-1 gap-4 overflow-y-auto pr-1 lg:grid-cols-[1.12fr_0.88fr]">
            <div>
              {visao === "empresa" ? (
                <FormularioEmpresa
                  etapaAtual={
                    etapaAtual
                  }
                  dados={dadosEmpresa}
                  configuracoes={
                    configuracoesEmpresa
                  }
                  atualizar={
                    atualizarEmpresa
                  }
                />
              ) : (
                <FormularioMedico
                  etapaAtual={
                    etapaAtual
                  }
                  dados={dadosMedico}
                  configuracoes={
                    configuracoesMedico
                  }
                  atualizar={
                    atualizarMedico
                  }
                />
              )}
            </div>
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              {visao === "empresa" ? (
                <ResumoEmpresa
                  resultado={
                    resultadoEmpresa
                  }
                />
              ) : (
                <ResumoMedico
                  resultado={
                    resultadoMedico
                  }
                />
              )}
            </aside>
          </div>

          <div className="mt-4 w-full">
            <MiniGrafico
              valores={
                composicaoVisual.valores
              }
              rotulos={
                composicaoVisual.rotulos
              }
              descricoes={
                composicaoVisual.descricoes
              }
            />
          </div>
        </div>

        <div className="hidden">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-hss-violeta dark:text-hss-lavanda">
              Relatório
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Gere uma versão impressa
              com os dados atuais da
              simulação.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="mt-4 rounded-full bg-hss-roxo px-6 py-3 text-sm font-extrabold text-white shadow-neon transition hover:-translate-y-1 sm:mt-0"
          >
            Imprimir simulação
          </button>
        </div>
      </div>
    </section>
  );
}
/* === COMPONENTE PRINCIPAL DA CALCULADORA | fim === */

/* === FORMULARIO EMPRESA | inicio === */
function FormularioEmpresa({
  etapaAtual,
  dados,
  configuracoes,
  atualizar,
}: {
  etapaAtual: EtapaCalculadora;
  dados: DadosEmpresaRoi;
  configuracoes: ConfiguracaoCredenciamento[];
  atualizar: (
    campo: keyof DadosEmpresaRoi,
    valor: string | number,
  ) => void;
}): JSX.Element {
  const configuracaoAtual =
    buscarConfiguracaoCredenciamento(
      configuracoes,
      dados.tipoCredenciamentoId,
    );

  if (etapaAtual === 1) {
    return (
      <div className="grid gap-4">
        <TextoResultado
          texto={
            configuracaoAtual.premissaSite
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <CampoTexto
            label="Instituição"
            valor={
              dados.nomeInstituicao
            }
            aoMudar={(valor) =>
              atualizar(
                "nomeInstituicao",
                valor,
              )
            }
          />
          <CampoSelectTexto
            label="Porte"
            valor={
              dados.porteInstituicao
            }
            opcoes={[
              "Pequeno porte",
              "Médio porte",
              "Grande porte",
              "Rede hospitalar",
            ]}
            aoMudar={(valor) =>
              atualizar(
                "porteInstituicao",
                valor,
              )
            }
          />
          <CampoNumerico
            id="profissionaisSaude"
            label="Profissionais de saúde"
            valor={
              dados.profissionaisSaude
            }
            aoMudar={(valor) =>
              atualizar(
                "profissionaisSaude",
                valor,
              )
            }
          />
          <CampoNumerico
            id="medicosCredenciadosMes"
            label="Médicos credenciados por mês"
            valor={
              dados.medicosCredenciadosMes
            }
            aoMudar={(valor) =>
              atualizar(
                "medicosCredenciadosMes",
                valor,
              )
            }
          />
        </div>
      </div>
    );
  }

  if (etapaAtual === 2) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <CampoNumerico
          id="tempoCredenciamentoAtualDias"
          label="Tempo sem HSS"
          sufixo="dias"
          valor={
            dados.tempoCredenciamentoAtualDias
          }
          aoMudar={(valor) =>
            atualizar(
              "tempoCredenciamentoAtualDias",
              valor,
            )
          }
        />
        <CampoNumerico
          id="tempoCredenciamentoComHssDias"
          label="Tempo com HSS"
          sufixo="dias"
          valor={
            dados.tempoCredenciamentoComHssDias
          }
          aoMudar={(valor) =>
            atualizar(
              "tempoCredenciamentoComHssDias",
              valor,
            )
          }
        />
        <CampoNumerico
          id="horasAdministrativasPorCredenciamento"
          label="Horas administrativas por credenciamento"
          sufixo="h"
          valor={
            dados.horasAdministrativasPorCredenciamento ??
            0
          }
          aoMudar={(valor) =>
            atualizar(
              "horasAdministrativasPorCredenciamento",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoHoraAdministrativo"
          label="Custo hora administrativa"
          prefixo="R$"
          valor={
            dados.custoHoraAdministrativo
          }
          aoMudar={(valor) =>
            atualizar(
              "custoHoraAdministrativo",
              valor,
            )
          }
        />
        <InfoProcesso
          titulo="Tempo economizado por médico"
          valor={`${formatarNumero(Math.max(0, dados.tempoCredenciamentoAtualDias - dados.tempoCredenciamentoComHssDias))} dias`}
        />
        <InfoProcesso
          titulo="Cenário ADM aplicado"
          valor={
            dados.tipoCredenciamentoNome ??
            configuracaoAtual.nome
          }
        />
      </div>
    );
  }

  if (etapaAtual === 3) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <CampoNumerico
          id="valorMensalPorMedicoLiberado"
          label="Receita mensal por médico ativo"
          prefixo="R$"
          valor={
            dados.valorMensalPorMedicoLiberado
          }
          aoMudar={(valor) =>
            atualizar(
              "valorMensalPorMedicoLiberado",
              valor,
            )
          }
        />
        <CampoNumerico
          id="margemLiquidaPercentual"
          label="Margem líquida estimada"
          sufixo="%"
          max={100}
          valor={
            dados.margemLiquidaPercentual ??
            0
          }
          aoMudar={(valor) =>
            atualizar(
              "margemLiquidaPercentual",
              valor,
            )
          }
        />
        <CampoNumerico
          id="atendimentosMes"
          label="Atendimentos por mês"
          valor={dados.atendimentosMes}
          aoMudar={(valor) =>
            atualizar(
              "atendimentosMes",
              valor,
            )
          }
        />
        <CampoNumerico
          id="ticketMedioAtendimento"
          label="Ticket médio por atendimento"
          prefixo="R$"
          valor={
            dados.ticketMedioAtendimento
          }
          aoMudar={(valor) =>
            atualizar(
              "ticketMedioAtendimento",
              valor,
            )
          }
        />
        <CampoNumerico
          id="taxaNoShowAtual"
          label="No-show atual"
          sufixo="%"
          max={100}
          valor={dados.taxaNoShowAtual}
          aoMudar={(valor) =>
            atualizar(
              "taxaNoShowAtual",
              valor,
            )
          }
        />
        <CampoNumerico
          id="taxaNoShowComHss"
          label="No-show projetado com HSS"
          sufixo="%"
          max={100}
          valor={dados.taxaNoShowComHss}
          aoMudar={(valor) =>
            atualizar(
              "taxaNoShowComHss",
              valor,
            )
          }
        />
      </div>
    );
  }

  if (etapaAtual === 4) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <CampoNumerico
          id="custoMensalHss"
          label="Custo mensal HSS"
          prefixo="R$"
          valor={dados.custoMensalHss}
          aoMudar={(valor) =>
            atualizar(
              "custoMensalHss",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoImplantacaoHss"
          label="Implantação HSS"
          prefixo="R$"
          valor={
            dados.custoImplantacaoHss
          }
          aoMudar={(valor) =>
            atualizar(
              "custoImplantacaoHss",
              valor,
            )
          }
        />
        <CampoNumerico
          id="taxaRetrabalhoDocumental"
          label="Taxa de retrabalho documental"
          sufixo="%"
          max={100}
          valor={
            dados.taxaRetrabalhoDocumental ??
            0
          }
          aoMudar={(valor) =>
            atualizar(
              "taxaRetrabalhoDocumental",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoRetrabalhoPorMedico"
          label="Custo de retrabalho por médico"
          prefixo="R$"
          valor={
            dados.custoRetrabalhoPorMedico ??
            0
          }
          aoMudar={(valor) =>
            atualizar(
              "custoRetrabalhoPorMedico",
              valor,
            )
          }
        />
        <CampoNumerico
          id="taxaDocumentosVencidos"
          label="Taxa de documentos vencidos"
          sufixo="%"
          max={100}
          valor={
            dados.taxaDocumentosVencidos ??
            0
          }
          aoMudar={(valor) =>
            atualizar(
              "taxaDocumentosVencidos",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoDocumentoVencido"
          label="Custo por documento vencido"
          prefixo="R$"
          valor={
            dados.custoDocumentoVencido ??
            0
          }
          aoMudar={(valor) =>
            atualizar(
              "custoDocumentoVencido",
              valor,
            )
          }
        />
        <CampoNumerico
          id="reducaoAdministrativaPercentual"
          label="Redução administrativa"
          sufixo="%"
          max={100}
          valor={
            dados.reducaoAdministrativaPercentual
          }
          aoMudar={(valor) =>
            atualizar(
              "reducaoAdministrativaPercentual",
              valor,
            )
          }
        />
        <CampoNumerico
          id="reducaoGlosasPercentual"
          label="Redução de retrabalho/glosas"
          sufixo="%"
          max={100}
          valor={
            dados.reducaoGlosasPercentual
          }
          aoMudar={(valor) =>
            atualizar(
              "reducaoGlosasPercentual",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoGlosasMensal"
          label="Custo mensal com glosas/retrabalho"
          prefixo="R$"
          valor={
            dados.custoGlosasMensal
          }
          aoMudar={(valor) =>
            atualizar(
              "custoGlosasMensal",
              valor,
            )
          }
        />
        <CampoNumerico
          id="mesesAnaliseEmpresa"
          label="Meses de análise"
          valor={dados.mesesAnalise}
          aoMudar={(valor) =>
            atualizar(
              "mesesAnalise",
              valor,
            )
          }
        />
      </div>
    );
  }

  return (
    <TextoResultado texto="Resultado da empresa: a calculadora cruza tempo economizado, receita por médico ativo, redução de retrabalho, custos administrativos, no-show e custo da HSS para estimar ROI, payback e prejuízo evitado." />
  );
}
/* === FORMULARIO EMPRESA | fim === */

/* === FORMULARIO MEDICO | inicio === */
function FormularioMedico({
  etapaAtual,
  dados,
  configuracoes,
  atualizar,
}: {
  etapaAtual: EtapaCalculadora;
  dados: DadosMedicoRoi;
  configuracoes: ConfiguracaoCredenciamento[];
  atualizar: (
    campo: keyof DadosMedicoRoi,
    valor: string | number,
  ) => void;
}): JSX.Element {
  const configuracaoAtual =
    buscarConfiguracaoCredenciamento(
      configuracoes,
      dados.tipoCredenciamentoId,
    );

  if (etapaAtual === 1) {
    return (
      <div className="grid gap-4">
        <TextoResultado
          texto={
            configuracaoAtual.premissaSite
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <CampoTexto
            label="Nome do médico"
            valor={dados.nomeMedico}
            aoMudar={(valor) =>
              atualizar(
                "nomeMedico",
                valor,
              )
            }
          />
          <CampoTexto
            label="Especialidade"
            valor={dados.especialidade}
            aoMudar={(valor) =>
              atualizar(
                "especialidade",
                valor,
              )
            }
          />
          <CampoNumerico
            id="receitaMensalEsperadaHospital"
            label="Receita mensal bruta esperada"
            prefixo="R$"
            valor={
              dados.receitaMensalEsperadaHospital
            }
            aoMudar={(valor) =>
              atualizar(
                "receitaMensalEsperadaHospital",
                valor,
              )
            }
          />
          <CampoNumerico
            id="mesesAnaliseMedico"
            label="Meses de análise"
            valor={dados.mesesAnalise}
            aoMudar={(valor) =>
              atualizar(
                "mesesAnalise",
                valor,
              )
            }
          />
        </div>
      </div>
    );
  }

  if (etapaAtual === 2) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <CampoNumerico
          id="tempoCredenciamentoTradicionalDias"
          label="Tempo tradicional / sem HSS"
          sufixo="dias"
          valor={
            dados.tempoCredenciamentoTradicionalDias
          }
          aoMudar={(valor) =>
            atualizar(
              "tempoCredenciamentoTradicionalDias",
              valor,
            )
          }
        />
        <CampoNumerico
          id="tempoCredenciamentoDigitalDias"
          label="Tempo com HSS / fluxo digital"
          sufixo="dias"
          valor={
            dados.tempoCredenciamentoDigitalDias
          }
          aoMudar={(valor) =>
            atualizar(
              "tempoCredenciamentoDigitalDias",
              valor,
            )
          }
        />
        <CampoNumerico
          id="horasPerdidasProcesso"
          label="Horas perdidas no processo"
          sufixo="h"
          valor={
            dados.horasPerdidasProcesso
          }
          aoMudar={(valor) =>
            atualizar(
              "horasPerdidasProcesso",
              valor,
            )
          }
        />
        <CampoNumerico
          id="valorHoraMedica"
          label="Valor da hora médica"
          prefixo="R$"
          valor={dados.valorHoraMedica}
          aoMudar={(valor) =>
            atualizar(
              "valorHoraMedica",
              valor,
            )
          }
        />
        <InfoProcesso
          titulo="Dias antecipados"
          valor={`${formatarNumero(Math.max(0, dados.tempoCredenciamentoTradicionalDias - dados.tempoCredenciamentoDigitalDias))} dias`}
        />
        <InfoProcesso
          titulo="Cenário ADM aplicado"
          valor={
            dados.tipoCredenciamentoNome ??
            configuracaoAtual.nome
          }
        />
      </div>
    );
  }

  if (etapaAtual === 3) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <CampoNumerico
          id="percentualRepasseClinica"
          label="Repasse para clínica/hospital"
          sufixo="%"
          max={100}
          valor={
            dados.percentualRepasseClinica ??
            0
          }
          aoMudar={(valor) =>
            atualizar(
              "percentualRepasseClinica",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoOperacionalMensal"
          label="Custo operacional mensal"
          prefixo="R$"
          valor={
            dados.custoOperacionalMensal ??
            0
          }
          aoMudar={(valor) =>
            atualizar(
              "custoOperacionalMensal",
              valor,
            )
          }
        />
        <CampoNumerico
          id="investimentoInicial"
          label="Investimento inicial"
          prefixo="R$"
          valor={
            dados.investimentoInicial ??
            0
          }
          aoMudar={(valor) =>
            atualizar(
              "investimentoInicial",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoTaxasHospitalares"
          label="Taxas hospitalares/credenciamento"
          prefixo="R$"
          valor={
            dados.custoTaxasHospitalares
          }
          aoMudar={(valor) =>
            atualizar(
              "custoTaxasHospitalares",
              valor,
            )
          }
        />
      </div>
    );
  }

  if (etapaAtual === 4) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <CampoNumerico
          id="custoCrmAnual"
          label="CRM/anuidade"
          prefixo="R$"
          valor={dados.custoCrmAnual}
          aoMudar={(valor) =>
            atualizar(
              "custoCrmAnual",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoCursos"
          label="Cursos obrigatórios"
          prefixo="R$"
          ajuda="Ex.: BLS, ACLS, PALS, ATLS, reanimação neonatal."
          valor={dados.custoCursos}
          aoMudar={(valor) =>
            atualizar(
              "custoCursos",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoDocumentos"
          label="Documentos e cópias"
          prefixo="R$"
          valor={dados.custoDocumentos}
          aoMudar={(valor) =>
            atualizar(
              "custoDocumentos",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoCertificadoDigital"
          label="Certificado digital"
          prefixo="R$"
          valor={
            dados.custoCertificadoDigital
          }
          aoMudar={(valor) =>
            atualizar(
              "custoCertificadoDigital",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoVacinasExames"
          label="Vacinas, sorologias e ASO"
          prefixo="R$"
          valor={
            dados.custoVacinasExames
          }
          aoMudar={(valor) =>
            atualizar(
              "custoVacinasExames",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoSeguroAnual"
          label="Seguro de responsabilidade civil"
          prefixo="R$"
          valor={dados.custoSeguroAnual}
          aoMudar={(valor) =>
            atualizar(
              "custoSeguroAnual",
              valor,
            )
          }
        />
        <CampoNumerico
          id="custoPjPrimeiroAno"
          label="PJ/contador no primeiro ano"
          prefixo="R$"
          valor={
            dados.custoPjPrimeiroAno
          }
          aoMudar={(valor) =>
            atualizar(
              "custoPjPrimeiroAno",
              valor,
            )
          }
        />
      </div>
    );
  }

  return (
    <TextoResultado texto="Resultado do médico: a calculadora soma custos de entrada e custos do processo, calcula receita líquida mensal, receita antecipada pela redução de tempo e retorno projetado no período." />
  );
}
/* === FORMULARIO MEDICO | fim === */

/* === APLICACAO DAS CONFIGURACOES ADM | inicio === */
function aplicarConfiguracaoNaEmpresa(
  dados: DadosEmpresaRoi,
  configuracao: ConfiguracaoCredenciamento,
): DadosEmpresaRoi {
  return {
    ...dados,
    tipoCredenciamentoId:
      configuracao.id,
    tipoCredenciamentoNome:
      configuracao.nome,
    cenarioRoi: configuracao.cenarioRoi,
    valorMensalPorMedicoLiberado:
      configuracao.receitaMensalPorMedico,
    tempoCredenciamentoAtualDias:
      configuracao.tempoSemHssDias,
    tempoCredenciamentoComHssDias:
      configuracao.tempoComHssDias,
    horasAdministrativasPorCredenciamento:
      configuracao.horasAdministrativasPorCredenciamento,
    custoHoraAdministrativo:
      configuracao.custoHoraAdministrativa,
    reducaoAdministrativaPercentual:
      configuracao.reducaoAdministrativaPercentual,
    reducaoGlosasPercentual:
      configuracao.reducaoRetrabalhoPercentual,
    taxaNoShowAtual:
      configuracao.taxaNoShowAtual,
    taxaNoShowComHss:
      configuracao.taxaNoShowComHss,
    custoMensalHss:
      configuracao.custoMensalHss,
    custoImplantacaoHss:
      configuracao.custoImplantacaoHss,
    taxaRetrabalhoDocumental:
      configuracao.taxaRetrabalhoPercentual,
    custoRetrabalhoPorMedico:
      configuracao.custoRetrabalhoPorMedico,
    taxaDocumentosVencidos:
      configuracao.taxaDocumentosVencidosPercentual,
    custoDocumentoVencido:
      configuracao.custoDocumentoVencido,
    margemLiquidaPercentual:
      configuracao.margemLiquidaPercentual,
  };
}

function aplicarConfiguracaoNoMedico(
  dados: DadosMedicoRoi,
  configuracao: ConfiguracaoCredenciamento,
): DadosMedicoRoi {
  return {
    ...dados,
    tipoCredenciamentoId:
      configuracao.id,
    tipoCredenciamentoNome:
      configuracao.nome,
    cenarioRoi: configuracao.cenarioRoi,
    receitaMensalEsperadaHospital:
      configuracao.receitaMensalPorMedico,
    tempoCredenciamentoTradicionalDias:
      configuracao.tempoSemHssDias,
    tempoCredenciamentoDigitalDias:
      configuracao.tempoComHssDias,
    valorHoraMedica:
      configuracao.custoHoraAdministrativa,
    horasPerdidasProcesso:
      configuracao.horasAdministrativasPorCredenciamento,
    percentualRepasseClinica:
      configuracao.percentualRepasseClinica,
    custoOperacionalMensal:
      configuracao.custoOperacionalMensalMedico,
    investimentoInicial:
      configuracao.investimentoInicialMedico,
  };
}
/* === APLICACAO DAS CONFIGURACOES ADM | fim === */

/* === CAMPOS E CONTROLES | inicio === */
function NavegacaoEtapas({
  etapaAtual,
  aoMudar,
  dicasHoverAtivas,
}: {
  etapaAtual: EtapaCalculadora;
  aoMudar: (
    etapa: EtapaCalculadora,
  ) => void;
  dicasHoverAtivas: boolean;
}): JSX.Element {
  const listaRef =
    useRef<HTMLDivElement>(null);
  const [etapaExplicada, definirEtapaExplicada] =
    useState<(typeof etapas)[number] | null>(null);

  function rolar(direcao: -1 | 1): void {
    const largura = listaRef.current?.clientWidth ?? 180;

    listaRef.current?.scrollBy({
      left: direcao * largura,
      behavior: "smooth",
    });
  }

  return (
    <>
    <div className="mt-4 grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 md:grid-cols-1">
      <button
        type="button"
        onClick={() => rolar(-1)}
        aria-label="Ver etapas anteriores"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hss-violeta/20 bg-white text-lg font-black text-hss-roxo shadow-sm transition hover:-translate-y-0.5 hover:shadow-neon dark:border-white/10 dark:bg-white/10 dark:text-white md:hidden"
      >
        &lt;
      </button>

      <div
        ref={listaRef}
        className="scrollbar-hss flex snap-x snap-mandatory gap-2 overflow-x-auto py-1 lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible"
      >
        {etapas.map((etapa) => {
          const ativo =
            etapaAtual === etapa.numero;

          return (
            <div
              key={etapa.numero}
              className="group relative grid w-full shrink-0 snap-start grid-cols-[minmax(0,1fr)_2.5rem] gap-2 lg:block lg:min-w-0"
            >
              <button
                type="button"
                onClick={() =>
                  aoMudar(etapa.numero)
                }
                aria-describedby={`descricao-etapa-${etapa.numero}`}
                className={
                  ativo
                    ? "h-10 w-full rounded-full border-2 border-hss-violeta bg-hss-lavanda px-4 text-sm font-black text-hss-roxo shadow-[0_0_24px_rgba(141,123,255,0.5)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-hss-lavanda/40"
                    : "h-10 w-full rounded-full border border-hss-violeta/15 bg-white px-4 text-sm font-bold text-slate-600 transition hover:-translate-y-0.5 hover:border-hss-violeta/40 hover:bg-hss-violeta/10 hover:text-hss-roxo dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }
              >
                {etapa.nome.toUpperCase()}
              </button>

              <button
                type="button"
                onClick={() =>
                  definirEtapaExplicada(etapa)
                }
                aria-label={`Explicar etapa ${etapa.nome}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hss-violeta/20 bg-white text-sm font-black text-hss-roxo shadow-sm transition hover:-translate-y-0.5 hover:shadow-neon dark:border-white/10 dark:bg-white/10 dark:text-white lg:hidden"
              >
                <IconeInfo />
              </button>

              <div
                id={`descricao-etapa-${etapa.numero}`}
                className={
                  dicasHoverAtivas
                    ? "pointer-events-none absolute bottom-[calc(100%+0.65rem)] left-0 right-0 z-20 hidden rounded-2xl border border-hss-violeta/20 bg-white p-3 text-xs font-semibold leading-5 text-slate-700 opacity-0 shadow-neon transition group-hover:opacity-100 group-focus-within:opacity-100 dark:border-white/10 dark:bg-hss-tinta dark:text-slate-200 lg:block"
                    : "hidden"
                }
              >
                {descricoesEtapas[etapa.numero]}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => rolar(1)}
        aria-label="Ver próximas etapas"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hss-violeta/20 bg-white text-lg font-black text-hss-roxo shadow-sm transition hover:-translate-y-0.5 hover:shadow-neon dark:border-white/10 dark:bg-white/10 dark:text-white md:hidden"
      >
        &gt;
      </button>
    </div>

    {etapaExplicada ? (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-hss-tinta/70 px-4 backdrop-blur-sm lg:hidden">
        <div className="w-full max-w-sm rounded-[2rem] border border-hss-violeta/25 bg-white p-6 shadow-neon dark:border-white/10 dark:bg-hss-tinta">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-black text-hss-roxo dark:text-white">
              {etapaExplicada.nome.toUpperCase()}
            </h3>
            <button
              type="button"
              onClick={() =>
                definirEtapaExplicada(null)
              }
              aria-label="Fechar explicação"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hss-violeta/20 text-lg font-black text-hss-roxo dark:border-white/10 dark:text-white"
            >
              - 
            </button>
          </div>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-600 dark:text-slate-300">
            {descricoesEtapas[etapaExplicada.numero]}
          </p>
        </div>
      </div>
    ) : null}
    </>
  );
}

function IconeInfo(): JSX.Element {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function CampoTexto({
  label,
  valor,
  aoMudar,
}: {
  label: string;
  valor: string;
  aoMudar: (valor: string) => void;
}): JSX.Element {
  return (
    <label className="block rounded-3xl border border-hss-violeta/15 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
      <span className="text-sm font-extrabold text-slate-800 dark:text-white">
        {label}
      </span>
      <input
        value={valor}
        onChange={(evento) =>
          aoMudar(evento.target.value)
        }
        className="mt-3 w-full rounded-2xl border border-hss-violeta/20 bg-white px-3 py-3 font-bold outline-none dark:border-white/10 dark:bg-hss-tinta/70 dark:text-white"
      />
    </label>
  );
}

function CampoSelectTexto({
  label,
  valor,
  opcoes,
  aoMudar,
}: {
  label: string;
  valor: string;
  opcoes: string[];
  aoMudar: (valor: string) => void;
}): JSX.Element {
  return (
    <label className="block rounded-3xl border border-hss-violeta/15 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
      <span className="text-sm font-extrabold text-slate-800 dark:text-white">
        {label}
      </span>
      <select
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        className="mt-3 w-full rounded-2xl border border-hss-violeta/20 bg-white px-3 py-3 font-bold outline-none dark:border-white/10 dark:bg-hss-tinta/70 dark:text-white"
      >
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
    </label>
  );
}

function CampoSelectConfiguracao({
  configuracoes,
  valor,
  aoMudar,
}: {
  configuracoes: ConfiguracaoCredenciamento[];
  valor: string;
  aoMudar: (
    configuracao: ConfiguracaoCredenciamento,
  ) => void;
}): JSX.Element {
  return (
    <label className="flex flex-col gap-3 rounded-3xl border border-hss-violeta/15 bg-white/85 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.06)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <span className="shrink-0 text-sm font-extrabold text-slate-950 lg:w-[290px]">
        Tipo de cenário configurado no ADM
      </span>
      <select
        value={valor}
        onChange={(evento) =>
          aoMudar(
            buscarConfiguracaoCredenciamento(
              configuracoes,
              evento.target.value,
            ),
          )
        }
        className="w-full rounded-2xl border border-hss-violeta/20 bg-white px-4 py-3 font-bold text-slate-900 outline-none lg:flex-1"
      >
        {configuracoes.map(
          (configuracao) => (
            <option
              key={configuracao.id}
              value={configuracao.id}
            >
              {configuracao.nome} - {" "}
              {configuracao.categoria}
            </option>
          ),
        )}
      </select>
    </label>
  );
}

function InfoProcesso({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}): JSX.Element {
  return (
    <div className="rounded-2xl bg-white/80 p-3 shadow-sm dark:bg-white/10">
      <span className="block text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {titulo}
      </span>
      <strong className="mt-1 block text-lg text-hss-roxo dark:text-white">
        {valor}
      </strong>
    </div>
  );
}

function TextoResultado({
  texto,
}: {
  texto: string;
}): JSX.Element {
  return (
    <div className="rounded-[1.75rem] bg-hss-roxo/10 p-6 dark:bg-white/5">
      <h3 className="text-2xl font-black text-slate-950 dark:text-white">
        Leitura do cenário
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {texto}
      </p>
    </div>
  );
}

function BotaoVisao({
  ativo,
  titulo,
  subtitulo,
  aoClicar,
}: {
  ativo: boolean;
  titulo: string;
  subtitulo: string;
  aoClicar: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={aoClicar}
      className={
        ativo
          ? "rounded-[1.5rem] bg-hss-roxo p-5 text-left text-white shadow-neon transition hover:-translate-y-1"
          : "rounded-[1.5rem] border border-hss-violeta/15 bg-white/80 p-5 text-left text-slate-700 transition hover:-translate-y-1 hover:border-hss-violeta/40 hover:shadow-suave dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
      }
    >
      <strong className="block text-lg font-black">
        {titulo}
      </strong>
      <span
        className={
          ativo
            ? "mt-2 block text-sm leading-6 text-white/75"
            : "mt-2 block text-sm leading-6 text-slate-500 dark:text-slate-400"
        }
      >
        {subtitulo}
      </span>
    </button>
  );
}
/* === CAMPOS E CONTROLES | fim === */

/* === RESUMOS | inicio === */
function ResumoEmpresa({
  resultado,
}: {
  resultado: ResultadoEmpresaRoi;
}): JSX.Element {
  return (
    <div className="space-y-4">
      <CartaoResultado
        destaque
        titulo="ROI estimado"
        valor={`${formatarNumero(resultado.roiPercentual)}%`}
        detalhe="Retorno considerando benefícios menos custos da HSS."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <CartaoResultado
          titulo="Benefícios mensais"
          valor={formatarMoeda(
            resultado.beneficiosMensais,
          )}
          detalhe="Administração, no-show, retrabalho e receita antecipada."
        />
        <CartaoResultado
          titulo="Custo mensal equivalente"
          valor={formatarMoeda(
            resultado.custosMensaisEquivalentes,
          )}
          detalhe="Mensalidade HSS + implantação amortizada."
        />
        <CartaoResultado
          titulo="Prejuízo sem HSS"
          valor={formatarMoeda(
            resultado.prejuizoMensalSemHss,
          )}
          detalhe="Tempo atual sem médicos liberados."
        />
        <CartaoResultado
          titulo="Dias economizados"
          valor={`${formatarNumero(resultado.tempoEconomizadoTotalDias)} dias`}
          detalhe="Soma dos dias economizados no volume mensal."
        />
        <CartaoResultado
          titulo="Receita antecipada"
          valor={formatarMoeda(
            resultado.receitaAntecipadaMensal,
          )}
          detalhe="Impacto da entrada mais rápida do médico."
        />
        <CartaoResultado
          titulo="Payback"
          valor={
            resultado.paybackMeses ===
            null
              ? "Sem payback"
              : `${formatarNumero(resultado.paybackMeses)} meses`
          }
          detalhe="Tempo para recuperar a implantação."
        />
      </div>
    </div>
  );
}

function ResumoMedico({
  resultado,
}: {
  resultado: ResultadoMedicoRoi;
}): JSX.Element {
  return (
    <div className="space-y-4">
      <CartaoResultado
        destaque
        titulo="ROI do médico"
        valor={`${formatarNumero(resultado.roiPercentual)}%`}
        detalhe="Retorno considerando custos de entrada e receita líquida."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <CartaoResultado
          titulo="Custo inicial total"
          valor={formatarMoeda(
            resultado.custoInicialTotal,
          )}
          detalhe="CRM, cursos, documentos, seguro, PJ, investimento e tempo."
        />
        <CartaoResultado
          titulo="Receita líquida mensal"
          valor={formatarMoeda(
            resultado.receitaLiquidaMensal,
          )}
          detalhe="Receita bruta menos repasse e custo operacional."
        />
        <CartaoResultado
          titulo="Receita antecipada"
          valor={formatarMoeda(
            resultado.receitaAntecipada,
          )}
          detalhe="Valor antecipado pela redução do tempo de entrada."
        />
        <CartaoResultado
          titulo="Dias antecipados"
          valor={`${formatarNumero(resultado.economiaTempoCredenciamento)} dias`}
          detalhe="Diferença entre fluxo tradicional e fluxo com HSS."
        />
        <CartaoResultado
          titulo="Repasse mensal"
          valor={formatarMoeda(
            resultado.repasseMensal,
          )}
          detalhe="Valor repassado para clínica ou hospital."
        />
        <CartaoResultado
          titulo="Payback"
          valor={
            resultado.paybackMeses ===
            null
              ? "Sem payback"
              : `${formatarNumero(resultado.paybackMeses)} meses`
          }
          detalhe="Tempo para recuperar os custos iniciais."
        />
      </div>
    </div>
  );
}
/* === RESUMOS | fim === */

/* === MINI GRAFICO | inicio === */
function MiniGrafico({
  valores,
  rotulos,
  descricoes,
}: {
  valores: number[];
  rotulos: string[];
  descricoes: string[];
}): JSX.Element {
  const maior = Math.max(
    ...valores.map((valor) =>
      Math.abs(valor),
    ),
    1,
  );

  return (
    <div className="rounded-[1.75rem] border border-hss-violeta/15 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-hss-violeta dark:text-hss-lavanda">
        Composição visual
      </p>
      <div
        className="mt-3 grid w-full gap-3"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(14rem, 100%), 1fr))",
        }}
      >
        {valores.map(
          (valor, indice) => {
            const largura = Math.max(
              8,
              (Math.abs(valor) /
                maior) *
                100,
            );
            return (
              <div
                key={rotulos[indice]}
                className="group relative flex min-h-20 w-full flex-col justify-end rounded-2xl bg-hss-violeta/10 p-3 dark:bg-white/5"
                tabIndex={0}
                aria-label={`${rotulos[indice]}: ${descricoes[indice]}`}
              >
                <div className="pointer-events-none absolute bottom-[calc(100%+0.65rem)] left-3 right-3 z-20 rounded-2xl border border-hss-violeta/20 bg-white p-3 text-xs font-semibold leading-5 text-slate-700 opacity-0 shadow-neon transition group-hover:opacity-100 group-focus:opacity-100 dark:border-white/10 dark:bg-hss-tinta dark:text-slate-200">
                  {descricoes[indice]}
                </div>
                <div className="h-5 w-full overflow-hidden rounded-full bg-white/75 dark:bg-hss-tinta/70">
                  <div
                    className="h-full rounded-l-full bg-hss-roxo shadow-neon transition-all"
                    style={{
                      width: `${largura}%`,
                    }}
                  />
                </div>
                <strong className="mt-2 block text-sm text-slate-900 dark:text-white">
                  {rotulos[indice]}
                </strong>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {formatarMoeda(valor)}
                </span>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
/* === MINI GRAFICO | fim === */



