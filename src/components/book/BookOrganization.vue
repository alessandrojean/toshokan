<template>
  <div>
    <TagField
      required
      input-class="pl-9"
      prefix-class="ml-2.5 pointer-events-none"
      tag-class="is-uppercase"
      :label="t('book.properties.tags')"
      :model-value="modelValue.tags"
      :placeholder="t('book.form.addTagPlaceholder')"
      :remove-action="t('book.form.removeTag')"
      @update:model-value="handleChange"
    >
      <template #prefix>
        <TagIcon class="w-5 h-5" />
      </template>
    </TagField>
  </div>
</template>

<script>
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import cloneDeep from 'lodash.clonedeep'

import { TagIcon } from '@heroicons/vue/solid'
import TagField from '@/components/fields/TagField.vue'

import Book from '@/model/Book'

export default {
  components: { TagField, TagIcon },

  props: {
    modelValue: {
      type: Book,
      required: true
    }
  },

  emits: ['update:modelValue'],

  setup (props, context) {
    const { t } = useI18n()

    const { modelValue: book } = toRefs(props)

    function handleChange (newTags) {
      const newBook = cloneDeep(book.value)
      newBook.tags = newTags

      context.emit('update:modelValue', newBook)
    }

    return { t, handleChange }
  }
}
</script>
