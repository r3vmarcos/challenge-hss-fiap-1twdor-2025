# Validação Final

## Status

Validação atualizada para a versão v6.14, com reforço responsivo em celulares e ajuste do menu A11y mobile.

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
15 - Build após responsivo tablet/mobile e menu A11y da v6.6: aprovado.
16 - Build após ajustes finais A11y/mobile/tablet da v6.7: aprovado.
17 - Build após header mobile, A11y temporizado e modal compacto da v6.8: aprovado.
18 - Smoke HTTP local após v6.8 em `http://localhost:5196/`: aprovado com HTTP 200.
19 - `npm install` após ajuste v6.9: aprovado, sem vulnerabilidades.
20 - `npm run build` após ajuste v6.9: aprovado.
21 - Smoke HTTP local após v6.9 em `http://localhost:5196/`: aprovado com HTTP 200 usando o Vite já aberto na porta 5196 deste projeto.
22 - `npm install` após ajuste v6.10: aprovado, sem vulnerabilidades.
23 - `npm run build` após ajuste v6.10: aprovado.
24 - Smoke HTTP local após v6.10 em `http://localhost:5196/`: aprovado com HTTP 200 usando o Vite já aberto na porta 5196 deste projeto.
25 - Commit local após v6.10: aprovado em `89d5145`.
26 - Push para GitHub `origin/main`: aprovado.
27 - Deploy Cloudflare Pages após v6.10: aprovado com `npx wrangler pages deploy dist`.
28 - Smoke HTTP remoto no preview `https://08d4f79d.hssfiap-chalange-1twdor-2025.pages.dev`: aprovado com HTTP 200.
29 - Smoke HTTP remoto em `https://hssfiap-chalange-1twdor-2025.pages.dev/`: aprovado com HTTP 200.
30 - Busca pelos textos removidos após v6.11: aprovada, sem ocorrências atuais.
31 - `npm install` após ajuste v6.11: aprovado, sem vulnerabilidades.
32 - `npm run build` após ajuste v6.11: aprovado.
33 - Smoke HTTP local após v6.11 em `http://localhost:5196/`: aprovado com HTTP 200.
34 - `npm run build` após ajuste v6.12: aprovado.
35 - Smoke HTTP local após v6.12 em `http://localhost:5196/`: aprovado com HTTP 200.
36 - `npm install` após ajuste v6.12: aprovado, sem vulnerabilidades.
37 - Revalidação após reconectar o drive E: `npm install`: aprovado, sem vulnerabilidades.
38 - Revalidação após reconectar o drive E: `npm run build`: aprovado.
39 - Revalidação após reconectar o drive E: smoke HTTP local em `http://localhost:5196/`: aprovado com HTTP 200.
40 - Commit local após ajustes v6.11/v6.12: aprovado em `ccc3157`.
41 - Push para GitHub `origin/main`: aprovado.
42 - Deploy Cloudflare Pages após v6.12: aprovado com `npx wrangler pages deploy dist`.
43 - Smoke HTTP remoto no preview `https://6f98c646.hssfiap-chalange-1twdor-2025.pages.dev`: aprovado com HTTP 200.
44 - Smoke HTTP remoto em `https://hssfiap-chalange-1twdor-2025.pages.dev/`: aprovado com HTTP 200.
45 - `npm run build` após reforço responsivo v6.13: aprovado.
46 - Smoke HTTP local após reforço responsivo v6.13 em `http://localhost:5196/`: aprovado com HTTP 200.
47 - `npm run build` após ajuste A11y mobile v6.14: aprovado.
48 - Smoke HTTP local após ajuste A11y mobile v6.14 em `http://localhost:5196/`: aprovado com HTTP 200.

## Observações

01 - Porta mantida em `5196`, conforme `config/servidor_dev.env` e scripts do projeto.
02 - Nome Cloudflare configurado em `wrangler.toml`: `hssfiap-chalange-1twdor-2025`.
03 - `node_modules` e `dist` foram protegidos no `.gitignore`.
04 - O primeiro deploy retornou projeto inexistente; o projeto Pages foi criado e o deploy foi repetido com sucesso.
05 - O script `npm run wrangler:deploy` executou o build, mas o deploy falhou porque `wrangler` não estava no PATH do terminal; a publicação foi concluída com `npx wrangler pages deploy dist`.
