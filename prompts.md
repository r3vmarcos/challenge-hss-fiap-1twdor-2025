# Histórico de prompts do projeto

## 2026-06-08 - Ajustes finais de interface, GitHub e deploy

Pedido: adicionar GitHub no footer, corrigir o destravamento da calculadora para não rolar do topo, revisar ortografia/mojibakes, publicar no GitHub na main e fazer deploy Cloudflare main.

Aplicação: o footer recebeu link para o repositório GitHub, a calculadora deixou de usar reposicionamento via `body: fixed` no travamento, os ajustes visuais recentes foram preservados e a validação local foi executada antes da publicação.

## 2026-06-08 - Cards de benefícios sem números

Pedido: remover a numeração dos cards de benefícios, colocar os ícones no topo direito como marca d'água translúcida e diminuir 20% da altura dos cards.

Aplicação: a seção de benefícios foi ajustada para exibir os ícones como marca d'água translúcida no canto superior direito, retirar os números visíveis e compactar o padding/altura dos cards em desktop e mobile.

## 2026-05-22 - Commit main e deploy Cloudflare

Pedido: fazer os commits, publicar na branch `main` do GitHub e fazer deploy `main` no Cloudflare.

Aplicação: a rodada incluiu validação com `npm install`, TypeScript estrito, build, commit na `main`, push para GitHub e deploy de produção no Cloudflare Pages.

## 2026-05-22 - Link Diferencial no cabeçalho

Pedido: colocar no header o item "Diferencial" levando para "Sem HSS • processos tradicionais".

Aplicação: o cabeçalho recebeu o link `Diferencial` apontando para `#processo-sem-hss`, mantendo a ordem Benefícios, Como funciona?, Diferencial e Depoimentos.

## 2026-05-22 - Alinhamento da produção Cloudflare

Pedido: informar que `https://hssfiap-chalange-1twdor-2025.pages.dev/` estava diferente do preview `https://8f571eb8.hssfiap-chalange-1twdor-2025.pages.dev`.

Aplicação: a branch `main` recebeu os commits da branch de ajuste para que o deploy de produção da URL principal fique alinhado ao preview validado.

## 2026-05-22 - Revisão de ortografia, branch e deploy

Pedido: fazer um check de ortografia e mojibakes, criar branch no GitHub e fazer deploy no Cloudflare.

Aplicação: a documentação recebeu correções pontuais de acentuação, o README foi alinhado ao projeto Cloudflare configurado, a checagem de mojibake comum foi aprovada e a branch `ajustes-ortografia-hero-comparativo-v6` foi publicada com deploy de preview no Cloudflare.

## 2026-05-22 - Cards completos no comparativo em 100vh

Pedido: aumentar/ajustar os cards do comparativo para caberem os quatro em 100vh, usando os textos completos de Etapa tradicional 01 a 04 e Ganho digital 01 a 04.

Aplicação: os cards laterais passaram a usar título e descrição completos, o componente separa título/descrição automaticamente e os cards animados/informativos foram compactados para caber no palco desktop de 100vh.

## 2026-05-22 - Reposicionamento da médica no hero

Pedido: corrigir a imagem da médica, que estava errada no hero.

Aplicação: no desktop, a imagem saiu do alinhamento inferior do grid e passou a ficar posicionada no lado direito do hero, centralizada verticalmente e com escala maior; no mobile, a imagem continua no fluxo normal.

## 2026-05-22 - Hero com médica e métricas no padrão Figma

Pedido: arrumar a imagem da médica e as informações do hero para ficar como a imagem do Figma, usando `33+`, `Dias economizados`, `73%`, `Redução estimada`, `R$ 504.000` e `Prejuízo mensal evitável`.

Aplicação: a imagem da médica foi ampliada e deslocada no bloco direito; o card de métricas passou a usar valores fixos e removeu truncamento para mostrar `R$ 504.000` por completo.

## 2026-05-22 - Quebra fixa do título do hero

Pedido: garantir que o título do hero fique com a quebra exata em três linhas: "Digitalize e simplifique", "o CREDENCIAMENTO" e "MÉDICO".

Aplicação: a coluna do texto foi ampliada no desktop, as linhas longas receberam `whitespace-nowrap` e a escala em telas pequenas foi reduzida para evitar quebras internas.

## 2026-05-22 - Textos do comparativo Sem HSS e Com HSS

Pedido: usar os textos das imagens enviadas nas partes Sem HSS e Com HSS, mantendo apenas os textos e preservando as cores e estilos atuais.

Aplicação: os títulos, descrições e itens dos arrays `problemasSemHss`, `informacoesSemHss`, `ganhosComHss` e `informacoesComHss` foram atualizados sem alterar a estrutura visual dos componentes.

## 2026-05-22 - Hero igual à referência visual

Pedido: ajustar o hero para ficar igual à imagem enviada, usando o fundo azul já existente em `medica-hero-hss.png` e quebrando o título em "Digitalize e simplifique / o CREDENCIAMENTO / MÉDICO".

Aplicação: o título do hero passou a ter três linhas controladas, a camada azul artificial foi removida, a máscara da imagem foi retirada e a escala do grid/imagem foi ajustada para preservar o PNG original.

## 2026-05-22 - Revisão de referências, mojibake e pt-BR

Pedido: verificar se havia algo errado no código, algo sem referência, mojibake e problemas de ortografia em pt-BR.

Aplicação: a checagem de imports e variáveis sem uso passou limpa; a classe Tailwind quebrada do hero foi corrigida; os prefixos internos dos textos do comparativo foram removidos; a codificação UTF-8 e a ortografia dos trechos alterados foram revalidadas.

## 2026-05-22 - Menu A11y mobile

Pedido: no mobile, ao abrir o menu de acessibilidade, ocultar o SVG flutuante A11y e destacar o botão de fechar em azul.

Aplicação: o botão flutuante do menu A11y fica invisível e sem eventos no mobile quando o painel está aberto; o botão de fechar recebeu fundo azul, texto branco, sombra e foco visível.

## 2026-05-22 - Reforço responsivo em celulares

Pedido: verificar e ajustar itens que saem da tela em alguns celulares e elementos que não redimensionam corretamente para 100vw.

Aplicação: os cards mobile do comparativo receberam limites e quebra de linha mais fortes, a calculadora deixou de reservar espaço lateral do pino no mobile, selects/botões/wrappers ganharam `min-w-0` e limites de largura, e o formulário de lead foi compactado para telas estreitas.

## 2026-05-21 - Ajuste Samsung S24 e ritmo dos cards

Pedido: corrigir exibição mobile no Samsung S24 em relação à largura da viewport, acelerar a entrada dos cards de "Benefícios da nossa solução" e destacar "Calcule agora o ROI" sem aumentar a fonte.

Aplicação: o hero e o cabeçalho receberam ajustes de largura, espaçamento e escala mobile; os cards de benefícios passaram a aparecer com menos scroll e animação mais rápida; o título da calculadora recebeu destaque visual em formato de pílula mantendo o tamanho de fonte.

## 2026-05-21 - Remoção do bloco Diferencial ADM

Pedido: retirar da landing o bloco Diferencial ADM indicado pelo usuário.

Aplicação: a seção do Diferencial ADM foi removida da landing, o link correspondente saiu do cabeçalho, o componente do bloco foi excluído e a cópia oculta do texto na calculadora também foi limpa.

## 2026-05-21 - Mobile informativo, bloqueio da calculadora, commits e deploy

Pedido: no mobile exibir apenas `informacoesSemHss` e `informacoesComHss`; no PC/notebook, ao fixar a calculadora, impedir a rolagem da página; fazer commits e deploys.

Aplicação: o layout compacto do comparativo passou a renderizar apenas `informacoes`, o travamento da calculadora passou a congelar a posição da página e bloquear wheel, touch e teclas de rolagem, e a documentação foi atualizada antes da validação, commit e deploy.

## 2026-05-21 - Conteúdos distintos no comparativo Sem HSS

Pedido: no bloco "Sem HSS - processo tradicional", separar o conteúdo exibido no lado dos cards do conteúdo exibido no lado da informação, pois os dois lados estavam iguais.

Aplicação: foram criados textos informativos separados em `dadosLanding.ts`, o componente `secao-processo-comparativo.tsx` passou a receber `itens` e `informacoes`, e a documentação foi atualizada para indicar os arrays corretos de cada lado.

## 2026-05-21 - Revisão estrutural e publicação

Pedido: inspecionar o projeto, separar cada parte do site em componentes para facilitar modificações, revisar ortografia global em pt-BR, listar melhorias possíveis, criar README no padrão GitHub, criar repositório, publicar no GitHub, fazer deploy no Cloudflare no projeto `hssfiap-chalange-1twdor-2025` e gerar commit local/remoto.

Aplicação: a landing foi reorganizada em páginas, layout e seções independentes; os textos em pt-BR foram revisados após correção de codificação; a documentação foi atualizada; o fluxo de validação, GitHub e Cloudflare foi iniciado nesta versão.

## 2026-05-21 - Revisão de fluidez, limpeza e deploy

Pedido: verificar a fluidez do projeto, limpar código não usado, revisar ortografia pt-BR e fazer os deploys.

Aplicação: foram preservados os ajustes visuais já aplicados, removidos arquivos e exports sem uso, padronizados comentários, revisados textos ativos em pt-BR, atualizada a documentação e executado novo ciclo de validação, commit, push e deploy.

## 2026-05-21 - Mapa do site e refinamentos de interação

Pedido: criar `docs/map_site_info.md` explicando onde modificar cada parte da página, ajustar o cabeçalho com Portal ADM e efeito no link da calculadora, refinar os blocos Sem HSS/Com HSS, remover o encaixe magnético da calculadora, adicionar botão de pino para travar a calculadora e trocar textos do footer por ícones.

Aplicação: o mapa de edição foi criado, os botões do cabeçalho foram ajustados, o comparativo ganhou cores e ordem solicitadas, a calculadora passou a ter travamento manual em desktop e o footer passou a exibir apenas ícones sociais.

## 2026-05-21 - Calculadora compacta e textos no info project

Pedido: diminuir mais a altura, fontes e campos da calculadora, esconder o header ao travar a calculadora, reduzir "Composição visual" e listar cada texto do site em `doc/info_project_files.md`.

Aplicação: a calculadora recebeu modo compacto, o header passa a ocultar no modo travado, a composição visual foi reduzida e o inventário de textos visíveis foi adicionado à documentação do projeto.

## 2026-05-21 - Responsivo e menu de acessibilidade

Pedido: manter a versão PC/notebook, adaptar tablet/mobile, corrigir a imagem da médica para não ultrapassar o fundo azul claro e adicionar ao portal um menu A11y com todos os recursos informados.

Aplicação: o hero foi ajustado em telas menores, benefícios e comparativo passaram a ter fallback estático em tablet/mobile, foi criado o componente global `MenuAcessibilidade` e adicionadas opções de contraste, fonte, tamanho, espaçamento, cursor, daltonismo, leitura por hover e restauração de padrões.

## 2026-05-21 - Header mobile e modal de explicação

Pedido: no mobile deixar Benefícios, Como funciona?, Diferencial e Depoimentos como menu sanduíche; manter Calculadora ROI e Agendar demonstração no header; reduzir logos; fazer o botão A11y sumir ao rolar e reaparecer em 3 segundos; deixar o modal "!" central, compacto ao texto e fechando ao clicar fora.

Aplicação: o cabeçalho mobile passou a exibir CTAs diretos e menu sanduíche para os links de navegação, os logos foram reduzidos por CSS, o botão A11y ganhou temporização no scroll e o modal de explicação das etapas da calculadora ficou compacto, centralizado e com fechamento pelo backdrop.

## 2026-05-21 - Ajustes finais A11y e responsivo

Pedido: remover rolagem do menu A11y, manter o botão fixo no meio da tela, corrigir Protanopia, trocar o ícone pelo SVG de acessibilidade, posicionar melhor o botão com menu aberto, iniciar sempre no topo ao atualizar, reforçar 100vw no mobile, alinhar abas da calculadora no tablet e revisar mojibake/pt-BR.

Aplicação: o menu A11y foi compactado sem rolagem interna, o filtro de daltonismo deixou de afetar o botão fixo, o ícone foi atualizado, a página passa a iniciar no topo, o mobile foi protegido contra overflow horizontal, as abas aparecem lado a lado em tablet e a codificação dos arquivos alterados foi revisada.
## 2026-06-08 - Contatos no ADM, calculadora em aba, commit e deploy

Pedido: certificar que o banco de dados armazena os dados de contato do formulário, criar uma aba para mostrar as pessoas que preencheram o formulário e querem contato, criar outra aba para configurar a calculadora, checar ortografia pt-BR e mojibakes, fazer primeiro commit, criar repositório público `challenge-hss-fiap-1twdor-2025` na `main` e fazer deploy no Cloudflare com o mesmo nome.

Aplicação: a API `/api/leads` passou a listar leads ativos do D1 por `GET`, o painel ADM ganhou abas `Contatos` e `Calculadora`, os textos pontuais com erro real foram corrigidos, o projeto foi revalidado com instalação, build e smoke HTTP local, a configuração Cloudflare foi renomeada para `challenge-hss-fiap-1twdor-2025`, o repositório público GitHub foi criado e o deploy Cloudflare ficou bloqueado por ausência de autenticação/token no ambiente.
