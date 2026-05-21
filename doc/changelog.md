# Changelog

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
