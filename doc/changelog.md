# Changelog

## v6.22 - Produção alinhada ao preview

01 - Avançada a branch `main` com os commits da branch `ajustes-ortografia-hero-comparativo-v6`.
02 - Preparado novo deploy Cloudflare de produção para alinhar a URL principal ao preview validado.

## v6.21 - Revisão de ortografia e publicação

01 - Revisados termos sem acento em registros recentes de documentação.
02 - Corrigidos links e caminhos do README para refletir `doc/`, `docs/` e o projeto Cloudflare configurado.
03 - Reexecutada a checagem de mojibake comum antes da validação, branch e deploy.

## v6.20 - Cards completos no comparativo em 100vh

01 - Atualizados os cards laterais do comparativo para exibir título e descrição completos nos quatro itens.
02 - Compactados padding, espaçamentos e tipografia dos cards animados e informativos para os quatro caberem no palco desktop de 100vh.
03 - Adicionado tratamento de título e descrição nos cards a partir do texto de `src/data/dadosLanding.ts`.

## v6.19 - Reposicionamento da médica no hero

01 - Corrigido o posicionamento da médica no desktop para ela não ficar pequena e presa no rodapé do hero.
02 - A imagem da médica passou a ficar posicionada no lado direito do hero, centralizada verticalmente e com escala maior.
03 - Mantido o comportamento responsivo no mobile, com a imagem ainda participando do fluxo normal.

## v6.18 - Hero com médica e métricas no padrão Figma

01 - Aumentada e reposicionada a imagem da médica no hero para aproximar a composição da referência do Figma.
02 - Ajustado o card de métricas para exibir `33+`, `73%` e `R$ 504.000` sem truncamento.
03 - Mantidos os rótulos `Dias economizados`, `Redução estimada` e `Prejuízo mensal evitável`.

## v6.17 - Quebra fixa do título do hero

01 - Ajustada a coluna de texto do hero para manter a quebra em três linhas: "Digitalize e simplifique", "o CREDENCIAMENTO" e "MÉDICO".
02 - Aplicado `whitespace-nowrap` nas duas linhas longas do título para evitar quebras internas no desktop.
03 - Reduzida a escala do título em telas estreitas para preservar a quebra sem vazamento horizontal.

## v6.16 - Textos do comparativo Sem HSS e Com HSS

01 - Atualizados os textos do bloco "Sem HSS • processos tradicionais" conforme a referência enviada.
02 - Atualizados os textos do bloco "Com HSS • processo digital" conforme a referência enviada.
03 - Mantidas as cores, estilos, estrutura e animações atuais do projeto.
04 - Atualizado o inventário de textos visíveis em `doc/info_project_files.md`.

## v6.15 - Hero ajustado e revisão de textos visíveis

01 - Ajustado o hero para seguir a referência visual enviada, com a quebra "Digitalize e simplifique / o CREDENCIAMENTO / MÉDICO".
02 - Removida a camada azul artificial atrás da médica, pois `src/assets/medica-hero-hss.png` já contém o fundo azul.
03 - Removida a máscara aplicada na imagem da médica para preservar o fundo original do PNG.
04 - Corrigida a classe Tailwind do grid do hero que estava com `max-w-[calc(100vw-20px)` sem fechamento.
05 - Removidos prefixos internos `sem S`, `sem R`, `com S` e `com R` dos textos visíveis do comparativo Sem HSS / Com HSS.
06 - Revalidados npm install, TypeScript estrito, build e smoke HTTP local.

## v6.14 - Menu A11y mobile

01 - Ocultado o botão SVG flutuante de acessibilidade quando o menu A11y está aberto no mobile.
02 - Destacado o botão de fechar do menu A11y em azul, com sombra e foco visível.

## v6.13 - Reforço responsivo em celulares

01 - Reforcadas quebras de linha e limites de largura nos cards mobile do comparativo Sem HSS / Com HSS.
02 - Ajustada a calculadora compacta para não reservar espaço lateral do pino no mobile.
03 - Reforçados `min-w-0`, `max-w-full` e `overflow-hidden` em selects, botões, cards e wrappers da calculadora.
04 - Ajustado o formulário de lead para reduzir padding e impedir vazamento horizontal em telas estreitas.

## v6.12 - Ajuste mobile S24 e ritmo visual

01 - Ajustado o hero e o cabeçalho para reduzir pressão horizontal em telas estreitas como Samsung S24.
02 - Reduzido o ritmo de scroll necessário para carregar os 6 cards de "Benefícios da nossa solução".
03 - Diminuída a duração e o delay da animação dos cards de benefícios.
04 - Reforçado o destaque visual de "Calcule agora o ROI" sem aumentar o tamanho da fonte.

## v6.11 - Remoção do bloco Diferencial ADM

01 - Removida a seção visível do bloco Diferencial ADM.
02 - Removido o link "Diferencial" do cabeçalho para evitar âncora inexistente.
03 - Removida a cópia oculta desse texto dentro da calculadora.
04 - Atualizada a documentação atual do projeto para não listar mais o bloco Diferencial ADM.

## v6.10 - Mobile informativo e calculadora travada

01 - Ajustado o comparativo Sem HSS / Com HSS no mobile para exibir apenas os arrays `informacoesSemHss` e `informacoesComHss`.
02 - Reforçado o bloqueio de rolagem da página quando a calculadora fica fixada no PC/notebook.
03 - O travamento da calculadora agora bloqueia wheel, touch, teclas de rolagem e mantém a posição da página até destravar.
04 - Atualizada a documentação do projeto com o comportamento novo.

## v6.9 - Conteúdos distintos no comparativo

01 - Separados os textos dos cards laterais e dos cards informativos do bloco "Sem HSS - processo tradicional".
02 - Criados os arrays `informacoesSemHss` e `informacoesComHss` em `src/data/dadosLanding.ts`.
03 - Atualizado o componente de processo comparativo para renderizar cada lado com sua própria fonte de conteúdo.
04 - Atualizada a documentação de mapa e inventário de textos do projeto.

## v6.8 - Header mobile e refinamentos A11y

01 - Transformada a navegação mobile de Benefícios, Como funciona?, Diferencial e Depoimentos em menu sanduíche.
02 - Mantidos Calculadora ROI e Agendar demonstração visíveis no header mobile.
03 - Reduzido o tamanho dos logos alternados no cabeçalho, com escala menor no mobile.
04 - Ajustado o botão A11y para sumir durante a rolagem e reaparecer após 3 segundos sem scroll.
05 - Ajustado o modal de explicação das etapas da calculadora para abrir centralizado, compacto ao texto e fechar ao clicar fora.

## v6.7 - Ajustes finais A11y, mobile e ortografia

01 - Removida a rolagem interna do menu de acessibilidade.
02 - Corrigido o posicionamento do botão A11y em modos de daltonismo, mantendo-o fixo no meio da viewport durante a rolagem.
03 - Substituído o ícone do menu A11y pelo SVG de acessibilidade solicitado.
04 - Ajustada a posição do botão A11y aberto para ficar fora do painel, um pouco mais à esquerda.
05 - Garantido scroll no topo ao atualizar a página.
06 - Reforçado `100vw` em mobile para evitar vazamento horizontal.
07 - Ajustadas as abas da calculadora para aparecerem lado a lado em tablet.
08 - Revisados mojibake e ortografia pt-BR nos arquivos alterados.

## v6.6 - Responsivo tablet/mobile e menu de acessibilidade

01 - Mantida a versão PC/notebook como referência visual principal.
02 - Ajustado o hero em tablet/mobile para centralizar conteúdo, reduzir escalas e impedir que a imagem da médica ultrapasse o fundo azul claro.
03 - Adaptadas as seções de benefícios e processo comparativo para layout estático em tablet/mobile, mantendo o scrollytelling apenas em PC/notebook.
04 - Criado `src/components/menu-acessibilidade.tsx` com menu global de acessibilidade.
05 - Adicionados alto contraste, tamanho de fonte, família de fonte, espaçamento de linhas, cursor grande, filtros de daltonismo, leitura por hover e restauração de padrões.
06 - Adicionadas classes globais A11y em `src/index.css` e filtros SVG para daltonismo.
07 - Atualizado `index.html` para carregar Lexend, Poppins e Inter.

## v6.5 - Calculadora compacta e inventário de textos

01 - Reduzida novamente a altura visual da calculadora, fontes, campos, abas, cards de resultado e composição visual.
02 - Adicionado modo compacto por CSS em `.calculadora-compacta` para facilitar ajustes futuros sem espalhar regras.
03 - Escondido o header automaticamente quando a calculadora é travada pelo botão de pino, liberando mais área útil da tela.
04 - Reduzido o bloco "Composição visual" para ocupar menos altura.
05 - Expandido `doc/info_project_files.md` com inventário dos textos visíveis do site por seção e origem dos arquivos.

## v6.4 - Mapa do site, header, comparativo e calculadora travável

01 - Criado `docs/map_site_info.md` com o mapa dos arquivos que controlam cada informação da landing, ADM, dados e deploy.
02 - Alterado o botão redondo do cabeçalho para abrir o Portal ADM via `#adm`.
03 - Aplicado efeito circulando discreto no link "Calculadora ROI" do cabeçalho, com visual contornado em azul escuro.
04 - Ajustado o bloco "Sem HSS - processo tradicional" com destaque uppercase laranja em "Sem", título em uma linha e cards/bordas em laranja claro.
05 - Ajustado o bloco "Com HSS - processo digital" com destaque uppercase azul em "Com", título em uma linha e cards/bordas em azul claro.
06 - Invertido o bloco "Com HSS - processo digital" para texto à esquerda e cards à direita.
07 - Removido o encaixe magnético automático da calculadora.
08 - Adicionado botão de pino para travar/destravar a calculadora em PC/notebook, com aviso quando o usuário tenta rolar a página travada.
09 - Ajustada a seção da calculadora para caber de "Calcule agora o ROI" até "Composição visual" em área próxima de 95vh.
10 - Alterado o footer para usar ícones de site, LinkedIn, Facebook e Instagram sem nomes visíveis.

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
