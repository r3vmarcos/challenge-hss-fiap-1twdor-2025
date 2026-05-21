# Histórico de prompts do projeto

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

## 2026-05-21 - Ajustes finais A11y e responsivo

Pedido: remover rolagem do menu A11y, manter o botão fixo no meio da tela, corrigir Protanopia, trocar o ícone pelo SVG de acessibilidade, posicionar melhor o botão com menu aberto, iniciar sempre no topo ao atualizar, reforçar 100vw no mobile, alinhar abas da calculadora no tablet e revisar mojibake/pt-BR.

Aplicação: o menu A11y foi compactado sem rolagem interna, o filtro de daltonismo deixou de afetar o botão fixo, o ícone foi atualizado, a página passa a iniciar no topo, o mobile foi protegido contra overflow horizontal, as abas aparecem lado a lado em tablet e a codificação dos arquivos alterados foi revisada.
