<template>
  <div class="g-chart"></div>
</template>

<script>
export default {
  name: 'GLineChart',

  props: {
    chartArea: {
      type: Object,
      default: () => ({})
    },
    colors: {
      type: Array,
      default: () => ['#673AB7']
    },
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    vAxis: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    chart: null,
    data: null,
    options: {}
  }),

  methods: {
    drawChart () {
      this.data = new window.google.visualization.DataTable()

      for (const column of this.columns) {
        this.data.addColumn(column.type, column.title)
      }

      this.data.addRows(this.rows)

      this.options = {
        ...this.options,
        backgroundColor: 'transparent',
        chartArea: {
          backgroundColor: 'transparent',
          width: '82.5%',
          height: '85%',
          top: 10,
          left: 70,
          ...this.chartArea
        },
        colors: this.colors,
        curveType: 'function',
        fontName: 'Roboto',
        hAxis: {
          title: '',
          textStyle: {
            color: this.colors[0],
            fontSize: 10
          }
        },
        legend: {
          position: 'none'
        },
        lineWidth: 3,
        vAxis: {
          format: 'currency',
          textStyle: {
            color: this.colors[0],
            fontSize: 10
          },
          ...this.vAxis
        }
      }

      this.chart = new window.google.visualization.LineChart(this.$el)
      this.chart.draw(this.data, this.options)
    }
  },

  mounted () {
    window.google.charts.load('current', {
      packages: ['corechart'],
      language: 'pt-BR'
    })
    window.google.charts.setOnLoadCallback(() => this.drawChart())
  }
}
</script>

<style lang="scss">
.g-chart {
  width: 100%;
  min-height: 200px;

  div[dir="ltr"] {
    margin: 0 auto !important;
  }
}
</style>
