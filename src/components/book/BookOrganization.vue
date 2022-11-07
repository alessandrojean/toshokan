<script lang="ts" setup>
import { toRaw, toRefs } from 'vue'

import cloneDeep from 'lodash.clonedeep'

import Book from '@/model/Book'
import { useI18n } from '@/i18n'

import TagField from '@/components/fields/TagField.vue'

const props = defineProps<{ modelValue: Book }>()

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: Book): void
}>()

const { t } = useI18n({ useScope: 'global' })

const { modelValue: book } = toRefs(props)

function handleChange(newTags: string[]) {
  const newBook = cloneDeep(toRaw(book.value))
  newBook.tags = newTags

  emit('update:modelValue', newBook)
}
</script>

<template>
  <div>
    <TagField
      required
      tag-class="is-uppercase"
      :label="t('book.properties.tags')"
      :model-value="modelValue.tags"
      :placeholder="t('book.form.addTagPlaceholder')"
      :remove-action="t('book.form.removeTag')"
      @update:model-value="handleChange"
    />
  </div>
</template>
