import MarkdownField from './MarkdownField.vue'

import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'Components/Form/Field/Markdown',
  component: MarkdownField,
  args: {
    error: '',
    help: 'The help text',
    label: 'Markdown field',
    markdownOptions: {},
    modelValue: 'This is a *markdown* text.',
    placeholder: 'This is the placeholder',
    required: false
  },
  argTypes: {
    error: {
      control: { type: null }
    },
    markdownOptions: {
      control: { type: null }
    },
    modelValue: {
      control: { type: null }
    },
    inputClass: {
      control: { type: null }
    },
    inputMode: {
      control: { type: null }
    },
    inputType: {
      control: { type: null }
    },
    'update:modelValue': {
      action: 'onUpdate:modelValue',
      control: { type: null }
    }
  },
  decorators: [() => ({ template: '<div class="p-6 md:w-3/5"><story/></div>' })]
} as Meta<typeof MarkdownField>

export const Default: StoryObj<typeof MarkdownField> = {
  render: (args) => ({
    components: { MarkdownField },
    setup: () => ({ args }),
    template: '<MarkdownField v-bind="args" v-on="args" />'
  })
}
