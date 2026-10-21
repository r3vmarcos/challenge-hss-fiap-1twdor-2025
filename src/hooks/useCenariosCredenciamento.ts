import { useEffect, useState } from 'react';
import { CENARIOS_PADRAO, normalizarCenarios } from '@/data/configuracoesCredenciamento';
import type { CenarioCredenciamento } from '@/types/calculadora';

/* === CONSTANTES DE PERSISTENCIA | inicio === */
export const CHAVE_RASCUNHO_CENARIOS = 'hss_adm_cenarios_v2';
const CHAVE_TOKEN_ADM = 'hss_adm_token';
const EVENTO_CENARIOS_ATUALIZADOS = 'hss:cenarios-atualizados';
const URL_API_CENARIOS = '/api/cenarios-credenciamento';

export type OrigemCenarios = 'rascunho' | 'publicado' | 'padrao';
/* === CONSTANTES DE PERSISTENCIA | fim === */

/* === RASCUNHO LOCAL | inicio === */
// O rascunho do ADM fica no navegador: o site deste navegador ja mostra as alteracoes antes de publicar.
export function lerRascunhoCenarios(): CenarioCredenciamento[] | null {
  try {
    const salvo = window.localStorage.getItem(CHAVE_RASCUNHO_CENARIOS);
    return salvo ? normalizarCenarios(JSON.parse(salvo)) : null;
  } catch {
    return null;
  }
}

export function salvarRascunhoCenarios(cenarios: CenarioCredenciamento[]): void {
  try {
    window.localStorage.setItem(CHAVE_RASCUNHO_CENARIOS, JSON.stringify(cenarios));
  } catch {
    /* sem armazenamento local disponivel */
  }
  window.dispatchEvent(new Event(EVENTO_CENARIOS_ATUALIZADOS));
}

export function descartarRascunhoCenarios(): void {
  try {
    window.localStorage.removeItem(CHAVE_RASCUNHO_CENARIOS);
  } catch {
    /* sem armazenamento local disponivel */
  }
  window.dispatchEvent(new Event(EVENTO_CENARIOS_ATUALIZADOS));
}
/* === RASCUNHO LOCAL | fim === */

/* === TOKEN ADM | inicio === */
export function salvarTokenAdm(token: string): void {
  try {
    window.sessionStorage.setItem(CHAVE_TOKEN_ADM, token);
  } catch {
    /* sem armazenamento de sessao disponivel */
  }
}

function lerTokenAdm(): string {
  try {
    return window.sessionStorage.getItem(CHAVE_TOKEN_ADM) ?? '';
  } catch {
    return '';
  }
}
/* === TOKEN ADM | fim === */

/* === API D1 | inicio === */
export async function buscarCenariosPublicados(incluirInativos = false): Promise<CenarioCredenciamento[] | null> {
  try {
    const resposta = await fetch(`${URL_API_CENARIOS}${incluirInativos ? '?incluirInativos=1' : ''}`);
    const tipo = resposta.headers.get('content-type') ?? '';
    if (!resposta.ok || !tipo.includes('application/json')) return null;

    const corpo = (await resposta.json()) as { dados?: unknown };
    return normalizarCenarios(corpo.dados);
  } catch {
    return null;
  }
}

export async function publicarCenarios(cenarios: CenarioCredenciamento[]): Promise<{ sucesso: boolean; mensagem: string }> {
  try {
    const resposta = await fetch(URL_API_CENARIOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hss-adm-token': lerTokenAdm(),
      },
      body: JSON.stringify({ cenarios }),
    });
    const tipo = resposta.headers.get('content-type') ?? '';

    if (resposta.status === 401) {
      return { sucesso: false, mensagem: 'Sessão do ADM expirada. Saia e entre novamente para publicar.' };
    }

    if (!resposta.ok || !tipo.includes('application/json')) {
      return {
        sucesso: false,
        mensagem: 'A API de publicação não respondeu. No ambiente local as alterações valem só neste navegador.',
      };
    }

    return { sucesso: true, mensagem: 'Cenários publicados. O site já usa esta versão para todos os visitantes.' };
  } catch {
    return {
      sucesso: false,
      mensagem: 'Sem conexão com a API de publicação. As alterações continuam salvas neste navegador.',
    };
  }
}
/* === API D1 | fim === */

/* === HOOK DO SITE | inicio === */
// Ordem de prioridade no site: rascunho do ADM neste navegador, versao publicada no D1, cenarios padrao do PDF.
export function useCenariosPublicos(): { cenarios: CenarioCredenciamento[]; origem: OrigemCenarios } {
  const [publicados, definirPublicados] = useState<CenarioCredenciamento[] | null>(null);
  const [rascunho, definirRascunho] = useState<CenarioCredenciamento[] | null>(() => lerRascunhoCenarios());

  useEffect(() => {
    let ativo = true;

    buscarCenariosPublicados().then((dados) => {
      if (ativo) definirPublicados(dados);
    });

    function atualizarRascunho(): void {
      definirRascunho(lerRascunhoCenarios());
    }

    function aoMudarArmazenamento(evento: StorageEvent): void {
      if (evento.key === CHAVE_RASCUNHO_CENARIOS) atualizarRascunho();
    }

    window.addEventListener(EVENTO_CENARIOS_ATUALIZADOS, atualizarRascunho);
    window.addEventListener('storage', aoMudarArmazenamento);

    return () => {
      ativo = false;
      window.removeEventListener(EVENTO_CENARIOS_ATUALIZADOS, atualizarRascunho);
      window.removeEventListener('storage', aoMudarArmazenamento);
    };
  }, []);

  if (rascunho) return { cenarios: rascunho, origem: 'rascunho' };
  if (publicados) return { cenarios: publicados, origem: 'publicado' };
  return { cenarios: CENARIOS_PADRAO, origem: 'padrao' };
}
/* === HOOK DO SITE | fim === */
