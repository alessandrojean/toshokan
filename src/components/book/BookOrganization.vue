<script setup>
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import cloneDeep from 'lodash.clonedeep'

import Book from '@/model/Book'

import TagField from '@/components/fields/TagField.vue'

const props = defineProps({
  modelValue: {
    type: Book,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n({ useScope: 'global' })

const { modelValue: book } = toRefs(props)

function handleChange(newTags) {
  const newBook = cloneDeep(book.value)
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
