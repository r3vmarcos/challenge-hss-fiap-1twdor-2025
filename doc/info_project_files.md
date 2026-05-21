# Info Project Files

## Arquivos Críticos

- [`src/main.tsx`](../src/main.tsx) -> inicializa o React no DOM.
- [`src/App.tsx`](../src/App.tsx) -> orquestra layout, hash `#adm`, hooks visuais e seleção da página.
- [`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts) -> concentra dados do hero, processo e depoimentos da landing.
- [`src/data/configuracoesCredenciamento.ts`](../src/data/configuracoesCredenciamento.ts) -> base padrão dos cenários do ADM.
- [`src/services/calculosRoi.ts`](../src/services/calculosRoi.ts) -> regras de cálculo de ROI, payback, receita antecipada e prejuízo evitado.
- [`src/components/calculadora/calculadora-roi.tsx`](../src/components/calculadora/calculadora-roi.tsx) -> calculadora pública por etapas e cenários ativos.
- [`src/components/admin/painel-adm-credenciamento.tsx`](../src/components/admin/painel-adm-credenciamento.tsx) -> painel administrativo de cenários, tempos, custos e percentuais.
- [`wrangler.toml`](../wrangler.toml) -> configuração Cloudflare Pages e D1.

## Páginas

- [`src/components/paginas/pagina-landing.tsx`](../src/components/paginas/pagina-landing.tsx) -> composição da landing pública.
- [`src/components/paginas/pagina-adm.tsx`](../src/components/paginas/pagina-adm.tsx) -> tela do painel ADM.

## Layout

- [`src/components/cabecalho.tsx`](../src/components/cabecalho.tsx) -> cabeçalho com navegação e CTA.
- [`src/components/layout/rodape.tsx`](../src/components/layout/rodape.tsx) -> rodapé com fontes e referências.
- [`src/components/camadas-parallax.tsx`](../src/components/camadas-parallax.tsx) -> camadas de fundo com parallax.

## Seções Da Landing

- [`src/components/hero-hss.tsx`](../src/components/hero-hss.tsx) -> primeira dobra com métricas e CTA.
- [`src/components/secao-solucao.tsx`](../src/components/secao-solucao.tsx) -> benefícios da solução.
- [`src/components/secoes/secao-como-funciona.tsx`](../src/components/secoes/secao-como-funciona.tsx) -> etapas do credenciamento.
- [`src/components/secoes/secao-processo-comparativo.tsx`](../src/components/secoes/secao-processo-comparativo.tsx) -> comparação sem HSS x com HSS.
- [`src/components/secoes/secao-depoimentos.tsx`](../src/components/secoes/secao-depoimentos.tsx) -> depoimentos em marquee.
- [`src/components/secoes/secao-diferencial-adm.tsx`](../src/components/secoes/secao-diferencial-adm.tsx) -> diferencial do ADM.
- [`src/components/formulario-lead.tsx`](../src/components/formulario-lead.tsx) -> formulário de contato e demonstração.

## UI Reutilizável

- [`src/components/ui/shimmer-button.tsx`](../src/components/ui/shimmer-button.tsx) -> botão com efeito shimmer.
- [`src/components/ui/card-spotlight.tsx`](../src/components/ui/card-spotlight.tsx) -> card com spotlight.
- [`src/components/ui/marquee.tsx`](../src/components/ui/marquee.tsx) -> marquee horizontal.
- [`src/components/ui/number-ticker.tsx`](../src/components/ui/number-ticker.tsx) -> contador animado.
- [`src/components/ui/logo-origami.tsx`](../src/components/ui/logo-origami.tsx) -> alternância animada dos logos HSS/FIAP no cabeçalho.

## Cloudflare

- [`functions/api/leads.js`](../functions/api/leads.js) -> endpoint de leads.
- [`functions/api/configuracoes-credenciamento.js`](../functions/api/configuracoes-credenciamento.js) -> endpoint de configurações do ADM.
- [`functions/api/simulacoes-roi.js`](../functions/api/simulacoes-roi.js) -> endpoint de simulações.
- [`migrations/`](../migrations) -> migrations D1 preparadas.

## Documentação

- [`README.md`](../README.md) -> visão geral e instruções GitHub.
- [`docs/map_site_info.md`](../docs/map_site_info.md) -> mapa de onde modificar cada parte e dado do site.
- [`doc/changelog.md`](./changelog.md) -> histórico de mudanças.
- [`doc/validacao_final.md`](./validacao_final.md) -> validação técnica da entrega.
- [`prompts.md`](../prompts.md) -> histórico do pedido aplicado.
