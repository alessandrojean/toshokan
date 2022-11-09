import MonetaryField from './MonetaryField.vue'

import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'Components/Form/Field/Monetary',
  component: MonetaryField,
  args: {
    base: 49.9,
    error: '',
    help: 'The help text',
    label: 'Monetary field',
    placeholder: 'The placeholder',
    modelValue: {
      currency: 'BRL',
      value: 36.9
    },
    required: false
  },
  argTypes: {
    error: {
      control: { type: null }
    },
    modelValue: {
      control: { type: null }
    },
    'update:modelValue': {
      action: 'onUpdate:modelValue',
      control: { type: null }
    }
  },
  decorators: [() => ({ template: '<div class="p-6 md:w-2/5"><story/></div>' })]
} as Meta<typeof MonetaryField>

export const Default: StoryObj<typeof MonetaryField> = {
  render: (args) => ({
    components: { MonetaryField },
    setup: () => ({ args }),
    template: '<MonetaryField v-bind="args" v-on="args" />'
  })
}
