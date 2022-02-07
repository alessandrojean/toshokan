<template>
  <form
    role="form"
    aria-label="Metadados do livro"
    class="space-y-6"
  >
    <div class="grid grid-cols-12 md:grid-cols-3 gap-6">
      <TextField
        required
        class="col-span-7 sm:col-span-5 md:col-span-1"
        :label="t('book.properties.id')"
        :model-value="modelValue.code"
        :placeholder="t('book.form.example.placeholder', [t('book.form.example.id')])"
        :error="v$.code.$error ? v$.code.$errors[0].$message : ''"
        @update:model-value="handleInput('code', $event)"
      />
    </div>

    <TextField
      required
      :label="t('book.properties.title')"
      :model-value="modelValue.title"
      :placeholder="t('book.form.example.placeholder', [t('book.form.example.title')])"
      :error="v$.title.$error ? v$.title.$errors[0].$message : ''"
      @update:model-value="handleInput('title', $event)"
    />

    <TagField
      required
      input-class="pl-9"
      prefix-class="ml-2.5 pointer-events-none"
      break-character=";"
      :label="t('book.properties.authors')"
      :model-value="modelValue.authors"
      :placeholder="t('book.form.addAuthorPlaceholder')"
      :error="v$.authorsStr.$error ? v$.authorsStr.$errors[0].$message : ''"
      :remove-action="t('book.form.removeAuthor')"
      @update:model-value="handleInput('authors', $event)"
    >
      <template #prefix>
        <UserAddIcon class="w-5 h-5" />
      </template>
    </TagField>

    <MarkdownField
      class="col-span-12 sm:col-span-1"
      :label="t('book.properties.synopsis')"
      :model-value="modelValue.synopsis"
      :placeholder="t('book.form.example.synopsis')"
      @update:model-value="handleInput('synopsis', $event)"
    />

    <div class="grid grid-cols-12 sm:grid-cols-2 gap-6">
      <TextField
        required
        class="col-span-12 sm:col-span-1"
        :label="t('book.properties.publisher')"
        :model-value="modelValue.publisher"
        :placeholder="t('book.form.example.placeholder', [t('book.form.example.publisher')])"
        :error="v$.publisher.$error ? v$.publisher.$errors[0].$message : ''"
        :list="publisherOptions"
        :list-text="option => option.name"
        :list-value="option => option.name"
        @update:model-value="handleInput('publisher', $event)"
      />

      <TextField
        required
        class="col-span-12 sm:col-span-1"
        :label="t('book.properties.group')"
        :model-value="modelValue.group"
        :placeholder="t('book.form.example.placeholder', [t('book.form.example.group')])"
        :error="v$.group.$error ? v$.group.$errors[0].$message : ''"
        :list="groupOptions"
        :list-text="option => option.name"
        :list-value="option => option.name"
        @update:model-value="handleInput('group', $event)"
      />
    </div>

    <div class="grid grid-cols-12 md:grid-cols-3 gap-6">
      <DimensionField
        required
        class="col-span-7 sm:col-span-4 md:col-span-1"
        :label="t('book.properties.dimensions')"
        :model-value="modelValue.dimensions"
        :error="v$.dimensions.$error ? v$.dimensions.$errors[0].$message : ''"
        @update:model-value="handleInput('dimensions', $event)"
      />

      <div aria-hidden="true" class="md:hidden col-span-5 sm:col-span-8"></div>

      <MonetaryField
        required
        class="col-span-9 sm:col-span-5 md:col-span-1"
        :label="t('book.properties.labelPrice')"
        :model-value="modelValue.labelPrice"
        :placeholder="t('book.form.example.placeholder', [t('book.form.example.labelPrice')])"
        :error="v$.labelPrice.$error ? v$.labelPrice.$errors[0].$message : ''"
        @update:model-value="handleInput('labelPrice', $event)"
      />

      <div aria-hidden="true" class="sm:hidden col-span-3"></div>

      <MonetaryField
        required
        class="col-span-9 sm:col-span-5 md:col-span-1"
        :label="t('book.properties.paidPrice')"
        :model-value="modelValue.paidPrice"
        :placeholder="t('book.form.example.placeholder', [t('book.form.example.paidPrice')])"
        :error="v$.paidPrice.$error ? v$.paidPrice.$errors[0].$message : ''"
        :base="modelValue.labelPrice.value"
        @update:model-value="handleInput('paidPrice', $event)"
      />
    </div>

    <div class="grid grid-cols-12 gap-6">
      <TextField
        required
        class="col-span-12 sm:col-span-6"
        :label="t('book.properties.store')"
        :model-value="modelValue.store"
        :placeholder="t('book.form.example.placeholder', [t('book.form.example.store')])"
        :error="v$.store.$error ? v$.store.$errors[0].$message : ''"
        :list="storeOptions"
        :list-text="option => option.name"
        :list-value="option => option.name"
        @update:model-value="handleInput('store', $event)"
      />

      <TextField
        class="col-span-7 sm:col-span-5 md:col-span-6"
        input-type="date"
        :max="toDateInputValue(new Date())"
        :label="t('book.properties.boughtAt')"
        :model-value="modelValue.boughtAtStr"
        :placeholder="t('book.form.example.placeholder', [t('book.form.example.boughtAt')])"
        @update:model-value="handleInput('boughtAtStr', $event)"
      />
    </div>

    <div class="space-y-2">
      <div class="flex items-center space-x-2.5">
        <input
          type="checkbox"
          class="checkbox"
          name="not-in-collection"
          id="not-in-collection"
          :checked="modelValue.isFuture"
          @change="handleNotInCollection($event.target.checked)"
        >
        <label
          for="not-in-collection"
          class="label mb-0"
        >
          {{ t('book.form.notInCollection') }}
        </label>
      </div>

      <div class="flex items-center space-x-2.5">
        <input
          type="checkbox"
          class="checkbox"
          name="add-notes"
          id="add-notes"
          v-model="addNotes"
        >
        <label
          for="add-notes"
          class="label mb-0"
        >
          {{ t('book.form.addNotes') }}
        </label>
      </div>
    </div>

    <MarkdownField
      v-if="addNotes"
      :label="t('book.properties.notes')"
      :model-value="modelValue.notes"
      :placeholder="t('book.form.example.notes')"
      :markdown-options="{ youtube: true }"
      @update:model-value="handleInput('notes', $event)"
    />

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
          <span class="font-medium">{{ propertyNames[error.$propertyPath] }}:</span>
          {{ error.$message }}
        </li>
      </ul>
    </Alert>
  </form>
</template>

<script>
import { computed, onMounted, reactive, ref, toRaw, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

import { UserAddIcon } from '@heroicons/vue/solid'

import { decimalComma, dimension } from '@/util/validators'

import Book, { STATUS_FUTURE, STATUS_UNREAD } from '@/model/Book'

import Alert from '@/components/Alert.vue'
import DimensionField from '@/components/fields/DimensionField.vue'
import MarkdownField from '@/components/fields/MarkdownField.vue'
import MonetaryField from '@/components/fields/MonetaryField.vue'
import TagField from '@/components/fields/TagField.vue'
import TextField from '@/components/fields/TextField.vue'

import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'BookForm',

  components: {
    Alert,
    DimensionField,
    MarkdownField,
    MonetaryField,
    TagField,
    TextField,
    UserAddIcon
  },

  emits: ['error', 'update:modelValue'],

  props: {
    editing: Boolean,
    modelValue: {
      type: Book,
      required: true
    },
    touchOnMount: Boolean
  },

  setup (props, context) {
    const { modelValue: book, touchOnMount } = toRefs(props)
    const currencies = ref(['BRL', 'USD', 'EUR', 'JPY'])
    const { t, locale } = useI18n()

    const bookState = reactive(cloneDeep(book.value))
    const addNotes = ref(book.value.notes ? book.value.notes.length > 0 : false)

    function forceUpdateBook () {
      Object.assign(bookState, cloneDeep(book.value))
    }

    const decimalCommaValidator = decimalComma(2)

    const messageRequired = helpers.withMessage(
      t('book.form.blankField'),
      required
    )
    const messageDimension = helpers.withMessage(
      t('book.form.invalidValue'),
      dimension
    )
    const messageDecimalComma = helpers.withMessage(
      t('book.form.invalidNumber'),
      decimalCommaValidator
    )

    const rules = {
      code: { messageRequired },
      title: { messageRequired },
      authorsStr: { messageRequired },
      publisher: { messageRequired },
      group: { messageRequired },
      labelPrice: {
        currency: { messageRequired },
        valueStr: { messageRequired, messageDecimalComma }
      },
      paidPrice: {
        currency: { messageRequired },
        valueStr: { messageRequired, messageDecimalComma }
      },
      dimensions: {
        width: { messageRequired, messageDimension },
        height: { messageRequired, messageDimension }
      },
      store: { messageRequired }
    }

    const propertyNames = computed(() => ({
      code: t('book.properties.id'),
      title: t('book.properties.title'),
      authorsStr: t('book.properties.authors'),
      publisher: t('book.properties.publisher'),
      group: t('book.properties.group'),
      'labelPrice.currency': t('book.properties.labelPriceCurrency'),
      'labelPrice.valueStr': t('book.properties.labelPrice'),
      'paidPrice.currency': t('book.properties.paidPriceCurrency'),
      'paidPrice.valueStr': t('book.properties.paidPrice'),
      'dimensions.width': t('book.properties.width'),
      'dimensions.height': t('book.properties.height'),
      store: t('book.properties.store'),
      synopsis: t('book.properties.synopsis'),
      notes: t('book.properties.notes')
    }))

    const v$ = useVuelidate(rules, bookState)

    function handleInput (property, value) {
      if (property === 'boughtAtStr') {
        bookState.boughtAt = value.length === 10 ? new Date(value) : null
        bookState.boughtAt?.setMinutes(
          bookState.boughtAt.getMinutes() + bookState.boughtAt.getTimezoneOffset()
        )
      } else {
        bookState[property] = value
      }

      if (v$.value[property]) {
        v$.value[property].$touch()
      }

      context.emit('error', v$.value.$anyDirty && v$.value.$invalid)
      context.emit('update:modelValue', cloneDeep(toRaw(bookState)))
    }

    function handleNotInCollection (value) {
      handleInput('status', value ? STATUS_FUTURE : STATUS_UNREAD)
      handleInput('boughtAtStr', value ? '' : toDateInputValue(new Date()))
      handleInput('readAt', null)
    }

    /** @param {Book} book */
    function touch (book) {
      if (book) {
        Object.assign(bookState, cloneDeep(book))
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

    const publisherOptions = computed(() => store.state.collection.filters.publishers.items)
    const storeOptions = computed(() => store.state.collection.filters.stores.items)
    const groupOptions = computed(() => {
      return store.state.collection.filters.groups.items
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
      if (publisherOptions.value.length === 0) {
        await store.dispatch('collection/fetchPublishers')
      }

      if (storeOptions.value.length === 0) {
        await store.dispatch('collection/fetchStores')
      }

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
      handleNotInCollection,
      propertyNames,
      v$,
      touch,
      reset,
      publisherOptions,
      storeOptions,
      groupOptions,
      addNotes,
      toDateInputValue,
      forceUpdateBook,
      t
    }
  }
}
</script>

<style lang="postcss" scoped>
.monetary-field:focus-within .suffix .select {
  @apply border-primary-600 dark:border-primary-400;
}

.monetary-field:hover:not(:focus-within) .input,
.monetary-field:hover:not(:focus-within) .select {
  @apply border-gray-400 dark:border-gray-500 transition-none;
}
</style>
