/* === PUBLICAR CHAVE DO GEMINI NO CLOUDFLARE | inicio === */
// Le config/gemini.env e grava a chave principal, os modelos e as reservas como secrets do Cloudflare Pages.
// A chave vai pelo stdin do wrangler: nao aparece no terminal nem no historico.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arquivo = path.join(raiz, 'config', 'gemini.env');
// HSS_PAGES_PROJETO permite publicar em outro projeto do Pages sem mudar o wrangler.toml.
const projeto = process.env.HSS_PAGES_PROJETO || (fs.readFileSync(path.join(raiz, 'wrangler.toml'), 'utf8').match(/^name\s*=\s*"([^"]+)"/m) ?? [])[1];

function lerValores() {
  if (!fs.existsSync(arquivo)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(arquivo, 'utf8')
      .split(/\r?\n/)
      .map((linha) => linha.trim())
      .filter((linha) => linha && !linha.startsWith('#') && linha.includes('='))
      .map((linha) => {
        const [chave, ...resto] = linha.split('=');
        return [chave.trim(), resto.join('=').trim().replace(/^["']|["']$/g, '')];
      }),
  );
}

function gravarSecret(nome, valor) {
  return new Promise((resolver, rejeitar) => {
    const processo = spawn('npx', ['wrangler', 'pages', 'secret', 'put', nome, '--project-name', projeto], {
      cwd: raiz,
      shell: true,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
    processo.stdin.end(valor);
    processo.on('close', (codigo) => (codigo === 0 ? resolver() : rejeitar(new Error(`wrangler terminou com código ${codigo}`))));
  });
}

const valores = lerValores();

if (!valores.GEMINI_API_KEY) {
  console.error('Preencha GEMINI_API_KEY em config/gemini.env antes de publicar.');
  process.exit(1);
}

if (!projeto) {
  console.error('Não encontrei o nome do projeto em wrangler.toml.');
  process.exit(1);
}

// Principal e reservas (_2 a _9), na mesma convencao lida por montarTentativasGemini.
const nomes = Object.keys(valores).filter((nome) => /^GEMINI_(API_KEY|MODELO)(_[2-9])?$/.test(nome) && valores[nome]);

try {
  for (const nome of nomes) await gravarSecret(nome, valores[nome]);
  console.log(`Secrets gravados no projeto ${projeto}: ${nomes.join(', ')}. Faça um novo deploy para valer no site.`);
} catch (erro) {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
}
/* === PUBLICAR CHAVE DO GEMINI NO CLOUDFLARE | fim === */
