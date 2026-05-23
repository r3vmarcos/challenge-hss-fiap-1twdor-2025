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
- [`src/components/menu-acessibilidade.tsx`](../src/components/menu-acessibilidade.tsx) -> menu global A11y com contraste, fonte, leitura por hover, daltonismo e cursor.

## Seções Da Landing

- [`src/components/hero-hss.tsx`](../src/components/hero-hss.tsx) -> primeira dobra com métricas e CTA.
- [`src/components/secao-solucao.tsx`](../src/components/secao-solucao.tsx) -> benefícios da solução.
- [`src/components/secoes/secao-como-funciona.tsx`](../src/components/secoes/secao-como-funciona.tsx) -> etapas do credenciamento.
- [`src/components/secoes/secao-processo-comparativo.tsx`](../src/components/secoes/secao-processo-comparativo.tsx) -> comparação sem HSS x com HSS.
- [`src/components/secoes/secao-depoimentos.tsx`](../src/components/secoes/secao-depoimentos.tsx) -> depoimentos em marquee.
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

## Ajustes Responsivos Atuais

- [`src/components/cabecalho.tsx`](../src/components/cabecalho.tsx) -> no mobile, Benefícios, Como funciona? e Depoimentos ficam no menu sanduíche; Calculadora ROI e Agendar
  demonstração permanecem no header.
- [`src/index.css`](../src/index.css) -> controla a escala reduzida dos logos do cabeçalho em desktop e mobile.
- [`src/components/menu-acessibilidade.tsx`](../src/components/menu-acessibilidade.tsx) -> faz o botão A11y sumir durante scroll e reaparecer após 3 segundos.
- [`src/components/menu-acessibilidade.tsx`](../src/components/menu-acessibilidade.tsx) -> no mobile, oculta o botão SVG flutuante quando o painel está aberto e destaca o fechar em
  azul.
- [`src/components/calculadora/calculadora-roi.tsx`](../src/components/calculadora/calculadora-roi.tsx) -> controla o modal compacto de explicação das etapas no mobile.
- [`src/components/secoes/secao-processo-comparativo.tsx`](../src/components/secoes/secao-processo-comparativo.tsx) -> no mobile, o comparativo exibe apenas os textos informativos.
- [`src/components/hero-hss.tsx`](../src/components/hero-hss.tsx) -> ajusta largura, título em três linhas e imagem do hero; no desktop, a médica fica posicionada no lado direito e
  centralizada verticalmente.
- [`src/components/calculadora/calculadora-roi.tsx`](../src/components/calculadora/calculadora-roi.tsx) -> usa limites de largura e `min-w-0` para selects, cards e wrappers no
  mobile.
- [`src/components/formulario-lead.tsx`](../src/components/formulario-lead.tsx) -> reduz padding e limita largura dos campos no mobile.

## Textos Visíveis Do Site

### Cabeçalho

Origem: [`src/components/cabecalho.tsx`](../src/components/cabecalho.tsx)

- Benefícios
- Como funciona?
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
- Ritmo de entrada dos cards no desktop: controlado por `PERCENTUAL_PASSO_BENEFICIO` e `PASSO_MINIMO_BENEFICIO` em
  [`src/components/secao-solucao.tsx`](../src/components/secao-solucao.tsx).
- 01 - Fluxo 100% digital: Menos papel e contratações muito mais rápidas.
- 02 - Cadastro único: O fornecedor preenche uma vez; a empresa acessa sempre atualizado.
- 03 - Status em tempo real: Transparência total para os dois lados acompanharem o processo.
- 04 - Fim do retrabalho: Filtros automáticos eliminam vai e vem de documentos errados.
- 05 - Segurança e compliance: Histórico imutável e auditável para segurança jurídica e fiscal.
- 06 - Proteção contra riscos: Dados protegidos pela LGPD e segurança corporativa contra fraudes.

### Como Funciona

Origem visual: [`src/components/secoes/secao-como-funciona.tsx`](../src/components/secoes/secao-como-funciona.tsx) Origem dos cards:
[`src/data/dadosLanding.ts`](../src/data/dadosLanding.ts)

- Como funciona?
- A Health Sync estrutura cada etapa do credenciamento médico em uma plataforma digital única, auditável e rastreável - para que instituições e médicos assumam o controle do
  processo, economizando tempo e com menos burocracia.
- Etapas do processo de credenciamento
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

- Calcule agora o ROI
- Destaque visual do título "Calcule agora o ROI" sem aumento de fonte.
- A calculadora compacta não reserva espaço lateral para o pino no mobile; o espaço extra fica apenas no desktop.
- Empresa / Hospital / Clínica
- Calcula benefício de contratar a HSS, reduzir tempo e credenciar médicos mais rápido.
- Médico
- Calcula ROI do médico em hospital, clínica particular ou consultório próprio.
- Tipo de cenário configurado no ADM
- Cenário
- Tempo
- Valores
- Custos
- Resultado
- Leitura do cenário
- ROI estimado
- Benefícios mensais
- Custo mensal equivalente
- Prejuízo sem HSS
- Dias economizados
- Receita antecipada
- Payback
- ROI do médico
- Custo inicial total
- Receita líquida mensal
- Dias antecipados
- Repasse mensal
- Composição visual
- Admin
- No-show
- Retrabalho
- Receita antecipada
- Custo inicial
- Líquido mensal
- Destrave para continuar rolando a página.
- Travar calculadora na tela
- Destravar calculadora
- Quando travada no PC/notebook, a calculadora bloqueia a rolagem da página até ser destravada.

### Formulário De Lead

Origem: [`src/components/formulario-lead.tsx`](../src/components/formulario-lead.tsx)

- Transforme a simulação em conversa comercial.
- O formulário captura as informações principais da instituição para uma abordagem B2B consultiva sobre credenciamento médico, redução de tempo e ROI.
- Nome
- E-mail
- Telefone
- Instituição
- Cargo
- Porte
- Pequeno porte
- Médio porte
- Grande porte
- Rede hospitalar
- Mensagem
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
