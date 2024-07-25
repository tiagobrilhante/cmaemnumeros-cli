<template>
  <div>
    <h2>{{nomeCategoria}}</h2>
    <div id="chart">
      <apexchart :options="chartOptions" :series="series" height="350" type="bar"></apexchart>
    </div>
  </div>
</template>
<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'

export default {
  name: 'categoriaView',
  mixins: [logoutMixin],

  data: () => ({

    series: this.dadosGraph,
    chartOptions: {
      chart: {
        type: 'bar',
        height: 1000
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '90%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
      },
      fill: {
        opacity: 1
      }
    }
  }),
  props: {
    dadosGraph: Array,
    nomeCategoria: String
  },

  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  created () {
  },
  watch: {},

  mounted () {
    this.series = this.dadosGraph
  },

  methods: {}
}
</script>
<style>
</style>
