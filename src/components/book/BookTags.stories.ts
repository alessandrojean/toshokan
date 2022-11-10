import BookTags from './BookTags.vue'

import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'Components/Book/Tags',
  component: BookTags,
  args: {
    loading: false,
    tags: [...Array.from({ length: 20 }).keys()].map((i) => `Tag ${i + 1}`)
  },
  argTypes: {
    tags: {
      control: { type: null }
    }
  },
  decorators: [
    () => ({
      template: '<div class="md:p-6 md:w-3/5"><story/></div>'
    })
  ]
} as Meta<typeof BookTags>

export const Default: StoryObj<typeof BookTags> = {
  render: (args) => ({
    components: { BookTags },
    setup: () => ({ args }),
    template: '<BookTags v-bind="args" />'
  })
}

export const Loading: StoryObj<typeof BookTags> = {
  render: (args) => ({
    components: { BookTags },
    setup: () => ({ args }),
    template: '<BookTags v-bind="args" />'
  }),
  args: { loading: true }
}

export const Empty: StoryObj<typeof BookTags> = {
  render: (args) => ({
    components: { BookTags },
    setup: () => ({ args }),
    template: '<BookTags v-bind="args" />'
  }),
  args: { tags: [] }
}
