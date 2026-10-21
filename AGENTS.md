# AGENTS.md

## 01 - Contexto do projeto

Projeto React + Vite + TypeScript + Tailwind da Health Sync Solutions para o MedTech Challenge FIAP. A landing apresenta o processo de credenciamento médico, compara o fluxo tradicional sem HSS com o fluxo digital com HSS e oferece uma calculadora de ROI por cenários.

## 02 - Regras técnicas

01 - Manter código em pt-BR.  
02 - Manter comentários em blocos delimitados no padrão `=== NOME DO BLOCO | inicio ===` e `=== NOME DO BLOCO | fim ===`.  
03 - Usar React + Vite + TypeScript + Tailwind.  
04 - Manter alias `@/`.  
05 - Não incluir `node_modules` nem `dist` no ZIP final.  
06 - Validar `npm install`, `npm run dev`, teste HTTP local e `npm run build` antes de entregar.  
07 - Manter porta atual do projeto em `config/servidor_dev.env` e scripts `.bat`.  
08 - Atualizar `README.md`, `doc/changelog.md`, `doc/info_project_files.md`, `doc/validacao_final.md` e `prompts.md` quando houver mudanças.

## 03 - Regras de produto

01 - A landing atual deve seguir visual light baseado no Figma enviado.  
02 - O painel ADM controla tipos de credenciamento, tempos, custos, percentuais e campo ativo/desativo.  
03 - A calculadora pública deve usar apenas cenários ativos do ADM.  
04 - O ROI deve considerar tempo sem HSS x tempo com HSS.  
05 - Manter cenários para empresa/hospital/clínica e médico.  
06 - Não remover a lógica de Cloudflare Pages Functions e D1 preparada.  
07 - A calculadora tem três tipos (médico, corporativo e carreira): médico e corporativo em dois passos; carreira em três (formação, gastos do curso, atendimentos), com o ganho líquido calculado dos atendimentos. Cenários vêm do ADM: rascunho local em `localStorage` e publicação na tabela D1 `cenarios_credenciamento` via `/api/cenarios-credenciamento`.  
08 - A IA de cenários usa Gemini por `/api/ia-cenario`; a chave fica só no servidor (`config/gemini.env` local, ignorado pelo Git, e secrets no Cloudflare). Nunca expor a chave no front-end.  
09 - Visual da calculadora e do ADM segue este projeto: bordas `hss-violeta/15`, cantos maiores, campos `#f3f4f6` com anel `hss-lavanda/30`, botões em pílula, sem HSS em laranja `#f97316` e com HSS em teal `#079879` (texto nessas cores usa `#c2410c`/`#075f50`). A régua do resultado é o único destaque; elevação/neon no hover só no botão principal; arredondamento por profundidade (caixa 22 px, painéis 16 px, campos 12 px); texto mínimo de 13 px.

