<template>
  <form
    role="form"
    aria-label="Metadados do livro"
    class="space-y-6"
  >
    <div class="grid grid-cols-12 md:grid-cols-3 gap-6">
      <div class="col-span-7 sm:col-span-5 md:col-span-1">
        <label for="book-code" class="label">
          {{ t('book.properties.id') }}
          <abbr :title="t('book.form.required')" class="required" aria-hidden="true">*</abbr>
        </label>
        <input
          id="book-code"
          type="text"
          :value="book.code"
          @input="handleInput('code', $event.target.value)"
          class="input"
          :placeholder="t('book.form.example.placeholder', [t('book.form.example.id')])"
          required
          aria-describedby="book-code-error"
          :aria-invalid="v$.code.$error"
        >
        <p id="book-code-error" class="sr-only" aria-hidden="true">
          {{ v$.code.$error ? v$.code.$errors[0].$message : '' }}
        </p>
      </div>
    </div>

    <div>
      <label for="book-title" class="label">
        {{ t('book.properties.title') }}
        <abbr :title="t('book.form.required')" class="required" aria-hidden="true">*</abbr>
      </label>
      <input
        id="book-title"
        type="text"
        :value="book.title"
        @input="handleInput('title', $event.target.value)"
        class="input"
        :placeholder="t('book.form.example.placeholder', [t('book.form.example.title')])"
        required
        aria-describedby="book-title-error"
        :aria-invalid="v$.title.$error"
      >
      <p id="book-title-error" class="sr-only" aria-hidden="true">
        {{ v$.title.$error ? v$.title.$errors[0].$message : '' }}
      </p>
    </div>

    <div>
      <label for="book-authors" class="label">
        {{ t('book.properties.authors') }}
        <abbr :title="t('book.form.required')" class="required" aria-hidden="true">*</abbr>
      </label>
      <input
        id="book-authors"
        type="text"
        :value="book.authorsStr"
        @input="handleInput('authorsStr', $event.target.value)"
        class="input"
        :placeholder="t('book.form.example.placeholder', [t('book.form.example.authors')])"
        aria-describedby="book-authors-hint book-authors-error"
        :aria-invalid="v$.authorsStr.$error"
        required
      >
      <p id="book-authors-hint" class="mt-1 text-xs text-gray-400" aria-hidden="true">
        {{ t('book.form.authorsHint') }}
      </p>
      <p id="book-authors-error" class="sr-only" aria-hidden="true">
        {{ v$.authorsStr.$error ? v$.authorsStr.$errors[0].$message : '' }}
      </p>
    </div>

    <div class="grid grid-cols-12 sm:grid-cols-2 gap-6">
      <div class="col-span-12 sm:col-span-1">
        <label for="book-imprint" class="label">
          {{ t('book.properties.imprint') }}
          <abbr :title="t('book.form.required')" class="required" aria-hidden="true">*</abbr>
        </label>
        <div class="group relative">
          <input
            id="book-imprint"
            type="text"
            :value="book.imprint"
            @input="handleInput('imprint', $event.target.value)"
            class="input pr-9"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.imprint')])"
            list="imprints"
            required
            aria-describedby="book-imprint-error"
            :aria-invalid="v$.imprint.$error"
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
          <div class="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <SelectorIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
        </div>
        <p id="book-imprint-error" class="sr-only" aria-hidden="true">
          {{ v$.imprint.$error ? v$.imprint.$errors[0].$message : '' }}
        </p>
      </div>

      <div class="col-span-12 sm:col-span-1">
        <label for="book-collection" class="label">
          {{ t('book.properties.collection') }}
          <abbr :title="t('book.form.required')" class="required" aria-hidden="true">*</abbr>
        </label>
        <div class="group relative">
          <input
            id="book-collection"
            type="text"
            :value="book.collection"
            @input="handleInput('collection', $event.target.value)"
            class="input pr-9"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.collection')])"
            list="collections"
            required
            aria-describedby="book-collection-error"
            :aria-invalid="v$.collection.$error"
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
          <div class="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <SelectorIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
        </div>
        <p id="book-collection-error" class="sr-only" aria-hidden="true">
          {{ v$.collection.$error ? v$.collection.$errors[0].$message : '' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-12 md:grid-cols-3 gap-6">
      <div class="col-span-7 sm:col-span-4 md:col-span-1">
        <label for="book-format" class="label">
          {{ t('book.properties.format') }}
          <abbr :title="t('book.form.required')" class="required" aria-hidden="true">*</abbr>
        </label>
        <input
          id="book-format"
          type="text"
          :value="book.format"
          @input="handleInput('format', $event.target.value)"
          class="input"
          :placeholder="t('book.form.example.placeholder', [t('book.form.example.format')])"
          required
          aria-describedby="book-format-error"
          :aria-invalid="v$.format.$error"
        >
        <p id="book-format-error" class="sr-only" aria-hidden="true">
          {{ v$.format.$error ? v$.format.$errors[0].$message : '' }}
        </p>
      </div>

      <div aria-hidden="true" class="md:hidden col-span-5 sm:col-span-8"></div>

      <div class="col-span-9 sm:col-span-5 md:col-span-1">
        <label for="book-label-price" class="label">
          {{ t('book.properties.labelPrice') }}
          <abbr :title="t('book.form.required')" class="required" aria-hidden="true">*</abbr>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            id="book-label-price"
            type="text"
            inputmode="decimal"
            :value="book.labelPriceValue"
            @input="handleInput('labelPriceValue', $event.target.value)"
            class="input pl-7 pr-12"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.labelPrice')])"
            required
            aria-describedby="book-label-price-error"
            :aria-invalid="v$.labelPriceValue.$error"
          >
          <div class="absolute inset-y-0 right-0 flex items-center">
            <label for="book-label-price-currency" class="sr-only">
              {{ t('book.properties.currency') }}
            </label>
            <select
              id="book-label-price-currency"
              class="select pl-2 pr-7 sm:text-sm border-transparent h-full bg-transparent dark:focus:bg-gray-700 shadow-none text-gray-500 dark:text-gray-300"
              @change="handleInput('labelPriceCurrency', $event.target.value)"
              required
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
        <p id="book-label-price-error" class="sr-only" aria-hidden="true">
          {{ v$.labelPriceValue.$error ? v$.labelPriceValue.$errors[0].$message : '' }}
        </p>
      </div>

      <div aria-hidden="true" class="sm:hidden col-span-3"></div>

      <div class="col-span-9 sm:col-span-5 md:col-span-1">
        <label for="book-paid-price" class="label">
          {{ t('book.properties.paidPrice') }}
          <abbr :title="t('book.form.required')" class="required" aria-hidden="true">*</abbr>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            id="book-paid-price"
            type="text"
            inputmode="decimal"
            :value="book.paidPriceValue"
            @input="handleInput('paidPriceValue', $event.target.value)"
            class="input pl-7 pr-12"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.paidPrice')])"
            required
            aria-describedby="book-paid-price-error"
            :aria-invalid="v$.paidPriceValue.$error"
          >
          <div class="absolute inset-y-0 right-0 flex items-center">
            <label for="book-paid-price-currency" class="sr-only">
              {{ t('book.properties.currency') }}
            </label>
            <select
              id="book-paid-price-currency"
              class="select pl-2 pr-7 sm:text-sm border-transparent h-full bg-transparent dark:focus:bg-gray-700 shadow-none text-gray-500 dark:text-gray-300"
              @change="handleInput('paidPriceCurrency', $event.target.value)"
              required
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
        <p id="book-paid-price-error" class="sr-only" aria-hidden="true">
          {{ v$.paidPriceValue.$error ? v$.paidPriceValue.$errors[0].$message : '' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 sm:col-span-6">
        <label for="book-store" class="label">
          {{ t('book.properties.store') }}
          <abbr :title="t('book.form.required')" class="required" aria-hidden="true">*</abbr>
        </label>
        <div class="group relative">
          <input
            id="book-store"
            type="text"
            :value="book.store"
            @input="handleInput('store', $event.target.value)"
            class="input pr-8"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.store')])"
            list="stores"
            required
            aria-describedby="book-store-error"
            :aria-invalid="v$.store.$error"
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
          <div class="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <SelectorIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
        </div>
        <p id="book-store-error" class="sr-only" aria-hidden="true">
          {{ v$.store.$error ? v$.store.$errors[0].$message : '' }}
        </p>
      </div>

      <div class="col-span-7 sm:col-span-5 md:col-span-6">
        <label for="book-bought-at" class="label">
          {{ t('book.properties.boughtAt') }}
        </label>
        <input
          id="book-bought-at"
          type="date"
          :value="book.boughtAt"
          @input="handleInput('boughtAt', $event.target.value)"
          class="input"
          :placeholder="t('book.form.example.placeholder', [t('book.form.example.boughtAt')])"
        >
      </div>
    </div>

    <i18n-t
      keypath="book.form.requiredHint"
      tag="p"
      class="mt-1 text-xs text-gray-400"
      aria-hidden="true"
    >
      <abbr :title="t('book.form.required')" class="required">*</abbr>
    </i18n-t>

    <Alert
      type="error"
      :show="v$.$error"
      :title="
        t(
          'book.form.error.title',
          { errorsCount: t('book.form.error.count', v$.$errors.length) }
        )
      "
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
  </form>
</template>

<script>
import { computed, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

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
    const { t } = useI18n()

    const bookState = reactive({ ...book.value })

    const messageRequired = helpers.withMessage(
      t('book.form.blankField'),
      required
    )
    const messageFormat = helpers.withMessage(
      t('book.form.invalidValue'),
      format
    )
    const messageDecimalComma = helpers.withMessage(
      t('book.form.invalidNumber'),
      decimalComma(2)
    )

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

    const propertyNames = computed(() => ({
      code: t('book.properties.id'),
      title: t('book.properties.title'),
      authorsStr: t('book.properties.authors'),
      imprint: t('book.properties.imprint'),
      collection: t('book.properties.collection'),
      labelPriceValue: t('book.properties.labelPrice'),
      paidPriceValue: t('book.properties.paidPrice'),
      format: t('book.properties.format'),
      store: t('book.properties.store')
    }))

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
      collectionOptions,
      t
    }
  }
}
</script>
