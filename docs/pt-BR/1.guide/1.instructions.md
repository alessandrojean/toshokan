---
title: Instruções de uso
category: guide
date: 2022-03-09T12:04:00.000-03:00
---

O Toshokan é um utilitário com o objetivo de prover uma interface
de usuário amigável para um melhor gerenciamento de sua planilha
de coleção de mangás, quadrinhos, livros e impressos em geral.

A planilha, por sua vez, deve seguir um _template_ bem estrito,
que deve ser copiado para sua conta do Google Drive para que a aplicação
possa ter acesso.

A aplicação somente lê e altera as informações na planilha,
assim você ainda tem controle total sobre seus dados da coleção e
poderá manipulá-los facilmente caso queira exportá-los ou utilizá-los
em outro serviço, por exemplo.

[[toc]]

## Antes de começar

Na primeira utilização, você deve realizar o procedimento de criação
do arquivo da planilha que conterá suas informações da coleção.

- Autentique-se com sua conta no site do [Google Drive].
- Acesse [esta planilha] e faça uma cópia em **Arquivo → Fazer uma cópia**.
- **Não renomeie o arquivo**, o nome deve ser mantido como **Toshokan**.

Nas próximas vezes, a planilha copiada será escolhida automaticamente.

[Google Drive]: https://drive.google.com/
[esta planilha]: #

## Autenticando-se

Tendo copiado a planilha para seu Google Drive, você já pode começar
a gerenciar sua coleção no Toshokan, autenticando-se com sua
Conta do Google.

- Acesse a página inicial e clique em **Entrar com Google**.
- Permita o acesso do Toshokan às informações requisitadas em sua conta.

Nas próximas vezes, você não precisará conceder a permissão novamente.

### Sobre o uso de suas informações pessoais

O Toshokan é uma aplicação de código-aberto, estática e totalmente
renderizada no lado do navegador, isto é, não possuímos um servidor
próprio para armazenar seus dados e nem nos comunicamos com
serviços externos para repassar seus dados.

Você pode remover a permissão de acesso
do utilitário a suas planilhas e arquivos do Google Drive
a qualquer momento em suas configurações da Conta do Google.

Você pode ler mais sobre em nossa Política de Privacidade.

## Criando o primeiro livro

Ao entrar pela primeira vez, por conta da planilha estar vazia,
você será informado e convidado a criar o primeiro livro através
do utilitário.

Caso a pesquisa por ISBN esteja habilitada, você poderá realizar
a pesquisa e obter um formulário pré-preenchido com os metadados
do livro na próxima etapa, isso se o código é válido e um livro
com tal código existe no banco de dados do provedor.

![Primeira etapa: pesquisa por ISBN.](@/assets/about/new-book-step-01.jpg)

O ISBN para a pesquisa pode ser digitado com ou sem os hífens,
e a pesquisa também funciona para livros mais antigos que utilizem
o ISBN de 10 dígitos. Entretanto, a pesquisa só irá retornar
resultados de livros publicados no território nacional, ou seja,
livros em que o código começa com **978-85** ou **978-65**.

Caso a pesquisa não retorne nenhum resultado ou o livro não
possui um ISBN brasileiro, você poderá optar por
**Preencher manualmente**.

![Segunda etapa: preenchimento dos metadados do livro.](@/assets/about/new-book-step-02.jpg)

As informações do livro no provedor de pesquisa não necessariamente
estão corretas e/ou seguem um padrão, portanto na maioria das vezes
você precisará realizar pequenos ajustes nos metadados. Na imagem acima,
o mangá teve seu título e autor cadastrado com caixa alta, e precisa
ser arrumado.

## Os metadados do livro

Abaixo você encontra uma explicação sucinta de cada metadado.

Identificação
: Geralmente o ISBN do livro, mas outros códigos únicos como
  o ISSN ou EAN podem ser utilizados em sua ausência.
  Em publicações independentes, o valor **N/A**
  (não se aplica) pode ser utilizado.

Título
: Nome oficial do livro. Em casos de publicações seriadas, isto
  é, com mais de um volume, pode-se utilizar o caractere
  **#** (cerquilha) seguido do número.

  **Exemplo:** Lobo Solitário #05: O Segredo do Vento Sul

Autores
: Pessoas envolvidas na criação do livro, tais como escritores,
  roteiristas, desenhistas, letristas etc. Em caso de múltiplas pessoas,
  você deve separar os nomes pelo caractere de
  **ponto-e-vírgula**.

  **Exemplo:** Kazuo Koike; Goseki Kojima

Editora
: Editora que lançou a edição nacional do livro. Algumas vezes
  o valor retornado pelo provedor é incorreto e o utilitário realizará
  a correção, mas pode ser que você ainda precise modificar manualmente.

Grupo
: Grupo que este livro possui em comum com outros em sua coleção.
  Apesar de idealmente o recomendado ser utilizar o tipo de publicação
  (tal como "livros", "quadrinhos" ou "mangás"), você também pode, se
  desejar, utilizar o nome da obra em casos com vários volumes.

  Você deve preencher esta informação manualmente sempre.

Dimensões
: Relação de largura e altura, em centímetros. Os valores
  podem ter no máximo um dígito na casa decimal.

Preço de capa
: Preço cheio do livro. Você pode utilizar até dois dígitos
  para as casas decimais.

  Em caso de livros importados, você poderá trocar a moeda
  na caixa de seleção ao lado, escolhendo pelo código equivalente
  no [ISO 4217].

Preço pago
: Preço promocional pago na compra. Quando não se aplicar,
  você deve preencher com o valor do preço de capa.
  Você também pode trocar a moeda utilizada.

Loja
: Local onde a compra do livro foi realizada. Você pode preencher
  com o valor **Desconhecido** quando não se recordar
  ou quando não quiser preencher.

Data de entrada
: Data quando o item entrou na sua coleção. É utilizado para
  gerar as estatísticas de gastos mensais. Caso você não recorde
  ou não possua mais esta informação, você pode deixar o valor
  do campo em branco apagando o dia, mês e ano.

![Metadados do livro preenchidos corretamente.](@/assets/about/new-book-step-03.jpg)

[ISO 4217]: https://pt.wikipedia.org/wiki/ISO_4217

## Imagem de capa

Após preencher os metadados do livro, você poderá escolher uma
imagem de capa obtida automaticamente da Amazon ou do site da editora,
ou providenciar uma URL válida para uma imagem personalizada.

Caso você queira deixar o sem imagem, basta não selecionar
nenhuma das opções.

![Terceira etapa: escolha da imagem de capa.](@/assets/about/new-book-step-04.jpg)

## Revisão das informações

Com os metadados preenchidos e a imagem de capa escolhida,
você pode realizar uma última revisão das informações antes
de concluir o procedimento e adicionar o novo livro na planilha.

![Quarta etapa: revisão das informações.](@/assets/about/new-book-step-05.jpg)

Caso todas as informações estejam corretas, você deve
clicar em **Concluir**.

![Diálogo de confirmação de criação.](@/assets/about/new-book-step-06.jpg)

Com isso, o livro será adicionado na planilha e você poderá em
seguida optar por **Visualizar**, caso queira ir direto para a
página com as informações, ou **Novo livro** caso queira
adicionar um em sequência.

![Página das informações do livro.](@/assets/about/new-book-step-07.jpg)

Agora o livro está salvo na planilha e você já pode continuar
o procedimento ao inserir novos ou explorar sua biblioteca
através do item **Biblioteca** na navegação principal.
