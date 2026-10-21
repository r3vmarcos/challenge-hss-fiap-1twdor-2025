import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import tls from 'node:tls';
import react from '@vitejs/plugin-react';
import { defineConfig, type Connect, type Plugin } from 'vite';
import { montarTentativasGemini, tratarRequisicaoIaCenario, type TentativaGemini } from './servidor/gemini-cenario.js';

/* === CERTIFICADOS DO SISTEMA | inicio === */
// Antivirus/proxy corporativo pode interceptar HTTPS com um certificado que so o Windows conhece;
// sem isso o fetch ao Gemini falha com UNABLE_TO_GET_ISSUER_CERT_LOCALLY. Recursos do Node 22.19+/24.5+,
// por isso a deteccao em tempo de execucao (os tipos instalados podem nao declarar as funcoes).
type TlsComCertificados = typeof tls & {
  getCACertificates?: (tipo: 'default' | 'system') => string[];
  setDefaultCACertificates?: (certificados: string[]) => void;
};

function confiarCertificadosDoSistema(): void {
  const modulo = tls as TlsComCertificados;
  if (!modulo.getCACertificates || !modulo.setDefaultCACertificates) return;

  try {
    modulo.setDefaultCACertificates([...modulo.getCACertificates('default'), ...modulo.getCACertificates('system')]);
  } catch {
    /* mantem os certificados padrao do Node */
  }
}
/* === CERTIFICADOS DO SISTEMA | fim === */

/* === CHAVE DO GEMINI LOCAL | inicio === */
// Lido a cada requisicao: editar config/gemini.env vale sem reiniciar o servidor.
const ARQUIVO_GEMINI = path.resolve(__dirname, 'config/gemini.env');

function lerTentativasGemini(): TentativaGemini[] {
  const valores: Record<string, string | undefined> = { ...process.env };

  try {
    fs.readFileSync(ARQUIVO_GEMINI, 'utf8')
      .split(/\r?\n/)
      .forEach((linha) => {
        const limpa = linha.trim();
        if (!limpa || limpa.startsWith('#') || !limpa.includes('=')) return;
        const [chave, ...resto] = limpa.split('=');
        valores[chave.trim()] = resto.join('=').trim().replace(/^["']|["']$/g, '');
      });
  } catch {
    /* sem arquivo: usa variaveis de ambiente */
  }

  return montarTentativasGemini(valores);
}
/* === CHAVE DO GEMINI LOCAL | fim === */

/* === MIDDLEWARE DA IA LOCAL | inicio === */
// Reproduz no `npm run dev` e no `npm run preview` a Pages Function functions/api/ia-cenario.js.
async function atenderIaLocal(requisicao: IncomingMessage, resposta: ServerResponse): Promise<void> {
  const partes: Buffer[] = [];
  for await (const parte of requisicao) partes.push(parte as Buffer);

  const metodo = requisicao.method ?? 'GET';
  const respostaWeb = await tratarRequisicaoIaCenario(
    new Request('http://localhost/api/ia-cenario', {
      method: metodo,
      headers: { 'content-type': String(requisicao.headers['content-type'] ?? 'application/json') },
      body: metodo === 'GET' || metodo === 'HEAD' ? undefined : Buffer.concat(partes).toString('utf8'),
    }),
    { tentativas: lerTentativasGemini() },
  );

  resposta.statusCode = respostaWeb.status;
  respostaWeb.headers.forEach((valor, nome) => resposta.setHeader(nome, valor));
  resposta.end(await respostaWeb.text());
}

function registrarIaLocal(middlewares: Connect.Server): void {
  confiarCertificadosDoSistema();
  middlewares.use('/api/ia-cenario', (requisicao, resposta) => {
    atenderIaLocal(requisicao, resposta).catch(() => {
      resposta.statusCode = 500;
      resposta.setHeader('content-type', 'application/json; charset=utf-8');
      resposta.end(JSON.stringify({ sucesso: false, erro: 'Erro interno da IA local.' }));
    });
  });
}

function pluginIaLocal(): Plugin {
  return {
    name: 'hss-ia-local',
    configureServer(servidor) {
      registrarIaLocal(servidor.middlewares);
    },
    configurePreviewServer(servidor) {
      registrarIaLocal(servidor.middlewares);
    },
  };
}
/* === MIDDLEWARE DA IA LOCAL | fim === */

/* === CONFIGURACAO DO VITE | inicio === */
export default defineConfig({
  plugins: [react(), pluginIaLocal()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: 'localhost',
    port: 5196,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 250,
    },
  },
});
/* === CONFIGURACAO DO VITE | fim === */
