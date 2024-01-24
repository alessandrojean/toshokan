import type { Meta, StoryObj } from '@storybook/vue3'
import BookCover from './BookCover.vue'

import Book from '@/model/Book'

const bookDemo: Partial<Book> = {
  title: 'Komi não consegue se comunicar #07',
  authors: ['Oda Tomohito'],
  publisher: 'Panini',
  group: 'Manga',
  tags: ['nsfw'],
  coverUrl: 'https://panini.com.br/media/catalog/product/a/k/akomi007.jpg',
}

export default {
  title: 'Components/Book/Cover',
  component: BookCover,
  args: {
    blurNsfw: false,
    book: new Book(bookDemo),
    loading: false,
    spoilerMode: {
      cover: false,
      synopsis: false,
    },
  },
  argTypes: {
    book: {
      control: { type: null },
    },
    spoilerMode: {
      control: { type: null },
    },
  },
  decorators: [
    () => ({
      template: '<div class="md:p-6 w-64 max-w-xl"><story/></div>',
    }),
  ],
} as Meta<typeof BookCover>

export const Default: StoryObj<typeof BookCover> = {
  render: args => ({
    components: { BookCover },
    setup: () => ({ args }),
    template: '<BookCover v-bind="args" v-on="args" />',
  }),
}

export const Loading: StoryObj<typeof BookCover> = {
  render: args => ({
    components: { BookCover },
    setup: () => ({ args }),
    template: '<BookCover v-bind="args" v-on="args" />',
  }),
  args: { loading: true },
}

export const Empty: StoryObj<typeof BookCover> = {
  render: args => ({
    components: { BookCover },
    setup: () => ({ args }),
    template: '<BookCover v-bind="args" v-on="args" />',
  }),
  args: { book: new Book({ ...bookDemo, coverUrl: '' }) },
}

export const NSFW: StoryObj<typeof BookCover> = {
  render: args => ({
    components: { BookCover },
    setup: () => ({ args }),
    template: '<BookCover v-bind="args" v-on="args" />',
  }),
  args: { blurNsfw: true },
}
