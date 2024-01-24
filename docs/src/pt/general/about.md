# Sobre o projeto

Nesta página você irá descobrir um pouco mais sobre o projeto.

## As motivações

O projeto foi criado por conta de várias limitações nos sites de
gerenciamento de coleção de mangás e quadrinhos, tais como:

- Design desatualizado e sem compatibilidade com _mobile_;
- Marca d'água nas capas dos livros;
- Site lento ou quebrado;
- Falta de campos melhores para categorização;
- Código fechado e privacidade do usuário duvidosa;
- Sem suporte para marcar como lido e histórico de leitura.

Também não existia nenhum utilitário (_offline_ ou não) que permitia que
o usuário tivesse total controle sobre os dados de sua coleção. Já que
nenhum dos sites banco de dados existentes tem uma API pública, o projeto
teria que depender em preenchimento manual, mas isto é um problema ínfimo
levando em consideração a vantagem de realmente ser o dono dos seus dados.

## O _script_ para planilha

O primeiro conceito deste utilitário foi criado diretamente no Planilhas
do Google, utilizando o ambiente de _script_ disponibilizado, o _Google
Apps Script_. Foi útil para a criação e edição dos livros, pas era ruim
de visualizar os dados somente por uma tabela, era uma das limitações.

Desde o começo, já existiam a busca de ISBN e capas, uns dos principais
recursos que ajudam bastante na criação das fichas.

## A primeira versão

O primeiro site foi criado usando [Vue.js] (o mesmo _framework_ que é
usado na versão atual) e [Vuetify] como o kit de UI. Mesmo tendo funcionado
bem, a performance não era tão boa, a UI era lenta e o utilitário fazia
um péssimo uso dos dados na memória, requisitando todos os dados da
planilha de uma vez e trabalhando localmente com eles.

[Vue.js]: https://vuejs.org/
[Vuetify]: https://vuetifyjs.com/

## A versão atual

A versão atual é mais otimizada e usa o [Tailwind CSS] para a UI.
É feito usando [Vite] e [Netlify]. O algoritmo de requisição de dados
foi melhorado e carrega muito mais rápidamente em comparação a primeira
versão disponível.

[Tailwind CSS]: https://tailwindcss.com/
[Vite]: https://vitejs.dev/
[Netlify]: https://www.netlify.com/

## Desenvolvimento

O projeto ainda está em Beta, então seu uso para catalogação é limitado
para poucos _beta testers_, e não estamos abertos para novos no momento,
sentimos muito.

Se não fosse pelos _beta testers_, o projeto nunca estaria em constante
melhoria e otimização. Agradecemos bastante a colaboração e _feedback_.

Se você encontrar algum _bug_ ou problema, agradecemos se você tiver
um tempo para reportar **(em inglês)** no nosso [repositório do GitHub],
preenchendo um dos formulários de _Issues_.

[repositório do GitHub]: https://github.com/alessandrojean/toshokan/issues/new/choose/

## Doações individuais

Se você acredita que o projeto é útil para você e deseja contribuir,
você pode fazer uma doação através do [Ko-fi] ou [GitHub Sponsors].
Agradecemos bastante!

[Ko-fi]: https://ko-fi.com/alessandrojean/
[GitHub Sponsors]: https://github.com/sponsors/alessandrojean/

## Patrocínio

Se você tem um negócio relacionado a mangás, quadrinhos ou livros (tal
como uma loja, por exemplo), e deseja patrocinar o projeto mensalmente,
por favor abra uma _Issue_ no nosso [repositório do GitHub] para
que possamos discutir sobre.

Patrocinando o projeto, seu logo será incluido no arquivo `README.md`
e na página inicial e _sidebars_ da Central de Ajuda, dependendo
do plano de patrocínio escolhido.

Ainda não estabelecemos os planos disponíveis, mas fique de olho
nesta páginas para atualizações eventuais se deseja que seu
negócio patrocine o projeto.

[repositório do GitHub]: https://github.com/alessandrojean/toshokan/issues/new/choose/
