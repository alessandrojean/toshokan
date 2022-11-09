import TagField from './TagField.vue'

import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'Components/Form/Field/Tag',
  component: TagField,
  args: {
    error: '',
    help: 'The help text',
    label: 'Tag field',
    placeholder: 'The placeholder',
    required: false,
    breakCharacter: ',',
    modelValue: ['tag 1', 'tag 2'],
    removeAction: 'Remove',
    suggestions: ['tag 1', 'tag 2', 'tag 3', 'tag 4']
  },
  argTypes: {
    error: {
      control: { type: null }
    },
    modelValue: {
      control: { type: null }
    },
    suggestions: {
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
    tagClass: {
      control: { type: null }
    },
    'update:modelValue': {
      action: 'onUpdate:modelValue',
      control: { type: null }
    }
  },
  decorators: [() => ({ template: '<div class="p-6 md:w-3/5"><story/></div>' })]
} as Meta<typeof TagField>

export const Default: StoryObj<typeof TagField> = {
  render: (args) => ({
    components: { TagField },
    setup: () => ({ args }),
    template: '<TagField v-bind="args" v-on="args" />'
  })
}

export const Empty: StoryObj<typeof TagField> = {
  render: (args) => ({
    components: { TagField },
    setup: () => ({ args }),
    template: '<TagField v-bind="args" v-on="args" />'
  }),
  args: { modelValue: [] }
}
