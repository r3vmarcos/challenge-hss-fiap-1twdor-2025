# Validação Final

## Status

Validação em atualização para a versão v6.5, com calculadora compacta, header oculto no modo travado e inventário dos textos visíveis do site.

## Checklist Técnico

01 - `npm install`: aprovado.
02 - `npm run dev`: aprovado na porta 5196.
03 - Teste HTTP local em `http://localhost:5196/`: aprovado com HTTP 200.
04 - `npm run build`: aprovado.
05 - Git local: aprovado com repositório inicializado em `main`.
06 - GitHub remoto: aprovado em `https://github.com/r3vmarcos/hssfiap-chalange-1twdor-2025`.
07 - Cloudflare Pages: aprovado em `https://hssfiap-chalange-1twdor-2025.pages.dev/`.
08 - Revisão de codificação nos arquivos alterados: aprovada.
09 - Build após ajustes visuais da v6.2: aprovado.
10 - Build após scrollytelling final, footer modal e calculadora em 100vh: aprovado.
11 - Limpeza de código não utilizado da v6.3: aprovada.
12 - Build após revisão de fluidez e ortografia da v6.3: aprovado.
13 - Build após ajustes visuais e mapa do site da v6.4: aprovado.
14 - Build após compactação da calculadora e documentação de textos da v6.5: aprovado.

## Observações

01 - Porta mantida em `5196`, conforme `config/servidor_dev.env` e scripts do projeto.
02 - Nome Cloudflare configurado em `wrangler.toml`: `hssfiap-chalange-1twdor-2025`.
03 - `node_modules` e `dist` foram protegidos no `.gitignore`.
04 - O primeiro deploy retornou projeto inexistente; o projeto Pages foi criado e o deploy foi repetido com sucesso.
