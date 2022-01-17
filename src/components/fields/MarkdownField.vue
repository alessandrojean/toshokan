<template>
  <BaseField
    :label="label"
    :error="error"
    :required="required"
    v-slot="{ inputId, ariaDescribedBy }"
  >
    <div
      :class="[
        'markdown-editor',
        hasFocus ? 'has-focus' : '',
        currentTab === 1 ? 'view-mode' : ''
      ]"
    >
      <TabGroup @change="changedTab" as="div">
        <TabPanels as="div" class="relative z-0">
          <TabPanel class="tab-panel">
            <textarea
              :id="inputId"
              :class="['textarea', inputClass]"
              :value="modelValue"
              :placeholder="placeholder"
              :aria-describedby="ariaDescribedBy"
              :aria-invalid="hasError"
              :required="required"
              @input="$emit('update:modelValue', $event.target.value)"
              @focus="hasFocus = true"
              @blur="hasFocus = false"
            />
          </TabPanel>
          <TabPanel class="tab-panel">
            <div
              class="preview prose prose-sm dark:prose-invert"
              v-html="markdownContent"
            />
          </TabPanel>
        </TabPanels>
        <TabList class="tab-list relative z-10">
          <a
            href="https://www.markdownguide.org/"
            target="_blank"
            class="markdown-logo has-ring-focus"
            :title="t('book.form.markdown')"
          >
            <svg
              aria-hidden="true"
              class="w-4 h-4 fill-current"
              viewBox="0 0 16 16"
              version="1.1"
            >
              <path
                fill-rule="evenodd"
                d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"
              />
            </svg>
            <span class="sr-only">
              {{ t('book.form.markdown') }}
            </span>
          </a>
          <Tab class="tab has-ring-focus shrink-0">Editor</Tab>
          <Tab class="tab has-ring-focus shrink-0">Visualização</Tab>
          <span
            v-if="characterCount > 0"
            class="characters flex-grow"
          >
            {{ characterCount }}
          </span>
        </TabList>
      </TabGroup>
    </div>
  </BaseField>
</template>

<script>
import { computed, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel
} from '@headlessui/vue'

import BaseField from './BaseField.vue'

import useMarkdown from '@/composables/useMarkdown'

export default {
  components: {
    BaseField,
    Tab,
    TabGroup,
    TabList,
    TabPanels,
    TabPanel
  },

  props: {
    error: String,
    inputClass: String,
    inputMode: String,
    inputType: {
      type: String,
      default: 'text'
    },
    label: String,
    modelValue: {
      type: String,
      required: true
    },
    placeholder: String,
    required: Boolean
  },

  emits: ['update:modelValue'],

  setup (props) {
    const { error, help, list, modelValue } = toRefs(props)

    const hasError = computed(() => error.value && error.value.length > 0)
    const hasHelp = computed(() => help.value && help.value.length > 0)
    const hasList = computed(() => list.value && list.value.length > 0)

    const characterCount = computed(() => modelValue.value.length)

    const { renderMarkdown } = useMarkdown()

    const markdownContent = ref(renderMarkdown(modelValue.value))

    const currentTab = ref(0)

    function changedTab (index) {
      currentTab.value = index

      if (index === 1) {
        markdownContent.value = renderMarkdown(modelValue.value)
      }
    }

    const hasFocus = ref(false)

    const { t } = useI18n()

    return {
      hasError,
      hasHelp,
      hasList,
      characterCount,
      markdownContent,
      changedTab,
      hasFocus,
      currentTab,
      t
    }
  }
}
</script>

<style lang="postcss" scoped>
.markdown-editor {
  @apply rounded-md shadow-sm
    border border-gray-300 dark:border-gray-600
    overflow-hidden motion-safe:transition-colors;
}

.markdown-editor.has-focus {
  @apply outline-none ring ring-offset-0
    ring-opacity-30 dark:ring-opacity-50
    ring-primary-600 dark:ring-primary-500
    border-primary-500 dark:border-primary-400;
}

.markdown-editor:hover:not(.has-focus):not(.view-mode) {
  @apply border-gray-400 dark:border-gray-500 transition-none;
}

.tab-list {
  @apply px-3 border-t border-gray-200 dark:border-gray-600
    flex items-center space-x-4;
}

.markdown-editor.has-focus .tab-list {
  @apply border-primary-300 dark:border-primary-400 border-dashed;
}

.markdown-editor:hover:not(.has-focus):not(.view-mode) .tab-list {
  @apply border-gray-300 dark:border-gray-500;
}

.tab {
  @apply text-sm font-medium h-full py-1.5 px-0.5
    text-gray-600 dark:text-gray-400
    border-t-2 border-transparent -mt-px;
}

.markdown-editor:not(.has-focus) .tab:not([aria-selected="true"]):hover {
  @apply border-gray-300 dark:border-gray-400;
}

.tab:hover {
  @apply text-gray-800 dark:text-gray-300;
}

.tab[aria-selected="true"] {
  @apply border-primary-600 dark:border-primary-400
    text-primary-600 dark:text-gray-100;
}

.tab-panel:focus {
  @apply outline-none;
}

.textarea {
  @apply text-sm sm:text-sm block border-0
    w-full py-2 px-3 dark:text-gray-300
    bg-white dark:bg-gray-850;
  min-height: 8em;
  max-height: 20em;
}

.textarea:focus {
  @apply outline-none border-0 ring-0;
}

.preview {
  @apply leading-5 w-full min-w-full py-2 px-3 overflow-y-auto resize-y;
  min-height: 8em;
  max-height: 20em;
}

.tab-panel:focus-visible .textarea,
.tab-panel:focus-visible .preview {
  @apply bg-primary-50 dark:bg-gray-700;
}

.characters {
  @apply block text-right text-xxs tabular-nums
    text-gray-500 dark:text-gray-400;
}

.markdown-editor.has-focus .characters {
  @apply text-primary-600 dark:text-gray-200;
}

.markdown-logo {
  @apply rounded p-1 -ml-1
    text-gray-400 dark:text-gray-500;
}

.markdown-logo:hover,
.markdown-logo:focus-visible {
  @apply text-gray-600 dark:text-gray-300;
}

.markdown-editor.has-focus .markdown-logo {
  @apply text-primary-600 dark:text-gray-200;
}

.markdown-editor.has-focus .markdown-logo:hover,
.markdown-editor.has-focus .markdown-logo:focus-visible {
  @apply text-primary-400 dark:text-gray-400;
}
</style>
