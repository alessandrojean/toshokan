<template>
  <v-img
    :lazy-src="lazySrc"
    :src="srcToShow"
    class="deep-purple lighten-1 white--text align-end"
    @error="handleError"
    @load="handleLoad"
    ref="imageRef"
    v-bind="$attrs"
  >
    <template v-slot:placeholder>
      <v-row
        class="fill-height ma-0"
        align="center"
        justify="center"
      >
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
          :size="progressSize"
          :width="progressWidth"
          v-if="error.length === 0 && srcToShow.length > 0"
        />
      </v-row>
    </template>

    <slot></slot>
  </v-img>
</template>

<script>
const placeholder = require('../assets/placeholder.jpg')

export default {
  name: 'VCustomImg',

  props: {
    src: {
      type: String,
      default: ''
    },
    progressSize: {
      type: Number,
      default: 32
    },
    progressWidth: {
      type: Number,
      default: 4
    }
  },

  data: () => ({
    error: '',
    srcToShow: ''
  }),

  computed: {
    lazySrc: function () {
      if (this.src.includes('images-amazon.com')) {
        return this.src.replace('_SL700_', '_SL150_')
      }

      return undefined
    }
  },

  methods: {
    handleError: function (error) {
      this.error = error.message || error
      this.srcToShow = placeholder
    },

    handleLoad: function () {
      const cover = new Image()
      cover.onload = () => {
        if (cover.naturalWidth === 1 && cover.naturalHeight === 1) {
          this.srcToShow = placeholder
        }
      }

      cover.src = this.src
    }
  },

  mounted () {
    this.srcToShow = this.src.length > 0 ? this.src : placeholder
  },

  watch: {
    src (newValue) {
      this.srcToShow = newValue.length > 0 ? newValue : placeholder
    }
  }
}
</script>
