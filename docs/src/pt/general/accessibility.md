# Acessibilidade

Este site possui alguns recursos de acessibilidade.

## Pular para o conteúdo

Todas as páginas possuem um link interno para pular para
o conteúdo principal. Ele pode ser utilizado por usuários
que naveguem utilizando somente o teclado ou através de um
leitor de tela para ir direto para a parte principal da página.

## Pular para a navegação

Em páginas como o Dashboard, você também encontrará um link
interno para pular diretamente para a navegação principal.

## Menus

Os menus utilizados da biblioteca Headless UI seguem as recomendações
dos padrões da WAI-ARIA. Os comandos com teclado podem ser consultados
na tabela abaixo.

| Comando                 | Descrição                                                     |
| ----------------------- | ------------------------------------------------------------- |
| [[Enter]] ou [[Espaço]] | Abre o menu e foca no primeiro item não desabilitado.         |
| [[↑]] ou [[↓]]          | Abre o menu e foca no primeiro/último item não desabilitado.  |
| [[Esc]]                 | Fecha qualquer menu aberto.                                   |
| [[↑]] ou [[↓]]          | Quando aberto, foca no próximo item/item anterior.            |
| [[Home]] ou [[End]]     | Quando aberto, foca no primeiro/último item não desabilitado. |
| [[Enter]] ou [[Espaço]] | Quando aberto, ativa/clica no item atual.                     |
| [[A-Z]] ou [[a-z]]      | Quando aberto, foca no primeiro item que corresponde a tecla. |

## Navegação

O site possui carregamento dinâmico dos conteúdos. Quando
a rota é alterada, o leitor de tela é informado através de uma
modificação em um elemento de controle.

## Animações

O site respeita a configuração no sistema operacional, se disponível,
para desabilitar animações não-essenciais. Você pode encontrar
esta configuração na seção de Acessibilidade de seu computador
e/ou dispositivo.

## Interação com teclado

O site suporta a utilização apenas com o teclado. A navegação tenta
ao máximo implementar as boas práticas e teclas comumente utilizadas,
conforme as tabelas de comandos disponíveis abaixo.

### Operações simples

Todos os componentes HTML5 suportam estes comandos.

| Comando                 | Descrição                                              |
| ----------------------- | ------------------------------------------------------ |
| [[Tab]]                 | Pula e foca no próximo componente.                     |
| [[Shift]] + [[Tab]]     | Pula e foca no componente anterior.                    |
| [[Enter]] ou [[Espaço]] | Efetua a ação do botão ou seleciona caixas de seleção. |

### Operações em componentes selecionáveis

Componentes selecionáveis incluem a grade de grupos e de livros, a tabela
de livros na biblioteca e o navegador no início do *dashboard*.

| Comando                                     | Descrição                                            |
| ------------------------------------------- | ---------------------------------------------------- |
| [[↑]] ou [[↓]]                              | Desce/sobe para o item abaixo/acima.                 |
| [[→]] ou [[←]]                              | Avança/retrocede em um item para a direita/esquerda. |
| [[Home]] ou [[End]]                         | Pula para o primeiro/último item.                    |
| [[Shift]] + [[↓]] ou [[Shift]] + [[↑]]      | Aumenta a seleção no sentido inferior/superior.      |
| [[Shift]] + [[End]] ou [[Shift]] + [[Home]] | Seleciona do item atual até o último/primeiro.       |
| [[Ctrl]] + [[↓]] ou [[Ctrl]] + [[↑]]        | Move o cursor para baixo/cima.                       |
| [[Ctrl]] + [[End]] ou [[Ctrl]] + [[Home]]   | Move o cursor para o último/primeiro item.           |
| [[Ctrl]] + [[A]]                            | Seleciona/desseleciona todos os itens.               |
| [[Ctrl]] + [[K]]                            | Abre a tela de busca na coleção, quando ativada.     |

Em sistemas macOS, utilize o [[Command]] no lugar do [[Ctrl]].

## Problemas de acesso

Caso encontre algum problema com o acesso ou alguma implementação
feita de maneira incorreta, por favor, abra uma *Issue* em nosso
[repositório no GitHub].

[repositório no GitHub]: https://github.com/alessandrojean/toshokan/issues/new/choose
