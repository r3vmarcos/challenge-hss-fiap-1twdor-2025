# Health Sync Solutions (HSS)

## Plataforma de Credenciamento Médico e Simulação de ROI

Landing page desenvolvida em React para o MedTech Challenge FIAP da Health Sync Solutions. O projeto apresenta o fluxo de credenciamento médico/hospitalar, compara o processo
tradicional com o fluxo digital da HSS e disponibiliza uma calculadora pública de ROI baseada em cenários configuráveis pelo painel administrativo.

## Página Publicada

https://hssfiap-chalange-1twdor-2025.pages.dev/

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8) ![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-f38020)

---

## Sumário

- [Health Sync Solutions (HSS)](#health-sync-solutions-hss)
  - [Plataforma de Credenciamento Médico e Simulação de ROI](#plataforma-de-credenciamento-médico-e-simulação-de-roi)
  - [Página Publicada](#página-publicada)
  - [Sumário](#sumário)
  - [Visão Geral](#visão-geral)
  - [Arquitetura](#arquitetura)
  - [Funcionalidades](#funcionalidades)
  - [Diferenciais Técnicos](#diferenciais-técnicos)
  - [Stack](#stack)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Estrutura Técnica](#estrutura-técnica)
  - [Principais Arquivos](#principais-arquivos)
  - [Como Rodar](#como-rodar)
  - [Scripts](#scripts)
  - [Cloudflare](#cloudflare)
  - [Documentação](#documentação)
  - [Melhorias Futuras](#melhorias-futuras)

---

## Visão Geral

A plataforma Health Sync Solutions (HSS) foi desenvolvida para reduzir o tempo e o custo operacional do processo de credenciamento médico/hospitalar.

O sistema permite simular o impacto financeiro da digitalização do fluxo de credenciamento por meio de uma calculadora de ROI dinâmica, configurável via painel administrativo.

A solução considera:

- redução do tempo operacional
- antecipação de receita
- diminuição de retrabalho
- redução de glosas
- custos de implantação
- mensalidade da plataforma
- cenários configuráveis por tipo de credenciamento

O painel administrativo controla parâmetros financeiros, tempos operacionais, percentuais, custos e status ativo/inativo dos cenários utilizados pela calculadora pública.

---

## Arquitetura

O projeto foi estruturado em:

- Front-end SPA em React + Vite
- Componentização reutilizável em TypeScript
- Camada de serviços dedicada às regras financeiras
- Persistência local via `localStorage`
- APIs serverless utilizando Cloudflare Pages Functions
- Banco Cloudflare D1 preparado para persistência futura
- Estrutura preparada para expansão administrativa e comercial

---

## Funcionalidades

- Landing page responsiva baseada na referência visual do Figma
- Hero section com métricas animadas e imagem institucional
- Seções independentes para:
  - benefícios com cards compactos e ícones em marca d'água
  - processo
  - comparativo Sem HSS / Com HSS
  - depoimentos
  - calculadora ROI
  - formulário
- Calculadora ROI para:
  - hospitais
  - clínicas
  - empresas
  - médicos
- Comparativo visual entre processo tradicional e fluxo digital HSS
- Scrollytelling com seções fixas e transições guiadas
- Painel administrativo isolado por rota hash (`/#adm`)
- Persistência local via `localStorage` para demonstração funcional sem dependência de infraestrutura remota
- Cloudflare Pages Functions preparadas para APIs de:
  - leads
  - simulações ROI
  - configurações administrativas
- Cloudflare D1 preparado com migrations
- Layout responsivo para desktop, tablet e mobile
- Ajustes específicos para dispositivos mobile estreitos
- Sistema global de acessibilidade com:
  - contraste
  - ajuste de fonte
  - espaçamento
  - cursor ampliado
  - modos de daltonismo
  - leitura por hover

---

## Diferenciais Técnicos

- Simulação financeira dinâmica configurável via painel ADM
- Separação entre fluxo público e administrativo
- Estrutura preparada para persistência em banco serverless
- Arquitetura escalável para evolução comercial
- Experiência interativa baseada em scrollytelling
- Componentização organizada para manutenção futura
- Estrutura compatível com expansão para autenticação e dashboard comercial

---

## Stack

- React 18
- Vite 6
- TypeScript
- Tailwind CSS
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare D1

---

## Estrutura do Projeto

```txt
src/
  components/     # Componentes visuais e seções da landing
    admin/
    calculadora/
    layout/
    paginas/
    secoes/
    ui/

  data/           # Dados mockados e configurações iniciais
  hooks/          # Hooks customizados
  services/       # Regras de negócio e cálculos financeiros
  types/          # Tipagens TypeScript

functions/api/    # APIs Cloudflare Pages Functions
migrations/       # Estrutura e migrations do banco D1
doc/              # Documentação técnica, changelog e validações
docs/             # Mapa complementar de edição do site
config/           # Configurações gerais do projeto
```

---

## Estrutura Técnica

| Tecnologia                | Uso                                                               |
| ------------------------- | ----------------------------------------------------------------- |
| React + Vite + TypeScript | Base do front-end com tipagem e componentização                   |
| Tailwind CSS              | Estilização responsiva e aderente à identidade visual health tech |
| Cloudflare Pages          | Deploy e hospedagem da aplicação                                  |
| Cloudflare D1             | Banco preparado para leads, simulações e configurações            |
| Pages Functions           | APIs serverless para persistência futura                          |
| localStorage              | Persistência local para demonstração funcional                    |

---

## Principais Arquivos

| Arquivo                                                         | Responsabilidade                                   |
| --------------------------------------------------------------- | -------------------------------------------------- |
| `src/components/admin/painel-adm-credenciamento.tsx`            | Painel administrativo e configuração de parâmetros |
| `src/components/calculadora/calculadora-roi.tsx`                | Calculadora ROI pública                            |
| `src/services/calculosRoi.ts`                                   | Regras financeiras e cálculos                      |
| `src/data/configuracoesCredenciamento.ts`                       | Dados iniciais dos cenários                        |
| `functions/api/configuracoes-credenciamento.js`                 | API preparada para persistência D1                 |
| `migrations/0003_criar_tabela_configuracoes_credenciamento.sql` | Migration da tabela administrativa                 |

---

## Como Rodar

Instalação das dependências:

```bash
npm install
```

Execução local:

```bash
npm run dev
```

Aplicação:

```txt
http://localhost:5196/
```

Painel administrativo:

```txt
http://localhost:5196/#adm
```

---

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

---

## Cloudflare

Projeto configurado no arquivo `wrangler.toml`:

```txt
challenge-hss-fiap-1twdor-2025
```

Deploy:

```bash
npm run wrangler:deploy
```

---

## Documentação

- `doc/changelog.md`
- `doc/info_project_files.md`
- `doc/validacao_final.md`
- `docs/map_site_info.md`
- `prompts.md`

---

## Melhorias Futuras

- Adicionar autenticação real ao painel administrativo
- Ampliar relatórios comerciais dos leads salvos no D1
- Exportar simulações em PDF
- Criar dashboard comercial para histórico de leads e ROI
- Adicionar testes automatizados para cálculos e fluxos principais
- Implementar analytics e métricas de conversão
- Adicionar versionamento de cenários administrativos
