<template>
  <div class="space-y-6">
    <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
      <transition
        mode="out-in"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <RadioGroup
          v-if="results.length > 0"
          :model-value="coverUrl"
          @update:model-value="$emit('update:coverUrl', $event)"
        >
          <RadioGroupLabel class="sr-only">Imagem de capa</RadioGroupLabel>
          <div class="grid gap-3 grid-cols-2 md:grid-cols-3">
            <RadioGroupOption
              class="focus:outline-none"
              v-for="result of results"
              :key="result"
              :value="result"
              v-slot="{ active, checked }"
            >
              <CoverOption
                :active="active"
                :checked="checked"
                :cover-url="result"
              />
            </RadioGroupOption>
          </div>
        </RadioGroup>

        <div v-else class="flex flex-col items-center p-3">
          <EmojiSadIcon class="h-24 w-24 text-gray-300 dark:text-gray-500 mb-3" aria-hidden="true" />
          <p class="font-semibold text-lg text-gray-500 dark:text-gray-400">Nenhuma capa encontrada</p>
          <p v-if="custom" class="text-sm text-gray-500 dark:text-gray-400">Você pode adicionar uma personalizada abaixo.</p>
        </div>
      </transition>
    </div>

    <template v-if="custom">
      <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h3 class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
          Imagem personalizada
        </h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Você também pode adicionar uma nova imagem nas opções.
        </p>
      </div>

      <div>
        <label for="cover-url" class="label">
          URL da Imagem
        </label>
        <div class="flex space-x-2">
          <input
            id="cover-url"
            type="url"
            class="input"
            v-model="state.customUrl"
            placeholder="Insira uma URL personalizada"
          >
          <button
            type="button"
            class="button"
            @click="addNewImage"
          >
            <PlusIcon aria-hidden="true" />
            Adicionar
          </button>
        </div>
      </div>

      <Alert
        type="error"
        :show="v$.$error"
        title="Há um erro no formulário de imagem personalizada"
      >
        <ul class="list-disc list-inside space-y-1">
          <li
            v-for="error of v$.$errors"
            :key="error.$uid"
          >
            <span class="font-medium">URL da Imagem:</span>
            {{ error.$message }}
          </li>
        </ul>
      </Alert>
    </template>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'

import useVuelidate from '@vuelidate/core'
import { helpers, required, url } from '@vuelidate/validators'

import useCoverFinder from '@/composables/useCoverFinder'

import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption
} from '@headlessui/vue'

import { EmojiSadIcon } from '@heroicons/vue/outline'
import { PlusIcon } from '@heroicons/vue/solid'

import Alert from '@/components/Alert'
import CoverOption from '@/components/CoverOption'

export default {
  name: 'BookCoverSelector',

  components: {
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption,
    Alert,
    CoverOption,
    EmojiSadIcon,
    PlusIcon
  },

  props: {
    book: Object,
    coverUrl: {
      type: String,
      required: true
    },
    custom: Boolean
  },

  emits: ['update:coverUrl', 'update:finding'],

  setup (props, context) {
    const { book, coverUrl } = toRefs(props)

    const {
      clearResults,
      finding,
      findCover,
      results: coverResults
    } = useCoverFinder(book.value)

    onMounted(findCover)

    watch(finding, newValue => context.emit('update:finding', newValue))

    const state = reactive({
      customUrl: ''
    })

    const customs = ref(coverUrl.value.length > 0 ? [coverUrl.value] : [])

    const rules = {
      customUrl: {
        required: helpers.withMessage('Campo não preenchido.', required),
        url: helpers.withMessage('Formato da URL inválido.', url)
      }
    }

    const v$ = useVuelidate(rules, state)

    function addNewImage () {
      v$.value.$touch()

      if (!v$.value.$error) {
        if (results.value.indexOf(state.customUrl) === -1) {
          customs.value.push(state.customUrl)
        }

        state.customUrl = ''
        v$.value.$reset()
      }
    }

    const results = computed(() => {
      const allImages = coverResults.value.concat(customs.value)

      return Array.from(new Set(allImages))
    })

    watch(() => state.customUrl, newValue => {
      if (newValue.length === 0) {
        v$.value.$reset()
      }
    })

    return {
      clearResults,
      finding,
      findCover,
      results,
      state,
      v$,
      addNewImage
    }
  }
}
</script>
