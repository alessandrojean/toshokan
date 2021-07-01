<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <HomeHeader />

    <main class="max-w-7xl mx-auto pb-16 px-6 lg:px-8 space-y-16" id="main-content">
      <section class="w-full">
        <div class="flex flex-col items-center pt-24 space-y-24">
          <div class="space-y-8">
            <h2 class="text-gray-800 dark:text-gray-100 font-bold font-title text-center text-5xl">
              Gerencie sua planilha da<br>
              <span class="text-indigo-600 dark:text-indigo-500">coleção de mangás</span>
            </h2>
            <p class="w-full text-gray-500 dark:text-gray-400 text-center max-w-2xl text-lg">
              Visualize os dados e estatísticas em uma interface limpa e moderna,
              com recursos que permitem uma rápida criação de novos itens.
            </p>
          </div>
          <figure class="w-full flex justify-center">
            <img class="border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg" src="@/assets/home/screenshot-library.png" alt="">
          </figure>
        </div>
      </section>

      <section class="features">
        <h2>O intuito é facilitar o controle da coleção.</h2>

        <div class="features-grid">
          <div class="feature">
            <span class="icon" aria-hidden="true">
              <SearchIcon />
            </span>
            <h3>Adicione novos livros por ISBN</h3>
            <p>
              Preenchimento automático dos metadados
              através da pesquisa de ISBN-13.
            </p>
          </div>

          <div class="feature">
            <span class="icon" aria-hidden="true">
              <PhotographIcon />
            </span>
            <h3>Imagens de capa automáticas</h3>
            <p>
              Escolha dentre uma das opções encontradas ou adicione
              uma nova imagem personalizada.
            </p>
          </div>

          <div class="feature">
            <span class="icon" aria-hidden="true">
              <SparklesIcon />
            </span>
            <h3>Tenha controle sobre seus dados</h3>
            <p>
              A planilha é um arquivo do Google Sheets que fica armazenado
              em seu Google Drive.
            </p>
          </div>

          <div class="feature">
            <span class="icon" aria-hidden="true">
              <ChipIcon />
            </span>
            <h3>Site de código-aberto</h3>
            <p>
              Qualquer um pode navegar pelo código e contribuir
              através do repositório no GitHub.
            </p>
          </div>
        </div>
      </section>

      <section class="functionality">
        <figure>
          <img src="@/assets/home/screenshot-metadata.png" alt="">
        </figure>

        <div class="functionality-description">
          <span class="icon" aria-hidden="true">
            <DatabaseIcon />
          </span>
          <h2>
            Ideal para também gerenciar a sua coleção de quadrinhos e livros
          </h2>
          <p>
            Apesar do Toshokan ser inicialmente criado com a intenção
            de gerenciar mangás, a planilha é versátil para também suportar
            outras mídias impressas, como os quadrinhos e livros.
          </p>
          <p>
            Ao preencher a ficha catalográfica de cada item, você permite
            com que filtros possam ser utilizados na coleção para uma
            melhor organização do conteúdo cadastrado na planilha.
          </p>
        </div>
      </section>

      <section class="cta">
        <h2>
          Pronto para começar?
        </h2>
        <div class="space-x-4">
          <router-link
            :to="{ name: 'Instructions' }"
            class="button is-primary"
            v-if="signedIn"
          >
            <span lang="en">Dashboard</span>
          </router-link>
          <SignInWithGoogleButton class="is-cta" />
          <router-link
            :to="{ name: 'Instructions' }"
            class="button is-secondary"
          >
            Instruções de uso
          </router-link>
        </div>
      </section>
    </main>

    <HomeFooter />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import {
  ChipIcon,
  DatabaseIcon,
  PhotographIcon,
  SearchIcon,
  SparklesIcon
} from '@heroicons/vue/outline'

import HomeFooter from '@/components/HomeFooter'
import HomeHeader from '@/components/HomeHeader'
import SignInWithGoogleButton from '@/components/SignInWithGoogleButton'

export default {
  components: {
    HomeFooter,
    HomeHeader,
    SignInWithGoogleButton,
    ChipIcon,
    DatabaseIcon,
    PhotographIcon,
    SearchIcon,
    SparklesIcon
  },

  setup () {
    const store = useStore()
    const signedIn = computed(() => store.state.auth.signedIn)

    return { signedIn }
  }
}
</script>

<style scoped>
.features {
  @apply grid grid-cols-3 gap-12 py-6;
}

.features h2 {
  @apply col-span-3 md:col-span-1 text-gray-800 dark:text-gray-100 font-title font-bold text-3xl;
}

.features-grid {
  @apply col-span-3 md:col-span-2 inline-grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-12;
}

.feature {
  @apply space-y-4;
}

.feature h3 {
  @apply text-gray-800 dark:text-gray-100 font-semibold font-title text-lg;
}

.feature p {
  @apply text-gray-500 dark:text-gray-400;
}

.functionality-description .icon,
.feature .icon {
  @apply w-12 h-12 bg-indigo-500 inline-flex justify-center items-center rounded-md;
}

.functionality-description .icon svg,
.feature .icon svg {
  @apply w-6 h-6 text-white;
}

.functionality {
  @apply py-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-x-hidden;
}

.functionality-description {
  @apply flex flex-col space-y-4 justify-center row-start-1 row-end-2 md:row-auto;
}

.functionality-description .icon {
  @apply hidden lg:flex;
}

.functionality-description h2 {
  @apply text-gray-800 dark:text-gray-100 font-title font-bold text-2xl;
}

.functionality-description p {
  @apply text-gray-500 dark:text-gray-400;
}

.functionality figure {
  @apply px-6 md:pl-0 md:pr-8;
}

.functionality figure img {
  @apply shadow-lg rounded-lg border border-gray-200 dark:border-gray-600;
}

.cta {
  @apply flex flex-col items-center space-y-6;
}

.cta h2 {
  @apply col-span-3 md:col-span-1 text-gray-800 dark:text-gray-100 font-title font-bold text-3xl;
}

.cta .button {
  @apply py-3 px-5 font-medium text-base shadow-md;
}

.cta .button.is-secondary {
  @apply text-indigo-500 dark:text-gray-100;
}
</style>
