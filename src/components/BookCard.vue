<template>
  <v-card class="book-card">
    <v-img
      :lazy-src="lazySrc"
      :src="coverUrl"
      class="grey lighten-2 white--text align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
      :aspect-ratio="2/3"
      @error="handleError"
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
            v-if="error.length === 0"
          />

          <v-icon v-else large>
            mdi-book-off-outline
          </v-icon>
        </v-row>
      </template>

      <p
        class="text-body-2 font-weight-bold text-truncate mb-0 pa-4 pb-0"
        style="max-width: 100%;"
      >
        {{ book.titleParts[0] }}
      </p>
      <v-card-subtitle class="text-caption white--text pt-0">
        Volume {{ volume }}
      </v-card-subtitle>
    </v-img>
  </v-card>
</template>

<script>
export default {
  name: 'BookCard',

  props: {
    book: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    error: ''
  }),

  computed: {
    coverUrl: function () {
      return this.book.coverUrl.replace('_SL700_', '_SL300_')
    },

    lazySrc: function () {
      if (this.book.coverUrl.includes('images-amazon.com')) {
        return this.book.coverUrl.replace('_SL700_', '_SL150_')
      }

      return undefined
    },

    volume: function () {
      return this.book.titleParts[1] ? '#' + this.book.titleParts[1] : 'único'
    }
  },

  methods: {
    handleError: function (error) {
      this.error = error.message || error
    }
  }
}
</script>

<style scoped>
.book-card {
  overflow: hidden;
}
</style>
