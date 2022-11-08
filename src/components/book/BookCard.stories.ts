import BookCard from './BookCard.vue'

import { Meta, StoryObj } from '@storybook/vue3'
import Book, { Status } from '@/model/Book'

export default {
  title: 'Components/Book/Card',
  component: BookCard,
  argTypes: {
    actions: {
      control: { type: null }
    },
    book: {
      control: { type: null }
    },
    mode: {
      control: 'inline-radio',
      options: ['compact', 'comfortable']
    },
    spoilerMode: {
      control: { type: null }
    },
    tabindex: {
      control: { type: null }
    }
  },
  decorators: [
    () => ({
      template: '<div class="w-52 p-6"><story/></div>'
    })
  ]
} as Meta<typeof BookCard>

const bookDemo: Partial<Book> = {
  id: '1234',
  title: 'Komi não consegue se comunicar #07',
  authors: ['Oda Tomohito'],
  publisher: 'Panini',
  group: 'Manga',
  tags: ['nsfw'],
  coverUrl: 'https://panini.com.br/media/catalog/product/a/k/akomi007.jpg'
}

export const Default: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book(bookDemo),
    current: false,
    imageOnly: false,
    loading: false,
    mode: 'comfortable',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const Loading: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book(bookDemo),
    current: false,
    imageOnly: false,
    loading: true,
    mode: 'comfortable',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const Compact: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book(bookDemo),
    current: false,
    imageOnly: false,
    loading: false,
    mode: 'compact',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const CompactLoading: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book(bookDemo),
    current: false,
    imageOnly: false,
    loading: true,
    mode: 'compact',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const Current: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book(bookDemo),
    current: true,
    imageOnly: false,
    loading: false,
    mode: 'comfortable',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const Read: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book({
      ...bookDemo,
      status: Status.READ
    }),
    current: false,
    imageOnly: false,
    loading: false,
    mode: 'comfortable',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const ReadCompact: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book({
      ...bookDemo,
      status: Status.READ
    }),
    current: false,
    imageOnly: false,
    loading: false,
    mode: 'compact',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const Future: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book({
      ...bookDemo,
      status: Status.FUTURE
    }),
    current: false,
    imageOnly: false,
    loading: false,
    mode: 'comfortable',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const NSFW: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: true,
    book: new Book(bookDemo),
    current: false,
    imageOnly: false,
    loading: false,
    mode: 'comfortable',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const NSFWCompact: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: true,
    book: new Book(bookDemo),
    current: false,
    imageOnly: false,
    loading: false,
    mode: 'compact',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const SingleVolume: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book({
      ...bookDemo,
      title: 'Komi não consegue se comunicar'
    }),
    current: false,
    imageOnly: false,
    loading: false,
    mode: 'comfortable',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}

export const NoCover: StoryObj<typeof BookCard> = {
  render: (args) => ({
    components: { BookCard },
    setup: () => ({ args }),
    template: '<BookCard v-bind="args" />'
  }),
  args: {
    blurNsfw: false,
    book: new Book({
      ...bookDemo,
      coverUrl: ''
    }),
    current: false,
    imageOnly: false,
    loading: false,
    mode: 'comfortable',
    spoilerMode: {
      cover: false,
      synopsis: false
    },
    tabindex: undefined
  }
}
