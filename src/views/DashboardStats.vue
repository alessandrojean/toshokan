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
      <v-col
        v-for="mostPresent in mostPresents"
        :key="mostPresent.key"
        md="4"
        cols="12"
      >
        <v-card>
          <v-card-title class="text-body-1">
            {{ mostPresent.title }}
          </v-card-title>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  {{ mostPresent.value }}
                </th>
                <th class="text-right">
                  {{ mostPresent.count }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in stats[mostPresent.key]"
                :key="row.name"
              >
                <td>
                  <router-link
                    :to="{ name: 'collection', query: { search: row.name } }"
                  >
                    {{ row.name }}
                  </router-link>
                </td>
                <td class="text-right">{{ row.count }}</td>
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

  data: () => ({
    mostPresents: [
      {
        title: 'Séries mais presentes',
        value: 'Série',
        count: 'Volumes',
        key: 'series'
      },
      {
        title: 'Autores mais presentes',
        value: 'Autor',
        count: 'Volumes',
        key: 'authors'
      },
      {
        title: 'Editoras mais presentes',
        value: 'Editora',
        count: 'Volumes',
        key: 'imprints'
      }
    ]
  }),

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
  }
}
</script>

<style>

</style>
