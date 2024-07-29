<template>
  <div>
    <v-data-table
      v-for="categoria in meusDados"
      :key="categoria.categoria.id"
      :headers="headersDados"
      :items="categoria.indicadores"
      :items-per-page="-1"
      class="elevation-21 mt-4"
      disable-pagination
      hide-default-footer
    >

      <!-- template para titulo e search-->
      <template v-slot:top>
        <v-toolbar class="green lighten-3"
                   flat
        >
          <!-- Título da tabela e gera gráfico-->
          <v-toolbar-title>
            {{ categoria.categoria.nome }}
          </v-toolbar-title>

          <v-row>
            <v-col class="text-right">
              <v-btn class="primary" small @click="openGraphDialog(categoria)">Gerar Gráfico</v-btn>
            </v-col>
          </v-row>

        </v-toolbar>

      </template>

      <!-- nome do inicador-->
      <template v-slot:item.indicador="{ item }">

        {{ item.indicador.nome }}

      </template>

      <!-- Add a new row for generating graphs -->
      <template v-slot:body.append>
        <tr>
          <td class="text-center">
            Gerar Gráfico<br>
            Mensal
          </td>
          <td v-for="(month, index) in arrayMonthSmall" :key="index" class="text-left">
            <v-btn v-if="mostraBtnMes(categoria, index)" color="secondary" x-small
                   @click="generateMonthGraph(categoria, index)">{{ month }}
            </v-btn>
          </td>
        </tr>
      </template>

      <!-- chips de informação-->
      <template v-slot:item.mes_1="{ item }">
            <span v-if="item.valor && item.valor.length > 0">
               <v-chip v-if="item.indicador.meta === 1 && item.valor[0].valor !== ''"
                       :color="getColorForIndicatorTable(item.indicador, item.valor[0].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[0].valor) === 'red'"
                        class="white--text">{{
                      item.valor[0].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[0].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[0].valor }}</span>
            </span>
        <span v-else class="text-center">-</span>
      </template>

      <template v-slot:item.mes_2="{ item }">
            <span v-if="item.valor && item.valor.length > 1">
               <v-chip v-if="item.indicador.meta === 1 && item.valor[1].valor !== ''"
                       :color="getColorForIndicatorTable(item.indicador, item.valor[1].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[1].valor) === 'red'"
                        class="white--text">{{
                      item.valor[1].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[1].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[1].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_3="{ item }">
            <span v-if="item.valor && item.valor.length > 2">
               <v-chip v-if="item.indicador.meta === 1 && item.valor[2].valor !== ''"
                       :color="getColorForIndicatorTable(item.indicador, item.valor[2].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[2].valor) === 'red'"
                        class="white--text">{{
                      item.valor[2].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[2].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[2].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_4="{ item }">
            <span v-if="item.valor && item.valor.length > 3">
              <v-chip v-if="item.indicador.meta === 1 && item.valor[3].valor !== ''"
                      :color="getColorForIndicatorTable(item.indicador, item.valor[3].valor)"
              >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[3].valor) === 'red'"
                        class="white--text">{{
                      item.valor[3].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[3].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[3].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_5="{ item }">
            <span v-if="item.valor && item.valor.length > 4">
               <v-chip v-if="item.indicador.meta === 1 && item.valor[4].valor !== ''"
                       :color="getColorForIndicatorTable(item.indicador, item.valor[4].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[4].valor) === 'red'"
                        class="white--text">{{
                      item.valor[4].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[4].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[4].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_6="{ item }">
            <span v-if="item.valor && item.valor.length > 5">
               <v-chip v-if="item.indicador.meta === 1 && item.valor[5].valor !== ''"
                       :color="getColorForIndicatorTable(item.indicador, item.valor[5].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[5].valor) === 'red'"
                        class="white--text">{{
                      item.valor[5].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[5].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[5].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_7="{ item }">
            <span v-if="item.valor && item.valor.length > 6">
              <v-chip v-if="item.indicador.meta === 1 && item.valor[6].valor !== ''"
                      :color="getColorForIndicatorTable(item.indicador, item.valor[6].valor)"
              >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[6].valor) === 'red'"
                        class="white--text">{{
                      item.valor[6].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[6].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[6].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_8="{ item }">
            <span v-if="item.valor && item.valor.length > 7">
               <v-chip v-if="item.indicador.meta === 1 && item.valor[7].valor !== ''"
                       :color="getColorForIndicatorTable(item.indicador, item.valor[7].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[7].valor) === 'red'"
                        class="white--text">{{
                      item.valor[7].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[7].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[7].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_9="{ item }">
            <span v-if="item.valor && item.valor.length > 8">
              <v-chip v-if="item.indicador.meta === 1 && item.valor[8].valor !== ''"
                      :color="getColorForIndicatorTable(item.indicador, item.valor[8].valor)"
              >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[8].valor) === 'red'"
                        class="white--text">{{
                      item.valor[8].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[8].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[8].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_10="{ item }">
            <span v-if="item.valor && item.valor.length > 9">
               <v-chip v-if="item.indicador.meta === 1 && item.valor[9].valor !== ''"
                       :color="getColorForIndicatorTable(item.indicador, item.valor[9].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[9].valor) === 'red'"
                        class="white--text">{{
                      item.valor[9].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[9].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[9].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_11="{ item }">
            <span v-if="item.valor && item.valor.length > 10">
               <v-chip v-if="item.indicador.meta === 1 && item.valor[10].valor !== ''"
                       :color="getColorForIndicatorTable(item.indicador, item.valor[10].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[10].valor) === 'red'"
                        class="white--text">{{
                      item.valor[10].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[10].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[10].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

      <template v-slot:item.mes_12="{ item }">
            <span v-if="item.valor && item.valor.length > 11">
               <v-chip v-if="item.indicador.meta === 1 && item.valor[11].valor !== ''"
                       :color="getColorForIndicatorTable(item.indicador, item.valor[11].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, item.valor[11].valor) === 'red'"
                        class="white--text">{{
                      item.valor[11].valor
                    }}</span>
              <span v-else class="black--text">{{ item.valor[11].valor }}</span>
            </v-chip>
              <span v-else>{{ item.valor[11].valor }}</span>
            </span>
        <span v-else>-</span>
      </template>

    </v-data-table>

    <!-- dialog para ver gráfico-->
    <v-dialog v-model="dialogVerGrafico" :width="leDialogGraphWidth">
      <v-card>
        <v-card-title>
          Gráfico ({{ garphTipo }})
        </v-card-title>
        <v-card-text>
          <GeraGraphAno v-if="dialogVerGrafico" :dadosGraph="dadosGraph" :garphTipo="garphTipo"
                        :lelabels="labelpie" :nomeCategoria="nomeCategoria"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            @click="dialogVerGrafico = false"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import GeraGraphAno from './GeraGraphAno.vue'

export default {
  name: 'categoriaView',
  mixins: [logoutMixin],
  components: {GeraGraphAno},
  data: () => ({
    headersDados: [
      {text: 'Indicador', align: 'center', value: 'indicador'},
      {text: 'Janeiro', align: 'start', value: 'mes_1'},
      {text: 'Fevereiro', align: 'start', value: 'mes_2'},
      {text: 'Março', align: 'start', value: 'mes_3'},
      {text: 'Abril', align: 'start', value: 'mes_4'},
      {text: 'Maio', align: 'start', value: 'mes_5'},
      {text: 'Junho', align: 'start', value: 'mes_6'},
      {text: 'Julho', align: 'start', value: 'mes_7'},
      {text: 'Agosto', align: 'start', value: 'mes_8'},
      {text: 'Setembro', align: 'start', value: 'mes_9'},
      {text: 'Outubro', align: 'start', value: 'mes_10'},
      {text: 'Novembro', align: 'start', value: 'mes_11'},
      {text: 'Dezembro', align: 'start', value: 'mes_12'},
      {text: 'Total', align: 'start', value: 'tempvalue'}
    ],
    meusDados: [],
    tempvalue: '',
    dialogVerGrafico: false,
    selectedCategoria: {},
    dadosGraph: [],
    nomeCategoria: '',
    arrayMonthSmall: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    garphTipo: '',
    labelpie: [],
    leDialogGraphWidth: '90%'
  }),

  props: {
    selectedSecao: Object,
    anoCorrente: Number
  },

  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  created () {
  },
  watch: {
    selectedSecao: {
      deep: true, // Observa mudanças profundas no objeto
      handler (newVal, oldVal) {
        // Chama o método de busca sempre que a propriedade selectedSecao mudar
        this.pegaPorCategoria()
      }
    },
    anoCorrente: {
      deep: true, // Observa mudanças profundas no objeto
      handler (newVal, oldVal) {
        // Chama o método de busca sempre que a propriedade selectedSecao mudar
        this.pegaPorCategoria()
      }
    }
  },

  mounted () {
    this.pegaPorCategoria()
  },

  methods: {
    async pegaPorCategoria () {
      let objetoParaEnvio = {
        ano: this.anoCorrente,
        secao_id: this.selectedSecao.id
      }

      try {
        const response = await this.$http.post('valorindicador/porcat', objetoParaEnvio)
        const dadosOrdenados = response.data.map(categoria => {
          categoria.indicadores.forEach(indicador => {
            indicador.valor.sort((a, b) => a.mes - b.mes)
          })
          return categoria
        })
        this.meusDados = dadosOrdenados
      } catch (e) {
        console.log(e)
      }
    },

    getColorForIndicator (indicador) {
      if (indicador.meta) {
        if (indicador.indicador_valor.length > 0) {
          const value = parseFloat(indicador.indicador_valor[0].valor)
          if (!isNaN(value)) {
            const lowerYellow = Math.min(indicador.yellow_1, indicador.yellow_2)
            const higherYellow = Math.max(indicador.yellow_1, indicador.yellow_2)

            if (indicador.tendencia === 'Quanto maior melhor') {
              if (value >= indicador.green) {
                return 'green' // Verde, se maior ou igual ao limite green
              } else if (value >= lowerYellow && value <= higherYellow) {
                return 'yellow' // Amarelo entre yellow_2 e green
              } else {
                return 'red' // Vermelho para valores abaixo de yellow_2
              }
            } else {
              if (value <= indicador.green) {
                return 'green' // Verde, se maior ou igual ao limite green
              } else if (value >= lowerYellow && value <= higherYellow) {
                return 'yellow' // Amarelo entre yellow_2 e green
              } else {
                return 'red' // Vermelho para valores abaixo de yellow_2
              }
            }
          }
        }
        return 'grey' // Cor padrão se o valor não for válido
      } else {
        return 'blue'
      }
    },

    getColorForIndicatorTable (indicador, valor) {
      if (indicador.meta) {
        const lowerYellow = Math.min(indicador.yellow_1, indicador.yellow_2)
        const higherYellow = Math.max(indicador.yellow_1, indicador.yellow_2)

        if (indicador.tendencia === 'Quanto maior melhor') {
          if (valor >= indicador.green) {
            return 'green' // Verde, se maior ou igual ao limite green
          } else if (valor >= lowerYellow && valor <= higherYellow) {
            return 'yellow' // Amarelo entre yellow_2 e green
          } else {
            return 'red' // Vermelho para valores abaixo de yellow_2
          }
        } else {
          if (valor <= indicador.green) {
            return 'green' // Verde, se maior ou igual ao limite green
          } else if (valor >= lowerYellow && valor <= higherYellow) {
            return 'yellow' // Amarelo entre yellow_2 e green
          } else {
            return 'red' // Vermelho para valores abaixo de yellow_2
          }
        }
      }
    },

    openGraphDialog (categoria) {
      this.selectedCategoria = categoria
      this.garphTipo = 'Anual'
      this.leDialogGraphWidth = '90%'

      // Ajustar a informação antes de passar
      let ajustes = []

      for (let i = 0; i < this.selectedCategoria.indicadores.length; i++) {
        let data = []

        // Ordenar os valores pelo mês
        this.selectedCategoria.indicadores[i].valor.sort((a, b) => a.mes - b.mes)

        for (let j = 0; j < this.selectedCategoria.indicadores[i].valor.length; j++) {
          data.push(this.selectedCategoria.indicadores[i].valor[j].valor)
        }

        ajustes.push({
          name: this.selectedCategoria.indicadores[i].indicador.nome,
          data: data
        })
      }

      this.dadosGraph = ajustes
      this.nomeCategoria = this.selectedCategoria.categoria.nome

      this.dialogVerGrafico = true
    },

    generateMonthGraph (categoria, indexMonth) {
      this.selectedCategoria = categoria
      this.garphTipo = 'Mensal'
      this.leDialogGraphWidth = '50%'

      let labels = []
      let series = []
      let mes = indexMonth + 1

      for (let i = 0; i < categoria.indicadores.length; i++) {
        labels.push(categoria.indicadores[i].indicador.nome)

        for (let j = 0; j < categoria.indicadores[i].valor.length; j++) {
          if (categoria.indicadores[i].valor[j].mes === mes) {
            series.push(categoria.indicadores[i].valor[j].valor)
          }
        }
      }

      this.dadosGraph = series
      this.labelpie = labels
      this.nomeCategoria = this.selectedCategoria.categoria.nome

      this.dialogVerGrafico = true
    },

    mostraBtnMes (categoria, indexMes) {
      let mes = indexMes + 1
      let labels = []
      let series = []

      for (let i = 0; i < categoria.indicadores.length; i++) {
        labels.push(categoria.indicadores[i].indicador.nome)

        for (let j = 0; j < categoria.indicadores[i].valor.length; j++) {
          if (categoria.indicadores[i].valor[j].mes === mes) {
            series.push(categoria.indicadores[i].valor[j].valor)
          }
        }
      }
      return series.length > 0
    }
  }
}

</script>
<style>

</style>
