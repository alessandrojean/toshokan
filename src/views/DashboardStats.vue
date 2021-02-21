<template>
  <div class="ma-3">
    <v-row>
      <v-col md="6" cols="12">
        <v-card>
          <v-card-text>
            <div class="text-body-1 font-weight-medium">
              Gasto mensal
            </div>
          </v-card-text>

          <v-sheet color="rgba(0, 0, 0, .05)">
            <v-sparkline
              :labels="monthlyLabels"
              :value="monthlyValue"
              color="primary"
              height="100"
              padding="24"
              line-width="2"
              stroke-linecap="round"
              smooth
            />
          </v-sheet>
        </v-card>
      </v-col>

      <v-col md="6" cols="12">
        <v-card>
          <v-card-text>
            <div class="text-body-1 font-weight-medium">
              Itens comprados
            </div>
          </v-card-text>

          <v-sheet color="rgba(0, 0, 0, .05)">
            <v-sparkline
              :labels="monthlyLabels"
              :value="countValue"
              color="primary"
              height="100"
              padding="24"
              line-width="2"
              stroke-linecap="round"
              smooth
            />
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'DashboardStats',

  computed: {
    monthlyLabels: function () {
      return this.stats.monthly.map(m => m.month)
    },

    monthlyValue: function () {
      return this.stats.monthly.map(m => {
        return parseFloat(
          m.totalSpent
            .replace('R$ ', '')
            .replace(/\./g, '')
            .replace(',', '.')
        )
      })
    },

    countValue: function () {
      return this.stats.monthly.map(m => {
        return parseFloat(
          m.count
            .replace(/\./g, '')
            .replace(',', '.')
        )
      })
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
