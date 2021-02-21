<template>
  <v-card class="book-card" @click="$emit('click', book)">
    <v-custom-img
      :src="thumbnailUrl"
      gradient="to top, rgba(0, 0, 0, 0.7) 0%, transparent 60%"
      :aspect-ratio="2/3"
      ref="imageRef"
    >
      <p
        class="text-body-2 font-weight-bold text-truncate mb-0 pa-4 pb-0"
        style="max-width: 100%;"
      >
        {{ book.titleParts[0] }}
      </p>
      <v-card-subtitle class="text-caption white--text pt-0">
        Volume {{ volume }}
      </v-card-subtitle>
    </v-custom-img>
  </v-card>
</template>

<script>
import VCustomImg from './VCustomImg.vue'

export default {
  name: 'BookCard',

  components: {
    VCustomImg
  },

  props: {
    book: {
      type: Object,
      required: true
    }
  },

  computed: {
    thumbnailUrl: function () {
      return this.book.coverUrl.replace('_SL700_', '_SL300_')
    },

    volume: function () {
      return this.book.titleParts[1] ? '#' + this.book.titleParts[1] : 'único'
    }
  }
}
</script>

<style lang="scss" scoped>
.book-card {
  overflow: hidden;
}
</style>
