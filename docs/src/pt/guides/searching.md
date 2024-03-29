# Pesquisando

Após ter cadastrado os livros de sua coleção, você pode pesquisar
na sua biblioteca através da barra de busca no cabeçalho.

## Modo simples

Digite sua pesquisa para apenas buscar nos campos de _código_,
_título_ e _autor_.

A busca na planilha será feita com o operador lógico `OU`, isto é,
quaisquer livros que tenham correspondências em alguns dos campos
citados anteriormente, seja em um ou em vários, será retornado.

Utilizar a pesquisa simples pode ser problemático em alguns casos
em que é necessário filtrar os resultados. Por exemplo, imagine que
em sua coleção cadastrou os volumes do mangá _AKIRA_ e de
_Dragon Ball_, e você quer buscar pelo mangá _AKIRA_, porém a pesquisa
te retornará não só os mangás corretos, mas também os de _Dragon Ball_,
visto que há uma correspondência no campo autor dos mangás (**Akira**
Toriyama). Este problema pode ser corrigido ao se utilizar o modo
avançado, explicado na próxima seção.

## Modo avançado

A pesquisa no modo avançado permite com que sejam específicados
os campos em que o termo será procurado, bem como utilizar
alguns filtros adicionais temporais.

A sintaxe é a mesma utilizada em diversos outros aplicativos,
como o Twitter ou Discord. Você deve utilizar a palavra-chave
seguida de dois pontos e o termo, colocando aspas ao redor
dele caso contenha espaços.

Dando continuidade ao exemplo da seção anterior, o problema poderia
ser facilmente solucionado ao pesquisar por `título:akira`,
que limitaria a pesquisa somente ao campo de título dos livros,
removendo os mangás de _Dragon Ball_ dos resultados.

Abaixo você encontra a relação de todas as palavras-chave disponíveis,
bem como a explicação de seu funcionamento individual.

## Palavras-chave textuais

As seguintes palavras-chave esperam o termo buscado **seja uma cadeia de
caracteres**, isto é, um texto, desde que esteja envolto por aspas duplas
caso contenha espaços.

| Palavra-chave   | Descrição                                                       |
| --------------- | --------------------------------------------------------------- |
| `id`            | Pesquisa pelo livro com ID estritamente igual ao termo.         |
| `código`        | Pesquisa pelos livros com o código estritamente igual ao termo. |
| `título`        | Pesquisa pelo termo dentro do título.                           |
| `grupo`         | Pesquisa pelo termo dentro do grupo.                            |
| `autor`         | Pesquisa pelo termo dentro dos autores.                         |
| `editora`       | Pesquisa pelo termo dentro da editora.                          |
| `loja`          | Pesquisa pelo termo dentro do local de compra.                  |
| `observações`   | Pesquisa pelo termo dentro das observações.                     |
| `tag`           | Pesquisa pelo termo dentro das tags.                            |

## Palavras-chave temporais

As seguintes palavras-chave esperam que o termo buscado **seja uma data
válida** no formato `YYYY`, `YYYY-MM` ou `YYYY-MM-DD`. Não é
necessário envolver a data em aspas duplas, já que o formato esperado
não permite espaços.

| Palavra-chave            | Descrição                                                          |
| ------------------------ | ------------------------------------------------------------------ |
| `comprado-em`            | Pesquisa por livros comprados em tal data, mês ou ano.             |
| `comprado-antes-de`      | Pesquisa por livros comprados exclusivamente antes de tal data.    |
| `comprado-depois-de`     | Pesquisa por livros comprados exclusivamente depois de tal data.   |
| `lido-em`                | Pesquisa por livros lidos em tal data, mês ou ano.                 |
| `lido-antes-de`          | Pesquisa por livros lidos exclusivamente antes de tal data.        |
| `lido-depois-de`         | Pesquisa por livros lidos exclusivamente depois de tal data.       |
| `criado-em`              | Pesquisa por livros criados em tal data, mês ou ano.               |
| `criado-antes-de`        | Pesquisa por livros criados exclusivamente antes de tal data.      |
| `criado-depois-de`       | Pesquisa por livros criados exclusivamente depois de tal data.     |
| `atualizado-em`          | Pesquisa por livros atualizados em tal data, mês ou ano.           |
| `atualizado-antes-de`    | Pesquisa por livros atualizados exclusivamente antes de tal data.  |
| `atualizado-depois-de`   | Pesquisa por livros atualizados exclusivamente depois de tal data. |

## Combinando múltiplos usos

Caso sua pesquisa inclua múltiplas palavras-chave iguais,
seus usos podem ser combinados em apenas um, juntando os
termos por uma vírgula.

Por exemplo, `editora:jbc editora:newpop` pode ser
substituido por `editora:jbc,newpop`, e os resultados
serão exatamente os mesmos.

## Excluindo itens

Todas as palavras-chave suportam o uso de seu inverso (exclusão)
ao utilizá-la com um sinal de menos no começo.

Por exemplo, usar `-editora:panini` buscará todos os livros
que **não tenham** a correspondência de "panini" no campo
da editora.

## Exemplos

`comprado-em:2022-01 grupo:mangás`
: Livros que sejam do grupo "mangás" **e** foram comprados
  entre o período de 01/01/2022 e 31/01/2022 (inclusive).

`sword art online grupo:novels`
: Livros que tenham "sword art online" no título **e**
  sejam do grupo "novels".

`grupo:mangás -editora:panini`
: Livros que sejam do grupo "mangás" **e** não
  sejam da editora "panini".
