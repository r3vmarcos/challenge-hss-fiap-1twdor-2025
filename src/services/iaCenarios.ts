import { calcularCarreira } from '@/services/calculosCarreira';
import { locaisValidos, PERFIS_CARREIRA, PRAZO_PAGAMENTO_DIAS } from '@/data/carreiraMedica';
import { normalizarCenario } from '@/data/configuracoesCredenciamento';
import type { LocalAtendimento, MensagemChatIa, PerfilCarreira, PerspectivaRoi, RespostaChatIa, RespostaChatIaCarreira } from '@/types/calculadora';

/* === CONSTANTES DA IA | inicio === */
const URL_API_IA = '/api/ia-cenario';
/* === CONSTANTES DA IA | fim === */

/* === CHAMADA DA IA | inicio === */
// A IA so coleta premissas; o cenario volta normalizado e a calculadora faz todas as contas.
export async function enviarMensagensIa(mensagens: MensagemChatIa[], perspectiva: PerspectivaRoi | null): Promise<RespostaChatIa> {
  const corpo = await postarConversa({ mensagens, perspectiva });
  const cenario = corpo.concluido && corpo.cenario ? normalizarCenario({ ...(corpo.cenario as object), id: `ia-${Date.now()}`, origemCriacao: 'ia' }) : null;

  return { mensagem: String(corpo.mensagem ?? ''), sugestoes: lerSugestoes(corpo.sugestoes), concluido: Boolean(cenario), cenario };
}

// Modo carreira: a IA devolve o perfil de formacao; os numeros sao saneados aqui antes de entrar na calculadora.
export async function enviarMensagensIaCarreira(mensagens: MensagemChatIa[]): Promise<RespostaChatIaCarreira> {
  const corpo = await postarConversa({ mensagens, modo: 'carreira' });
  const perfil = corpo.concluido && corpo.perfil && typeof corpo.perfil === 'object' ? normalizarPerfilIa(corpo.perfil as Record<string, unknown>) : null;

  return { mensagem: String(corpo.mensagem ?? ''), sugestoes: lerSugestoes(corpo.sugestoes), concluido: Boolean(perfil), perfil };
}
/* === CHAMADA DA IA | fim === */

/* === APOIO DA IA | inicio === */
interface CorpoRespostaIa {
  sucesso?: boolean;
  erro?: string;
  mensagem?: string;
  sugestoes?: unknown;
  concluido?: boolean;
  cenario?: unknown;
  perfil?: unknown;
}

export const ID_PERFIL_IA = 'ia';

function lerSugestoes(valor: unknown): string[] {
  return Array.isArray(valor) ? valor.filter((item): item is string => typeof item === 'string') : [];
}

function numero(valor: unknown, padrao: number, minimo = 0, maximo = Number.POSITIVE_INFINITY): number {
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? Math.min(maximo, Math.max(minimo, convertido)) : padrao;
}

function normalizarPerfilIa(bruto: Record<string, unknown>): PerfilCarreira {
  const base = PERFIS_CARREIRA[2].premissas;
  const locaisBrutos = Array.isArray(bruto.locais) ? (bruto.locais as Record<string, unknown>[]).slice(0, 5) : [];
  const locais: LocalAtendimento[] = locaisValidos(
    locaisBrutos.map((local, indice) => ({
      id: `local-${indice + 1}`,
      nome: String(local.nome ?? `Local ${indice + 1}`).slice(0, 40),
      atendimentosPorDia: numero(local.atendimentosPorDia, 20, 1),
      diasAtendimentoMes: numero(local.diasAtendimentoMes, 10, 1, 31),
      valorAtendimento: numero(local.valorAtendimento, 120),
      parcelaMedicoPercentual: numero(local.parcelaMedicoPercentual, 60, 0, 100),
      impostosPercentual: numero(local.impostosPercentual, 13, 0, 100),
      prazoRecebimentoDias: PRAZO_PAGAMENTO_DIAS,
    })),
  );
  const custoVidaMensal = numero(bruto.custoVidaMensal, base.custoVidaMensal);
  const premissas = {
    mensalidadeInicial: numero(bruto.mensalidadeInicial, base.mensalidadeInicial),
    reajusteAnualPercentual: numero(bruto.reajusteAnualPercentual, base.reajusteAnualPercentual, 0, 50),
    anosCurso: Math.round(numero(bruto.anosCurso, base.anosCurso, 1, 10)),
    custoVidaMensal,
    materiais: numero(bruto.materiais, base.materiais),
    preparatorioResidencia: numero(bruto.preparatorioResidencia, base.preparatorioResidencia),
    locais,
    custoVidaFormado: numero(bruto.custoVidaFormado, custoVidaMensal),
  };

  return {
    id: ID_PERFIL_IA,
    nome: String(bruto.nome ?? 'Meu perfil').slice(0, 60),
    resumo: String(bruto.resumo ?? 'Perfil montado com a IA.').slice(0, 160),
    premissas,
    investimentoReferencia: calcularCarreira(premissas).investimentoTotal,
  };
}

async function postarConversa(dados: object): Promise<CorpoRespostaIa> {
  let resposta: Response;

  try {
    resposta = await fetch(URL_API_IA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
  } catch {
    throw new Error('Sem conexão com o assistente. Verifique a internet e tente de novo.');
  }

  const tipo = resposta.headers.get('content-type') ?? '';
  if (!tipo.includes('application/json')) {
    throw new Error('O assistente não está disponível neste ambiente. Rode com `npm run dev` ou publique as Functions no Cloudflare.');
  }

  const corpo = (await resposta.json()) as CorpoRespostaIa;
  if (!resposta.ok || !corpo.sucesso) throw new Error(corpo.erro || 'O assistente não respondeu. Tente de novo.');
  return corpo;
}
/* === APOIO DA IA | fim === */
