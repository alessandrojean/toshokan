<template>
  <Content>
    <ContentTitle>Acessibilidade</ContentTitle>
    <ContentBody>
      <p>
        Este site possui alguns recursos de acessibilidade.
      </p>

      <h2>Pular para o conteúdo</h2>

      <p>
        Todas as páginas possuem um link interno para pular para
        o conteúdo principal. Ele pode ser utilizado por usuários
        que naveguem utilizando somente o teclado ou através de um
        leitor de tela para ir direto para a parte principal da página.
      </p>

      <h2>Pular para a navegação</h2>

      <p>
        Em páginas como o Dashboard, você também encontrará um link
        interno para pular diretamente para a navegação principal.
      </p>

      <h2>Menus</h2>

      <p>
        Os menus utilizados da biblioteca Headless UI seguem as recomendações
        dos padrões da WAI-ARIA. Os comandos com teclado podem ser consultados
        na <a href="https://headlessui.dev/vue/menu#keyboard-interaction" target="_blank" rel="noopener noreferrer">documentação do componente</a>.
      </p>

      <h2>Navegação</h2>

      <p>
        O site possui carregamento dinâmico dos conteúdos. Quando
        a rota é alterada, o leitor de tela é informado através de uma
        modificação em um elemento de controle.
      </p>

      <h2>Animações</h2>

      <p>
        O site respeita a configuração no sistema operacional, se disponível,
        para desabilitar animações não-essenciais. Você pode encontrar
        esta configuração na seção de Acessibilidade de seu computador
        e/ou dispositivo.
      </p>

      <h2>Problemas de acesso</h2>

      <p>
        Caso encontre algum problema com o acesso ou alguma implementação
        feita de maneira incorreta, por favor, abra uma Issue no repositório
        no GitHub.
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
