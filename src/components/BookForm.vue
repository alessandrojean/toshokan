<template>
  <div class="space-y-6">
    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-3 sm:col-span-1">
        <label for="book-code" class="label">
          Identificação
          <abbr title="Obrigatório" class="required">*</abbr>
        </label>
        <input
          id="book-code"
          type="text"
          :value="book.code"
          @input="handleInput('code', $event.target.value)"
          class="input"
          placeholder="ex. 9788583621508"
        >
      </div>
    </div>

    <div>
      <label for="book-title" class="label">
        Título
        <abbr title="Obrigatório" class="required">*</abbr>
      </label>
      <input
        id="book-title"
        type="text"
        :value="book.title"
        @input="handleInput('title', $event.target.value)"
        class="input"
        placeholder="ex. A Nova Ilha do Tesouro"
      >
    </div>

    <div>
      <label for="book-authors" class="label">
        Autores
        <abbr title="Obrigatório" class="required">*</abbr>
      </label>
      <input
        id="book-authors"
        type="text"
        :value="book.authorsStr"
        @input="handleInput('authorsStr', $event.target.value)"
        class="input"
        placeholder="ex. Osamu Tezuka"
      >
      <p class="mt-1 text-xs text-gray-500">
        Separe os nomes utilizando o caractere de ponto-e-vírgula.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-2 sm:col-span-1">
        <label for="book-imprint" class="label">
          Editora
          <abbr title="Obrigatório" class="required">*</abbr>
        </label>
        <div class="group relative">
          <input
            id="book-imprint"
            type="text"
            :value="book.imprint"
            @input="handleInput('imprint', $event.target.value)"
            class="input pr-9"
            placeholder="ex. NewPOP"
            list="imprints"
          >
          <datalist id="imprints">
            <option
              v-for="imprint of imprintOptions"
              :key="imprint"
              :value="imprint"
            >
              {{ imprint }}
            </option>
          </datalist>
          <div class="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
            <SelectorIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div class="col-span-2 sm:col-span-1">
        <label for="book-collection" class="label">
          Coleção
          <abbr title="Obrigatório" class="required">*</abbr>
        </label>
        <div class="group relative">
          <input
            id="book-collection"
            type="text"
            :value="book.collection"
            @input="handleInput('collection', $event.target.value)"
            class="input pr-9"
            placeholder="ex. Mangás"
            list="collections"
          >
          <datalist id="collections">
            <option
              v-for="collection of collectionOptions"
              :key="collection"
              :value="collection"
            >
              {{ collection }}
            </option>
          </datalist>
          <div class="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
            <SelectorIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-3 sm:col-span-1">
        <label for="book-format" class="label">
          Formato
          <abbr title="Obrigatório" class="required">*</abbr>
        </label>
        <input
          id="book-format"
          type="text"
          :value="book.format"
          @input="handleInput('format', $event.target.value)"
          class="input"
          placeholder="ex. 15 x 21"
        >
      </div>

      <div class="col-span-3 sm:col-span-1">
        <label for="book-label-price" class="label">
          Preço de capa
          <abbr title="Obrigatório" class="required">*</abbr>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            id="book-label-price"
            type="tel"
            inputmode="decimal"
            :value="book.labelPriceValue"
            @input="handleInput('labelPriceValue', $event.target.value)"
            class="input pl-7 pr-12"
            placeholder="ex. 26,90"
          >
          <div class="absolute inset-y-0 right-0 flex items-center">
            <label for="book-label-price-currency" class="sr-only">Moeda</label>
            <select
              id="book-label-price-currency"
              class="select pl-2 pr-7 sm:text-sm border-transparent h-full bg-transparent dark:focus:bg-gray-700 shadow-none text-gray-500 dark:text-gray-300"
              @change="handleInput('labelPriceCurrency', $event.target.value)"
            >
              <option
                v-for="currency of currencies"
                :key="currency"
                :value="currency"
                :selected="book.labelPriceCurrency === currency"
              >
                {{ currency }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="col-span-3 sm:col-span-1">
        <label for="book-paid-price" class="label">
          Preço pago
          <abbr title="Obrigatório" class="required">*</abbr>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            id="book-paid-price"
            type="tel"
            inputmode="decimal"
            :value="book.paidPriceValue"
            @input="handleInput('paidPriceValue', $event.target.value)"
            class="input pl-7 pr-12"
            placeholder="ex. 22,90"
          >
          <div class="absolute inset-y-0 right-0 flex items-center">
            <label for="book-paid-price-currency" class="sr-only">Moeda</label>
            <select
              id="book-paid-price-currency"
              class="select pl-2 pr-7 sm:text-sm border-transparent h-full bg-transparent dark:focus:bg-gray-700 shadow-none text-gray-500 dark:text-gray-300"
              @change="handleInput('paidPriceCurrency', $event.target.value)"
            >
              <option
                v-for="currency of currencies"
                :key="currency"
                :value="currency"
                :selected="book.paidPriceCurrency === currency"
              >
                {{ currency }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-2 sm:col-span-1">
        <label for="book-store" class="label">
          Loja
          <abbr title="Obrigatório" class="required">*</abbr>
        </label>
        <div class="group relative">
          <input
            id="book-store"
            type="text"
            :value="book.store"
            @input="handleInput('store', $event.target.value)"
            class="input pr-8"
            placeholder="ex. Amazon"
            list="stores"
          >
          <datalist id="stores">
            <option
              v-for="store of storeOptions"
              :key="store"
              :value="store"
            >
              {{ store }}
            </option>
          </datalist>
          <div class="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
            <SelectorIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div class="col-span-2 sm:col-span-1">
        <label for="book-bought-at" class="label">Data de entrada</label>
        <input
          id="book-bought-at"
          type="date"
          :value="book.boughtAt"
          @input="handleInput('boughtAt', $event.target.value)"
          class="input"
          placeholder="ex. 18/02/2021"
        >
      </div>
    </div>

    <Alert
      type="error"
      :show="v$.$error"
      :title="`O formulário dos metadados do livro possui ${v$.$errors.length} ${v$.$errors.length === 1 ? 'erro' : 'erros'}`"
    >
      <ul class="list-disc list-inside space-y-1">
        <li
          v-for="error of v$.$errors"
          :key="error.$uid"
        >
          <span class="font-medium">{{ propertyNames[error.$property] }}:</span>
          {{ error.$message }}
        </li>
      </ul>
    </Alert>
  </div>
</template>

<script>
import { computed, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

import { decimalComma, format } from '@/util/validators'

import { SelectorIcon } from '@heroicons/vue/solid'

import { getCodeType } from '@/model/Book'

import Alert from '@/components/Alert'

export default {
  name: 'BookForm',

  components: {
    Alert,
    SelectorIcon
  },

  emits: ['update:book'],

  props: {
    book: {
      type: Object,
      required: true
    },
    editing: Boolean
  },

  setup (props, context) {
    const { book } = toRefs(props)
    const currencies = ref(['BRL', 'USD', 'EUR', 'JPY'])

    const bookState = reactive({ ...book.value })

    const messageRequired = helpers.withMessage('Campo não preenchido.', required)
    const messageFormat = helpers.withMessage('Valor inválido.', format)
    const messageDecimalComma = helpers.withMessage('Número inválido.', decimalComma(2))

    const rules = {
      code: { messageRequired },
      title: { messageRequired },
      authorsStr: { messageRequired },
      imprint: { messageRequired },
      collection: { messageRequired },
      labelPriceValue: { messageRequired, messageDecimalComma },
      paidPriceValue: { messageRequired, messageDecimalComma },
      format: { messageRequired, messageFormat },
      store: { messageRequired }
    }

    const propertyNames = ref({
      code: 'Código',
      title: 'Título',
      authorsStr: 'Autores',
      imprint: 'Editora',
      collection: 'Coleção',
      labelPriceValue: 'Preço de capa',
      paidPriceValue: 'Preço pago',
      format: 'Formato',
      store: 'Loja'
    })

    const v$ = useVuelidate(rules, bookState)

    function handleInput (property, value) {
      const newBook = { ...book.value, [property]: value }

      if (property === 'code') {
        newBook.codeType = getCodeType(value)
      } else if (property === 'authorsStr') {
        newBook.authors = value.split(/;\s+/g)
      }

      context.emit('update:book', newBook)
    }

    function touch (book) {
      if (book) {
        Object.assign(bookState, book)
      }

      v$.value.$touch()

      return {
        error: v$.value.$error,
        book: bookState
      }
    }

    function reset () {
      v$.value.$reset()
    }

    const store = useStore()

    const imprintOptions = computed(() => store.state.sheet.imprints)
    const storeOptions = computed(() => store.state.sheet.stores)
    const collectionOptions = computed(() => store.getters['sheet/collections'])

    return {
      currencies,
      handleInput,
      propertyNames,
      v$,
      touch,
      reset,
      imprintOptions,
      storeOptions,
      collectionOptions
    }
  }
}
</script>

<style>

</style>
