<template>
  <Content>
    <ContentTitle>Termos de Uso</ContentTitle>
    <ContentBody>
      <p>
        Esta página lista os termos de uso do site Toshokan.
      </p>

      <p class="font-bold">
        Por favor, leia cuidadosamente estes termos, pois ao acessar ou usar
        qualquer parte deste site, você automaticamente concorda com eles.
        Se não concordar com os termos, você não poderá acessar o site
        ou usar quaisquer de seus serviços.
      </p>

      <p>
        Reservamos o direito de alterar esses termos a qualquer momento.
        É sua responsabilidade verificar as alterações feitas nesta página
        periodicamente. Seu acesso ao site após a publicação de quaisquer
        alterações constitui aceitação de tais alterações. Você pode revisar
        a versão mais atual dos termos a qualquer momento nesta página.
      </p>

      <h2>Comunicação eletrônica</h2>

      <p>
        Você entende que o seu conteúdo pode ser transferido sem criptografia
        e pode: <strong>(a)</strong> ser transmitido por várias redes; e
        <strong>(b)</strong> sofrer alterações para se adaptar e se adequar
        às exigências técnicas de conexão de redes ou dispositivos. As
        informações de autenticação sempre são criptografadas durante
        a transferência entre redes.
      </p>

      <h2>Serviços de Terceiros</h2>

      <p>
        Utilizamos o <a href="https://developers.google.com/identity/sign-in/web" target="_blank" rel="noopener noreferrer">Serviço de Autenticação do Google</a>,
        bem como o Google Drive e Google Sheets. Ao utilizar este site e se
        autenticar através da sua Conta do Google, você concorda
        com os <a href="https://policies.google.com/terms?hl=pt-BR" target="_blank" rel="noopener noreferrer">Termos de Serviço</a>
        e a <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>
        do Google.
      </p>

      <h2>Política de Privacidade</h2>

      <p>
        Ao utilizar este site, você concorda com nossa
        <router-link :to="{ name: 'PrivacyPolicy' }">Política de Privacidade</router-link>.
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
