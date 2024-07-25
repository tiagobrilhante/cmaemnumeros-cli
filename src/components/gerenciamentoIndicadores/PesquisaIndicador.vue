<template>
  <v-container fluid>
    <v-row dense>
      <v-col>
        <h4>Pesquisa de indicadores</h4>
        <v-row>

          <v-col>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              dense
              hide-details
              label="Pesquisar"
              outlined
              placeholder="Pesquisar"
              single-line
              @keydown.enter="fazBusca('agora')"
            ></v-text-field>
          </v-col>
          <v-col class="mt-2 text-left">Digite alguma palavra chave para identificação da categoria e aperte ENTER</v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- dialog para ver resultados-->
    <v-dialog v-model="dialogVerResultados" width="90%" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="10">Resultado da busca pelo termo: {{ this.search }}</v-col>
            <v-col cols="2" class="text-right">
              <v-btn
                class="link"
                @click="dialogVerResultados = false"
              >
                X
              </v-btn>
            </v-col>
          </v-row>

        </v-card-title>
        <v-card-text>

          <v-row>
            <v-col></v-col>
            <!--btn Navega Ano-->
            <v-col class="text-center">
              <!--diminui ano, exibe ano corrente e aumenta ano-->
              <v-row>

                <!-- dminui ano-->
                <v-col class="text-right">
                  <v-btn class="primary" @click="changeYear('down')">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                </v-col>

                <!-- exibe ano selecionado-->
                <v-col>
                  <v-alert class="mt-0 mb-0" dense elevation="10">
                    <h2>{{ anoCorrente }}</h2>
                  </v-alert>
                </v-col>

                <!-- aimenta ano-->
                <v-col class="text-left">
                  <v-btn v-if="anoBase !== anoCorrente" class="primary" @click="changeYear('up')">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>

                  <v-btn v-if="anoBase !== anoCorrente" class="success" @click="changeYear('corrente')">
                    <v-icon>mdi-calendar-today</v-icon>
                  </v-btn>

                </v-col>

              </v-row>

            </v-col>
            <v-col></v-col>
          </v-row>

          <v-data-table
            v-for="categoria in resultadoBusca"
            :key="categoria.id"
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
                <!-- Título da tabela-->
                <v-toolbar-title>
                  {{ categoria.nome }} - <b>Seção Responsável: {{categoria.secao.sigla}}</b>
                </v-toolbar-title>

                <v-row>
                  <v-col class="text-right">
                    <v-btn class="primary" small @click="openGraphDialog(categoria)">Gerar Gráfico</v-btn>
                  </v-col>
                </v-row>

              </v-toolbar>

            </template>

            <template v-slot:item.indicador="{ item }">

              {{ item.nome }}

            </template>

            <template v-slot:item.mes_1="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 0">
               <v-chip v-if="item.meta === 1 && item.indicador_valor[0].valor !== ''"
                       :color="getColorForIndicatorTable(item, item.indicador_valor[0].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[0].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[0].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[0].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[0].valor }}</span>
            </span>
              <span v-else class="text-center">-</span>
            </template>

            <template v-slot:item.mes_2="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 1">
               <v-chip v-if="item.meta === 1 && item.indicador_valor[1].valor !== ''"
                       :color="getColorForIndicatorTable(item, item.indicador_valor[1].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[1].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[1].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[1].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[1].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_3="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 2">
               <v-chip v-if="item.meta === 1 && item.indicador_valor[2].valor !== ''"
                       :color="getColorForIndicatorTable(item, item.indicador_valor[2].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[2].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[2].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[2].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[2].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_4="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 3">
              <v-chip v-if="item.meta === 1 && item.indicador_valor[3].valor !== ''"
                      :color="getColorForIndicatorTable(item, item.indicador_valor[3].valor)"
              >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[3].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[3].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[3].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[3].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_5="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 4">
               <v-chip v-if="item.meta === 1 && item.indicador_valor[4].valor !== ''"
                       :color="getColorForIndicatorTable(item, item.indicador_valor[4].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[4].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[4].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[4].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[4].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_6="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 5">
               <v-chip v-if="item.meta === 1 && item.indicador_valor[5].valor !== ''"
                       :color="getColorForIndicatorTable(item, item.indicador_valor[5].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[5].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[5].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[5].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[5].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_7="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 6">
              <v-chip v-if="item.meta === 1 && item.indicador_valor[6].valor !== ''"
                      :color="getColorForIndicatorTable(item, item.indicador_valor[6].valor)"
              >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[6].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[6].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[6].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[6].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_8="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 7">
               <v-chip v-if="item.meta === 1 && item.indicador_valor[7].valor !== ''"
                       :color="getColorForIndicatorTable(item, item.indicador_valor[7].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[7].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[7].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[7].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[7].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_9="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 8">
              <v-chip v-if="item.meta === 1 && item.indicador_valor[8].valor !== ''"
                      :color="getColorForIndicatorTable(item, item.indicador_valor[8].valor)"
              >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[8].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[8].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[8].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[8].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_10="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 9">
               <v-chip v-if="item.meta === 1 && item.indicador_valor[9].valor !== ''"
                       :color="getColorForIndicatorTable(item, item.indicador_valor[9].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[9].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[9].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[9].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[9].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_11="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 10">
               <v-chip v-if="item.meta === 1 && item.indicador_valor[10].valor !== ''"
                       :color="getColorForIndicatorTable(item, item.indicador_valor[10].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[10].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[10].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[10].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[10].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <template v-slot:item.mes_12="{ item }">
            <span v-if="item.indicador_valor && item.indicador_valor.length > 11">
               <v-chip v-if="item.meta === 1 && item.indicador_valor[11].valor !== ''"
                       :color="getColorForIndicatorTable(item, item.indicador_valor[11].valor)"
               >
                  <span v-if="getColorForIndicatorTable(item, item.indicador_valor[11].valor) === 'red'"
                        class="white--text">{{
                      item.indicador_valor[11].valor
                    }}</span>
              <span v-else class="black--text">{{ item.indicador_valor[11].valor }}</span>
            </v-chip>
              <span v-else>{{ item.indicador_valor[11].valor }}</span>
            </span>
              <span v-else>-</span>
            </template>

          </v-data-table>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            @click="dialogVerResultados = false"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog para ver gráfico-->
    <v-dialog v-model="dialogVerGrafico" width="90%">
      <v-card>
        <v-card-title>
          Gráfico (Anual)
        </v-card-title>
        <v-card-text>
          <GeraGraphAno v-if="dialogVerGrafico" :dadosGraph="dadosGraph" :nomeCategoria="nomeCategoria"/>
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
  </v-container>
</template>
<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import GeraGraphAno from '../categoria/GeraGraphAno.vue'

export default {
  name: 'pesquisaIndicador',
  components: {GeraGraphAno},
  mixins: [logoutMixin],

  data: () => ({
    search: '',
    dialogVerResultados: false,
    resultadoBusca: [],
    headersDados: [
      {text: 'Indicador', align: 'start', value: 'indicador'},
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
    awaitData: true,
    anoCorrente: 0,
    anoBase: 0,
    selectedCategoria: {},
    dialogVerGrafico: false,
    dadosGraph: [],
    nomeCategoria: ''
  }),
  props: {},

  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  created () {
  },
  watch: {},

  mounted () {
    this.getCurrentDate()
  },

  methods: {
    fazBusca (anoBusca) {
      if (this.search.length > 0) {
        let anoNow = 0
        if (anoBusca === 'agora') {
          anoNow = new Date().getFullYear()
        } else {
          anoNow = anoBusca
        }
        let objetoParaEnvio = {
          busca: this.search,
          ano: anoNow
        }
        try {
          this.$http.post('categorias/busca', objetoParaEnvio)
            .then(response => {
              this.resultadoBusca = response.data
              this.dialogVerResultados = true
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      } else {
        this.$toastr.e(
          'Você deve digitar algo', 'Erro!'
        )
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
      // Ajustar a informação antes de passar
      let ajustes = []

      for (let i = 0; i < this.selectedCategoria.indicadores.length; i++) {
        let data = []

        // Ordenar os valores pelo mês
        this.selectedCategoria.indicadores[i].indicador_valor.sort((a, b) => a.mes - b.mes)

        for (let j = 0; j < this.selectedCategoria.indicadores[i].indicador_valor.length; j++) {
          data.push(this.selectedCategoria.indicadores[i].indicador_valor[j].valor)
        }

        ajustes.push({
          name: this.selectedCategoria.indicadores[i].nome,
          data: data
        })
      }

      this.dadosGraph = ajustes
      this.nomeCategoria = this.selectedCategoria.nome + ' - ' + this.anoCorrente

      this.dialogVerGrafico = true
    },

    changeYear (direction) {
      this.awaitData = true
      if (direction === 'up') {
        this.anoCorrente++
      } else if (direction === 'corrente') {
        this.anoCorrente = this.anoBase
      } else {
        this.anoCorrente--
      }

      this.$nextTick(() => {
        this.fazBusca(this.anoCorrente)
      })
    },
    getCurrentDate () {
      // Obtém a data atual
      const currentDate = new Date()
      this.anoBase = currentDate.getFullYear()
      this.anoCorrente = currentDate.getFullYear()
    }
  }
}
</script>
<style>
</style>
