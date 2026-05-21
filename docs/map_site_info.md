# Mapa de Informações do Site

Este arquivo indica onde encontrar e modificar cada área da landing page, do painel ADM e dos dados exibidos no site.

## Estrutura Geral

| Parte do site | Arquivo principal | O que alterar |
| --- | --- | --- |
| Aplicação e troca Landing/ADM | [App.tsx](../src/App.tsx) | Renderização geral, hash `#adm`, estado global visual e escolha da página. |
| Página pública | [pagina-landing.tsx](../src/components/paginas/pagina-landing.tsx) | Ordem das seções da landing. |
| Página ADM | [pagina-adm.tsx](../src/components/paginas/pagina-adm.tsx) | Composição da tela administrativa. |
| Estilos globais | [index.css](../src/index.css) | Fonte, scrollbar, animações globais, parallax, botões shimmer e estilos compartilhados. |
| Tema Tailwind | [tailwind.config.ts](../tailwind.config.ts) | Cores HSS, sombras, animações e tokens do Tailwind. |

## Cabeçalho

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Header completo | [cabecalho.tsx](../src/components/cabecalho.tsx) | Logo, links, botão "Agendar demonstração", botão Portal ADM e navegação mobile. |
| Logo alternado HSS/FIAP | [logo-origami.tsx](../src/components/ui/logo-origami.tsx) | Alternância dos logos, tempos de exibição e imagem ativa. |
| Imagens dos logos | [logo-health-sync-solutions.png](../src/assets/logo-health-sync-solutions.png), [logo-fiap.png](../src/assets/logo-fiap.png) | Troca dos arquivos de marca. |
| Efeito dos botões do header | [shimmer-button.tsx](../src/components/ui/shimmer-button.tsx), [index.css](../src/index.css) | Componente e CSS do efeito circulando. |
| Menu A11y | [menu-acessibilidade.tsx](../src/components/menu-acessibilidade.tsx), [index.css](../src/index.css) | Alto contraste, fonte, tamanho, espaçamento, cursor, daltonismo e leitura por hover. |

## Hero

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Primeira dobra | [hero-hss.tsx](../src/components/hero-hss.tsx) | Título, subtítulo, métricas, CTAs, foto da médica e fundo azul claro. |
| Foto da médica | [medica-hero-hss.png](../src/assets/medica-hero-hss.png) | Imagem principal do hero. |
| Parallax de fundo | [camadas-parallax.tsx](../src/components/camadas-parallax.tsx) | Camadas visuais, profundidade e movimento do fundo. |
| Dados base do hero | [dadosLanding.ts](../src/data/dadosLanding.ts) | Métricas e dados institucionais usados na landing. |

## Benefícios

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Seção "Benefícios da nossa solução" | [secao-solucao.tsx](../src/components/secao-solucao.tsx) | Texto fixo, cards 01 a 06, travamento na tela e ritmo de aparecimento no scroll. |
| Cards de benefícios | [secao-solucao.tsx](../src/components/secao-solucao.tsx) | Array `beneficios`, títulos, descrições, ícones e ordem dos cards. |

## Como Funciona

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Seção "Como funciona?" | [secao-como-funciona.tsx](../src/components/secoes/secao-como-funciona.tsx) | Texto da seção, layout e cards do processo. |
| Etapas do processo | [dadosLanding.ts](../src/data/dadosLanding.ts) | Array `etapasProcesso`, títulos e descrições das etapas. |
| Card com spotlight | [card-spotlight.tsx](../src/components/ui/card-spotlight.tsx) | Efeito visual dos cards. |

## Processo Comparativo

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Seção completa Sem HSS / Com HSS | [secao-processo-comparativo.tsx](../src/components/secoes/secao-processo-comparativo.tsx) | Layout sticky, cores, lados dos textos/cards, títulos e destaque progressivo. |
| Textos dos cards "Sem HSS" | [dadosLanding.ts](../src/data/dadosLanding.ts) | Array `problemasSemHss`. |
| Textos informativos "Sem HSS" | [dadosLanding.ts](../src/data/dadosLanding.ts) | Array `informacoesSemHss`. |
| Textos dos cards "Com HSS" | [dadosLanding.ts](../src/data/dadosLanding.ts) | Array `ganhosComHss`. |
| Textos informativos "Com HSS" | [dadosLanding.ts](../src/data/dadosLanding.ts) | Array `informacoesComHss`. |
| Comparativo no mobile | [secao-processo-comparativo.tsx](../src/components/secoes/secao-processo-comparativo.tsx) | Renderiza apenas os arrays informativos no layout compacto. |

## Depoimentos

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Seção "Depoimentos" | [secao-depoimentos.tsx](../src/components/secoes/secao-depoimentos.tsx) | Layout da seção e marquee. |
| Lista de depoimentos | [dadosLanding.ts](../src/data/dadosLanding.ts) | Array `depoimentos`, nomes, cargos, cores e textos. |
| Movimento marquee | [marquee.tsx](../src/components/ui/marquee.tsx), [index.css](../src/index.css) | Velocidade, direção e repetição dos depoimentos. |

## Diferencial ADM

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Seção "Diferencial" | [secao-diferencial-adm.tsx](../src/components/secoes/secao-diferencial-adm.tsx) | Cards do ADM, chamada visual e conteúdo explicativo. |
| Configurações base do ADM | [configuracoesCredenciamento.ts](../src/data/configuracoesCredenciamento.ts) | Cenários padrão, tempos, custos, percentuais e status ativo/inativo. |

## Calculadora ROI

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Calculadora pública | [calculadora-roi.tsx](../src/components/calculadora/calculadora-roi.tsx) | Layout, botão de travar, bloqueio de rolagem, abas, etapas, resumo e composição visual. |
| Campos numéricos | [campo-numerico.tsx](../src/components/calculadora/campo-numerico.tsx) | Componente de input numérico reutilizável. |
| Cards de resultado | [cartao-resultado.tsx](../src/components/calculadora/cartao-resultado.tsx) | Visual dos KPIs da calculadora. |
| Regras de cálculo | [calculosRoi.ts](../src/services/calculosRoi.ts) | Fórmulas de ROI, payback, receita antecipada, economia e formatação. |
| Tipos da calculadora | [calculadora.ts](../src/types/calculadora.ts) | Interfaces e tipos dos dados de entrada, cenários e resultados. |
| Configurações do ADM | [configuracoesCredenciamento.ts](../src/data/configuracoesCredenciamento.ts) | Premissas que alimentam a calculadora pública. |

## Formulário e Leads

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Formulário de contato | [formulario-lead.tsx](../src/components/formulario-lead.tsx) | Campos, textos, CTA e payload local. |
| API de leads Cloudflare | [leads.js](../functions/api/leads.js) | Endpoint preparado para gravação de leads. |

## Footer

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Rodapé completo | [rodape.tsx](../src/components/layout/rodape.tsx) | Logos, grupos HSS/FIAP, ícones sociais, direitos reservados e modal de fontes. |
| Fontes e referências | [conteudoHss.ts](../src/data/conteudoHss.ts) | Array `fontesConsultadas` exibido no modal. |

## Painel ADM

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Painel de credenciamento | [painel-adm-credenciamento.tsx](../src/components/admin/painel-adm-credenciamento.tsx) | CRUD visual de cenários, tempos, custos, percentuais e ativação. |
| Persistência local | [useLocalStorage.ts](../src/hooks/useLocalStorage.ts) | Hook usado para manter dados no navegador. |
| API de configurações | [configuracoes-credenciamento.js](../functions/api/configuracoes-credenciamento.js) | Endpoint Cloudflare preparado para configurações do ADM. |
| API de simulações | [simulacoes-roi.js](../functions/api/simulacoes-roi.js) | Endpoint Cloudflare preparado para simulações de ROI. |
| Banco D1 | [migrations](../migrations) | Estrutura de banco preparada para produção. |

## Deploy e Configuração

| Elemento | Arquivo | O que alterar |
| --- | --- | --- |
| Cloudflare Pages | [wrangler.toml](../wrangler.toml) | Nome do projeto Pages, diretório `dist` e binding D1. |
| Scripts npm | [package.json](../package.json) | Comandos de dev, build, preview, deploy e migrations D1. |
| Porta local | [servidor_dev.env](../config/servidor_dev.env) | Porta usada no desenvolvimento local. |
| Validação da entrega | [validacao_final.md](../doc/validacao_final.md) | Checklist técnico da última validação. |
| Histórico de mudanças | [changelog.md](../doc/changelog.md) | Registro das alterações por versão. |
