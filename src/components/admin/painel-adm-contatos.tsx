import { useEffect, useMemo, useState } from 'react';
import type { LeadCaptado, VisaoCalculadora } from '@/types/calculadora';

/* === TIPOS CONTATOS ADM | inicio === */
interface LeadContato extends LeadCaptado {
  id: string;
  criadoEm: string;
  atualizadoEm?: string;
  ativo: boolean;
}

interface LeadApi {
  id?: unknown;
  nome?: unknown;
  email?: unknown;
  telefone?: unknown;
  instituicao?: unknown;
  cargo?: unknown;
  porte?: unknown;
  visao?: unknown;
  mensagem?: unknown;
  criado_em?: unknown;
  atualizado_em?: unknown;
  ativo?: unknown;
}

interface RespostaLeadsApi {
  ok?: boolean;
  dados?: LeadApi[];
}

type StatusCarregamento = 'carregando' | 'pronto' | 'erro';
/* === TIPOS CONTATOS ADM | fim === */

/* === COMPONENTE CONTATOS ADM | inicio === */
export function PainelAdmContatos(): JSX.Element {
  const [contatos, definirContatos] = useState<LeadContato[]>([]);
  const [status, definirStatus] = useState<StatusCarregamento>('carregando');
  const [busca, definirBusca] = useState('');

  useEffect(() => {
    let montado = true;

    async function carregarContatos(): Promise<void> {
      definirStatus('carregando');

      try {
        const resposta = await fetch('/api/leads');
        if (!resposta.ok) throw new Error('Falha ao carregar contatos');

        const dados = (await resposta.json()) as RespostaLeadsApi;
        const contatosApi = Array.isArray(dados.dados) ? dados.dados.map(normalizarLeadApi) : [];

        if (montado) {
          definirContatos(contatosApi);
          definirStatus('pronto');
        }
      } catch {
        const contatosFallback = carregarLeadsFallback();

        if (montado) {
          definirContatos(contatosFallback);
          definirStatus(contatosFallback.length > 0 ? 'pronto' : 'erro');
        }
      }
    }

    void carregarContatos();

    return () => {
      montado = false;
    };
  }, []);

  const contatosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return contatos;

    return contatos.filter((contato) =>
      [contato.nome, contato.email, contato.telefone, contato.instituicao, contato.cargo, contato.porte, contato.visao]
        .join(' ')
        .toLowerCase()
        .includes(termo),
    );
  }, [busca, contatos]);

  const totalEmpresa = contatos.filter((contato) => contato.visao === 'empresa').length;
  const totalMedico = contatos.filter((contato) => contato.visao === 'medico').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <ResumoContato titulo="Contatos recebidos" valor={String(contatos.length)} detalhe="Leads salvos pelo formulário público." />
        <ResumoContato titulo="Empresa / Hospital / Clínica" valor={String(totalEmpresa)} detalhe="Interessados na visão B2B." />
        <ResumoContato titulo="Médicos" valor={String(totalMedico)} detalhe="Interessados na visão do profissional." />
      </div>

      <div className="rounded-[1.5rem] border border-hss-violeta/15 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
        <label className="block">
          <span className="text-sm font-extrabold text-slate-800 dark:text-white">Buscar contato</span>
          <input
            value={busca}
            onChange={(evento) => definirBusca(evento.target.value)}
            className="mt-3 w-full rounded-2xl border border-hss-violeta/20 bg-white px-4 py-3 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-hss-lavanda/30 dark:border-white/10 dark:bg-hss-tinta/70 dark:text-white"
            placeholder="Nome, e-mail, telefone, instituição ou perfil"
          />
        </label>
      </div>

      {status === 'carregando' ? (
        <AvisoContatos texto="Carregando contatos..." />
      ) : null}

      {status === 'erro' ? (
        <AvisoContatos texto="Nenhum contato encontrado no banco ou fallback local. No Vite, a listagem completa depende das Functions do Cloudflare." />
      ) : null}

      {status !== 'carregando' && contatosFiltrados.length === 0 && contatos.length > 0 ? (
        <AvisoContatos texto="Nenhum contato corresponde à busca atual." />
      ) : null}

      <div className="grid gap-4">
        {contatosFiltrados.map((contato) => (
          <article key={contato.id} className="rounded-[1.5rem] border border-hss-violeta/15 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-hss-violeta dark:text-hss-lavanda">
                  {contato.visao === 'empresa' ? 'Empresa / hospital / clínica' : 'Médico'}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{contato.nome}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-300">{contato.instituicao}</p>
              </div>
              <span className="rounded-full bg-hss-violeta/10 px-4 py-2 text-xs font-black text-hss-roxo dark:bg-white/10 dark:text-white">
                {formatarData(contato.criadoEm)}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <InfoContato titulo="E-mail" valor={contato.email} />
              <InfoContato titulo="Telefone" valor={contato.telefone || 'Não informado'} />
              <InfoContato titulo="Cargo" valor={contato.cargo || 'Não informado'} />
              <InfoContato titulo="Porte" valor={contato.porte || 'Não informado'} />
            </div>

            {contato.mensagem ? (
              <p className="mt-4 rounded-2xl bg-hss-violeta/10 p-4 text-sm font-semibold leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                {contato.mensagem}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
/* === COMPONENTE CONTATOS ADM | fim === */

/* === APOIO CONTATOS ADM | inicio === */
function normalizarLeadApi(lead: LeadApi): LeadContato {
  const visao = String(lead.visao ?? 'empresa') === 'medico' ? 'medico' : 'empresa';

  return {
    id: String(lead.id ?? crypto.randomUUID()),
    nome: String(lead.nome ?? ''),
    email: String(lead.email ?? ''),
    telefone: String(lead.telefone ?? ''),
    instituicao: String(lead.instituicao ?? ''),
    cargo: String(lead.cargo ?? ''),
    porte: String(lead.porte ?? ''),
    visao,
    mensagem: String(lead.mensagem ?? ''),
    criadoEm: String(lead.criado_em ?? new Date().toISOString()),
    atualizadoEm: typeof lead.atualizado_em === 'string' ? lead.atualizado_em : undefined,
    ativo: lead.ativo !== 0,
  };
}

function carregarLeadsFallback(): LeadContato[] {
  try {
    const leadsLocais = JSON.parse(window.localStorage.getItem('hss_leads_fallback') ?? '[]') as LeadCaptado[];

    return leadsLocais.map((lead, indice) => ({
      ...lead,
      id: `fallback-${indice + 1}`,
      visao: normalizarVisao(lead.visao),
      criadoEm: new Date().toISOString(),
      ativo: true,
    }));
  } catch {
    return [];
  }
}

function normalizarVisao(visao: string): VisaoCalculadora {
  return visao === 'medico' ? 'medico' : 'empresa';
}

function formatarData(valor: string): string {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return 'Data não informada';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data);
}

function ResumoContato({ titulo, valor, detalhe }: { titulo: string; valor: string; detalhe: string }): JSX.Element {
  return (
    <article className="rounded-[1.5rem] border border-hss-violeta/15 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{titulo}</p>
      <strong className="mt-2 block text-2xl font-black text-hss-roxo dark:text-white">{valor}</strong>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{detalhe}</p>
    </article>
  );
}

function InfoContato({ titulo, valor }: { titulo: string; valor: string }): JSX.Element {
  return (
    <div className="rounded-2xl bg-white/80 p-3 dark:bg-white/10">
      <span className="block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{titulo}</span>
      <strong className="mt-1 block break-words text-sm text-slate-900 dark:text-white">{valor}</strong>
    </div>
  );
}

function AvisoContatos({ texto }: { texto: string }): JSX.Element {
  return (
    <p className="rounded-[1.5rem] border border-hss-violeta/15 bg-white/75 p-5 text-sm font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
      {texto}
    </p>
  );
}
/* === APOIO CONTATOS ADM | fim === */
