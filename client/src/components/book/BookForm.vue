<script lang="ts" setup>
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

import cloneDeep from 'lodash.clonedeep'

import { UserPlusIcon } from '@heroicons/vue/20/solid'
import { useI18n } from '@/i18n'
import type Book from '@/model/Book'
import { STATUS_FUTURE, STATUS_UNREAD } from '@/model/Book'
import { decimalComma, dimension } from '@/util/validators'

export interface BookFormProps {
  editing?: boolean
  modelValue: Book
  touchOnMount?: boolean
}

const props = withDefaults(defineProps<BookFormProps>(), {
  editing: false,
  touchOnMount: false,
})

const emit = defineEmits<{
  (e: 'error', error: any): void
  (e: 'update:modelValue', modelValue: Book): void
}>()

const { modelValue: book, touchOnMount } = toRefs(props)
const { t, locale } = useI18n({ useScope: 'global' })

const bookState = reactive(cloneDeep(toRaw(book.value)))
const addNotes = ref(book.value.notes ? book.value.notes.length > 0 : false)

function forceUpdateBook() {
  Object.assign(bookState, cloneDeep(toRaw(book.value)))
}

const decimalCommaValidator = decimalComma(2)

const messageRequired = helpers.withMessage(
  t('book.form.blankField'),
  required,
)
const messageDimension = helpers.withMessage(
  t('book.form.invalidValue'),
  dimension,
)
const messageDecimalComma = helpers.withMessage(
  t('book.form.invalidNumber'),
  decimalCommaValidator,
)

const rules = {
  code: { messageRequired },
  title: { messageRequired },
  authors: { messageRequired },
  publisher: { messageRequired },
  group: { messageRequired },
  labelPrice: {
    currency: { messageRequired },
    valueStr: { messageRequired, messageDecimalComma },
  },
  paidPrice: {
    currency: { messageRequired },
    valueStr: { messageRequired, messageDecimalComma },
  },
  dimensions: {
    width: { messageRequired, messageDimension },
    height: { messageRequired, messageDimension },
  },
  store: { messageRequired },
}

const propertyNames = computed<Record<string, string>>(() => ({
  'code': t('book.properties.id'),
  'title': t('book.properties.title'),
  'authors': t('book.properties.authors'),
  'publisher': t('book.properties.publisher'),
  'group': t('book.properties.group'),
  'labelPrice.currency': t('book.properties.labelPriceCurrency'),
  'labelPrice.valueStr': t('book.properties.labelPrice'),
  'paidPrice.currency': t('book.properties.paidPriceCurrency'),
  'paidPrice.valueStr': t('book.properties.paidPrice'),
  'dimensions.width': t('book.properties.width'),
  'dimensions.height': t('book.properties.height'),
  'store': t('book.properties.store'),
  'synopsis': t('book.properties.synopsis'),
  'notes': t('book.properties.notes'),
}))

const v$ = useVuelidate(rules, bookState)

function handleInput(
  property: keyof typeof bookState | 'boughtAtStr',
  value: any,
) {
  if (property === 'boughtAtStr') {
    bookState.boughtAt = value.length === 10 ? new Date(value) : null
    bookState.boughtAt?.setMinutes(
      bookState.boughtAt.getMinutes() + bookState.boughtAt.getTimezoneOffset(),
    )
  } else {
    // @ts-expect-error missing types
    bookState[property] = value
  }

  if (v$.value[property]) {
    v$.value[property].$touch()
  }

  emit('error', v$.value.$anyDirty && v$.value.$invalid)
  emit('update:modelValue', cloneDeep(toRaw(bookState)))
}

function handleNotInCollection(event: Event) {
  const checked = (event.target as HTMLInputElement).checked

  handleInput('status', checked ? STATUS_FUTURE : STATUS_UNREAD)
  handleInput('boughtAtStr', checked ? '' : toDateInputValue(new Date()))
  handleInput('readAt', null)
}

function touch(book?: Book) {
  if (book) {
    Object.assign(bookState, cloneDeep(toRaw(book)))
    addNotes.value = book.notes!.length > 0
  }

  v$.value.$touch()

  return {
    error: v$.value.$error,
    book: bookState,
  }
}

function reset() {
  v$.value.$reset()
}

defineExpose({ touch, reset, forceUpdateBook })

const sheetStore = useSheetStore()
const optionsEnabled = computed(() => sheetStore.sheetId !== null)

const { data: groupData } = useGroupsQuery({ enabled: optionsEnabled })
const { data: publishersData } = usePublishersQuery({ enabled: optionsEnabled })
const { data: storesData } = useStoresQuery({ enabled: optionsEnabled })
const { data: authorsData } = useAuthorsQuery({ enabled: optionsEnabled })

const groupOptions = computed(() => {
  return (groupData.value || [])
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, locale.value))
})

const publisherOptions = computed(() => publishersData.value || [])
const storeOptions = computed(() => storesData.value || [])
const authorOptions = computed(() => authorsData.value || [])

onMounted(() => {
  if (touchOnMount.value) {
    v$.value.$touch()
    emit('error', v$.value.$anyDirty && v$.value.$invalid)
  }
})

watch(addNotes, () => {
  handleInput('notes', '')
})

function toDateInputValue(date: Date) {
  if (!date) {
    return ''
  }

  const local = new Date(date)
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return local.toISOString().slice(0, 10)
}
</script>

<template>
  <form role="form" aria-label="Metadados do livro" class="space-y-6">
    <div class="grid grid-cols-12 md:grid-cols-3 gap-6">
      <TextField
        required
        class="col-span-7 sm:col-span-5 md:col-span-1"
        :label="t('book.properties.id')"
        :model-value="modelValue.code"
        :placeholder="
          t('book.form.example.placeholder', [t('book.form.example.id')])
        "
        :error="v$.code.$error ? v$.code.$errors[0].$message : ''"
        @update:model-value="handleInput('code', $event)"
      />
    </div>

    <TextField
      required
      :label="t('book.properties.title')"
      :model-value="modelValue.title"
      :placeholder="
        t('book.form.example.placeholder', [t('book.form.example.title')])
      "
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
      :error="v$.authors.$error ? v$.authors.$errors[0].$message : ''"
      :remove-action="t('book.form.removeAuthor')"
      :suggestions="authorOptions"
      @update:model-value="handleInput('authors', $event)"
    >
      <template #prefix>
        <UserPlusIcon class="w-5 h-5" />
      </template>
    </TagField>

    <MarkdownField
      class="col-span-12 sm:col-span-1"
      :label="t('book.properties.synopsis')"
      :model-value="modelValue.synopsis"
      :placeholder="t('book.form.example.synopsis')"
      :markdown-options="{ disable: ['image'] }"
      @update:model-value="handleInput('synopsis', $event)"
    />

    <div class="grid grid-cols-12 sm:grid-cols-2 gap-6">
      <TextField
        required
        class="col-span-12 sm:col-span-1"
        :label="t('book.properties.publisher')"
        :model-value="modelValue.publisher"
        :placeholder="
          t('book.form.example.placeholder', [t('book.form.example.publisher')])
        "
        :error="v$.publisher.$error ? v$.publisher.$errors[0].$message : ''"
        :list="publisherOptions"
        :list-text="(option) => option.name"
        :list-value="(option) => option.name"
        @update:model-value="handleInput('publisher', $event)"
      />

      <TextField
        required
        class="col-span-12 sm:col-span-1"
        :label="t('book.properties.group')"
        :model-value="modelValue.group"
        :placeholder="
          t('book.form.example.placeholder', [t('book.form.example.group')])
        "
        :error="v$.group.$error ? v$.group.$errors[0].$message : ''"
        :list="groupOptions"
        :list-text="(option) => option.name"
        :list-value="(option) => option.name"
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

      <div aria-hidden="true" class="md:hidden col-span-5 sm:col-span-8" />

      <MonetaryField
        required
        class="col-span-9 sm:col-span-5 md:col-span-1"
        :label="t('book.properties.labelPrice')"
        :model-value="modelValue.labelPrice"
        :placeholder="
          t('book.form.example.placeholder', [
            t('book.form.example.labelPrice'),
          ])
        "
        :error="v$.labelPrice.$error ? v$.labelPrice.$errors[0].$message : ''"
        @update:model-value="handleInput('labelPrice', $event)"
      />

      <div aria-hidden="true" class="sm:hidden col-span-3" />

      <MonetaryField
        required
        class="col-span-9 sm:col-span-5 md:col-span-1"
        :label="t('book.properties.paidPrice')"
        :model-value="modelValue.paidPrice"
        :placeholder="
          t('book.form.example.placeholder', [t('book.form.example.paidPrice')])
        "
        :error="v$.paidPrice.$error ? v$.paidPrice.$errors[0].$message : ''"
        :base="modelValue.labelPrice!.value"
        @update:model-value="handleInput('paidPrice', $event)"
      />
    </div>

    <div class="grid grid-cols-12 gap-6">
      <TextField
        required
        class="col-span-12 sm:col-span-6"
        :label="t('book.properties.store')"
        :model-value="modelValue.store"
        :placeholder="
          t('book.form.example.placeholder', [t('book.form.example.store')])
        "
        :error="v$.store.$error ? v$.store.$errors[0].$message : ''"
        :list="storeOptions"
        :list-text="(option) => option.name"
        :list-value="(option) => option.name"
        @update:model-value="handleInput('store', $event)"
      />

      <TextField
        class="col-span-7 sm:col-span-5 md:col-span-6"
        input-type="date"
        input-class="tabular-nums"
        :max="toDateInputValue(new Date())"
        :label="t('book.properties.boughtAt')"
        :model-value="modelValue.boughtAtStr"
        :placeholder="
          t('book.form.example.placeholder', [t('book.form.example.boughtAt')])
        "
        @update:model-value="handleInput('boughtAtStr', $event)"
      />
    </div>

    <div class="space-y-2">
      <div class="flex items-center space-x-2.5">
        <input
          id="not-in-collection"
          type="checkbox"
          class="checkbox"
          name="not-in-collection"
          :checked="modelValue.isFuture"
          @change="handleNotInCollection"
        >
        <label for="not-in-collection" class="label mb-0">
          {{ t('book.form.notInCollection') }}
        </label>
      </div>

      <div class="flex items-center space-x-2.5">
        <input
          id="add-notes"
          v-model="addNotes"
          type="checkbox"
          class="checkbox"
          name="add-notes"
        >
        <label for="add-notes" class="label mb-0">
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
        t('book.form.error.title', {
          errorsCount: t('book.form.error.count', v$.$errors.length),
        })
      "
    >
      <ul class="list-disc list-inside space-y-1">
        <li v-for="error of v$.$errors" :key="error.$uid">
          <span class="font-medium">
            {{ propertyNames[error.$propertyPath] }}:
          </span>
          {{ error.$message }}
        </li>
      </ul>
    </Alert>
  </form>
</template>
