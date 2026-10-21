/* === API DE IA PARA CENARIOS | inicio === */
// Remoto (Cloudflare Pages): chaves e modelos vem dos secrets GEMINI_API_KEY, GEMINI_MODELO e reservas _2, _3...
// enviados com `npm run ia:publicar-chave`.
import { montarTentativasGemini, tratarRequisicaoIaCenario } from '../../servidor/gemini-cenario.js';

export async function onRequest(contexto) {
  return tratarRequisicaoIaCenario(contexto.request, { tentativas: montarTentativasGemini(contexto.env) });
}
/* === API DE IA PARA CENARIOS | fim === */
