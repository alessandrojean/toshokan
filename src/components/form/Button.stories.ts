import Button from './Button.vue'
import { FolderOpenIcon } from '@heroicons/vue/20/solid'

import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'Components/Form/Button',
  component: Button,
  args: {
    disabled: false,
    kind: 'default',
    iconOnly: false,
    link: false,
    rounded: false,
    size: 'normal',
    type: 'button'
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['default', 'primary', 'secondary', 'ghost', 'danger']
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'normal', 'large']
    },
    type: {
      control: { type: null }
    },
    default: {
      control: { type: null }
    },
    left: {
      control: { type: null }
    },
    right: {
      control: { type: null }
    },
    click: {
      action: 'onClick',
      control: { type: null },
      table: { category: 'Events' }
    }
  },
  decorators: [() => ({ template: '<div class="p-6"><story/></div>' })]
} as Meta<typeof Button>

export const Default: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args" v-on="args">Button</Button>'
  })
}

export const Disabled: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args" v-on="args">Button</Button>'
  }),
  args: { disabled: true }
}

export const Primary: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args" v-on="args">Button</Button>'
  }),
  args: { kind: 'primary' }
}

export const Secondary: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args" v-on="args">Button</Button>'
  }),
  args: { kind: 'secondary' }
}

export const Danger: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args" v-on="args">Button</Button>'
  }),
  args: { kind: 'danger' }
}

export const Ghost: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args" v-on="args">Button</Button>'
  }),
  args: { kind: 'ghost' }
}

export const Link: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args" v-on="args">Button</Button>'
  }),
  args: {
    kind: 'ghost',
    link: true,
    as: 'router-link',
    // @ts-ignore
    to: '/'
  },
  argTypes: {
    // @ts-ignore
    click: { action: null }
  }
}

export const LeftIcon: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button, FolderOpenIcon },
    setup: () => ({ args }),
    template: `
      <Button v-bind="args" v-on="args">
        <template #left="{ iconClass }">
          <FolderOpenIcon :class="iconClass" />
        </template>
        <span>Open file&hellip;</span>
      </Button>
    `
  })
}

export const RightIcon: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button, FolderOpenIcon },
    setup: () => ({ args }),
    template: `
      <Button v-bind="args" v-on="args">
        <span>Open file&hellip;</span>
        <template #right="{ iconClass }">
          <FolderOpenIcon :class="iconClass" />
        </template>
      </Button>
    `
  })
}

export const IconOnly: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button, FolderOpenIcon },
    setup: () => ({ args }),
    template: `
      <Button
        v-bind="args"
        v-on="args"
        aria-label="Open file"
        v-slot="{ iconClass }"
      >
        <FolderOpenIcon :class="iconClass" />
      </Button>
    `
  }),
  args: { iconOnly: true }
}
