import BookBanner from './BookBanner.vue'

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
  title: 'Components/Book/Banner',
  component: BookBanner,
  args: {
    book: new Book(bookDemo),
    loading: false
  },
  argTypes: {
    book: {
      control: { type: null }
    }
  },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<typeof BookBanner>

export const Default: StoryObj<typeof BookBanner> = {
  render: (args) => ({
    components: { BookBanner },
    setup: () => ({ args }),
    template: '<BookBanner v-bind="args" v-on="args" />'
  })
}

export const Loading: StoryObj<typeof BookBanner> = {
  render: (args) => ({
    components: { BookBanner },
    setup: () => ({ args }),
    template: '<BookBanner v-bind="args" v-on="args" />'
  }),
  args: { loading: true }
}

export const Empty: StoryObj<typeof BookBanner> = {
  render: (args) => ({
    components: { BookBanner },
    setup: () => ({ args }),
    template: '<BookBanner v-bind="args" v-on="args" />'
  }),
  args: { book: new Book({ ...bookDemo, coverUrl: '' }) }
}
