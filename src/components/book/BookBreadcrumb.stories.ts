import type { Meta, StoryObj } from '@storybook/vue3'
import BookBreadcrumb from './BookBreadcrumb.vue'

import Book from '@/model/Book'

export default {
  title: 'Components/Book/Breadcrumb',
  component: BookBreadcrumb,
  argTypes: { book: { control: { type: null } } },
  decorators: [
    () => ({
      template: '<div class="max-w-2xl p-6"><story/></div>',
    }),
  ],
} as Meta<typeof BookBreadcrumb>

export const Normal: StoryObj<typeof BookBreadcrumb> = {
  render: args => ({
    components: { BookBreadcrumb },
    setup: () => ({ args }),
    template: '<BookBreadcrumb v-bind="args" />',
  }),
  args: {
    book: new Book({
      title: 'Steins;Gate #01',
      authors: ['5pb.', 'Nitro+'],
      publisher: 'Editora JBC',
      group: 'Manga',
    }),
    loading: false,
    hideHome: false,
  },
}

export const Loading: StoryObj<typeof BookBreadcrumb> = {
  render: args => ({
    components: { BookBreadcrumb },
    setup: () => ({ args }),
    template: '<BookBreadcrumb v-bind="args" />',
  }),
  args: {
    book: null,
    loading: true,
    hideHome: false,
  },
}

export const HideHome: StoryObj<typeof BookBreadcrumb> = {
  render: args => ({
    components: { BookBreadcrumb },
    setup: () => ({ args }),
    template: '<BookBreadcrumb v-bind="args" />',
  }),
  args: {
    book: new Book({
      title: 'Steins;Gate #01',
      authors: ['5pb.', 'Nitro+'],
      publisher: 'Editora JBC',
      group: 'Manga',
    }),
    loading: false,
    hideHome: true,
  },
}
