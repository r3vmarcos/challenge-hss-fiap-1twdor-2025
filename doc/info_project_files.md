# Info Project Files

## Arquivos CrÃ­ticos

- [`src/main.tsx`](../src/main.tsx) -> inicializa o React no DOM.
- [`src/App.tsx`](../src/App.tsx) -> orquestra layout, hash `#adm`, hooks visuais e seleÃ§Ã£o da pÃ¡gina.
- [`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts) -> concentra dados do hero, processo e depoimentos da landing.
- [`src/data/configuracoesCredenciamento.ts`](../src/data/configuracoesCredenciamento.ts) -> base padrÃ£o dos cenÃ¡rios do ADM.
- [`src/services/calculosRoi.ts`](../src/services/calculosRoi.ts) -> regras de cÃ¡lculo de ROI, payback, receita antecipada e prejuÃ­zo evitado.
- [`src/components/calculadora/calculadora-roi.tsx`](../src/components/calculadora/calculadora-roi.tsx) -> calculadora pÃºblica por etapas e cenÃ¡rios ativos.
- [`src/components/admin/painel-adm-credenciamento.tsx`](../src/components/admin/painel-adm-credenciamento.tsx) -> painel administrativo de cenÃ¡rios, tempos, custos e percentuais.
- [`wrangler.toml`](../wrangler.toml) -> configuraÃ§Ã£o Cloudflare Pages e D1.

## PÃ¡ginas

- [`src/components/paginas/pagina-landing.tsx`](../src/components/paginas/pagina-landing.tsx) -> composiÃ§Ã£o da landing pÃºblica.
- [`src/components/paginas/pagina-adm.tsx`](../src/components/paginas/pagina-adm.tsx) -> tela do painel ADM.

## Layout

- [`src/components/cabecalho.tsx`](../src/components/cabecalho.tsx) -> cabeÃ§alho com navegaÃ§Ã£o e CTA.
- [`src/components/layout/rodape.tsx`](../src/components/layout/rodape.tsx) -> rodapÃ© com fontes e referÃªncias.
- [`src/components/camadas-parallax.tsx`](../src/components/camadas-parallax.tsx) -> camadas de fundo com parallax.

## SeÃ§Ãµes Da Landing

- [`src/components/hero-hss.tsx`](../src/components/hero-hss.tsx) -> primeira dobra com mÃ©tricas e CTA.
- [`src/components/secao-solucao.tsx`](../src/components/secao-solucao.tsx) -> benefÃ­cios da soluÃ§Ã£o.
- [`src/components/secoes/secao-como-funciona.tsx`](../src/components/secoes/secao-como-funciona.tsx) -> etapas do credenciamento.
- [`src/components/secoes/secao-processo-comparativo.tsx`](../src/components/secoes/secao-processo-comparativo.tsx) -> comparaÃ§Ã£o sem HSS x com HSS.
- [`src/components/secoes/secao-depoimentos.tsx`](../src/components/secoes/secao-depoimentos.tsx) -> depoimentos em marquee.
- [`src/components/secoes/secao-diferencial-adm.tsx`](../src/components/secoes/secao-diferencial-adm.tsx) -> diferencial do ADM.
- [`src/components/formulario-lead.tsx`](../src/components/formulario-lead.tsx) -> formulÃ¡rio de contato e demonstraÃ§Ã£o.

## UI ReutilizÃ¡vel

- [`src/components/ui/shimmer-button.tsx`](../src/components/ui/shimmer-button.tsx) -> botÃ£o com efeito shimmer.
- [`src/components/ui/card-spotlight.tsx`](../src/components/ui/card-spotlight.tsx) -> card com spotlight.
- [`src/components/ui/marquee.tsx`](../src/components/ui/marquee.tsx) -> marquee horizontal.
- [`src/components/ui/number-ticker.tsx`](../src/components/ui/number-ticker.tsx) -> contador animado.
- [`src/components/ui/logo-origami.tsx`](../src/components/ui/logo-origami.tsx) -> alternÃ¢ncia animada dos logos HSS/FIAP no cabeÃ§alho.

## Cloudflare

- [`functions/api/leads.js`](../functions/api/leads.js) -> endpoint de leads.
- [`functions/api/configuracoes-credenciamento.js`](../functions/api/configuracoes-credenciamento.js) -> endpoint de configuraÃ§Ãµes do ADM.
- [`functions/api/simulacoes-roi.js`](../functions/api/simulacoes-roi.js) -> endpoint de simulaÃ§Ãµes.
- [`migrations/`](../migrations) -> migrations D1 preparadas.

## Textos VisÃ­veis Do Site

### CabeÃ§alho

Origem: [`src/components/cabecalho.tsx`](../src/components/cabecalho.tsx)

- BenefÃ­cios
- Como funciona?
- Diferencial
- Depoimentos
- Calculadora ROI
- Agendar demonstraÃ§Ã£o
- Portal ADM
- Landing

### Hero

Origem: [`src/components/hero-hss.tsx`](../src/components/hero-hss.tsx)

- Digitalize e simplifique o CREDENCIAMENTO MÃ‰DICO
- O credenciamento mÃ©dico como vocÃª nunca viu - centralizado, econÃ´mico e confiÃ¡vel.
- Agendar demonstraÃ§Ã£o
- Calcular ROI
- dias economizados por mÃ©dico
- reduÃ§Ã£o estimada do ciclo
- prejuÃ­zo mensal evitÃ¡vel

### BenefÃ­cios

Origem: [`src/components/secao-solucao.tsx`](../src/components/secao-solucao.tsx)

- BenefÃ­cios da nossa soluÃ§Ã£o
- Transforme o credenciamento mÃ©dico em um processo mais organizado, rastreÃ¡vel e eficiente. Centralize validaÃ§Ãµes, reduza retrabalho e acompanhe cada etapa com mais controle operacional.
- 01 - Fluxo 100% digital: Menos papel e contrataÃ§Ãµes muito mais rÃ¡pidas.
- 02 - Cadastro Ãºnico: O fornecedor preenche uma vez; a empresa acessa sempre atualizado.
- 03 - Status em tempo real: TransparÃªncia total para os dois lados acompanharem o processo.
- 04 - Fim do retrabalho: Filtros automÃ¡ticos eliminam vai e vem de documentos errados.
- 05 - SeguranÃ§a e compliance: HistÃ³rico imutÃ¡vel e auditÃ¡vel para seguranÃ§a jurÃ­dica e fiscal.
- 06 - ProteÃ§Ã£o contra riscos: Dados protegidos pela LGPD e seguranÃ§a corporativa contra fraudes.

### Como Funciona

Origem visual: [`src/components/secoes/secao-como-funciona.tsx`](../src/components/secoes/secao-como-funciona.tsx)
Origem dos cards: [`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts)

- Como funciona?
- A Health Sync estrutura cada etapa do credenciamento mÃ©dico em uma plataforma digital Ãºnica, auditÃ¡vel e rastreÃ¡vel - para que instituiÃ§Ãµes e mÃ©dicos assumam o controle do processo, economizando tempo e com menos burocracia.
- Etapas do processo de credenciamento
- PrÃ©-cadastro do mÃ©dico: InstituiÃ§Ã£o ou mÃ©dico inicia o fluxo com dados bÃ¡sicos, vÃ­nculo desejado e tipo de credenciamento.
- Envio e triagem documental: Documentos obrigatÃ³rios sÃ£o reunidos, classificados e conferidos conforme o perfil do cenÃ¡rio.
- ValidaÃ§Ã£o de CRM, RQE e certidÃµes: A etapa reduz risco assistencial e organiza a conferÃªncia das credenciais profissionais.
- AnÃ¡lise tÃ©cnica e aprovaÃ§Ã£o interna: CoordenaÃ§Ã£o, corpo clÃ­nico, compliance ou jurÃ­dico validam o mÃ©dico conforme as regras da instituiÃ§Ã£o.
- LiberaÃ§Ã£o operacional para atuaÃ§Ã£o: O mÃ©dico Ã© liberado para agenda, plantÃ£o, procedimento ou recredenciamento conforme o cenÃ¡rio.

### Processo Comparativo

Origem visual: [`src/components/secoes/secao-processo-comparativo.tsx`](../src/components/secoes/secao-processo-comparativo.tsx)
Origem dos cards: [`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts)

- Sem HSS - processo tradicional
- O processo depende de e-mails, conferÃªncias manuais e cobranÃ§as recorrentes. Quanto mais lento o ciclo, maior o prejuÃ­zo por mÃ©dico parado.
- Etapa tradicional 01: Arquivos espalhados em e-mails, planilhas e pastas internas dificultam o controle do processo.
- Etapa tradicional 02: A equipe perde tempo cobrando documentos, conferindo anexos e atualizando status manualmente.
- Etapa tradicional 03: A ausÃªncia de premissas de tempo por cenÃ¡rio torna o prazo pouco previsÃ­vel para a operaÃ§Ã£o.
- Etapa tradicional 04: Quanto mais lenta a liberaÃ§Ã£o, maior o impacto de mÃ©dicos parados, agendas vazias e receita postergada.
- Com HSS - processo digital
- O ADM define os tempos por cenÃ¡rio e a calculadora usa essas premissas para estimar economia, receita antecipada e ROI.
- Ganho digital 01: O fluxo digital centraliza etapas, documentos e premissas por tipo de credenciamento configurado no ADM.
- Ganho digital 02: A instituiÃ§Ã£o define tempo sem HSS, tempo com HSS, percentuais e custos para cada cenÃ¡rio ativo.
- Ganho digital 03: A calculadora converte dias economizados em receita antecipada, economia operacional e ROI estimado.
- Ganho digital 04: O painel ADM ativa ou desativa cenÃ¡rios, mantendo o site alinhado ao processo comercial da HSS.

### Depoimentos

Origem visual: [`src/components/secoes/secao-depoimentos.tsx`](../src/components/secoes/secao-depoimentos.tsx)
Origem dos depoimentos: [`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts)

- A simulaÃ§Ã£o deixou claro o custo de manter mÃ©dicos aguardando liberaÃ§Ã£o. - Gestora hospitalar, OperaÃ§Ãµes em saÃºde.
- O painel ADM permite ajustar tempos e percentuais por tipo de credenciamento. - Coordenador mÃ©dico, Corpo clÃ­nico.
- O processo fica mais transparente para a instituiÃ§Ã£o e para o mÃ©dico. - Diretora de clÃ­nica, Rede assistencial.
- A comparaÃ§Ã£o sem HSS e com HSS transforma burocracia em nÃºmero de negÃ³cio. - Analista de saÃºde, Planejamento financeiro.
- Conseguimos apresentar o ROI do credenciamento em poucos minutos. - Gerente financeiro, Hospital geral.
- Os cenÃ¡rios ativos ajudam a adaptar a conversa para hospitais, clÃ­nicas e mÃ©dicos. - Executiva comercial, Health tech B2B.
- A lÃ³gica por tempo deixa fÃ¡cil explicar o prejuÃ­zo de cada dia de atraso. - Consultor de processos, EficiÃªncia operacional.
- A navegaÃ§Ã£o por etapas ajuda o gestor a preencher os dados sem confusÃ£o. - Coordenadora administrativa, ClÃ­nica mÃ©dica.
- O modelo dÃ¡ visibilidade para recredenciamento, alta complexidade e PJ. - Diretor tÃ©cnico, Rede hospitalar.
- O cÃ¡lculo aproxima operaÃ§Ã£o, financeiro e corpo clÃ­nico da mesma decisÃ£o. - Head de operaÃ§Ãµes, InstituiÃ§Ã£o de saÃºde.
- A experiÃªncia visual ficou clara para demonstrar ganhos em reuniÃµes comerciais. - Especialista comercial, SoluÃ§Ãµes B2B.
- O fluxo evidencia onde o processo tradicional perde tempo e dinheiro. - Auditor interno, Qualidade hospitalar.
- As premissas no ADM dÃ£o controle para testar cenÃ¡rios conservadores e otimistas. - Controller, Planejamento.
- A leitura de payback e ROI facilita priorizar a contrataÃ§Ã£o da soluÃ§Ã£o. - Diretor administrativo, Hospital privado.
- A HSS transforma credenciamento em uma jornada mensurÃ¡vel. - Product owner, SaÃºde digital.

### Diferencial

Origem: [`src/components/secoes/secao-diferencial-adm.tsx`](../src/components/secoes/secao-diferencial-adm.tsx)

- O ADM define as premissas, o usuÃ¡rio informa os valores e o ROI Ã© calculado por tempo.
- Tipos ativos: O ADM ativa ou desativa cenÃ¡rios exibidos no site.
- Tempo sem HSS: Define o ciclo tradicional por credenciamento.
- Tempo com HSS: Define o ganho estimado do fluxo digital.
- ROI automÃ¡tico: A calculadora transforma tempo economizado em valor.

### Calculadora ROI

Origem: [`src/components/calculadora/calculadora-roi.tsx`](../src/components/calculadora/calculadora-roi.tsx)

- Calcule agora o ROI
- Empresa / Hospital / ClÃ­nica
- Calcula benefÃ­cio de contratar a HSS, reduzir tempo e credenciar mÃ©dicos mais rÃ¡pido.
- MÃ©dico
- Calcula ROI do mÃ©dico em hospital, clÃ­nica particular ou consultÃ³rio prÃ³prio.
- Tipo de cenÃ¡rio configurado no ADM
- CenÃ¡rio
- Tempo
- Valores
- Custos
- Resultado
- Leitura do cenÃ¡rio
- ROI estimado
- BenefÃ­cios mensais
- Custo mensal equivalente
- PrejuÃ­zo sem HSS
- Dias economizados
- Receita antecipada
- Payback
- ROI do mÃ©dico
- Custo inicial total
- Receita lÃ­quida mensal
- Dias antecipados
- Repasse mensal
- ComposiÃ§Ã£o visual
- Admin
- No-show
- Retrabalho
- Receita antecipada
- Custo inicial
- LÃ­quido mensal
- Destrave para continuar rolando a pÃ¡gina.
- Travar calculadora na tela
- Destravar calculadora

### FormulÃ¡rio De Lead

Origem: [`src/components/formulario-lead.tsx`](../src/components/formulario-lead.tsx)

- Transforme a simulaÃ§Ã£o em conversa comercial.
- O formulÃ¡rio captura as informaÃ§Ãµes principais da instituiÃ§Ã£o para uma abordagem B2B consultiva sobre credenciamento mÃ©dico, reduÃ§Ã£o de tempo e ROI.
- Nome
- E-mail
- Telefone
- InstituiÃ§Ã£o
- Cargo
- Porte
- Pequeno porte
- MÃ©dio porte
- Grande porte
- Rede hospitalar
- Mensagem
- Enviando...
- Solicitar demonstraÃ§Ã£o
- Lead salvo com sucesso.

### Footer

Origem visual: [`src/components/layout/rodape.tsx`](../src/components/layout/rodape.tsx)
Origem das fontes: [`src/data/conteudoHss.ts`](../src/data/conteudoHss.ts)

- Health Sync Solutions - FIAP MedTech Challenge - Landing light com calculadora de ROI por tempo de credenciamento.
- Â© 2026 Health Sync Solutions. Todos os direitos reservados.
- Health Sync Solutions
- FIAP
- Fontes e referÃªncias
- Site Health Sync Solutions
- LinkedIn Health Sync Solutions
- Facebook Health Sync Solutions
- Instagram Health Sync Solutions
- Site FIAP
- LinkedIn FIAP
- Facebook FIAP
- Instagram FIAP
- Fechar fontes e referÃªncias

## DocumentaÃ§Ã£o

- [`README.md`](../README.md) -> visÃ£o geral e instruÃ§Ãµes GitHub.
- [`docs/map_site_info.md`](../docs/map_site_info.md) -> mapa de onde modificar cada parte e dado do site.
- [`doc/changelog.md`](./changelog.md) -> histÃ³rico de mudanÃ§as.
- [`doc/validacao_final.md`](./validacao_final.md) -> validaÃ§Ã£o tÃ©cnica da entrega.
- [`prompts.md`](../prompts.md) -> histÃ³rico do pedido aplicado.
