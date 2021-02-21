<template>
  <div class="ma-3">
    <v-row v-if="!loading">
      <v-col md="3" cols="6">
        <v-card color="#385F73" dark>
          <v-card-title class="text-md-h4 text-h6">
            {{ count }}
          </v-card-title>

          <v-card-subtitle class="text-md-body-1 text-caption">
            {{ count === '1' ? 'item' : 'itens' }}
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col md="3" cols="6">
        <v-card color="#1F7087" dark>
          <v-card-title class="text-md-h4 text-h6">
            {{ stats.money.totalSpentPaid }}
          </v-card-title>

          <v-card-subtitle class="text-md-body-1 text-caption">
            gasto
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col md="3" cols="6">
        <v-card color="#952175" dark>
          <v-card-title class="text-md-h4 text-h6">
            {{ stats.money.saved }}
          </v-card-title>

          <v-card-subtitle class="text-md-body-1 text-caption">
            economizado
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col md="3" cols="6">
        <v-card color="pink" dark>
          <v-card-title class="text-md-h4 text-h6">
            {{ stats.status.percent }}
          </v-card-title>

          <v-card-subtitle class="text-md-body-1 text-caption">
            lido
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

const formatter = new Intl.NumberFormat('pt-BR')

export default {
  name: 'DashboardHome',

  computed: {
    count: function () {
      return formatter.format(this.stats.count)
    },

    ...mapState('sheet', ['loading', 'stats'])
  },

  methods: {
    ...mapMutations('appbar', ['updateIcons'])
  },

  mounted: function () {
    this.updateIcons([])
  }
}
</script>

<style>

</style>
