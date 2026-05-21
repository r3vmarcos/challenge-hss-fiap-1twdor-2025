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

