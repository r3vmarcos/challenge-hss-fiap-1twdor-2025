# Info Project Files

## Arquivos Críticos

- [`src/main.tsx`](../src/main.tsx) -> inicializa o React no DOM.
- [`src/App.tsx`](../src/App.tsx) -> orquestra layout, hash `#adm`, hooks visuais e seleção da página.
- [`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts) -> concentra dados do processo e depoimentos da landing.
- [`src/data/configuracoesCredenciamento.ts`](../src/data/configuracoesCredenciamento.ts) -> cenários padrão (etapas, prazos sem/com HSS, premissas) e normalização dos dados vindos do ADM, D1 ou IA.
- [`src/data/camposPremissas.ts`](../src/data/camposPremissas.ts) -> catálogo dos campos de premissa: rótulo, unidade, limites, grupo e explicação.
- [`src/data/carreiraMedica.ts`](../src/data/carreiraMedica.ts) -> perfis e campos da calculadora de carreira médica.
- [`src/services/calculosRoi.ts`](../src/services/calculosRoi.ts) -> ROI do médico e da instituição, timeline, payback, projeções mês a mês e formatadores.
- [`src/services/calculosCarreira.ts`](../src/services/calculosCarreira.ts) -> investimento da graduação e tempo de retorno da carreira.
- [`src/services/memoriaCalculo.ts`](../src/services/memoriaCalculo.ts) -> linhas da memória de cálculo exibidas no resultado e no ADM.
- [`src/services/iaCenarios.ts`](../src/services/iaCenarios.ts) -> cliente da API `/api/ia-cenario`.
- [`src/hooks/useCenariosCredenciamento.ts`](../src/hooks/useCenariosCredenciamento.ts) -> rascunho local do ADM, leitura dos cenários publicados no D1 e publicação.
- [`src/hooks/useEncaixeMagnetico.ts`](../src/hooks/useEncaixeMagnetico.ts) -> encaixe da calculadora na tela; sai após girar a roda do mouse.
- [`src/components/calculadora/calculadora-roi.tsx`](../src/components/calculadora/calculadora-roi.tsx) -> calculadora pública: escolha entre ROI do médico, corporativo e da carreira, em dois passos e resultado.
- [`src/components/calculadora/tela-resultado.tsx`](../src/components/calculadora/tela-resultado.tsx) -> resultado médico/corporativo com vistas de resumo, gráfico e cálculo.
- [`src/components/calculadora/tela-resultado-carreira.tsx`](../src/components/calculadora/tela-resultado-carreira.tsx) -> resultado da calculadora de carreira.
- [`src/components/calculadora/graficos-resultado.tsx`](../src/components/calculadora/graficos-resultado.tsx) -> gráficos SVG de tempo x gasto.
- [`src/components/calculadora/chat-ia-cenario.tsx`](../src/components/calculadora/chat-ia-cenario.tsx) -> conversa com a IA para montar um cenário (calculadora e ADM).
- [`src/components/admin/painel-adm-credenciamento.tsx`](../src/components/admin/painel-adm-credenciamento.tsx) -> Portal ADM com abas "Cenários da calculadora" e "Contatos".
- [`src/components/admin/painel-adm-contatos.tsx`](../src/components/admin/painel-adm-contatos.tsx) -> aba ADM que lista pessoas que preencheram o formulário e solicitaram contato.
- [`wrangler.toml`](../wrangler.toml) -> configuração Cloudflare Pages e D1.

## Páginas

- [`src/components/paginas/pagina-landing.tsx`](../src/components/paginas/pagina-landing.tsx) -> composição da landing pública.
- [`src/components/paginas/pagina-adm.tsx`](../src/components/paginas/pagina-adm.tsx) -> tela do painel ADM.

## Layout

- [`src/components/cabecalho.tsx`](../src/components/cabecalho.tsx) -> cabeçalho com navegação e CTA.
- [`src/components/layout/rodape.tsx`](../src/components/layout/rodape.tsx) -> rodapé com fontes e referências.
- [`src/components/camadas-parallax.tsx`](../src/components/camadas-parallax.tsx) -> camadas de fundo com parallax.
- [`src/components/menu-acessibilidade.tsx`](../src/components/menu-acessibilidade.tsx) -> menu global A11y com contraste, fonte, leitura por hover, daltonismo e cursor.

## Seções Da Landing

- [`src/components/hero-hss.tsx`](../src/components/hero-hss.tsx) -> primeira dobra com métricas e CTA.
- [`src/components/secao-solucao.tsx`](../src/components/secao-solucao.tsx) -> benefícios da solução.
- [`src/components/secoes/secao-como-funciona.tsx`](../src/components/secoes/secao-como-funciona.tsx) -> etapas do credenciamento com estilos responsivos em Tailwind CSS.
- [`src/components/secoes/secao-processo-comparativo.tsx`](../src/components/secoes/secao-processo-comparativo.tsx) -> comparação responsiva de dúvidas comuns e benefícios da HSS, com painéis pastel, cartões alinhados e setas centrais.
- [`src/components/secoes/secao-depoimentos.tsx`](../src/components/secoes/secao-depoimentos.tsx) -> depoimentos em marquee.
- [`src/components/formulario-lead.tsx`](../src/components/formulario-lead.tsx) -> formulário de contato e demonstração.

## UI Reutilizável

- [`src/components/ui/shimmer-button.tsx`](../src/components/ui/shimmer-button.tsx) -> botão com efeito shimmer.
- [`src/components/ui/card-spotlight.tsx`](../src/components/ui/card-spotlight.tsx) -> card com spotlight.
- [`src/components/ui/marquee.tsx`](../src/components/ui/marquee.tsx) -> marquee horizontal.
- [`src/components/ui/number-ticker.tsx`](../src/components/ui/number-ticker.tsx) -> contador animado.
- [`src/components/ui/logo-origami.tsx`](../src/components/ui/logo-origami.tsx) -> alternância animada dos logos HSS/FIAP no cabeçalho.
- [`src/components/ui/botao-info.tsx`](../src/components/ui/botao-info.tsx) -> botão "i" com balão de explicação dos campos.
- [`src/components/ui/interruptor.tsx`](../src/components/ui/interruptor.tsx) -> interruptor ativo/desativado usado no ADM.

## Cloudflare

- [`functions/api/leads.js`](../functions/api/leads.js) -> endpoint de leads com gravação via `POST` e listagem administrativa via `GET`.
- [`functions/api/configuracoes-credenciamento.js`](../functions/api/configuracoes-credenciamento.js) -> endpoint de configurações do ADM.
- [`functions/api/simulacoes-roi.js`](../functions/api/simulacoes-roi.js) -> endpoint de simulações.
- [`functions/api/cenarios-credenciamento.js`](../functions/api/cenarios-credenciamento.js) -> leitura (`GET`) e publicação (`POST`, token `HSS_ADM_TOKEN` opcional) dos cenários no D1.
- [`functions/api/ia-cenario.js`](../functions/api/ia-cenario.js) -> endpoint da IA; usa os secrets `GEMINI_API_KEY`, `GEMINI_MODELO` e reservas `_2` a `_9`.
- [`servidor/gemini-cenario.js`](../servidor/gemini-cenario.js) -> módulo do Gemini compartilhado com o middleware do Vite (`vite.config.ts`), que atende `/api/ia-cenario` no `npm run dev`.
- [`config/gemini.env.example`](../config/gemini.env.example) -> modelo do `config/gemini.env` local (ignorado pelo Git).
- [`scripts/publicar-chave-gemini.mjs`](../scripts/publicar-chave-gemini.mjs) -> `npm run ia:publicar-chave`, grava as chaves como secrets do Cloudflare Pages.
- [`migrations/`](../migrations) -> migrations D1 preparadas; `0004` cria a tabela `cenarios_credenciamento`.

## Ajustes Responsivos Atuais

- [`src/components/cabecalho.tsx`](../src/components/cabecalho.tsx) -> no mobile, as mesmas opções de navegação do desktop ficam no menu sanduíche; Agendar demonstração permanece no header.
- [`src/index.css`](../src/index.css) -> controla a escala reduzida dos logos do cabeçalho em desktop e mobile.
- [`src/components/menu-acessibilidade.tsx`](../src/components/menu-acessibilidade.tsx) -> faz o botão A11y sumir durante scroll e reaparecer após 3 segundos.
- [`src/components/menu-acessibilidade.tsx`](../src/components/menu-acessibilidade.tsx) -> no mobile, oculta o botão SVG flutuante quando o painel está aberto e destaca o fechar em
  azul.
- [`src/components/secoes/secao-processo-comparativo.tsx`](../src/components/secoes/secao-processo-comparativo.tsx) -> apresenta os painéis em desktop com setas entre os cartões e preserva o empilhamento responsivo em telas menores.
- [`src/components/hero-hss.tsx`](../src/components/hero-hss.tsx) -> ajusta largura, título em três linhas e imagem do hero; no desktop, a médica fica posicionada no lado direito,
  centralizada verticalmente e com degradê transparente na base.
- [`src/components/calculadora/calculadora-roi.tsx`](../src/components/calculadora/calculadora-roi.tsx) -> caixa de 90dvh x 90dvw com grade de campos em duas colunas a partir de
  360px; enquanto ocupa a tela, cabeçalho e botão A11y saem de cena (`calculadora-em-tela` em `src/index.css`).
- [`src/components/formulario-lead.tsx`](../src/components/formulario-lead.tsx) -> reduz padding e limita largura dos campos no mobile.

## Textos Visíveis Do Site

### Cabeçalho

Origem: [`src/components/cabecalho.tsx`](../src/components/cabecalho.tsx)

- Benefícios
- Como funciona?
- Diferencial
- Depoimentos
- Calculadora ROI
- Agendar demonstração
- Portal ADM
- Landing

### Hero

Origem: [`src/components/hero-hss.tsx`](../src/components/hero-hss.tsx)

- Digitalize e simplifique
- o CREDENCIAMENTO
- MÉDICO
- O credenciamento médico como você nunca viu - centralizado, econômico e confiável.
- Agendar demonstração
- Calcular ROI
- 33+
- Dias economizados
- 73%
- Redução estimada
- R$ 504.000
- Prejuízo mensal evitável

### Benefícios

Origem: [`src/components/secao-solucao.tsx`](../src/components/secao-solucao.tsx)

- Benefícios da nossa solução
- Transforme o credenciamento médico em um processo mais organizado, rastreável e eficiente. Centralize validações, reduza retrabalho e acompanhe cada etapa com mais controle
  operacional.
- Os cards exibem ícones no topo direito como marca d'água translúcida, sem numeração visível.
- Ritmo de entrada dos cards no desktop: controlado por `PERCENTUAL_PASSO_BENEFICIO` e `PASSO_MINIMO_BENEFICIO` em
  [`src/components/secao-solucao.tsx`](../src/components/secao-solucao.tsx).
- Fluxo 100% digital: Menos papel e contratações muito mais rápidas.
- Cadastro único: O fornecedor preenche uma vez; a empresa acessa sempre atualizado.
- Status em tempo real: Transparência total para os dois lados acompanharem o processo.
- Fim do retrabalho: Filtros automáticos eliminam vai e vem de documentos errados.
- Segurança e compliance: Histórico imutável e auditável para segurança jurídica e fiscal.
- Proteção contra riscos: Dados protegidos pela LGPD e segurança corporativa contra fraudes.

### Como Funciona

Origem visual: [`src/components/secoes/secao-como-funciona.tsx`](../src/components/secoes/secao-como-funciona.tsx) Origem dos cards:
[`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts)

- Como funciona?
- A Health Sync estrutura cada etapa do credenciamento médico em uma plataforma digital única, auditável e rastreável - para que instituições e médicos assumam o controle do
  processo, economizando tempo e com menos burocracia.
- Etapas do processo de credenciamento
- Hover ou foco destaca a etapa; clique abre o modal com "O que acontece", "Com a HSS", "O que continua com a instituição", "Etapa anterior" e "Próxima etapa" (textos em `etapasProcesso`: `texto`, `comHss`, `limite`).
- Pré-cadastro do médico: Instituição ou médico inicia o fluxo com dados básicos, vínculo desejado e tipo de credenciamento.
- Envio e triagem documental: Documentos obrigatórios são reunidos, classificados e conferidos conforme o perfil do cenário.
- Validação de CRM, RQE e certidões: A etapa reduz risco assistencial e organiza a conferência das credenciais profissionais.
- Análise técnica e aprovação interna: Coordenação, corpo clínico, compliance ou jurídico validam o médico conforme as regras da instituição.
- Liberação operacional para atuação: O médico é liberado para agenda, plantão, procedimento ou recredenciamento conforme o cenário.

### Processo Comparativo

Origem visual: [`src/components/secoes/secao-processo-comparativo.tsx`](../src/components/secoes/secao-processo-comparativo.tsx) Origem dos cards laterais:
[`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts) Origem dos cards informativos: [`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts) Observação mobile: no layout
compacto são exibidos apenas os cards informativos. Observação responsiva: os cards usam `min-w-0`, `overflow-hidden` e quebra de palavras para não ultrapassar 100vw. Observação de
conteúdo: os textos em `dadosLanding.ts` devem ser frases finais de UI, sem prefixos internos como `sem S`, `sem R`, `com S` ou `com R`. Observação desktop: os quatro cards
laterais e os quatro cards informativos foram compactados para caber no palco de `100vh`.

- Sem HSS • processos tradicionais
- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
- Etapa tradicional 01: ANÁLISE EXAUSTIVA E FALSA AUTOMAÇÃO. A ausência de leitura automática — no papel ou em sistemas limitados — abre brechas para o erro humano e aprovações
  irregulares.
- Etapa tradicional 02: VALIDAÇÃO ARTESANAL E RETRABALHO. O eterno vai-e-vem de e-mails cobrando anexos frustra o corpo clínico e atrasa o início dos plantões.
- Etapa tradicional 03: INTEGRAÇÃO LIMITADA. Softwares que não conectam ao CRM ou bases federais tornam o preenchimento de dados repetitivo e lento.
- Etapa tradicional 04: GESTÃO CAÓTICA E VULNERABILIDADE. Sem rastreabilidade clara, comprovar o compliance durante uma auditoria vira uma operação de resgate estressante.
- Informação tradicional 01: ANÁLISE EXAUSTIVA E FALSA AUTOMAÇÃO. A ausência de leitura automática — no papel ou em sistemas limitados — abre brechas para o erro humano e
  aprovações irregulares.
- Informação tradicional 02: VALIDAÇÃO ARTESANAL E RETRABALHO. O eterno vai-e-vem de e-mails cobrando anexos frustra o corpo clínico e atrasa o início dos plantões.
- Informação tradicional 03: INTEGRAÇÃO LIMITADA. Softwares que não conectam ao CRM ou bases federais tornam o preenchimento de dados repetitivo e lento.
- Informação tradicional 04: GESTÃO CAÓTICA E VULNERABILIDADE. Sem rastreabilidade clara, comprovar o compliance durante uma auditoria vira uma operação de resgate estressante.
- Com HSS • processo digital
- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
- Ganho digital 01: IA DE ALTA PRECISÃO. Antecipa erros e inconsistências, acelerando drasticamente aprovações e eliminando falhas humanas.
- Ganho digital 02: SEGURANÇA BLINDADA. Camadas de validação rigorosas que garantem a autenticidade documental e total conformidade com as normas do setor.
- Ganho digital 03: ECOSSISTEMA INTEROPERÁVEL. Conecte-se aos principais sistemas hospitalares e bases regulatórias sem trabalho manual e silos de informação.
- Ganho digital 04: FOCO EM COMPLIANCE. Trilhas de auditoria automáticas e arquitetura focada em compliance para fiscalizações sem estresse.
- Informação digital 01: IA DE ALTA PRECISÃO. Antecipa erros e inconsistências, acelerando drasticamente aprovações e eliminando falhas humanas.
- Informação digital 02: SEGURANÇA BLINDADA. Camadas de validação rigorosas que garantem a autenticidade documental e total conformidade com as normas do setor.
- Informação digital 03: ECOSSISTEMA INTEROPERÁVEL. Conecte-se aos principais sistemas hospitalares e bases regulatórias sem trabalho manual e silos de informação.
- Informação digital 04: FOCO EM COMPLIANCE. Trilhas de auditoria automáticas e arquitetura focada em compliance para fiscalizações sem estresse.

### Depoimentos

Origem visual: [`src/components/secoes/secao-depoimentos.tsx`](../src/components/secoes/secao-depoimentos.tsx) Origem dos depoimentos:
[`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts)

- A simulação deixou claro o custo de manter médicos aguardando liberação. - Gestora hospitalar, Operações em saúde.
- O painel ADM permite ajustar tempos e percentuais por tipo de credenciamento. - Coordenador médico, Corpo clínico.
- O processo fica mais transparente para a instituição e para o médico. - Diretora de clínica, Rede assistencial.
- A comparação sem HSS e com HSS transforma burocracia em número de negócio. - Analista de saúde, Planejamento financeiro.
- Conseguimos apresentar o ROI do credenciamento em poucos minutos. - Gerente financeiro, Hospital geral.
- Os cenários ativos ajudam a adaptar a conversa para hospitais, clínicas e médicos. - Executiva comercial, Health tech B2B.
- A lógica por tempo deixa fácil explicar o prejuízo de cada dia de atraso. - Consultor de processos, Eficiência operacional.
- A navegação por etapas ajuda o gestor a preencher os dados sem confusão. - Coordenadora administrativa, Clínica médica.
- O modelo dá visibilidade para recredenciamento, alta complexidade e PJ. - Diretor técnico, Rede hospitalar.
- O cálculo aproxima operação, financeiro e corpo clínico da mesma decisão. - Head de operações, Instituição de saúde.
- A experiência visual ficou clara para demonstrar ganhos em reuniões comerciais. - Especialista comercial, Soluções B2B.
- O fluxo evidencia onde o processo tradicional perde tempo e dinheiro. - Auditor interno, Qualidade hospitalar.
- As premissas no ADM dão controle para testar cenários conservadores e otimistas. - Controller, Planejamento.
- A leitura de payback e ROI facilita priorizar a contratação da solução. - Diretor administrativo, Hospital privado.
- A HSS transforma credenciamento em uma jornada mensurável. - Product owner, Saúde digital.

### Calculadora ROI

Origem: [`src/components/calculadora/calculadora-roi.tsx`](../src/components/calculadora/calculadora-roi.tsx)

Componentes de apoio: [`src/components/calculadora/`](../src/components/calculadora)

- Calcule seu retorno
- Qual retorno você quer calcular?
- ROI do médico com a HSS
- ROI corporativo com a HSS
- ROI da carreira médica
- Começar / Continuar simulação
- Onde você vai se credenciar? / Qual processo você quer simular? / Qual perfil de formação se parece com o seu?
- Conte só o principal (médico e corporativo)
- Carreira: Ajuste os gastos do curso / Como serão os seus atendimentos?
- Montar meu cenário com IA
- Trocar calculadora / Voltar / Próximo / Ver resultado
- Seu resultado
- Ajustar respostas / Nova simulação / Agendar demonstração
- Gire a roda do mouse 3 vezes para sair da calculadora
- Cores: sem HSS em laranja (`#f97316`), com HSS em teal (`#079879`), seleção com borda violeta e anel lavanda.

### Painel ADM

Origem principal: [`src/components/admin/painel-adm-credenciamento.tsx`](../src/components/admin/painel-adm-credenciamento.tsx) Origem dos contatos: [`src/components/admin/painel-adm-contatos.tsx`](../src/components/admin/painel-adm-contatos.tsx)

- Portal ADM
- Cenários da calculadora
- Contatos
- Entrar no Portal ADM (ambiente demo: usuário hssadmin e senha hss2026)
- Cenários (interruptor liga ou desliga o cenário na calculadora)
- Como aparece no site
- Para quem é este cenário
- Mostrar na calculadora do site
- Etapas e prazos
- O que o visitante preenche
- Resultado e conta com os valores deste cenário
- Descartar rascunho / Restaurar cenários padrão / Publicar no site
- Contatos recebidos
- Buscar contato
- Carregando contatos...
- Nenhum contato encontrado no banco ou fallback local.

### Formulário De Lead

Origem: [`src/components/formulario-lead.tsx`](../src/components/formulario-lead.tsx)

- MENOS PAPELADA. (maior, caixa alta) / MÉDICOS ATENDENDO MAIS RÁPIDO. (caixa alta, uma linha, sem quebra; "Menos" e "rápido" em hss-verde)
- Conte como é o credenciamento hoje na sua instituição. / Ou sua rotina como médico. / Nossa equipe mostra como a HSS reúne documentos, validações e prazos em um só lugar, e quanto tempo você pode ganhar.
- Nome
- E-mail
- Telefone
- Você é: Médico / Hospital / clínica (grava em `visao`)
- Mensagem
- Campos em uma coluna; instituição, cargo e porte saíram do formulário e seguem vazios no lead.
- Enviando...
- Solicitar demonstração
- Lead salvo com sucesso.
- Layout mobile com padding reduzido e campos limitados ao container.

### Footer

Origem visual: [`src/components/layout/rodape.tsx`](../src/components/layout/rodape.tsx) Origem das fontes: [`src/data/conteudoHss.ts`](../src/data/conteudoHss.ts)

- Health Sync Solutions - FIAP MedTech Challenge - Landing light com calculadora de ROI por tempo de credenciamento.
- © 2026 Health Sync Solutions. Todos os direitos reservados.
- Health Sync Solutions
- FIAP
- Fontes e referências
- GitHub
- Site Health Sync Solutions
- LinkedIn Health Sync Solutions
- Facebook Health Sync Solutions
- Instagram Health Sync Solutions
- Site FIAP
- LinkedIn FIAP
- Facebook FIAP
- Instagram FIAP
- Fechar fontes e referências

### Menu De Acessibilidade

Origem: [`src/components/menu-acessibilidade.tsx`](../src/components/menu-acessibilidade.tsx)

- Acessibilidade
- Alto contraste
- Leitura por hover
- Cursor grande
- Tamanho do texto
- A-
- A
- A+
- A++
- Fonte
- Lexend
- Poppins
- Inter
- Espaçamento de linhas
- Normal
- Largo
- Muito largo
- Daltonismo
- Desativado
- Protanopia
- Deuteranopia
- Tritanopia
- Restaurar padrões
- Abrir menu de acessibilidade
- Fechar menu de acessibilidade

## Documentação

- [`README.md`](../README.md) -> visão geral e instruções GitHub.
- [`docs/map_site_info.md`](../docs/map_site_info.md) -> mapa de onde modificar cada parte e dado do site.
- [`doc/changelog.md`](./changelog.md) -> histórico de mudanças.
- [`doc/validacao_final.md`](./validacao_final.md) -> validação técnica da entrega.
- [`prompts.md`](../prompts.md) -> histórico do pedido aplicado.
