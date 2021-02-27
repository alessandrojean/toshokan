<template>
  <div class="ma-3">
    <v-row v-if="!loading && Object.keys(stats).length > 0">
      <v-col md="3" cols="6">
        <v-card color="#385F73" dark>
          <v-card-title class="text-md-h5 text-h6">
            {{ count }}
          </v-card-title>

          <v-card-subtitle class="text-md-body-1 text-caption">
            {{ count === '1' ? 'item' : 'itens' }}
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col md="3" cols="6">
        <v-card color="#1F7087" dark>
          <v-card-title class="text-md-h5 text-h6">
            {{ stats.money.totalSpentPaid }}
          </v-card-title>

          <v-card-subtitle class="text-md-body-1 text-caption">
            gasto
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col md="3" cols="6">
        <v-card color="#952175" dark>
          <v-card-title class="text-md-h5 text-h6">
            {{ stats.money.saved }}
          </v-card-title>

          <v-card-subtitle class="text-md-body-1 text-caption">
            economizado
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col md="3" cols="6">
        <v-card color="pink" dark>
          <v-card-title class="text-md-h5 text-h6">
            {{ stats.status.percent }}
          </v-card-title>

          <v-card-subtitle class="text-md-body-1 text-caption">
            lido
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <h2
      class="grey--text text--darken-3 font-weight-medium mt-8 mb-2"
      v-if="!loading"
    >
      Últimos adicionados
    </h2>

    <v-row dense v-if="!loading">
      <v-col
        v-for="item in lastAdded"
        :key="item.id"
        xl="1"
        md="2"
        lg="2"
        sm="4"
        cols="4"
      >
        <book-card :book="item" @click="handleCardClick" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

import BookCard from '@/components/BookCard'

const formatter = new Intl.NumberFormat('pt-BR')

export default {
  name: 'DashboardHome',

  components: {
    BookCard
  },

  computed: {
    count: function () {
      return formatter.format(this.stats.count)
    },

    ...mapState('sheet', ['lastAdded', 'loading', 'stats'])
  },

  methods: {
    handleCardClick: function (book) {
      this.$router.push({
        name: 'book-details',
        params: { bookId: book.id }
      })
    },

    ...mapMutations('appbar', ['updateIcons'])
  },

  mounted: function () {
    this.updateIcons([])
  }
}
</script>

<style>

</style>
