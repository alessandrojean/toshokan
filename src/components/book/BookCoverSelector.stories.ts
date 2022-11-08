import BookCoverSelector from './BookCoverSelector.vue'

import { Meta, StoryObj } from '@storybook/vue3'

const options = [
  'https://panini.com.br/media/catalog/product/a/k/akomi007.jpg',
  'https://covers.openlibrary.org/b/id/11898303-L.jpg'
]

export default {
  title: 'Components/Book/Cover Selector',
  component: BookCoverSelector,
  args: {
    custom: false,
    hideCustomTitle: false,
    loading: false,
    modelValue: options[0],
    options
  },
  argTypes: {
    modelValue: {
      control: { type: null }
    },
    options: {
      control: { type: null }
    },
    'update:modelValue': {
      action: 'onUpdate:modelValue',
      control: { type: null }
    }
  },
  decorators: [
    () => ({
      template: '<div class="p-6 md:w-3/5"><story/></div>'
    })
  ]
} as Meta<typeof BookCoverSelector>

export const Default: StoryObj<typeof BookCoverSelector> = {
  render: (args) => ({
    components: { BookCoverSelector },
    setup: () => ({ args }),
    template: '<BookCoverSelector v-bind="args" v-on="args" />'
  })
}

export const Empty: StoryObj<typeof BookCoverSelector> = {
  render: (args) => ({
    components: { BookCoverSelector },
    setup: () => ({ args }),
    template: '<BookCoverSelector v-bind="args" v-on="args" />'
  }),
  args: {
    modelValue: '',
    options: []
  }
}

export const Loading: StoryObj<typeof BookCoverSelector> = {
  render: (args) => ({
    components: { BookCoverSelector },
    setup: () => ({ args }),
    template: '<BookCoverSelector v-bind="args" v-on="args" />'
  }),
  args: { loading: true }
}

export const Custom: StoryObj<typeof BookCoverSelector> = {
  render: (args) => ({
    components: { BookCoverSelector },
    setup: () => ({ args }),
    template: '<BookCoverSelector v-bind="args" v-on="args" />'
  }),
  args: { custom: true }
}

export const CustomNoTitle: StoryObj<typeof BookCoverSelector> = {
  render: (args) => ({
    components: { BookCoverSelector },
    setup: () => ({ args }),
    template: '<BookCoverSelector v-bind="args" v-on="args" />'
  }),
  args: {
    custom: true,
    hideCustomTitle: true
  }
}
