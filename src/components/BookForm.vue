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
      </label>
      <div class="flex space-x-2">
        <input
          id="book-authors"
          type="text"
          v-model="tempAuthor"
          class="input"
          :placeholder="t('book.form.example.placeholder', [t('book.form.example.authors')])"
          aria-describedby="book-authors-error"
          :aria-invalid="v$.authorsStr.$error"
          @keydown.enter.prevent="addAuthor"
        >

        <button
          type="button"
          class="button px-2 sm:px-4 is-icon-only sm:not-is-icon-only"
          @click="addAuthor"
        >
          <span aria-hidden="true">
            <PlusIcon />
          </span>
          <span class="sr-only sm:not-sr-only">
            {{ t('book.form.addAuthor') }}
          </span>
        </button>
      </div>
      <p id="book-authors-error" class="sr-only" aria-hidden="true">
        {{ v$.authorsStr.$error ? v$.authorsStr.$errors[0].$message : '' }}
      </p>

      <ul class="flex flex-wrap mt-2 select-none" v-if="book.authors.length > 0">
        <li
          v-for="(author, i) of book.authors"
          :key="i"
          class="flex items-center text-sm bg-primary-100 dark:bg-gray-700 rounded-md px-2 py-0.5 mr-2 mt-2 font-medium text-primary-700 dark:text-gray-200"
        >
          <span>{{ author }}</span>
          <button
            type="button"
            :title="t('book.form.removeAuthor')"
            class="text-primary-400 dark:text-gray-400 hover:text-primary-600 dark:hover:text-gray-200 focus-visible:text-primary-600 dark:focus-visible:text-gray-200 p-1 ml-1 -mr-1 rounded-md has-ring-focus focus-visible:ring-offset-primary-100 dark:focus-visible:ring-offset-gray-700"
            @click="removeAuthor(i)"
          >
            <span class="sr-only">
              {{ t('book.form.removeAuthor') }}
            </span>
            <span aria-hidden="true">
              <XIcon class="w-3 h-3" />
            </span>
          </button>
        </li>
      </ul>
    </div>

    <div>
      <label for="book-synopsis" class="label flex justify-between items-baseline">
        <span>{{ t('book.properties.synopsis') }}</span>
        <span class="font-normal text-gray-500 dark:text-gray-400 text-xs">
          {{ t('book.form.optional') }}
        </span>
      </label>
      <textarea
        id="book-synopsis"
        :value="book.synopsis"
        @input="handleInput('synopsis', $event.target.value)"
        class="input"
        :placeholder="t('book.form.example.synopsis')"
        aria-describedby="book-synopsis-hint"
        rows="5"
      />
      <p id="book-synopsis-hint" class="mt-2 text-xs text-gray-400" aria-hidden="true">
        {{ t('book.form.markdown') }}
      </p>
    </div>

    <div class="grid grid-cols-12 sm:grid-cols-2 gap-6">
      <div class="col-span-12 sm:col-span-1">
        <label for="book-publisher" class="label">
          {{ t('book.properties.publisher') }}
        </label>
        <div class="group relative">
          <input
            id="book-publisher"
            type="text"
            :value="book.publisher"
            @input="handleInput('publisher', $event.target.value)"
            class="input pr-9"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.publisher')])"
            list="publishers"
            required
            aria-describedby="book-publisher-error"
            :aria-invalid="v$.publisher.$error"
          >
          <datalist id="publishers">
            <option
              v-for="publisher of publisherOptions"
              :key="publisher.name"
              :value="publisher.name"
            >
              {{ publisher.name }}
            </option>
          </datalist>
          <div class="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <SelectorIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
        </div>
        <p id="book-publisher-error" class="sr-only" aria-hidden="true">
          {{ v$.publisher.$error ? v$.publisher.$errors[0].$message : '' }}
        </p>
      </div>

      <div class="col-span-12 sm:col-span-1">
        <label for="book-group" class="label">
          {{ t('book.properties.group') }}
        </label>
        <div class="group relative">
          <input
            id="book-group"
            type="text"
            :value="book.group"
            @input="handleInput('group', $event.target.value)"
            class="input pr-9"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.group')])"
            list="groups"
            required
            aria-describedby="book-group-error"
            :aria-invalid="v$.group.$error"
          >
          <datalist id="groups">
            <option
              v-for="group of groupOptions"
              :key="group.name"
              :value="group.name"
            >
              {{ group.name }}
            </option>
          </datalist>
          <div class="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <SelectorIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
        </div>
        <p id="book-group-error" class="sr-only" aria-hidden="true">
          {{ v$.group.$error ? v$.group.$errors[0].$message : '' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-12 md:grid-cols-3 gap-6">
      <div class="col-span-7 sm:col-span-4 md:col-span-1">
        <label for="book-dimensions" class="label">
          {{ t('book.properties.dimensions') }}
        </label>
        <div class="group relative">
          <input
            id="book-dimensions"
            type="text"
            :value="book.dimensionsStr"
            @input="handleInput('dimensionsStr', $event.target.value)"
            class="input pr-10"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.dimensions')])"
            required
            aria-describedby="book-dimensions-error"
            :aria-invalid="v$.dimensionsStr.$error"
          >
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" aria-hidden="true">
            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">cm</span>
          </div>
        </div>
        <p id="book-dimensions-error" class="sr-only" aria-hidden="true">
          {{ v$.dimensionsStr.$error ? v$.dimensionsStr.$errors[0].$message : '' }}
        </p>
      </div>

      <div aria-hidden="true" class="md:hidden col-span-5 sm:col-span-8"></div>

      <div class="col-span-9 sm:col-span-5 md:col-span-1">
        <label for="book-label-price" class="label">
          {{ t('book.properties.labelPrice') }}
        </label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            id="book-label-price"
            type="text"
            inputmode="decimal"
            :value="book.labelPriceValueStr"
            @input="handleInput('labelPriceValueStr', $event.target.value)"
            class="input pl-7 pr-12"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.labelPrice')])"
            required
            aria-describedby="book-label-price-error"
            :aria-invalid="v$.labelPriceValueStr.$error"
          >
          <div class="absolute inset-y-0 right-0 flex items-center">
            <label for="book-label-price-currency" class="sr-only">
              {{ t('book.properties.currency') }}
            </label>
            <select
              id="book-label-price-currency"
              class="select pl-2 pr-7 rounded-l-none sm:text-sm border-l-0 focus:border-l group-focus-within:border-primary-600 dark:group-focus-within:border-primary-500 h-full shadow-none text-gray-500 dark:text-gray-300"
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
          {{ v$.labelPriceValueStr.$error ? v$.labelPriceValueStr.$errors[0].$message : '' }}
        </p>
      </div>

      <div aria-hidden="true" class="sm:hidden col-span-3"></div>

      <div class="col-span-9 sm:col-span-5 md:col-span-1">
        <label for="book-paid-price" class="label">
          {{ t('book.properties.paidPrice') }}
        </label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            id="book-paid-price"
            type="text"
            inputmode="decimal"
            :value="book.paidPriceValueStr"
            @input="handleInput('paidPriceValueStr', $event.target.value)"
            class="input pl-7 pr-12"
            :placeholder="t('book.form.example.placeholder', [t('book.form.example.paidPrice')])"
            required
            aria-describedby="book-paid-price-error"
            :aria-invalid="v$.paidPriceValueStr.$error"
          >
          <div class="absolute inset-y-0 right-0 flex items-center">
            <label for="book-paid-price-currency" class="sr-only">
              {{ t('book.properties.currency') }}
            </label>
            <select
              id="book-paid-price-currency"
              class="select pl-2 pr-7 rounded-l-none sm:text-sm border-l-0 focus:border-l group-focus-within:border-primary-600 dark:group-focus-within:border-primary-500 h-full shadow-none text-gray-500 dark:text-gray-300"
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
          {{ v$.paidPriceValueStr.$error ? v$.paidPriceValueStr.$errors[0].$message : '' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 sm:col-span-6">
        <label for="book-store" class="label">
          {{ t('book.properties.store') }}
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
              :key="store.name"
              :value="store.name"
            >
              {{ store.name }}
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
        <label for="book-bought-at" class="label flex justify-between items-baseline">
          <span>{{ t('book.properties.boughtAt') }}</span>
          <span class="font-normal text-gray-500 dark:text-gray-400 text-xs">
            {{ t('book.form.optional') }}
          </span>
        </label>
        <input
          id="book-bought-at"
          type="date"
          :value="book.boughtAtStr"
          @input="handleInput('boughtAtStr', $event.target.value)"
          class="input"
          :placeholder="t('book.form.example.placeholder', [t('book.form.example.boughtAt')])"
        >
      </div>
    </div>

    <div>
      <label
        for="add-notes"
        class="checkbox-label"
      >
        <input
          type="checkbox"
          class="checkbox"
          name="add-notes"
          id="add-notes"
          v-model="addNotes"
        >
        <span class="ml-2">
          {{ t('book.form.addNotes') }}
        </span>
      </label>
    </div>

    <div v-if="addNotes">
      <label for="book-notes" class="label flex justify-between items-baseline">
        <span>{{ t('book.properties.notes') }}</span>
        <span class="font-normal text-gray-500 dark:text-gray-400 text-xs">
          {{ t('book.form.optional') }}
        </span>
      </label>
      <textarea
        id="book-notes"
        :value="book.notes"
        @input="handleInput('notes', $event.target.value)"
        class="input"
        :placeholder="t('book.form.example.notes')"
        aria-describedby="book-notes-hint"
        rows="5"
      />
      <p id="book-notes-hint" class="mt-2 text-xs text-gray-400" aria-hidden="true">
        {{ t('book.form.markdown') }}
      </p>
    </div>

    <Alert
      type="error"
      :show="v$.$errors.length > 0"
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
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

import { decimalComma, dimensions } from '@/util/validators'

import { PlusIcon, SelectorIcon, XIcon } from '@heroicons/vue/solid'

import { getCodeType } from '@/model/Book'

import Alert from '@/components/Alert'

export default {
  name: 'BookForm',

  components: {
    Alert,
    PlusIcon,
    SelectorIcon,
    XIcon
  },

  emits: ['error', 'update:book'],

  props: {
    book: {
      type: Object,
      required: true
    },
    editing: Boolean,
    touchOnMount: Boolean
  },

  setup (props, context) {
    const { book, touchOnMount } = toRefs(props)
    const currencies = ref(['BRL', 'USD', 'EUR', 'JPY'])
    const { t, locale } = useI18n()

    const bookState = reactive({ ...book.value })
    const addNotes = ref(book.value.notes.length > 0)

    function forceUpdateBook () {
      Object.assign(bookState, { ...book })
    }

    const messageRequired = helpers.withMessage(
      t('book.form.blankField'),
      required
    )
    const messageDimensions = helpers.withMessage(
      t('book.form.invalidValue'),
      dimensions
    )
    const messageDecimalComma = helpers.withMessage(
      t('book.form.invalidNumber'),
      decimalComma(2)
    )

    const rules = {
      code: { messageRequired },
      title: { messageRequired },
      authorsStr: { messageRequired },
      publisher: { messageRequired },
      group: { messageRequired },
      labelPriceValueStr: { messageRequired, messageDecimalComma },
      paidPriceValueStr: { messageRequired, messageDecimalComma },
      dimensionsStr: { messageRequired, messageDimensions },
      store: { messageRequired }
    }

    const propertyNames = computed(() => ({
      code: t('book.properties.id'),
      title: t('book.properties.title'),
      authorsStr: t('book.properties.authors'),
      publisher: t('book.properties.publisher'),
      group: t('book.properties.group'),
      labelPriceValueStr: t('book.properties.labelPrice'),
      paidPriceValueStr: t('book.properties.paidPrice'),
      dimensionsStr: t('book.properties.dimensions'),
      store: t('book.properties.store'),
      synopsis: t('book.properties.synopsis'),
      notes: t('book.properties.notes')
    }))

    const v$ = useVuelidate(rules, bookState)

    function handleInput (property, value) {
      const newBook = { ...bookState, [property]: value }

      if (property === 'code') {
        newBook.codeType = getCodeType(value)
      } else if (property === 'authorsStr') {
        newBook.authors = value.split(/;\s+/g)
      } else if (property === 'boughtAtStr') {
        newBook.boughtAt = value.length === 10 ? new Date(value) : null
      } else if (property === 'dimensionsStr') {
        newBook.dimensions = value.split(/\s*[Xx×]\s*/)
          .map(dm => parseFloat(dm.replace(',', '.')))
      } else if (property === 'labelPriceValueStr') {
        newBook.labelPriceValue = parseFloat(value.replace(',', '.'))
      } else if (property === 'paidPriceValueStr') {
        newBook.paidPriceValue = parseFloat(value.replace(',', '.'))
      }

      Object.assign(bookState, newBook)

      if (v$.value[property]) {
        v$.value[property].$touch()
      }

      context.emit('error', v$.value.$anyDirty && v$.value.$invalid)
      context.emit('update:book', newBook)
    }

    const tempAuthor = ref('')

    function addAuthor () {
      if (!bookState.authors.includes(tempAuthor.value.trim())) {
        bookState.authors.push(tempAuthor.value.trim())
        bookState.authorsStr = bookState.authors.join('; ')
        v$.value.authorsStr.$touch()
      }

      tempAuthor.value = ''
      context.emit('error', v$.value.$anyDirty && v$.value.$invalid)
    }

    function removeAuthor (i) {
      bookState.authors.splice(i, 1)
      bookState.authorsStr = bookState.authors.join('; ')

      v$.value.authorsStr.$touch()
      context.emit('error', v$.value.$anyDirty && v$.value.$invalid)
    }

    function touch (book) {
      if (book) {
        Object.assign(bookState, book)
        addNotes.value = book.notes.length > 0
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

    const publisherOptions = computed(() => store.state.collection.publishers.items)
    const storeOptions = computed(() => store.state.collection.stores.items)
    const groupOptions = computed(() => {
      return store.state.collection.groups.items
        .slice()
        .sort((a, b) => a.name.localeCompare(b, locale.value))
    })

    onMounted(() => {
      if (touchOnMount.value) {
        v$.value.$touch()
        context.emit('error', v$.value.$anyDirty && v$.value.$invalid)
      }
    })

    onMounted(async () => {
      await store.dispatch('collection/fetchPublishers')
      await store.dispatch('collection/fetchStores')

      if (groupOptions.value.length === 0) {
        await store.dispatch('collection/fetchGroups')
      }
    })

    watch(addNotes, () => {
      handleInput('notes', '')
    })

    function toDateInputValue (date) {
      if (!date) {
        return ''
      }

      const local = new Date(date)
      local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      return local.toISOString().slice(0, 10)
    }

    return {
      currencies,
      handleInput,
      propertyNames,
      v$,
      touch,
      reset,
      publisherOptions,
      storeOptions,
      groupOptions,
      addNotes,
      toDateInputValue,
      tempAuthor,
      addAuthor,
      removeAuthor,
      forceUpdateBook,
      t
    }
  }
}
</script>
