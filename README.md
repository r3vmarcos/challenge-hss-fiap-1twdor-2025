# Health Sync Solutions - Calculadora ROI Médico/Hospital

Landing page React para o MedTech Challenge FIAP da Health Sync Solutions. O projeto apresenta o fluxo de credenciamento médico, compara o processo tradicional com o fluxo digital da HSS e oferece uma calculadora pública de ROI por cenários configuráveis no ADM.

## Página Publicada

https://hssfiap-chalange-1twdor-2025.pages.dev/

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-f38020)

## Sumário

- [Página Publicada](#página-publicada)
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Estrutura](#estrutura)
- [Como Rodar](#como-rodar)
- [Scripts](#scripts)
- [Cloudflare](#cloudflare)
- [Documentação](#documentação)
- [Melhorias Sugeridas](#melhorias-sugeridas)

## Visão Geral

O sistema ajuda hospitais, clínicas, empresas e médicos a estimarem o impacto financeiro de reduzir o tempo de credenciamento. O ROI considera tempo sem HSS x tempo com HSS, receita antecipada, economia administrativa, retrabalho, glosas, custos de implantação e mensalidade.

O painel ADM controla os tipos de credenciamento, tempos, custos, percentuais e status ativo/inativo. A calculadora pública usa somente os cenários ativos.

## Funcionalidades

- Landing light baseada na referência visual do Figma.
- Hero com métricas animadas e imagem institucional.
- Seções independentes para benefícios, processo, depoimentos, diferencial ADM, calculadora e formulário.
- Scrollytelling com seções fixas para benefícios, comparação sem HSS/com HSS e calculadora em tela cheia.
- Layout responsivo para PC/notebook, tablet e mobile.
- Menu global de acessibilidade com contraste, fonte, espaçamento, cursor, daltonismo e leitura por hover.
- Calculadora de ROI para empresa/hospital/clínica e médico.
- Painel ADM por hash em `/#adm`.
- Persistência local por `localStorage`.
- Cloudflare Pages Functions e D1 preparados em `functions/` e `migrations/`.
- Deploy publicado no Cloudflare Pages.

## Stack

- React 18
- Vite 6
- TypeScript
- Tailwind CSS
- Cloudflare Pages Functions
- Cloudflare D1

## Estrutura

```txt
src/
  components/
    admin/
    calculadora/
    layout/
    paginas/
    secoes/
    ui/
  data/
  hooks/
  services/
  types/
functions/api/
migrations/
doc/
config/
```

## Como Rodar

```bash
npm install
npm run dev
```

Acesse:

```txt
http://localhost:5196/
```

O painel ADM fica em:

```txt
http://localhost:5196/#adm
```

## Scripts

```bash
npm run dev
npm run dev:rede
npm run build
npm run preview
npm run wrangler:deploy
npm run d1:migrar:local
npm run d1:migrar:remoto
```

## Cloudflare

Projeto configurado em `wrangler.toml`:

```txt
hssfiap-chalange-1twdor-2025
```

Deploy:

```bash
npm run wrangler:deploy
```

## Documentação

- [`doc/changelog.md`](doc/changelog.md)
- [`doc/info_project_files.md`](doc/info_project_files.md)
- [`doc/validacao_final.md`](doc/validacao_final.md)
- [`docs/map_site_info.md`](docs/map_site_info.md)
- [`prompts.md`](prompts.md)

## Melhorias Sugeridas

- Adicionar autenticação real ao painel ADM.
- Gravar leads, configurações e simulações no D1 em produção.
- Exportar simulações em PDF.
- Criar dashboard comercial para leads e histórico de ROI.
- Adicionar testes automatizados para cálculos e fluxos principais.
