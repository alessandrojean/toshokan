import BookCover from './BookCover.vue'

import { Meta, StoryObj } from '@storybook/vue3'
import Book from '@/model/Book'

const bookDemo: Partial<Book> = {
  title: 'Komi não consegue se comunicar #07',
  authors: ['Oda Tomohito'],
  publisher: 'Panini',
  group: 'Manga',
  tags: ['nsfw'],
  coverUrl: 'https://panini.com.br/media/catalog/product/a/k/akomi007.jpg'
}

export default {
  title: 'Components/Book/Cover',
  component: BookCover,
  args: {
    blurNsfw: false,
    book: new Book(bookDemo),
    collection: undefined,
    loading: false,
    spoilerMode: {
      cover: false,
      synopsis: false
    }
  },
  argTypes: {
    book: {
      control: { type: null }
    },
    collection: {
      control: { type: null }
    },
    spoilerMode: {
      control: { type: null }
    }
  },
  decorators: [
    () => ({
      template: '<div class="md:p-6 md:w-3/5 max-w-xl"><story/></div>'
    })
  ]
} as Meta<typeof BookCover>

export const Default: StoryObj<typeof BookCover> = {
  render: (args) => ({
    components: { BookCover },
    setup: () => ({ args }),
    template: '<BookCover v-bind="args" v-on="args" />'
  })
}

export const Loading: StoryObj<typeof BookCover> = {
  render: (args) => ({
    components: { BookCover },
    setup: () => ({ args }),
    template: '<BookCover v-bind="args" v-on="args" />'
  }),
  args: { loading: true }
}

export const NSFW: StoryObj<typeof BookCover> = {
  render: (args) => ({
    components: { BookCover },
    setup: () => ({ args }),
    template: '<BookCover v-bind="args" v-on="args" />'
  }),
  args: { blurNsfw: true }
}

export const Collection: StoryObj<typeof BookCover> = {
  render: (args) => ({
    components: { BookCover },
    setup: () => ({ args }),
    template: '<BookCover v-bind="args" v-on="args" />'
  }),
  args: {
    book: new Book({ ...bookDemo, id: '2' }),
    collection: [...Array.from({ length: 3 }).keys()].map(
      (i) => new Book({ ...bookDemo, id: String(i + 1) })
    )
  }
}
