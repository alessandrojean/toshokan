<template>
  <div class="ma-3">
    <v-row v-if="!loading">
      <v-col md="6" cols="12">
        <v-card>
          <v-card-title class="text-body-1">
            Gasto mensal
          </v-card-title>

          <v-sheet class="pa-2">
            <g-line-chart
              :columns="monthlyColumns"
              :rows="monthlyRows"
              ref="monthlyChart"
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

          <v-sheet class="pa-2">
            <g-line-chart
              :columns="monthlyColumns"
              :rows="countRows"
              :chart-area="{ left: 40, width: '89%' }"
              :v-axis="{ format: 'decimal' }"
              ref="countChart"
            />
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!loading">
      <v-col md="4" cols="12">
        <v-card>
          <v-card-title class="text-body-1">
            Séries mais presentes
          </v-card-title>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  Série
                </th>
                <th class="text-right">
                  Volumes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="serie in stats.series"
                :key="serie.name"
              >
                <td>{{ serie.name }}</td>
                <td class="text-right">{{ serie.count }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>

      <v-col md="4" cols="12">
        <v-card>
          <v-card-title class="text-body-1">
            Autores mais presentes
          </v-card-title>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  Autor
                </th>
                <th class="text-right">
                  Volumes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="author in stats.authors"
                :key="author.name"
              >
                <td>{{ author.name }}</td>
                <td class="text-right">{{ author.count }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>

      <v-col md="4" cols="12">
        <v-card>
          <v-card-title class="text-body-1">
            Editoras mais presentes
          </v-card-title>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  Editora
                </th>
                <th class="text-right">
                  Volumes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="imprint in stats.imprints"
                :key="imprint.name"
              >
                <td>{{ imprint.name }}</td>
                <td class="text-right">{{ imprint.count }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

import GLineChart from '@/components/GLineChart'

export default {
  name: 'DashboardStats',

  components: {
    GLineChart
  },

  computed: {
    monthlyColumns () {
      return [
        { type: 'string', title: 'Período' },
        { type: 'number', title: 'Valor' }
      ]
    },

    monthlyRows () {
      return this.stats.monthly.map(m => [
        m.month,
        parseFloat(
          m.totalSpent
            .replace('R$ ', '')
            .replace(/\./g, '')
            .replace(',', '.')
        )
      ])
    },

    countRows () {
      return this.stats.monthly.map(m => [
        m.month,
        parseFloat(
          m.count
            .replace(/\./g, '')
            .replace(',', '.')
        )
      ])
    },

    ...mapState('sheet', ['loading', 'stats'])
  },

  methods: {
    ...mapMutations('appbar', ['updateIcons'])
  },

  mounted: function () {
    this.updateIcons([])

    window.google.charts.load('current', {
      packages: ['corechart'],
      language: 'pt-BR'
    })
  }
}
</script>

<style>

</style>
