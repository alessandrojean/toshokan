<template>
  <Content>
    <ContentTitle>Instruções de uso</ContentTitle>
    <ContentBody>
      <p>
        O Toshokan é um utilitário com o objetivo de prover uma interface
        de usuário amigável para um melhor gerenciamento de sua planilha
        de coleção de mangás, quadrinhos, livros e impressos em geral.
      </p>
      <p>
        A planilha, por sua vez, deve seguir um <em>template</em> bem estrito,
        que deve ser copiado para sua conta do Google Drive para que a aplicação
        possa ter acesso.
      </p>
      <p>
        A aplicação somente lê e altera as informações na planilha,
        assim você ainda tem controle total sobre seus dados da coleção e
        poderá manipulá-los facilmente caso queira exportá-los ou utilizá-los
        em outro serviço, por exemplo.
      </p>

      <h2>Antes de começar</h2>

      <p>
        Na primeira utilização, você deve realizar o procedimento de criação
        do arquivo da planilha que conterá suas informações da coleção.
      </p>

      <ol>
        <li>
          Autentique-se com sua conta no site do
          <a href="https://drive.google.com/" rel="noopener noreferrer" target="_blank">Google Drive</a>.
        </li>
        <li>
          Acesse <a href="#">esta planilha</a> (em breve) e faça uma cópia
          em <span class="command">Arquivo → Fazer uma cópia</span>.
        </li>
        <li>
          <strong>Não renomeie o arquivo</strong>, o nome deve
          ser mantido como <strong>Toshokan</strong>.
        </li>
      </ol>

      <p>
        Nas próximas vezes, a planilha copiada será escolhida automaticamente.
      </p>

      <h2>Autenticando-se no Toshokan</h2>

      <p>
        Tendo copiado a planilha para seu Google Drive, você já pode começar
        a gerenciar sua coleção no Toshokan, autenticando-se com sua
        Conta do Google.
      </p>

      <ol>
        <li>
          Acesse a
          <router-link :to="{ name: 'Home' }" target="_blank">
            página de login
          </router-link>
          e clique em <span class="command">Entrar com Google</span>.
        </li>
        <li>
          Permita o acesso do Toshokan as informações requisitadas em sua conta.
        </li>
      </ol>

      <p>
        Nas próximas vezes, você não precisará conceder a permissão novamente.
      </p>

      <h3>Sobre o uso de suas informações pessoais</h3>

      <p>
        O Toshokan é uma aplicação de código-aberto, estática e totalmente
        renderizada no lado do navegador, isto é, não possuímos um servidor
        próprio para armazenar seus dados e nem nos comunicamos com
        serviços externos para repassar seus dados.
      </p>

      <p>
        Você pode remover a permissão de acesso
        do utilitário a suas planilhas e arquivos do Google Drive
        a qualquer momento em suas configurações da Conta do Google.
      </p>

      <p>
        Você pode ler mais sobre em nossa
        <router-link :to="{ name: 'PrivacyPolicy' }">Política de Privacidade</router-link>.
      </p>

      <h2>
        Criando o primeiro livro
      </h2>

      <p>
        Ao entrar pela primeira vez, por conta da planilha estar vazia,
        você será informado e convidado a criar o primeiro livro através
        do utilitário.
      </p>

      <p>
        Caso a pesquisa por ISBN esteja habilitada, você poderá realizar
        a pesquisa e obter um formulário pré-preenchido com os metadados
        do livro na próxima etapa, isso se o código é válido e um livro
        com tal código existe no banco de dados do provedor.
      </p>

      <figure>
        <img src="@/assets/about/new-book-step-01.png" />
        <legend>Primeira etapa: pesquisa por ISBN.</legend>
      </figure>

      <p>
        O ISBN para a pesquisa pode ser digitado com ou sem os hífens,
        e a pesquisa também funciona para livros mais antigos que utilizem
        o ISBN de 10 dígitos. Entretanto, a pesquisa só irá retornar
        resultados de livros publicados no território nacional, ou seja,
        livros em que o código começa com <strong>978-85</strong>
        ou <strong>978-65</strong>.
      </p>

      <p>
        Caso a pesquisa não retorne nenhum resultado ou o livro não
        possui um ISBN brasileiro, você poderá optar por
        <strong>Preencher manualmente</strong>.
      </p>

      <figure>
        <img src="@/assets/about/new-book-step-02.png" />
        <legend>Segunda etapa: preenchimento dos metadados do livro.</legend>
      </figure>

      <p>
        As informações do livro no provedor de pesquisa não necessariamente
        estão corretas e/ou seguem um padrão, portanto na maioria das vezes
        você precisará realizar pequenos ajustes nos metadados. Na imagem acima,
        o mangá teve seu título e autor cadastrado com caixa alta, e precisa
        ser arrumado.
      </p>

      <h3>Os metadados do livro</h3>

      <p>Abaixo você encontra uma explicação sucinta de cada metadado.</p>

      <dl>
        <dt>Identificação</dt>
        <dd>
          Geralmente o ISBN do livro, mas outros códigos únicos como
          o ISSN ou EAN podem ser utilizados em sua ausência.
          Em publicações independentes, o valor <strong>N/A</strong>
          (não se aplica) pode ser utilizado.
        </dd>

        <dt>Título</dt>
        <dd>
          Nome oficial do livro. Em casos de publicações seriadas, isto
          é, com mais de um volume, pode-se utilizar o caractere
          <strong>#</strong> (cerquilha) seguido do número.
        </dd>
        <dd>
          <strong>Exemplo:</strong> Lobo Solitário #05: O Segredo do Vento Sul
        </dd>

        <dt>Autores</dt>
        <dd>
          Pessoas envolvidas na criação do livro, tais como escritores,
          roteiristas, desenhistas, letristas etc. Em caso de múltiplas pessoas,
          você deve separar os nomes pelo caractere de
          <strong>ponto-e-vírgula</strong>.
        </dd>
        <dd>
          <strong>Exemplo:</strong> Kazuo Koike; Goseki Kojima
        </dd>

        <dt>Editora</dt>
        <dd>
          Editora que lançou a edição nacional do livro. Algumas vezes
          o valor retornado pelo provedor é incorreto e o utilitário realizará
          a correção, mas pode ser que você ainda precise modificar manualmente.
        </dd>

        <dt>Coleção</dt>
        <dd>
          Grupo que este livro possui em comum com outros em sua coleção.
          Apesar de idealmente o recomendado ser utilizar o tipo de publicação
          (tal como "livros", "quadrinhos" ou "mangás"), você também pode, se
          desejar, utilizar o nome da obra em casos com vários volumes.
        </dd>
        <dd>
          Você deve preencher esta informação manualmente sempre.
        </dd>

        <dt>Formato</dt>
        <dd>
          Relação de largura e altura, em centímetros. Você deve utilizar
          o caractere <strong>x</strong> para separar os valores, que
          podem ter no máximo um dígito na casa decimal.
        </dd>

        <dt>Preço de capa</dt>
        <dd>
          Preço cheio do livro. Você pode utilizar até dois dígitos
          para as casas decimais.
        </dd>
        <dd>
          Em caso de livros importados, você poderá trocar a moeda
          na caixa de seleção ao lado, escolhendo pelo código equivalente
          no <a href="https://pt.wikipedia.org/wiki/ISO_4217" rel="noopener noreferrer">ISO 4217</a>.
        </dd>

        <dt>Preço pago</dt>
        <dd>
          Preço promocional pago na compra. Quando não se aplicar,
          você deve preencher com o valor do preço de capa.
          Você também pode trocar a moeda utilizada.
        </dd>

        <dt>Loja</dt>
        <dd>
          Local a compra do livro foi realizada. Você pode preencher
          com o valor <strong>Desconhecido</strong> quando não se recordar
          ou quando não quiser preencher.
        </dd>

        <dt>Data de entrada</dt>
        <dd>
          Data quando o item entrou na sua coleção. É utilizado para
          gerar as estatísticas de gastos mensais. Caso você não recorde
          ou não possua mais esta informação, você pode deixar o valor
          do campo em branco apagando o dia, mês e ano.
        </dd>
      </dl>

      <figure>
        <img src="@/assets/about/new-book-step-03.png" />
        <legend>Metadados do livro preenchidos corretamente.</legend>
      </figure>

      <h3>Imagem de capa</h3>

      <p>
        Após preencher os metadados do livro, você poderá escolher uma
        imagem de capa obtida automaticamente da Amazon ou do site da editora,
        ou providenciar uma URL válida para uma imagem personalizada.
      </p>

      <p>
        Caso você queira deixar o sem imagem, basta não selecionar
        nenhuma das opções.
      </p>

      <figure>
        <img src="@/assets/about/new-book-step-04.png" />
        <legend>Terceira etapa: escolha da imagem de capa.</legend>
      </figure>

      <h3>Revisão das informações</h3>

      <p>
        Com os metadados preenchidos e a imagem de capa escolhida,
        você pode realizar uma última revisão das informações antes
        de concluir o procedimento e adicionar o novo livro na planilha.
      </p>

      <figure>
        <img src="@/assets/about/new-book-step-05.png" />
        <legend>Quarta etapa: revisão das informações.</legend>
      </figure>

      <p>
        Caso todas as informações estejam corretas, você deve
        clicar em <span class="command">Concluir</span>.
      </p>

      <figure>
        <img src="@/assets/about/new-book-step-06.png" />
        <legend>Diálogo de confirmação de criação.</legend>
      </figure>

      <p>
        Com isso, o livro será adicionado na planilha e você poderá em
        seguida optar por <span class="command">Visualizar</span>,
        caso queira ir direto para a página com as informações,
        ou <span class="command">Novo livro</span> caso queira
        adicionar um em sequência.
      </p>

      <figure>
        <img src="@/assets/about/new-book-step-07.png" />
        <legend>Página das informações do livro.</legend>
      </figure>

      <p>
        Agora o livro está salvo na planilha e você já pode continuar
        o procedimento ao inserir novos ou explorar sua biblioteca
        através do item <span class="command">Biblioteca</span>
        na navegação principal.
      </p>
    </ContentBody>

    <ContentFooter date="01/07/2021" time="22:00:00" />
  </Content>
</template>

<script>
import Content from '@/components/Content'
import ContentTitle from '@/components/ContentTitle'
import ContentBody from '@/components/ContentBody'
import ContentFooter from '@/components/ContentFooter'

export default {
  components: {
    Content,
    ContentBody,
    ContentFooter,
    ContentTitle
  }
}
</script>
