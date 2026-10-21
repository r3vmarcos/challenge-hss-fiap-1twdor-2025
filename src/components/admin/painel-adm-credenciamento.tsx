import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { PainelAdmContatos } from '@/components/admin/painel-adm-contatos';
import { CampoDaPremissa } from '@/components/calculadora/campo-premissa';
import { ChatIaCenario } from '@/components/calculadora/chat-ia-cenario';
import { ReguaPrazos } from '@/components/calculadora/regua-prazos';
import { TabelaMemoria } from '@/components/calculadora/tabela-memoria';
import { Interruptor } from '@/components/ui/interruptor';
import { GRUPOS_PREMISSAS, listarCamposDoGrupo } from '@/data/camposPremissas';
import {
  CENARIOS_PADRAO,
  PREMISSAS_PADRAO,
  ROTULOS_ORIGEM,
  ROTULOS_PERSPECTIVA,
  clonarCenarios,
  montarCamposVisitantePadrao,
} from '@/data/configuracoesCredenciamento';
import {
  buscarCenariosPublicados,
  descartarRascunhoCenarios,
  lerRascunhoCenarios,
  publicarCenarios,
  salvarRascunhoCenarios,
  salvarTokenAdm,
} from '@/hooks/useCenariosCredenciamento';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  calcularRoiInstituicao,
  calcularRoiMedico,
  calcularTimeline,
  formatarMeses,
  formatarMoeda,
  formatarPercentual,
  obterDiasComHssEtapa,
} from '@/services/calculosRoi';
import { montarMemoriaInstituicao, montarMemoriaMedico } from '@/services/memoriaCalculo';
import type { CampoPremissa, CenarioCredenciamento, EtapaCenario, OrigemDado, PerspectivaRoi } from '@/types/calculadora';

/* === CONSTANTES ADM | inicio === */
const USUARIO_DEMO = 'hssadmin';
const SENHA_DEMO = 'hss2026';
const abasAdm = [
  { id: 'cenarios', label: 'Cenários da calculadora' },
  { id: 'contatos', label: 'Contatos' },
] as const;
type AbaAdm = (typeof abasAdm)[number]['id'];
type FonteCenarios = 'rascunho' | 'publicado' | 'padrao';

/* === CONSTANTES ADM | fim === */

/* === COMPONENTE PAINEL ADM | inicio === */
export function PainelAdmCredenciamento(): JSX.Element {
  const [autenticado, definirAutenticado] = useLocalStorage<boolean>('hss_adm_autenticado', false);
  const [usuario, definirUsuario] = useState('');
  const [senha, definirSenha] = useState('');
  const [erroLogin, definirErroLogin] = useState('');
  const [abaAtual, definirAbaAtual] = useState<AbaAdm>('cenarios');

  function entrar(): void {
    if (usuario.trim() === USUARIO_DEMO && senha.trim() === SENHA_DEMO) {
      salvarTokenAdm(senha.trim());
      definirAutenticado(true);
      definirErroLogin('');
      return;
    }

    definirErroLogin('Usuário ou senha inválidos para o ambiente demo.');
  }

  if (!autenticado) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <PortalLoginAdm
          usuario={usuario}
          senha={senha}
          erroLogin={erroLogin}
          aoMudarUsuario={definirUsuario}
          aoMudarSenha={definirSenha}
          aoEntrar={entrar}
        />
      </section>
    );
  }

  return (
    <section className="px-0 py-6 sm:py-8">
      <div className="mx-auto max-w-[1240px]">
        <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.025em] text-slate-950 sm:text-[2.5rem]">Portal ADM</h1>
        <p className="mt-2 max-w-[62ch] text-base leading-7 text-slate-700">
          Configure os cenários que aparecem na calculadora do site e acompanhe quem pediu contato.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2 border-b border-hss-violeta/15" aria-label="Seções do Portal ADM">
          {abasAdm.map((aba) => (
            <button
              key={aba.id}
              type="button"
              aria-current={abaAtual === aba.id ? 'page' : undefined}
              onClick={() => definirAbaAtual(aba.id)}
              className={
                abaAtual === aba.id
                  ? '-mb-px border-b-2 border-hss-roxo px-4 py-3 text-sm font-semibold text-hss-roxo'
                  : '-mb-px border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:text-hss-roxo'
              }
            >
              {aba.label}
            </button>
          ))}
        </nav>

        <div className="mt-8">{abaAtual === 'cenarios' ? <EditorCenarios /> : <PainelAdmContatos />}</div>
      </div>
    </section>
  );
}
/* === COMPONENTE PAINEL ADM | fim === */

/* === EDITOR DE CENARIOS | inicio === */
function EditorCenarios(): JSX.Element {
  const [rascunhoInicial] = useState(() => lerRascunhoCenarios());
  const [cenarios, definirCenariosEstado] = useState<CenarioCredenciamento[]>(() => rascunhoInicial ?? clonarCenarios(CENARIOS_PADRAO));
  const [fonte, definirFonte] = useState<FonteCenarios>(rascunhoInicial ? 'rascunho' : 'padrao');
  const [idSelecionado, definirIdSelecionado] = useState(() => (rascunhoInicial ?? CENARIOS_PADRAO)[0]?.id ?? '');
  const [publicando, definirPublicando] = useState(false);
  const [aviso, definirAviso] = useState<{ tipo: 'sucesso' | 'erro'; mensagem: string } | null>(null);
  const [chatAberto, definirChatAberto] = useState(false);

  // Sem rascunho local, o ADM abre a versao publicada no D1 (quando a API estiver disponivel).
  useEffect(() => {
    if (rascunhoInicial) return;
    let ativo = true;

    buscarCenariosPublicados(true).then((publicados) => {
      if (!ativo || !publicados) return;
      definirCenariosEstado(publicados);
      definirIdSelecionado(publicados[0]?.id ?? '');
      definirFonte('publicado');
    });

    return () => {
      ativo = false;
    };
  }, [rascunhoInicial]);

  const cenarioAtual = cenarios.find((cenario) => cenario.id === idSelecionado) ?? cenarios[0];

  function definirCenarios(novos: CenarioCredenciamento[]): void {
    definirCenariosEstado(novos);
    salvarRascunhoCenarios(novos);
    definirFonte('rascunho');
    definirAviso(null);
  }

  function atualizarCenario(id: string, parcial: Partial<CenarioCredenciamento>): void {
    definirCenarios(cenarios.map((cenario) => (cenario.id === id ? { ...cenario, ...parcial } : cenario)));
  }

  function criarCenario(base?: CenarioCredenciamento): void {
    const id = `cenario-${Date.now()}`;
    const novo: CenarioCredenciamento = base
      ? { ...clonarCenarios([base])[0], id, ativo: false, nome: `${base.nome} (cópia)` }
      : {
          id,
          ativo: false,
          nome: 'Novo cenário',
          resumoSite: '',
          limite: '',
          perspectivas: ['medico'],
          origemPrazos: 'hipotese',
          origemCriacao: 'adm',
          etapas: [{ id: `etapa-${Date.now()}`, nome: 'Nova etapa', diasSemHss: 10, diasComHss: 5, hssAtua: true, nota: '' }],
          premissas: { ...PREMISSAS_PADRAO },
          camposVisitante: montarCamposVisitantePadrao(PREMISSAS_PADRAO),
        };

    definirCenarios([...cenarios, novo]);
    definirIdSelecionado(id);
    definirChatAberto(false);
  }

  // Copia a selecao de campos do visitante; o curso so entra onde houver mensalidade de curso preenchida.
  function aplicarCamposATodos(campos: Record<PerspectivaRoi, CampoPremissa[]>): void {
    if (!window.confirm('Usar esta seleção de campos do visitante em todos os cenários?')) return;

    const semCurso = (lista: CampoPremissa[]): CampoPremissa[] => lista.filter((campo) => campo !== 'mensalidadeCurso' && campo !== 'mesesCurso');
    definirCenarios(
      cenarios.map((cenario) => {
        const comCurso = cenario.premissas.mensalidadeCurso > 0;
        const medico = comCurso ? Array.from(new Set([...campos.medico, 'mensalidadeCurso', 'mesesCurso'] as CampoPremissa[])) : semCurso(campos.medico);
        return { ...cenario, camposVisitante: { medico, instituicao: [...campos.instituicao] } };
      }),
    );
  }

  // O cenario da IA entra desligado: o ADM revisa etapas e valores antes de mostrar no site.
  function handleUsarCenarioIa(novo: CenarioCredenciamento): void {
    definirCenarios([...cenarios, { ...novo, ativo: false }]);
    definirIdSelecionado(novo.id);
    definirChatAberto(false);
  }

  function excluirCenario(cenario: CenarioCredenciamento): void {
    if (cenarios.length <= 1) return;
    if (!window.confirm(`Excluir o cenário "${cenario.nome}"? Esta ação não pode ser desfeita depois de publicar.`)) return;

    const restantes = cenarios.filter((item) => item.id !== cenario.id);
    definirCenarios(restantes);
    definirIdSelecionado(restantes[0]?.id ?? '');
  }

  function moverCenario(indice: number, direcao: -1 | 1): void {
    const destino = indice + direcao;
    if (destino < 0 || destino >= cenarios.length) return;

    const reordenados = [...cenarios];
    [reordenados[indice], reordenados[destino]] = [reordenados[destino], reordenados[indice]];
    definirCenarios(reordenados);
  }

  function restaurarPadroes(): void {
    if (!window.confirm(`Substituir todos os cenários pelos ${CENARIOS_PADRAO.length} cenários padrão (prazos do PDF e valores de exemplo realistas)?`)) return;

    const padroes = clonarCenarios(CENARIOS_PADRAO);
    definirCenarios(padroes);
    definirIdSelecionado(padroes[0].id);
  }

  async function descartarRascunho(): Promise<void> {
    if (!window.confirm('Descartar as alterações não publicadas deste navegador?')) return;

    descartarRascunhoCenarios();
    const publicados = await buscarCenariosPublicados(true);
    const base = publicados ?? clonarCenarios(CENARIOS_PADRAO);

    definirCenariosEstado(base);
    definirIdSelecionado(base[0]?.id ?? '');
    definirFonte(publicados ? 'publicado' : 'padrao');
    definirAviso(null);
  }

  async function publicar(): Promise<void> {
    definirPublicando(true);
    const resultado = await publicarCenarios(cenarios);
    definirPublicando(false);

    if (resultado.sucesso) {
      descartarRascunhoCenarios();
      definirFonte('publicado');
    }

    definirAviso({ tipo: resultado.sucesso ? 'sucesso' : 'erro', mensagem: resultado.mensagem });
  }

  const textoFonte =
    fonte === 'rascunho'
      ? 'Rascunho salvo neste navegador. A calculadora deste navegador já mostra as mudanças; publique para valer para todos os visitantes.'
      : fonte === 'publicado'
        ? 'Você está vendo a versão publicada no site.'
        : 'Você está vendo os cenários padrão. Nada foi publicado ainda.';

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-hss-violeta/15 bg-white/90 shadow-suave p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-700">{textoFonte}</p>
        <div className="flex flex-wrap gap-2">
          {fonte === 'rascunho' ? (
            <button type="button" onClick={descartarRascunho} className={classeBotaoSecundario}>
              Descartar rascunho
            </button>
          ) : null}
          <button type="button" onClick={restaurarPadroes} className={classeBotaoSecundario}>
            Restaurar cenários padrão
          </button>
          <button type="button" onClick={publicar} disabled={publicando} className={classeBotaoPrimario}>
            {publicando ? 'Publicando...' : 'Publicar no site'}
          </button>
        </div>
      </div>

      {aviso ? (
        <p
          role="status"
          className={
            aviso.tipo === 'sucesso'
              ? 'mt-3 rounded-xl bg-[#e8f5f2] px-4 py-3 text-sm font-medium text-[#075f50]'
              : 'mt-3 rounded-xl bg-[#ffedd5] px-4 py-3 text-sm font-medium text-[#c2410c]'
          }
        >
          {aviso.mensagem}
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-base font-semibold text-slate-950">Cenários</h2>
          <p className="mt-1 text-[0.8125rem] leading-5 text-slate-600">O interruptor liga ou desliga o cenário na calculadora.</p>
          <ul className="mt-3 grid gap-2">
            {cenarios.map((cenario, indice) => {
              const timeline = calcularTimeline(cenario.etapas);
              const selecionado = cenario.id === cenarioAtual?.id;

              return (
                <li
                  key={cenario.id}
                  className={[
                    'flex items-start gap-3 rounded-2xl border p-3',
                    selecionado ? 'border-hss-violeta bg-hss-lavanda/10 ring-4 ring-hss-lavanda/30' : 'border-hss-violeta/15 bg-white/90 hover:border-hss-violeta/40',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    onClick={() => {
                      definirIdSelecionado(cenario.id);
                      definirChatAberto(false);
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className={cenario.ativo ? 'block text-sm font-semibold text-slate-950' : 'block text-sm font-semibold text-slate-950/50'}>
                      {cenario.nome}
                      {cenario.origemCriacao === 'ia' ? (
                        <span className="ml-1.5 rounded-full bg-hss-violeta/10 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-hss-roxo">IA</span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-5 text-slate-600">
                      {timeline.diasSemHss} → {timeline.diasComHss} dias. {cenario.perspectivas.map((p) => ROTULOS_PERSPECTIVA[p]).join(' e ')}
                    </span>
                  </button>
                  <div className="flex flex-col items-end gap-2">
                    <Interruptor
                      ligado={cenario.ativo}
                      aoAlternar={(ligado) => atualizarCenario(cenario.id, { ativo: ligado })}
                      rotulo={`Mostrar "${cenario.nome}" na calculadora`}
                    />
                    <span className="flex gap-1">
                      <BotaoIcone rotulo={`Subir "${cenario.nome}"`} desativado={indice === 0} aoClicar={() => moverCenario(indice, -1)}>
                        <path d="m18 15-6-6-6 6" />
                      </BotaoIcone>
                      <BotaoIcone rotulo={`Descer "${cenario.nome}"`} desativado={indice === cenarios.length - 1} aoClicar={() => moverCenario(indice, 1)}>
                        <path d="m6 9 6 6 6-6" />
                      </BotaoIcone>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={() => definirChatAberto(true)} className={`${classeBotaoPrimario} mt-3 w-full`}>
            Criar cenário com IA
          </button>
          <button type="button" onClick={() => criarCenario()} className={`${classeBotaoSecundario} mt-2 w-full`}>
            Novo cenário em branco
          </button>
        </aside>

        {chatAberto ? (
          <section className="flex h-[38rem] max-h-[80dvh] min-w-0 flex-col rounded-2xl border border-hss-violeta/15 bg-white/90 shadow-suave p-5">
            <ChatIaCenario
              perspectiva={null}
              textoUsar="Adicionar como rascunho"
              aoUsarCenario={handleUsarCenarioIa}
              aoFechar={() => definirChatAberto(false)}
            />
          </section>
        ) : cenarioAtual ? (
          <FormularioCenario
            key={cenarioAtual.id}
            cenario={cenarioAtual}
            podeExcluir={cenarios.length > 1}
            aoAtualizar={(parcial) => atualizarCenario(cenarioAtual.id, parcial)}
            aoDuplicar={() => criarCenario(cenarioAtual)}
            aoExcluir={() => excluirCenario(cenarioAtual)}
            aoAplicarCamposATodos={aplicarCamposATodos}
          />
        ) : null}
      </div>
    </div>
  );
}
/* === EDITOR DE CENARIOS | fim === */

/* === FORMULARIO DO CENARIO | inicio === */
function FormularioCenario({
  cenario,
  podeExcluir,
  aoAtualizar,
  aoDuplicar,
  aoExcluir,
  aoAplicarCamposATodos,
}: {
  cenario: CenarioCredenciamento;
  podeExcluir: boolean;
  aoAtualizar: (parcial: Partial<CenarioCredenciamento>) => void;
  aoDuplicar: () => void;
  aoExcluir: () => void;
  aoAplicarCamposATodos: (campos: Record<PerspectivaRoi, CampoPremissa[]>) => void;
}): JSX.Element {
  const timeline = calcularTimeline(cenario.etapas);

  function atualizarPremissa(campo: CampoPremissa, valor: number): void {
    aoAtualizar({ premissas: { ...cenario.premissas, [campo]: valor } });
  }

  function alternarCampoVisitante(perspectiva: PerspectivaRoi, campo: CampoPremissa, marcado: boolean): void {
    const atuais = cenario.camposVisitante[perspectiva];
    const novos = marcado ? [...atuais.filter((item) => item !== campo), campo] : atuais.filter((item) => item !== campo);
    aoAtualizar({ camposVisitante: { ...cenario.camposVisitante, [perspectiva]: novos } });
  }



  function atualizarEtapa(id: string, parcial: Partial<EtapaCenario>): void {
    aoAtualizar({ etapas: cenario.etapas.map((etapa) => (etapa.id === id ? { ...etapa, ...parcial } : etapa)) });
  }

  function moverEtapa(indice: number, direcao: -1 | 1): void {
    const destino = indice + direcao;
    if (destino < 0 || destino >= cenario.etapas.length) return;

    const etapas = [...cenario.etapas];
    [etapas[indice], etapas[destino]] = [etapas[destino], etapas[indice]];
    aoAtualizar({ etapas });
  }

  function removerEtapa(id: string): void {
    if (cenario.etapas.length <= 1) return;
    aoAtualizar({ etapas: cenario.etapas.filter((etapa) => etapa.id !== id) });
  }

  function adicionarEtapa(): void {
    aoAtualizar({
      etapas: [...cenario.etapas, { id: `etapa-${Date.now()}`, nome: 'Nova etapa', diasSemHss: 5, diasComHss: 3, hssAtua: true, nota: '' }],
    });
  }

  return (
    <div className="grid min-w-0 gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-hss-violeta/15 bg-white/90 shadow-suave p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-[-0.01em] text-slate-950">{cenario.nome}</h2>
          <p className="mt-1 text-sm text-slate-600">{cenario.ativo ? 'Aparece na calculadora do site.' : 'Desligado: não aparece no site.'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={aoDuplicar} className={classeBotaoSecundario}>
            Duplicar
          </button>
          <button type="button" onClick={aoExcluir} disabled={!podeExcluir} className={`${classeBotaoSecundario} text-[#c2410c]`}>
            Excluir
          </button>
        </div>
      </div>

      <PreviaCalculo cenario={cenario} />

      <Painel titulo="Como aparece no site">
        <div className="grid gap-5 md:grid-cols-2">
          <CampoTexto id="admNome" label="Nome do cenário" valor={cenario.nome} aoMudar={(valor) => aoAtualizar({ nome: valor })} />
          <div>
            <label htmlFor="admOrigem" className="block text-sm font-semibold text-slate-950">
              De onde vêm os prazos
            </label>
            <select
              id="admOrigem"
              value={cenario.origemPrazos}
              onChange={(evento) => aoAtualizar({ origemPrazos: evento.target.value as OrigemDado })}
              className="mt-1.5 h-11 w-full rounded-xl border border-hss-violeta/15 bg-[#f3f4f6] px-3 transition focus:border-hss-violeta focus:bg-white focus:ring-4 focus:ring-hss-lavanda/30 text-base font-medium text-slate-950"
            >
              {(Object.keys(ROTULOS_ORIGEM) as OrigemDado[]).map((origem) => (
                <option key={origem} value={origem}>
                  {ROTULOS_ORIGEM[origem]}
                </option>
              ))}
            </select>
          </div>
          <CampoTexto
            id="admResumo"
            label="Descrição curta para o visitante"
            valor={cenario.resumoSite}
            grande
            aoMudar={(valor) => aoAtualizar({ resumoSite: valor })}
          />
          <CampoTexto
            id="admLimite"
            label="Limite do cenário"
            ajuda="O que a HSS não acelera neste caso. Aparece no rodapé do resultado."
            valor={cenario.limite}
            grande
            aoMudar={(valor) => aoAtualizar({ limite: valor })}
          />
          <fieldset className="md:col-span-2">
            <legend className="text-sm font-semibold text-slate-950">Para quem é este cenário</legend>
            <p className="mt-0.5 text-[0.8125rem] leading-5 text-slate-600">Cada cenário aparece só para um perfil. Para ter o mesmo caso nos dois, duplique e troque o perfil.</p>
            <div className="mt-2 flex flex-wrap gap-5">
              {(['medico', 'instituicao'] as PerspectivaRoi[]).map((perspectiva) => (
                <label key={perspectiva} className="flex items-center gap-2 text-sm text-slate-950">
                  <input
                    type="radio"
                    name={`perfil-${cenario.id}`}
                    checked={cenario.perspectivas[0] === perspectiva}
                    onChange={() => aoAtualizar({ perspectivas: [perspectiva] })}
                    className="h-4 w-4 accent-[#291B7F]"
                  />
                  {ROTULOS_PERSPECTIVA[perspectiva]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex items-center justify-between gap-4 rounded-xl bg-[#eef0f7] p-4 md:col-span-2">
            <span>
              <strong className="block text-sm font-semibold text-slate-950">Mostrar na calculadora do site</strong>
              <span className="text-[0.8125rem] text-slate-600">Desligado, o cenário fica guardado só aqui.</span>
            </span>
            <Interruptor ligado={cenario.ativo} aoAlternar={(ligado) => aoAtualizar({ ativo: ligado })} rotulo="Mostrar na calculadora do site" />
          </div>
        </div>
      </Painel>

      <Painel
        titulo="Etapas e prazos"
        descricao="Desligue “HSS atua” nas etapas que a plataforma não controla, como comissão ou licenças. Nelas o prazo com HSS fica igual ao prazo sem HSS."
      >
        <div
          aria-hidden="true"
          className="hidden gap-3 border-b border-hss-violeta/15 pb-2 text-[0.8125rem] font-medium text-slate-600 md:grid md:grid-cols-[minmax(0,1fr)_6rem_5rem_6rem_5.5rem]"
        >
          <span>Etapa</span>
          <span>Sem HSS</span>
          <span>HSS atua</span>
          <span>Com HSS</span>
          <span />
        </div>
        <ol className="grid gap-4 md:gap-0 md:divide-y md:divide-hss-violeta/15">
          {cenario.etapas.map((etapa, indice) => (
            <li key={etapa.id} className="grid gap-3 rounded-xl border border-hss-violeta/15 p-3 md:rounded-none md:border-0 md:px-0 md:py-3">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_6rem_5rem_6rem_5.5rem] md:items-center">
                <EntradaCompacta rotulo={`Nome da etapa ${indice + 1}`} rotuloVisivel="Etapa">
                  <input
                    value={etapa.nome}
                    aria-label={`Nome da etapa ${indice + 1}`}
                    onChange={(evento) => atualizarEtapa(etapa.id, { nome: evento.target.value })}
                    className={classeEntrada}
                  />
                </EntradaCompacta>
                <EntradaCompacta rotulo="" rotuloVisivel="Sem HSS (dias)">
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    aria-label={`Dias sem HSS na etapa ${etapa.nome}`}
                    value={etapa.diasSemHss}
                    onChange={(evento) => atualizarEtapa(etapa.id, { diasSemHss: Math.max(0, Number(evento.target.value) || 0) })}
                    className={classeEntrada}
                  />
                </EntradaCompacta>
                <EntradaCompacta rotulo="" rotuloVisivel="HSS atua">
                  <Interruptor
                    ligado={etapa.hssAtua}
                    aoAlternar={(ligado) => atualizarEtapa(etapa.id, { hssAtua: ligado })}
                    rotulo={`HSS atua na etapa ${etapa.nome}`}
                  />
                </EntradaCompacta>
                <EntradaCompacta rotulo="" rotuloVisivel="Com HSS (dias)">
                  <input
                    type="number"
                    min={0}
                    max={etapa.diasSemHss}
                    inputMode="numeric"
                    disabled={!etapa.hssAtua}
                    aria-label={`Dias com HSS na etapa ${etapa.nome}`}
                    value={etapa.hssAtua ? etapa.diasComHss : obterDiasComHssEtapa(etapa)}
                    onChange={(evento) =>
                      atualizarEtapa(etapa.id, { diasComHss: Math.min(etapa.diasSemHss, Math.max(0, Number(evento.target.value) || 0)) })
                    }
                    className={`${classeEntrada} disabled:border-hss-violeta/10 disabled:bg-hss-violeta/5 disabled:text-slate-600`}
                  />
                </EntradaCompacta>
                <span className="flex gap-1 md:justify-end">
                  <BotaoIcone rotulo={`Subir etapa ${etapa.nome}`} desativado={indice === 0} aoClicar={() => moverEtapa(indice, -1)}>
                    <path d="m18 15-6-6-6 6" />
                  </BotaoIcone>
                  <BotaoIcone
                    rotulo={`Descer etapa ${etapa.nome}`}
                    desativado={indice === cenario.etapas.length - 1}
                    aoClicar={() => moverEtapa(indice, 1)}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </BotaoIcone>
                  <BotaoIcone rotulo={`Remover etapa ${etapa.nome}`} desativado={cenario.etapas.length <= 1} aoClicar={() => removerEtapa(etapa.id)}>
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </BotaoIcone>
                </span>
              </div>
              <input
                value={etapa.nota}
                placeholder="Nota ou limite desta etapa (aparece para o visitante)"
                aria-label={`Nota da etapa ${etapa.nome}`}
                onChange={(evento) => atualizarEtapa(etapa.id, { nota: evento.target.value })}
                className={`${classeEntrada} text-sm`}
              />
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-col gap-3 border-t border-hss-violeta/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-950">
            Total: <strong className="font-semibold text-[#c2410c]">{timeline.diasSemHss} dias sem HSS</strong>,{' '}
            <strong className="font-semibold text-[#075f50]">{timeline.diasComHss} com HSS</strong>, {timeline.diasEconomizados} dias a menos.
          </p>
          <button type="button" onClick={adicionarEtapa} className={classeBotaoSecundario}>
            Adicionar etapa
          </button>
        </div>
      </Painel>

      <Painel
        titulo="O que o visitante preenche"
        descricao="A calculadora pública pergunta só os campos marcados com “Visitante preenche”. Os demais usam os valores deste cenário e aparecem na aba “Cálculo” do resultado. Para caber na tela sem rolagem, mantenha até 8 campos por perfil."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-950">
            {cenario.perspectivas.map((perspectiva) => `${ROTULOS_PERSPECTIVA[perspectiva]}: ${cenario.camposVisitante[perspectiva].length} campos`).join('; ')}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => aoAtualizar({ camposVisitante: montarCamposVisitantePadrao(cenario.premissas) })} className={classeBotaoSecundario}>
              Voltar à seleção padrão
            </button>
            <button type="button" onClick={() => aoAplicarCamposATodos(cenario.camposVisitante)} className={classeBotaoSecundario}>
              Usar esta seleção em todos os cenários
            </button>
          </div>
        </div>
      </Painel>

      {GRUPOS_PREMISSAS.filter((grupo) => grupo.perspectiva === null || cenario.perspectivas.includes(grupo.perspectiva)).map((grupo) => (
        <Painel key={grupo.id} titulo={grupo.titulo} descricao={`${grupo.descricao} O botão “i” de cada campo mostra onde ele entra na conta.`}>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {listarCamposDoGrupo(grupo.id).map((campo) => {
              const perspectivasDoCampo = cenario.perspectivas.filter((perspectiva) => grupo.perspectiva === null || grupo.perspectiva === perspectiva);

              return (
                <div key={campo} className="min-w-0">
                  <CampoDaPremissa campo={campo} premissas={cenario.premissas} aoMudar={atualizarPremissa} prefixoId={`adm-${cenario.id}`} />
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-slate-600">
                    <span>Visitante preenche:</span>
                    {perspectivasDoCampo.map((perspectiva) => (
                      <label key={perspectiva} className="flex items-center gap-1.5 text-slate-950">
                        <input
                          type="checkbox"
                          checked={cenario.camposVisitante[perspectiva].includes(campo)}
                          onChange={(evento) => alternarCampoVisitante(perspectiva, campo, evento.target.checked)}
                          className="h-3.5 w-3.5 accent-[#291B7F]"
                        />
                        {ROTULOS_PERSPECTIVA[perspectiva]}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Painel>
      ))}
    </div>
  );
}
/* === FORMULARIO DO CENARIO | fim === */

/* === PREVIA DO CALCULO | inicio === */
// Mostra ao ADM o resultado e a conta completa com os valores deste cenario, atualizados a cada edicao.
function PreviaCalculo({ cenario }: { cenario: CenarioCredenciamento }): JSX.Element {
  const [perspectivaEscolhida, definirPerspectiva] = useState<PerspectivaRoi>(cenario.perspectivas[0]);
  const perspectiva = cenario.perspectivas.includes(perspectivaEscolhida) ? perspectivaEscolhida : cenario.perspectivas[0];
  const timeline = calcularTimeline(cenario.etapas);
  const medico = useMemo(() => calcularRoiMedico(cenario.etapas, cenario.premissas), [cenario]);
  const instituicao = useMemo(() => calcularRoiInstituicao(cenario.etapas, cenario.premissas), [cenario]);
  const memoria = useMemo(
    () => (perspectiva === 'medico' ? montarMemoriaMedico(medico, cenario.premissas) : montarMemoriaInstituicao(instituicao, cenario.premissas, cenario.etapas)),
    [perspectiva, medico, instituicao, cenario],
  );
  const destaques =
    perspectiva === 'medico'
      ? [
          { rotulo: 'Ganho total com a HSS', valor: formatarMoeda(medico.ganhoLiquidoHss) },
          { rotulo: 'Recupera o custo de entrada', valor: formatarMeses(medico.recuperaEntradaComHssMeses) },
          ...(medico.investimentoFormacao > 0 ? [{ rotulo: 'Recupera o curso de medicina', valor: formatarMeses(medico.recuperaFormacaoComHssMeses) }] : []),
        ]
      : [
          { rotulo: 'Benefício por médico', valor: formatarMoeda(instituicao.beneficioPorMedico) },
          { rotulo: `ROI em ${cenario.premissas.mesesAnalise} meses`, valor: formatarPercentual(instituicao.roiPercentual) },
          { rotulo: 'Payback', valor: formatarMeses(instituicao.paybackMeses) },
        ];

  return (
    <Painel titulo="Resultado e conta com os valores deste cenário" descricao="É o que o visitante vê antes de editar. Mude qualquer campo abaixo e acompanhe aqui.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="grid content-start gap-5">
          <ReguaPrazos diasSemHss={timeline.diasSemHss} diasComHss={timeline.diasComHss} compacta />
          {cenario.perspectivas.length > 1 ? (
            <div role="group" aria-label="Perfil da prévia" className="flex w-fit rounded-full border border-hss-violeta/20 bg-white p-1">
              {cenario.perspectivas.map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  aria-pressed={perspectiva === opcao}
                  onClick={() => definirPerspectiva(opcao)}
                  className={
                    perspectiva === opcao
                      ? 'rounded-full bg-hss-roxo px-3 py-1.5 text-sm font-semibold text-white'
                      : 'rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-hss-roxo'
                  }
                >
                  {ROTULOS_PERSPECTIVA[opcao]}
                </button>
              ))}
            </div>
          ) : null}
          <dl className="grid gap-3 text-sm">
            {destaques.map((item) => (
              <div key={item.rotulo} className="flex justify-between gap-4">
                <dt className="text-slate-600">{item.rotulo}</dt>
                <dd className="text-right font-semibold text-slate-950">{item.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="max-h-[26rem] min-w-0 overflow-y-auto rounded-xl border border-hss-violeta/15">
          <TabelaMemoria linhas={memoria} compacta />
        </div>
      </div>
    </Painel>
  );
}
/* === PREVIA DO CALCULO | fim === */

/* === APOIO ADM | inicio === */
const classeBotaoPrimario =
  'rounded-full bg-hss-roxo px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-hss-violeta disabled:cursor-not-allowed disabled:opacity-60';
const classeBotaoSecundario =
  'rounded-full border border-hss-violeta/20 bg-white px-5 py-2.5 text-sm font-semibold text-hss-roxo transition-colors hover:border-hss-violeta/50 hover:bg-hss-lavanda/10 disabled:cursor-not-allowed disabled:opacity-40';
const classeEntrada = 'h-10 w-full min-w-0 rounded-xl border border-hss-violeta/15 bg-[#f3f4f6] px-3 transition focus:border-hss-violeta focus:bg-white focus:ring-4 focus:ring-hss-lavanda/30 text-slate-950 outline-none';

function Painel({ titulo, descricao, children }: { titulo: string; descricao?: string; children: ReactNode }): JSX.Element {
  return (
    <section className="rounded-2xl border border-hss-violeta/15 bg-white/90 shadow-suave p-5">
      <h3 className="text-base font-semibold text-slate-950">{titulo}</h3>
      {descricao ? <p className="mt-1 max-w-[70ch] text-sm leading-6 text-slate-600">{descricao}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EntradaCompacta({ rotulo, rotuloVisivel, children }: { rotulo: string; rotuloVisivel: string; children: ReactNode }): JSX.Element {
  return (
    <div className="grid gap-1" title={rotulo || undefined}>
      <span aria-hidden="true" className="text-[0.8125rem] font-medium text-slate-600 md:hidden">
        {rotuloVisivel}
      </span>
      {children}
    </div>
  );
}

function CampoTexto({
  id,
  label,
  ajuda,
  valor,
  aoMudar,
  grande = false,
}: {
  id: string;
  label: string;
  ajuda?: string;
  valor: string;
  aoMudar: (valor: string) => void;
  grande?: boolean;
}): JSX.Element {
  return (
    <div className={grande ? 'md:col-span-1' : ''}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-950">
        {label}
      </label>
      {ajuda ? <p className="mt-0.5 text-[0.8125rem] leading-5 text-slate-600">{ajuda}</p> : null}
      {grande ? (
        <textarea
          id={id}
          value={valor}
          rows={3}
          onChange={(evento) => aoMudar(evento.target.value)}
          className="mt-1.5 w-full rounded-xl border border-hss-violeta/15 bg-[#f3f4f6] px-3 transition focus:border-hss-violeta focus:bg-white focus:ring-4 focus:ring-hss-lavanda/30 py-2.5 text-sm leading-6 text-slate-950 outline-none"
        />
      ) : (
        <input
          id={id}
          value={valor}
          onChange={(evento) => aoMudar(evento.target.value)}
          className="mt-1.5 h-11 w-full rounded-xl border border-hss-violeta/15 bg-[#f3f4f6] px-3 transition focus:border-hss-violeta focus:bg-white focus:ring-4 focus:ring-hss-lavanda/30 text-base font-medium text-slate-950 outline-none"
        />
      )}
    </div>
  );
}

function BotaoIcone({
  rotulo,
  desativado = false,
  aoClicar,
  children,
}: {
  rotulo: string;
  desativado?: boolean;
  aoClicar: () => void;
  children: ReactNode;
}): JSX.Element {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      disabled={desativado}
      onClick={aoClicar}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-hss-violeta/20 text-hss-roxo hover:border-hss-violeta/50 disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
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
    <form
      onSubmit={(evento) => {
        evento.preventDefault();
        aoEntrar();
      }}
      className="mx-auto mt-10 max-w-md rounded-[1.35rem] border border-hss-violeta/15 bg-white/90 shadow-suave p-6 sm:p-8"
    >
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-950">Entrar no Portal ADM</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Ambiente demo: usuário hssadmin e senha hss2026.</p>
      <div className="mt-6 grid gap-4">
        <div>
          <label htmlFor="admUsuario" className="block text-sm font-semibold text-slate-950">
            Usuário
          </label>
          <input
            id="admUsuario"
            type="text"
            value={usuario}
            autoComplete="username"
            onChange={(evento) => aoMudarUsuario(evento.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-hss-violeta/15 bg-[#f3f4f6] px-3 transition focus:border-hss-violeta focus:bg-white focus:ring-4 focus:ring-hss-lavanda/30 text-base text-slate-950 outline-none"
          />
        </div>
        <div>
          <label htmlFor="admSenha" className="block text-sm font-semibold text-slate-950">
            Senha
          </label>
          <input
            id="admSenha"
            type="password"
            value={senha}
            autoComplete="current-password"
            onChange={(evento) => aoMudarSenha(evento.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-hss-violeta/15 bg-[#f3f4f6] px-3 transition focus:border-hss-violeta focus:bg-white focus:ring-4 focus:ring-hss-lavanda/30 text-base text-slate-950 outline-none"
          />
        </div>
        {erroLogin ? (
          <p role="alert" className="rounded-xl bg-[#ffedd5] px-4 py-3 text-sm font-medium text-[#c2410c]">
            {erroLogin}
          </p>
        ) : null}
        <button type="submit" className={`${classeBotaoPrimario} py-3`}>
          Entrar
        </button>
      </div>
    </form>
  );
}
/* === PORTAL LOGIN ADM | fim === */
