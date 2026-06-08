import { useMemo, useState } from 'react';
import { PainelAdmContatos } from '@/components/admin/painel-adm-contatos';
import { CampoNumerico } from '@/components/calculadora/campo-numerico';
import {
  CONFIGURACOES_CREDENCIAMENTO_PADRAO,
  buscarConfiguracaoCredenciamento,
  normalizarConfiguracoesCredenciamento,
} from '@/data/configuracoesCredenciamento';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { calcularRoiEmpresa, formatarMoeda, formatarNumero } from '@/services/calculosRoi';
import type { CenarioRoi, ConfiguracaoCredenciamento, PublicoAlvoConfiguracao } from '@/types/calculadora';

/* === CONSTANTES ADM | inicio === */
const USUARIO_DEMO = 'hssadmin';
const SENHA_DEMO = 'hss2026';
const abasAdm = [
  { id: 'contatos', label: 'Contatos' },
  { id: 'calculadora', label: 'Calculadora' },
] as const;
const opcoesPublico: { valor: PublicoAlvoConfiguracao; label: string }[] = [
  { valor: 'empresa', label: 'Empresa / Hospital / Clínica' },
  { valor: 'medico', label: 'Médico' },
  { valor: 'ambos', label: 'Ambos' },
];
const opcoesCenario: { valor: CenarioRoi; label: string }[] = [
  { valor: 'hospital_contratando_hss', label: 'Hospital contratando HSS' },
  { valor: 'clinica_contratando_hss', label: 'Clínica contratando HSS' },
  { valor: 'hospital_credenciando_medico', label: 'Hospital x Médico' },
  { valor: 'clinica_credenciando_medico', label: 'Clínica x Médico' },
  { valor: 'medico_hospital', label: 'Médico x Hospital' },
  { valor: 'medico_clinica', label: 'Médico x Clínica' },
  { valor: 'medico_consultorio', label: 'Médico x Consultório próprio' },
  { valor: 'recredenciamento', label: 'Recredenciamento anual' },
  { valor: 'alta_complexidade', label: 'Alta complexidade' },
];
type AbaAdm = (typeof abasAdm)[number]['id'];
/* === CONSTANTES ADM | fim === */

/* === COMPONENTE PAINEL ADM | inicio === */
export function PainelAdmCredenciamento(): JSX.Element {
  const [autenticado, definirAutenticado] = useLocalStorage<boolean>('hss_adm_autenticado', false);
  const [usuario, definirUsuario] = useState('');
  const [senha, definirSenha] = useState('');
  const [erroLogin, definirErroLogin] = useState('');
  const [abaAtual, definirAbaAtual] = useState<AbaAdm>('contatos');
  const [configuracoesSalvas, definirConfiguracoes] = useLocalStorage<ConfiguracaoCredenciamento[]>(
    'hss_adm_configuracoes_credenciamento',
    CONFIGURACOES_CREDENCIAMENTO_PADRAO,
  );
  const configuracoes = useMemo(() => normalizarConfiguracoesCredenciamento(configuracoesSalvas), [configuracoesSalvas]);
  const [idSelecionado, definirIdSelecionado] = useState(configuracoes[0]?.id ?? CONFIGURACOES_CREDENCIAMENTO_PADRAO[0].id);
  const configuracaoAtual = buscarConfiguracaoCredenciamento(configuracoes, idSelecionado);
  const simulacao = useMemo(() => calcularRoiEmpresa(criarDadosSimulacao(configuracaoAtual)), [configuracaoAtual]);
  const totalAtivos = configuracoes.filter((configuracao) => configuracao.ativo).length;

  function entrar(): void {
    if (usuario.trim() === USUARIO_DEMO && senha.trim() === SENHA_DEMO) {
      definirAutenticado(true);
      definirErroLogin('');
      return;
    }

    definirErroLogin('Usuário ou senha inválidos para o ambiente demo.');
  }

  function sair(): void {
    definirAutenticado(false);
    definirSenha('');
  }

  function atualizarConfiguracao<K extends keyof ConfiguracaoCredenciamento>(campo: K, valor: ConfiguracaoCredenciamento[K]): void {
    definirConfiguracoes(
      configuracoes.map((configuracao) =>
        configuracao.id === configuracaoAtual.id
          ? {
              ...configuracao,
              [campo]: valor,
            }
          : configuracao,
      ),
    );
  }

  function adicionarConfiguracao(): void {
    const novoId = `cenario-personalizado-${Date.now()}`;
    const novaConfiguracao: ConfiguracaoCredenciamento = {
      ...configuracaoAtual,
      id: novoId,
      ativo: false,
      nome: 'Novo cenário personalizado',
      categoria: 'Personalizado',
      descricao: 'Cenário criado no painel administrativo.',
      premissaSite: 'Edite esta premissa para explicar como o cálculo deve aparecer no site.',
    };

    definirConfiguracoes([...configuracoes, novaConfiguracao]);
    definirIdSelecionado(novoId);
  }

  function removerConfiguracao(): void {
    if (configuracoes.length <= 1) return;
    const atualizadas = configuracoes.filter((configuracao) => configuracao.id !== configuracaoAtual.id);
    definirConfiguracoes(atualizadas);
    definirIdSelecionado(atualizadas[0]?.id ?? '');
  }

  function restaurarPadrao(): void {
    definirConfiguracoes(CONFIGURACOES_CREDENCIAMENTO_PADRAO);
    definirIdSelecionado(CONFIGURACOES_CREDENCIAMENTO_PADRAO[0].id);
  }

  if (!autenticado) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PortalLoginAdm
            usuario={usuario}
            senha={senha}
            erroLogin={erroLogin}
            aoMudarUsuario={definirUsuario}
            aoMudarSenha={definirSenha}
            aoEntrar={entrar}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-hss-violeta/15 bg-white/90 p-5 shadow-suave backdrop-blur dark:border-white/10 dark:bg-white/10 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-sm font-black uppercase tracking-[0.26em] text-hss-violeta dark:text-hss-lavanda">Painel ADM</span>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Gestão de contatos e calculadora ROI.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Consulte as pessoas que solicitaram contato e ajuste os cenários, tempos, custos e percentuais usados na calculadora pública.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={sair} className="rounded-full border border-red-300/40 px-5 py-3 text-sm font-black text-red-600 transition hover:-translate-y-1 dark:text-red-300">
                Sair
              </button>
            </div>
          </div>

          <nav className="mt-7 flex flex-wrap gap-2 rounded-[1.25rem] bg-hss-violeta/10 p-2 dark:bg-white/5" aria-label="Abas do painel administrativo">
            {abasAdm.map((aba) => (
              <button
                key={aba.id}
                type="button"
                onClick={() => definirAbaAtual(aba.id)}
                className={
                  abaAtual === aba.id
                    ? 'rounded-full bg-hss-roxo px-5 py-3 text-sm font-black text-white shadow-neon'
                    : 'rounded-full px-5 py-3 text-sm font-black text-hss-roxo transition hover:bg-white/80 dark:text-white dark:hover:bg-white/10'
                }
              >
                {aba.label}
              </button>
            ))}
          </nav>

          {abaAtual === 'contatos' ? (
            <div className="mt-8">
              <PainelAdmContatos />
            </div>
          ) : null}

          {abaAtual === 'calculadora' ? (
            <>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={adicionarConfiguracao} className="rounded-full bg-hss-roxo px-5 py-3 text-sm font-black text-white shadow-neon transition hover:-translate-y-1">
                  Adicionar cenário
                </button>
                <button type="button" onClick={restaurarPadrao} className="rounded-full border border-hss-violeta/20 px-5 py-3 text-sm font-black text-hss-roxo transition hover:-translate-y-1 dark:text-white">
                  Restaurar padrões
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <ResumoAdm titulo="Cenários totais" valor={String(configuracoes.length)} detalhe="Inclui ativos e inativos." />
                <ResumoAdm titulo="Ativos no site" valor={String(totalAtivos)} detalhe="Aparecem na calculadora pública." />
                <ResumoAdm titulo="Tempo economizado" valor={`${formatarNumero(simulacao.tempoEconomizadoPorMedicoDias)} dias`} detalhe="No cenário selecionado." />
                <ResumoAdm titulo="ROI simulado" valor={`${formatarNumero(simulacao.roiPercentual)}%`} detalhe="Com parâmetros atuais." />
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <aside className="space-y-4">
              <div className="rounded-[1.75rem] border border-hss-violeta/15 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Tipos cadastrados</p>
                <div className="mt-4 space-y-2">
                  {configuracoes.map((configuracao) => (
                    <button
                      type="button"
                      key={configuracao.id}
                      onClick={() => definirIdSelecionado(configuracao.id)}
                      className={
                        configuracao.id === configuracaoAtual.id
                          ? 'w-full rounded-2xl bg-hss-roxo px-4 py-3 text-left text-sm font-black text-white shadow-neon'
                          : 'w-full rounded-2xl border border-hss-violeta/15 bg-white px-4 py-3 text-left text-sm font-bold text-slate-600 hover:border-hss-violeta/40 hover:bg-hss-violeta/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                      }
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span>{configuracao.nome}</span>
                        <span className={configuracao.ativo ? 'rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] text-emerald-200' : 'rounded-full bg-slate-500/20 px-2 py-1 text-[10px] text-slate-300'}>
                          {configuracao.ativo ? 'ativo' : 'inativo'}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs opacity-70">
                        {configuracao.tempoSemHssDias} dias para {configuracao.tempoComHssDias} dias - {configuracao.categoria}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={removerConfiguracao}
                  disabled={configuracoes.length <= 1}
                  className="mt-4 w-full rounded-full border border-hss-violeta/20 px-4 py-3 text-xs font-extrabold text-slate-700 hover:-translate-y-1 disabled:opacity-40 dark:text-slate-200"
                >
                  Remover cenário selecionado
                </button>
              </div>

              <div className="rounded-[1.75rem] bg-hss-roxo p-5 text-white shadow-neon">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Impacto padrão</p>
                <p className="mt-3 text-3xl font-black">{formatarNumero(simulacao.tempoEconomizadoPorMedicoDias)} dias</p>
                <p className="mt-2 text-sm leading-6 text-white/75">economizados por médico neste tipo de credenciamento.</p>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <strong className="block">Receita antecipada</strong>
                    <span>{formatarMoeda(simulacao.receitaAntecipadaMensal)}</span>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <strong className="block">Benefício mensal</strong>
                    <span>{formatarMoeda(simulacao.beneficiosMensais)}</span>
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-hss-violeta/15 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-hss-violeta/10 p-4 dark:bg-white/5">
                  <span>
                    <strong className="block text-base text-slate-950 dark:text-white">Mostrar este cenário no site</strong>
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">Quando desativado, não aparece na calculadora pública.</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={configuracaoAtual.ativo}
                    onChange={(evento) => atualizarConfiguracao('ativo', evento.target.checked)}
                    className="h-6 w-6 accent-hss-roxo"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <CampoTextoAdm label="Nome do tipo" valor={configuracaoAtual.nome} aoMudar={(valor) => atualizarConfiguracao('nome', valor)} />
                <CampoTextoAdm label="Categoria" valor={configuracaoAtual.categoria} aoMudar={(valor) => atualizarConfiguracao('categoria', valor)} />
                <CampoSelectAdm
                  label="Público que verá no site"
                  valor={configuracaoAtual.publicoAlvo}
                  opcoes={opcoesPublico}
                  aoMudar={(valor) => atualizarConfiguracao('publicoAlvo', valor as PublicoAlvoConfiguracao)}
                />
                <CampoSelectAdm
                  label="Tipo de cálculo"
                  valor={configuracaoAtual.cenarioRoi}
                  opcoes={opcoesCenario}
                  aoMudar={(valor) => atualizarConfiguracao('cenarioRoi', valor as CenarioRoi)}
                />
                <CampoTextoAdm label="Descrição interna" valor={configuracaoAtual.descricao} grande aoMudar={(valor) => atualizarConfiguracao('descricao', valor)} />
                <CampoTextoAdm label="Texto/premissa que aparece no site" valor={configuracaoAtual.premissaSite} grande aoMudar={(valor) => atualizarConfiguracao('premissaSite', valor)} />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <CampoNumerico id="admTempoSemHss" label="Tempo sem HSS" sufixo="dias" valor={configuracaoAtual.tempoSemHssDias} aoMudar={(valor) => atualizarConfiguracao('tempoSemHssDias', valor)} />
                <CampoNumerico id="admTempoComHss" label="Tempo com HSS" sufixo="dias" valor={configuracaoAtual.tempoComHssDias} aoMudar={(valor) => atualizarConfiguracao('tempoComHssDias', valor)} />
                <CampoNumerico id="admReceitaMensal" label="Receita mensal por médico ativo" prefixo="R$" valor={configuracaoAtual.receitaMensalPorMedico} aoMudar={(valor) => atualizarConfiguracao('receitaMensalPorMedico', valor)} />
                <CampoNumerico id="admMargem" label="Margem líquida estimada" sufixo="%" max={100} valor={configuracaoAtual.margemLiquidaPercentual} aoMudar={(valor) => atualizarConfiguracao('margemLiquidaPercentual', valor)} />
                <CampoNumerico id="admHoras" label="Horas administrativas por credenciamento" sufixo="h" valor={configuracaoAtual.horasAdministrativasPorCredenciamento} aoMudar={(valor) => atualizarConfiguracao('horasAdministrativasPorCredenciamento', valor)} />
                <CampoNumerico id="admCustoHora" label="Custo hora administrativa / médica" prefixo="R$" valor={configuracaoAtual.custoHoraAdministrativa} aoMudar={(valor) => atualizarConfiguracao('custoHoraAdministrativa', valor)} />
                <CampoNumerico id="admRetrabalho" label="Taxa de retrabalho documental" sufixo="%" max={100} valor={configuracaoAtual.taxaRetrabalhoPercentual} aoMudar={(valor) => atualizarConfiguracao('taxaRetrabalhoPercentual', valor)} />
                <CampoNumerico id="admCustoRetrabalho" label="Custo retrabalho por médico" prefixo="R$" valor={configuracaoAtual.custoRetrabalhoPorMedico} aoMudar={(valor) => atualizarConfiguracao('custoRetrabalhoPorMedico', valor)} />
                <CampoNumerico id="admVencidos" label="Taxa documentos vencidos" sufixo="%" max={100} valor={configuracaoAtual.taxaDocumentosVencidosPercentual} aoMudar={(valor) => atualizarConfiguracao('taxaDocumentosVencidosPercentual', valor)} />
                <CampoNumerico id="admCustoVencido" label="Custo por documento vencido" prefixo="R$" valor={configuracaoAtual.custoDocumentoVencido} aoMudar={(valor) => atualizarConfiguracao('custoDocumentoVencido', valor)} />
                <CampoNumerico id="admReducaoAdm" label="Redução administrativa com HSS" sufixo="%" max={100} valor={configuracaoAtual.reducaoAdministrativaPercentual} aoMudar={(valor) => atualizarConfiguracao('reducaoAdministrativaPercentual', valor)} />
                <CampoNumerico id="admReducaoRetrabalho" label="Redução retrabalho com HSS" sufixo="%" max={100} valor={configuracaoAtual.reducaoRetrabalhoPercentual} aoMudar={(valor) => atualizarConfiguracao('reducaoRetrabalhoPercentual', valor)} />
                <CampoNumerico id="admNoShowAtual" label="No-show atual padrão" sufixo="%" max={100} valor={configuracaoAtual.taxaNoShowAtual} aoMudar={(valor) => atualizarConfiguracao('taxaNoShowAtual', valor)} />
                <CampoNumerico id="admNoShowHss" label="No-show com HSS padrão" sufixo="%" max={100} valor={configuracaoAtual.taxaNoShowComHss} aoMudar={(valor) => atualizarConfiguracao('taxaNoShowComHss', valor)} />
                <CampoNumerico id="admMensalidade" label="Mensalidade HSS padrão" prefixo="R$" valor={configuracaoAtual.custoMensalHss} aoMudar={(valor) => atualizarConfiguracao('custoMensalHss', valor)} />
                <CampoNumerico id="admImplantacao" label="Implantação HSS padrão" prefixo="R$" valor={configuracaoAtual.custoImplantacaoHss} aoMudar={(valor) => atualizarConfiguracao('custoImplantacaoHss', valor)} />
                <CampoNumerico id="admRepasse" label="Repasse clínica/hospital" sufixo="%" max={100} valor={configuracaoAtual.percentualRepasseClinica} aoMudar={(valor) => atualizarConfiguracao('percentualRepasseClinica', valor)} />
                <CampoNumerico id="admCustoMedico" label="Custo operacional mensal médico" prefixo="R$" valor={configuracaoAtual.custoOperacionalMensalMedico} aoMudar={(valor) => atualizarConfiguracao('custoOperacionalMensalMedico', valor)} />
                <CampoNumerico id="admInvestimentoMedico" label="Investimento inicial médico" prefixo="R$" valor={configuracaoAtual.investimentoInicialMedico} aoMudar={(valor) => atualizarConfiguracao('investimentoInicialMedico', valor)} />
              </div>
            </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
/* === COMPONENTE PAINEL ADM | fim === */

/* === APOIO ADM | inicio === */
function criarDadosSimulacao(configuracao: ConfiguracaoCredenciamento) {
  return {
    nomeInstituicao: 'Simulação ADM',
    porteInstituicao: 'Padrão',
    profissionaisSaude: 100,
    atendimentosMes: 8000,
    ticketMedioAtendimento: 280,
    margemMediaAtendimento: 95,
    medicosCredenciadosMes: 10,
    valorMensalPorMedicoLiberado: configuracao.receitaMensalPorMedico,
    tempoCredenciamentoAtualDias: configuracao.tempoSemHssDias,
    tempoCredenciamentoComHssDias: configuracao.tempoComHssDias,
    horasAdministrativasSemana: 100,
    custoHoraAdministrativo: configuracao.custoHoraAdministrativa,
    reducaoAdministrativaPercentual: configuracao.reducaoAdministrativaPercentual,
    taxaNoShowAtual: configuracao.taxaNoShowAtual,
    taxaNoShowComHss: configuracao.taxaNoShowComHss,
    reducaoGlosasPercentual: configuracao.reducaoRetrabalhoPercentual,
    custoGlosasMensal: 24000,
    custoMensalHss: configuracao.custoMensalHss,
    custoImplantacaoHss: configuracao.custoImplantacaoHss,
    mesesAnalise: 12,
    tipoCredenciamentoId: configuracao.id,
    tipoCredenciamentoNome: configuracao.nome,
    cenarioRoi: configuracao.cenarioRoi,
    horasAdministrativasPorCredenciamento: configuracao.horasAdministrativasPorCredenciamento,
    taxaRetrabalhoDocumental: configuracao.taxaRetrabalhoPercentual,
    custoRetrabalhoPorMedico: configuracao.custoRetrabalhoPorMedico,
    taxaDocumentosVencidos: configuracao.taxaDocumentosVencidosPercentual,
    custoDocumentoVencido: configuracao.custoDocumentoVencido,
    margemLiquidaPercentual: configuracao.margemLiquidaPercentual,
  };
}

function ResumoAdm({ titulo, valor, detalhe }: { titulo: string; valor: string; detalhe: string }): JSX.Element {
  return (
    <article className="rounded-[1.5rem] border border-hss-violeta/15 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{titulo}</p>
      <strong className="mt-2 block text-2xl font-black text-hss-roxo dark:text-white">{valor}</strong>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{detalhe}</p>
    </article>
  );
}

function CampoTextoAdm({
  label,
  valor,
  aoMudar,
  grande = false,
}: {
  label: string;
  valor: string;
  aoMudar: (valor: string) => void;
  grande?: boolean;
}): JSX.Element {
  return (
    <label className={grande ? 'block md:col-span-2' : 'block'}>
      <span className="text-sm font-extrabold text-slate-800 dark:text-white">{label}</span>
      {grande ? (
        <textarea
          value={valor}
          onChange={(evento) => aoMudar(evento.target.value)}
          rows={4}
          className="mt-3 w-full rounded-2xl border border-hss-violeta/20 bg-white px-4 py-3 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-hss-lavanda/30 dark:border-white/10 dark:bg-hss-tinta/70 dark:text-white"
        />
      ) : (
        <input
          value={valor}
          onChange={(evento) => aoMudar(evento.target.value)}
          className="mt-3 w-full rounded-2xl border border-hss-violeta/20 bg-white px-4 py-3 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-hss-lavanda/30 dark:border-white/10 dark:bg-hss-tinta/70 dark:text-white"
        />
      )}
    </label>
  );
}

function CampoSelectAdm({
  label,
  valor,
  opcoes,
  aoMudar,
}: {
  label: string;
  valor: string;
  opcoes: { valor: string; label: string }[];
  aoMudar: (valor: string) => void;
}): JSX.Element {
  return (
    <label className="block">
      <span className="text-sm font-extrabold text-slate-800 dark:text-white">{label}</span>
      <select
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        className="mt-3 w-full rounded-2xl border border-hss-violeta/20 bg-white px-4 py-3 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-hss-lavanda/30 dark:border-white/10 dark:bg-hss-tinta/70 dark:text-white"
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.label}
          </option>
        ))}
      </select>
    </label>
  );
}
/* === APOIO ADM | fim === */

/* === PORTAL LOGIN ADM | inicio === */
function PortalLoginAdm({
  usuario,
  senha,
  erroLogin,
  aoMudarUsuario,
  aoMudarSenha,
  aoEntrar,
}: {
  usuario: string;
  senha: string;
  erroLogin: string;
  aoMudarUsuario: (valor: string) => void;
  aoMudarSenha: (valor: string) => void;
  aoEntrar: () => void;
}): JSX.Element {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-[1.75rem] border border-hss-violeta/15 bg-white/80 p-6 shadow-suave dark:border-white/10 dark:bg-white/5 sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-hss-violeta dark:text-hss-lavanda">Portal ADM</p>
        <h3 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">Login administrativo</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Ambiente demo: usuário hssadmin e senha hss2026.</p>
      </div>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-extrabold text-slate-800 dark:text-white">Usuário</span>
          <input
            type="text"
            value={usuario}
            autoComplete="username"
            onChange={(evento) => aoMudarUsuario(evento.target.value)}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter') aoEntrar();
            }}
            className="mt-3 w-full rounded-2xl border border-hss-violeta/20 bg-white px-4 py-3 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-hss-lavanda/30 dark:border-white/10 dark:bg-hss-tinta/70 dark:text-white"
            placeholder="hssadmin"
          />
        </label>
        <label className="block">
          <span className="text-sm font-extrabold text-slate-800 dark:text-white">Senha</span>
          <input
            type="password"
            value={senha}
            autoComplete="current-password"
            onChange={(evento) => aoMudarSenha(evento.target.value)}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter') aoEntrar();
            }}
            className="mt-3 w-full rounded-2xl border border-hss-violeta/20 bg-white px-4 py-3 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-hss-lavanda/30 dark:border-white/10 dark:bg-hss-tinta/70 dark:text-white"
            placeholder="hss2026"
          />
        </label>
        {erroLogin ? <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-300">{erroLogin}</p> : null}
        <button type="button" onClick={aoEntrar} className="rounded-full bg-hss-roxo px-5 py-3 text-sm font-black text-white shadow-neon transition hover:-translate-y-1">
          Entrar no ADM
        </button>
      </div>
    </div>
  );
}
/* === PORTAL LOGIN ADM | fim === */
