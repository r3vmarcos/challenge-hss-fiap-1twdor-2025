# Changelog

## v6.3 - Revisão de fluidez, limpeza e deploy

01 - Revisada a fluidez das seções sticky de benefícios, processo tradicional, processo digital e calculadora.
02 - Removidos componente de alternância de tema e reexport legado de scrollytelling que não eram mais utilizados.
03 - Removidos exports institucionais sem consumo em `src/data/conteudoHss.ts`, mantendo apenas as fontes usadas no rodapé.
04 - Removido import não utilizado em `src/components/secoes/secao-como-funciona.tsx`.
05 - Padronizados comentários da seção comparativa no formato delimitado do projeto.
06 - Removido BOM invisível de `src/components/secao-solucao.tsx`.
07 - Revisada ortografia pt-BR nos textos ativos da landing, ADM, rodapé e calculadora.
08 - Adicionado `*.zip` ao `.gitignore` para evitar publicar pacotes locais gerados.
09 - Validado build de produção e republicado GitHub/Cloudflare.

## v6.1 - Componentização, revisão pt-BR e deploy

01 - Separado o `App.tsx` para atuar apenas como orquestrador de layout, páginas e navegação por hash.
02 - Criadas páginas dedicadas em `src/components/paginas/` para landing e ADM.
03 - Criado rodapé dedicado em `src/components/layout/rodape.tsx`.
04 - Separadas as seções de narrativa em `src/components/secoes/`: como funciona, processo comparativo, depoimentos e diferencial ADM.
05 - Movidos dados da landing e métricas base do hero para `src/data/dadosLanding.ts`.
06 - Mantido `src/components/secao-scrollytelling.tsx` como arquivo de reexportação para compatibilidade.
07 - Revisada a acentuação global em pt-BR após correção de mojibake.
08 - Atualizado `README.md` no padrão GitHub.
09 - Atualizado `wrangler.toml` com o projeto Cloudflare `hssfiap-chalange-1twdor-2025`.
10 - Registradas melhorias sugeridas para próximas versões.
11 - Ajustado hero para reduzir o título, alinhar a médica ao fundo azul claro e aplicar degradê transparente na imagem.
12 - Congelado o header no topo e suavizado o peso dos links de navegação.
13 - Adicionado logo origami alternando HSS por 5s e FIAP por 2s.
14 - Reposicionado o fundo azul claro do hero para ficar entre parallax e médica.
15 - Ajustada a calculadora para ocupar a tela e encaixar magneticamente ao atingir 50% de visibilidade.
16 - Centralizados os logos alternados no header.
17 - Criado footer com logos HSS/FIAP, botões sociais e direitos reservados.
18 - Transformada a seção de benefícios em scrollytelling com cards surgindo na ordem 1 a 6.
19 - Removido CTA intermediário de agendamento na seção de benefícios.
20 - Transformadas as seções Sem HSS e Com HSS em blocos sticky de 90vh com destaque progressivo por etapa.
21 - Ajustado o tempo de travamento das seções sticky para liberar o scroll apenas após todos os cards/etapas carregarem.
22 - Compactada a calculadora para ocupar 100vh com rolagem interna nos painéis.
23 - Atualizado footer com grupos sociais separados para HSS e FIAP e modal de fontes.
24 - Ajustado o scrollytelling de benefícios para iniciar apenas com texto fixo e revelar os cards 01 a 06 durante o scroll.
25 - Reposicionada a seção de benefícios como palco fixo em tela cheia, mantendo texto centralizado e cards entrando à direita.

## v6 - Ajustes finais da landing light Figma + componentes animados

01 - Aplicada fonte global Lexend/Lexand em todo o projeto.
02 - Hero ajustado para ficar fiel ao layout do Figma, evitando sobreposição entre texto e imagem.
03 - Atualizada a imagem real da médica no hero.
04 - Reativadas camadas de parallax do padrão v4, distribuídas em 100vw x 100vh.
05 - Botões "Agendar demonstração" e "Calcular ROI" atualizados com efeito shimmer.
06 - Cards da seção "Etapas do processo de credenciamento" atualizados com efeito card spotlight.
07 - Seções "Sem HSS - processo tradicional" e "Com HSS - processo digital" reorganizadas no modelo scrollytelling.
08 - Depoimentos substituídos por marquee horizontal de linha única, com 15 depoimentos e sem barra de scroll.
09 - Cards do diferencial ADM atualizados com efeito card spotlight.
10 - Números principais do hero atualizados com animação NumberTicker: 33+, 73% e R$ 504.000.
11 - Campo "Tipo de cenário configurado no ADM" reorganizado em uma linha no PC/notebook.
12 - Porta local atualizada para 5196.
