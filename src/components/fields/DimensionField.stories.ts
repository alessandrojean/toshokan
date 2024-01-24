import type { Meta, StoryObj } from '@storybook/vue3'
import DimensionField from './DimensionField.vue'

export default {
  title: 'Components/Form/Field/Dimension',
  component: DimensionField,
  args: {
    error: '',
    help: 'The help text',
    label: 'Dimension field',
    modelValue: {
      width: 13.5,
      height: 20.5,
    },
    required: false,
  },
  argTypes: {
    'error': {
      control: { type: null },
    },
    'modelValue': {
      control: { type: null },
    },
    'update:modelValue': {
      action: 'onUpdate:modelValue',
      control: { type: null },
    },
  },
  decorators: [() => ({ template: '<div class="p-6 md:w-2/5"><story/></div>' })],
} as Meta<typeof DimensionField>

export const Default: StoryObj<typeof DimensionField> = {
  render: args => ({
    components: { DimensionField },
    setup: () => ({ args }),
    template: '<DimensionField v-bind="args" v-on="args" />',
  }),
}
