# Health Sync Solutions (HSS)

## Plataforma de Credenciamento Médico e Simulação de ROI

Landing page do MedTech Challenge FIAP da Health Sync Solutions. Apresenta o processo de credenciamento médico, compara o fluxo
tradicional (sem HSS) com o fluxo digital (com HSS) e oferece uma calculadora pública de ROI com três calculadoras, cenários
configuráveis por um Portal ADM e um assistente de IA que monta cenários personalizados por conversa.

## Página Publicada

https://hssfiap-chalange-1twdor-2025.pages.dev/

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8) ![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-f38020) ![Gemini](https://img.shields.io/badge/IA-Gemini-4285f4)

---

## Sumário

- [Visão Geral](#visão-geral)
- [Calculadora de ROI](#calculadora-de-roi)
- [Assistente de IA](#assistente-de-ia)
- [Portal ADM](#portal-adm)
- [Landing Page](#landing-page)
- [Arquitetura](#arquitetura)
- [Stack](#stack)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Principais Arquivos](#principais-arquivos)
- [Como Rodar](#como-rodar)
- [Scripts](#scripts)
- [Cloudflare](#cloudflare)
- [Premissas e Limitações](#premissas-e-limitações)
- [Documentação](#documentação)
- [Melhorias Futuras](#melhorias-futuras)

---

## Visão Geral

A HSS é uma plataforma de credenciamento médico: onboarding digital, cadastro único reutilizável, validação estruturada de
documentos, rastreabilidade de pendências e monitoramento de vencimentos. O site mostra esse valor de forma prática: em vez de
apenas afirmar que a HSS economiza tempo e dinheiro, deixa o visitante simular o próprio caso.

A simulação considera:

- prazo de credenciamento sem HSS x com HSS, etapa por etapa
- receita antecipada pelos dias economizados
- horas de papelada e de equipe economizadas
- retrabalho evitado
- custo da HSS (valor por credenciamento para a instituição)
- cenários configuráveis por tipo de credenciamento

---

## Calculadora de ROI

Três calculadoras curtas, já preenchidas com valores de mercado e editáveis pelo visitante:

| Calculadora | Para quem | Passos | O que responde |
| --- | --- | --- | --- |
| **ROI do médico** | Médico que vai se credenciar | Onde atender → Seus dados | Em quanto tempo recupera o que gasta para começar a atender, sem e com a HSS |
| **ROI corporativo** | Hospitais, clínicas e pronto atendimentos | Processo → Seus dados | Em quanto tempo a HSS se paga e quanto custa cada médico credenciado, sem e com ela |
| **ROI da carreira** | Estudante ou médico em formação | Formação → Gastos do curso → Seus atendimentos | Quanto custa a graduação e quantos anos de profissão pagam o investimento |

Destaques:

- **Cenários prontos** (vindos do ADM), **cenário do zero** ("Faça seu cenário do início") ou **cenário com IA**.
- **Resultado em abas**: resumo com régua sem x com HSS, gráfico tempo x dinheiro, composição dos custos, etapas e a conta passo a passo
  (memória de cálculo). A carreira tem ainda saldo ano a ano e destino do ganho mensal.
- **Modelo de preço corporativo**: a HSS cobra um valor fixo por médico credenciado, sem mensalidade nem implantação.
- **Tema por calculadora**: azul (médico), roxo (corporativo) e laranja (carreira).
- **Sem rolagem no desktop**: cada passo cabe na caixa da calculadora; no tablet e no celular a calculadora ocupa a tela inteira.
- **Encaixe na tela**: ao chegar na calculadora (rolagem ou link "Calcular ROI"), ela é centralizada e a página fica presa até o
  visitante girar a roda do mouse para sair.

---

## Assistente de IA

O assistente (Gemini) conversa com o visitante e monta:

- um **cenário de credenciamento** (médico ou corporativo): etapas, prazos sem e com HSS e premissas;
- um **perfil de formação** (carreira): gastos do curso e atendimentos depois de formado.

A IA só coleta e organiza as premissas; **todas as contas são feitas pela calculadora**. Quando o visitante não sabe um valor, a IA
usa referências de mercado e informa qual usou. As respostas rápidas vêm em botões (um por opção) e as sugestões com números têm um
lápis para editar antes de enviar.

A chave do Gemini fica **somente no servidor** (`config/gemini.env` local, ignorado pelo Git, e secrets no Cloudflare). O servidor
tenta chaves e modelos de reserva quando o principal falha.

---

## Portal ADM

Disponível em `/#adm`. Controla os cenários usados pela calculadora pública:

- tipos de credenciamento, etapas e prazos sem e com HSS
- custos, percentuais e demais premissas
- quais campos o visitante preenche em cada calculadora
- cenário ativo ou desativado
- rascunho local (`localStorage`) e publicação no Cloudflare D1

---

## Landing Page

- Hero com chamada para demonstração e para a calculadora
- Benefícios, Como funciona?, Diferenciais (dúvidas comuns x com a HSS) e Depoimentos
- Formulário de lead
- Fundo com parallax, header que esconde a borda no topo e rodapé com navegação e redes
- Layout responsivo com ajustes específicos para tablet e celular
- Menu de acessibilidade: contraste, tamanho de fonte, espaçamento, cursor ampliado, modos de daltonismo e leitura por hover

---

## Arquitetura

- SPA em React + Vite, com componentes agrupados por responsabilidade
- Regras de negócio em `services/` (cálculos de ROI, carreira e memória de cálculo), separadas da interface
- Cloudflare Pages Functions para as APIs (cenários, leads, simulações, configurações e IA)
- Cloudflare D1 para os cenários publicados pelo ADM, leads e simulações
- Módulo da IA em `servidor/`, compartilhado entre a Pages Function (produção) e o middleware do Vite (desenvolvimento)

---

## Stack

- React 18
- Vite 6
- TypeScript (strict)
- Tailwind CSS
- Cloudflare Pages + Pages Functions
- Cloudflare D1
- Google Gemini (via API REST no servidor)

---

## Estrutura do Projeto

```txt
src/
  assets/         # Imagens (logos, hero e imagens de cada calculadora em WebP)
  components/
    admin/        # Portal ADM
    calculadora/  # Calculadora, chat de IA, telas de resultado e gráficos
    layout/       # Rodapé
    paginas/      # Landing e página do ADM
    secoes/       # Seções da landing
    ui/           # Botões e componentes de interface reutilizáveis
  data/           # Cenários iniciais, catálogo de campos e perfis da carreira
  hooks/          # Cenários, encaixe da calculadora, parallax, localStorage
  services/       # Cálculos de ROI, carreira, memória de cálculo e chamadas da IA
  types/          # Tipagens compartilhadas

functions/api/    # Cloudflare Pages Functions
servidor/         # IA (Gemini): instruções, esquemas e chamadas com reserva
scripts/          # Publicação das chaves do Gemini como secrets
migrations/       # Migrations do D1
config/           # Porta de desenvolvimento e exemplo do gemini.env
doc/ e docs/      # Documentação técnica, changelog e validações
```

---

## Principais Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/calculadora/calculadora-roi.tsx` | Calculadora pública: passos, listas de cenários e perfis, navegação |
| `src/components/calculadora/tela-resultado.tsx` | Resultado do médico e do corporativo |
| `src/components/calculadora/tela-resultado-carreira.tsx` | Resultado da carreira |
| `src/components/calculadora/chat-ia-cenario.tsx` | Chat de IA (cenário e perfil da carreira) |
| `src/components/calculadora/graficos-resultado.tsx` | Gráfico tempo x dinheiro e gráfico de etapas |
| `src/components/calculadora/graficos-extras.tsx` | Gráficos de composição e de colunas |
| `src/services/calculosRoi.ts` | Cálculos do médico e da instituição |
| `src/services/calculosCarreira.ts` | Cálculo do ROI da carreira |
| `src/services/memoriaCalculo.ts` | A conta passo a passo exibida ao visitante |
| `src/data/configuracoesCredenciamento.ts` | Cenários iniciais e premissas padrão |
| `src/data/camposPremissas.ts` | Catálogo de campos, limites e explicações |
| `src/data/carreiraMedica.ts` | Perfis de formação e campos da carreira |
| `src/components/admin/painel-adm-credenciamento.tsx` | Portal ADM |
| `servidor/gemini-cenario.js` | Instruções e esquemas da IA, chamadas ao Gemini |
| `functions/api/ia-cenario.js` | API da IA |
| `functions/api/cenarios-credenciamento.js` | API dos cenários publicados no D1 |

---

## Como Rodar

```bash
npm install
npm run dev
```

- Aplicação: http://localhost:5196/
- Portal ADM: http://localhost:5196/#adm
- Acesso pela rede local: `npm run dev:rede` (o firewall precisa liberar a porta 5196)

IA local: copie `config/gemini.env.example` para `config/gemini.env` e preencha `GEMINI_API_KEY` (e, opcionalmente, chaves e modelos
de reserva `GEMINI_API_KEY_2`, `GEMINI_MODELO_2`...). O arquivo é ignorado pelo Git.

---

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento em `localhost:5196` |
| `npm run dev:rede` | Servidor de desenvolvimento acessível pela rede local |
| `npm run build` | Checagem de tipos e build de produção |
| `npm run preview` | Pré-visualização do build |
| `npm run wrangler:deploy` | Build e deploy no Cloudflare Pages |
| `npm run d1:migrar:local` / `d1:migrar:remoto` | Migrations do D1 |
| `npm run ia:publicar-chave` | Envia as chaves do `config/gemini.env` como secrets do Pages |

Para publicar as chaves em outro projeto do Pages sem alterar o `wrangler.toml`, use a variável `HSS_PAGES_PROJETO`.

---

## Cloudflare

| Item | Valor |
| --- | --- |
| Projeto do Pages (site publicado) | `hssfiap-chalange-1twdor-2025` |
| Projeto no `wrangler.toml` | `challenge-hss-fiap-1twdor-2025` |
| Banco D1 | `hss_roi_db` (binding `DB`) |

Deploy no projeto publicado:

```bash
npm run build
npx wrangler pages deploy dist --project-name hssfiap-chalange-1twdor-2025 --branch main
```

---

## Premissas e Limitações

- **Preço da HSS**: não é público. O valor por credenciamento (R$ 350) é uma hipótese editável e deve ser substituído pela proposta
  comercial.
- **Prazos com HSS** são hipóteses de simulação; a HSS não acelera etapas como registro no CRM, análise da comissão ou assinatura de
  contrato, e a calculadora trata essas etapas como "sem redução".
- **Valores de mercado** (consultas, repasses, impostos, custos da graduação) vêm de referências de 2025-2026 e podem ser editados.
- **D1 no projeto publicado**: o banco precisa estar vinculado ao projeto `hssfiap-chalange-1twdor-2025` para os cenários do ADM e os
  leads funcionarem online; sem ele, a calculadora usa os cenários padrão do código.
- Simulação, não promessa de resultado.

---

## Documentação

- `doc/changelog.md`
- `doc/info_project_files.md`
- `doc/validacao_final.md`
- `doc/fontes_e_decisoes.md`
- `docs/map_site_info.md`
- `prompts.md`

---

## Melhorias Futuras

- Autenticação real no Portal ADM
- Vincular o D1 ao projeto publicado e ampliar os relatórios de leads
- Exportar a simulação em PDF
- Testes automatizados para os cálculos e fluxos principais
- Analytics e métricas de conversão
- Versionamento dos cenários administrativos
