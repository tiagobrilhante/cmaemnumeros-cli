<template>
  <v-main class="bgConfig">

    <!--Barra de navegação da área administrativa-->
    <BarraNavegacao></BarraNavegacao>

    <!--Gerenciamento de Valores-->
    <v-container fluid>

      <!-- Banner e seletor de seletor de ano-->
      <v-row>

        <v-col>

          <!--Banner (cabecalho e btn de navegação ano-->
          <v-alert
            class="p-5"
            elevation="21"
          >

            <v-row>
              <!--cabecalho-->
              <v-col>
                <h2>
                  <v-icon
                    class="mr-4"
                    size="36">
                    mdi-finance
                  </v-icon>
                  Controle de Indicadores
                </h2>
              </v-col>

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
                    <v-alert class="mt-0 mb-0 pt-0 pb-0" dense elevation="10">
                      <h2>{{ this.anoCorrente }}</h2>
                    </v-alert>
                  </v-col>

                  <!-- aimenta ano-->
                  <v-col class="text-left">
                    <v-btn v-if="this.anoBase !== this.anoCorrente" class="primary" @click="changeYear('up')">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>

                    <v-btn v-if="this.anoBase !== this.anoCorrente" class="success" @click="changeYear('corrente')">
                      <v-icon>mdi-calendar-today</v-icon>
                    </v-btn>

                  </v-col>

                </v-row>

              </v-col>

              <!-- separador-->
              <v-col></v-col>

            </v-row>

          </v-alert>

        </v-col>

      </v-row>

      <!-- pick de indicadores por seção-->
      <v-alert v-if="usuarioLogado.tipo === 'Administrador'"
               class="p-5"
               elevation="21"
      >
        <v-row>
          <v-col>
            <v-btn v-for="secao in secoes" :key="secao.id" class="primary mr-3" retain-focus-on-click
                   @click="pegaIndicadoresSecao(secao)"> {{ secao.sigla }}
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>

      <!--Seletor de mês e inserção de dados-->
      <v-alert
        class="p-5"
        elevation="21"
      >
        <v-row>

          <!-- seletor de mês-->
          <v-col cols="1">
            <v-btn
              v-for="(mes, index) in meses"
              :key="index"
              :class="getMonthButtonClass(mes)"
              :disabled="checaMesDisabled(index)"
              block
              retain-focus-on-click
              @click="escolheMesIndicador(mes)"
            >
              {{ mes }}
            </v-btn>
          </v-col>

          <!--area de lançamento preciso  ARRUMAR ISSO AQUI-->
          <v-col v-if="!awaitData">

            <!-- informa o mês e o ano de referência-->
            <h3 class="text-center mb-5">{{ selectedSecao.sigla }} - Referência: {{ this.mesCorrente }} de
              {{ this.anoCorrente }}</h3>

            <!-- nesse caso eu pego a categoria-->
            <v-row v-if="selectedSecao.categoria.length > 0">

              <v-col v-for="categoria in selectedSecao.categoria" :key="categoria.id" cols="3">
                <v-card class="pl-2 pr-2 pb-1" color="blue lighten-4" elevation="11">
                  <h4 class="mb-2">{{ categoria.nome }}</h4>

                  <v-alert v-for="indicador in categoria.indicadores" :key="indicador.id"
                           :color="getColorForIndicator(indicador)" class="mt-0 ml-0 mr-0 mb-2" dense elevation="10">
                    <span class="ml-2">{{ indicador.nome }}</span>
                    <v-text-field
                      :value="getIndicadorValor(indicador)"
                      class="mb-2"
                      dense
                      hide-details
                      rounded
                      solo
                      type="number"
                      @input="updateIndicadorValor(indicador, $event)"
                    ></v-text-field>
                    <span v-if="indicador.indicador_valor.length === 0 || indicador.indicador_valor[0].valor === ''"
                          class="ml-2">Dado não lançado</span>
                    <span v-else class="ml-2">
                      {{ indicador.indicador_valor[0].atualizado }}
                    </span>
                  </v-alert>

                </v-card>

              </v-col>

            </v-row>

            <!-- caso não tenha nenhum indicador cadastrado-->
            <v-row v-else>
              <v-col>
                <v-alert class="text-center mt-5" elevation="15" type="warning">
                  Esta Seção ainda não possui indicadores cadastrados
                </v-alert>
              </v-col>
            </v-row>

            <v-row v-if="selectedSecao.categoria.length > 0">
              <v-col>

              </v-col>
              <v-col>
                <v-btn block class="primary" x-large @click="gravaValores">
                  <v-icon class="mr-5" large>mdi-content-save-move</v-icon>
                  Gravar Valores
                </v-btn>
              </v-col>
            </v-row>

          </v-col>

          <v-col v-else>
            <v-alert type="info"> Aguardando Dados</v-alert>
          </v-col>

        </v-row>

      </v-alert>
    </v-container>

  </v-main>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import config from '../../http/config'
// import moment from 'moment-timezone'
import BarraNavegacao from '../../components/barra-navegacao/BarraNavegacao.vue'
import Grafico from './Grafico.vue'

export default {
  name: 'home',
  mixins: [logoutMixin],
  components: {BarraNavegacao, Grafico},
  data: () => ({
    configSis: config,
    anoCorrente: 0,
    anoBase: 0,
    mesCorrente: '',
    diaCorrente: '',
    secoes: [],
    selectedSecao: {},
    meses: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    mostraGrafico: {},
    capturaIndexMes: 0,
    awaitData: true
  }),
  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  created () {
  },
  watch: {},

  mounted () {
    this.getCurrentDate()

    this.asyncMounted()
  },
  methods: {

    async asyncMounted () {
      await this.getSecoes()
    },

    // tenho que melhorar isso e passar o mes e ano
    async getSecoes () {
      if (this.usuarioLogado.tipo === 'Administrador') {
        console.log('estou aqui administrador')
        try {
          this.$http.get('secao/simples')
            .then(response => {
              this.secoes = response.data
              this.getIndicadoresVigentes(this.secoes[0].id, this.mesCorrente, this.anoCorrente, 'consulta')
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      } else {
        console.log('estou aqui outros')
        try {
          this.$http.get('secao/unitaria/' + this.usuarioLogado.secao_id)
            .then(response => {
              this.getIndicadoresVigentes(response.data.id, this.mesCorrente, this.anoCorrente, 'consulta')
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      }
    },

    async getIndicadoresVigentes (secaoId, mes, ano, tipo, objeto) {
      this.selectedSecao = {}
      if (tipo === 'consulta') {
        let objetoParaEnvio = {
          mes: mes,
          ano: ano,
          secao_id: secaoId
        }

        console.log(objetoParaEnvio)
        try {
          this.$http.post('indicadores/secao', objetoParaEnvio)
            .then(response => {
              this.selectedSecao = response.data
              console.log(response.data)
              // Limpa os inputs antigos
              this.awaitData = false
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      }
    },

    pegaIndicadoresSecao (secao) {
      this.awaitData = true
      console.log('ano corrente dentro de pega por secao: ' + this.anoCorrente)
      this.getIndicadoresVigentes(secao.id, this.mesCorrente, this.anoCorrente, 'consulta')
    },

    getIndicadorValor (indicador) {
      if (indicador.indicador_valor.length > 0) {
        return indicador.indicador_valor[0].valor
      }
      return null
    },

    updateIndicadorValor (indicador, valor) {
      if (valor === null || valor === '') {
        this.$set(indicador, 'indicador_valor', [])
      } else {
        if (indicador.indicador_valor.length > 0) {
          indicador.indicador_valor[0].valor = valor
        } else {
          this.$set(indicador, 'indicador_valor', [{
            id: null,
            valor: valor,
            mes: this.mesCorrente,
            ano: this.anoCorrente,
            indicador_id: indicador.id,
            atualizado: this.formatDateTime(new Date())
          }])
        }
      }
    },
    gravaValores () {
      try {
        this.$http.post('valorindicador', this.selectedSecao)
          .then((response) => {
            console.log(response.data)
            // this.selectedSecao = response.data
            this.$toastr.s(
              'Indicadores lançados com sucesso', 'Sucesso!'
            )
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    getMonthButtonClass (mes) {
      // Se for o mês corrente, retorna 'primary', caso contrário, 'success'
      return {
        secondary: this.mesCorrente === mes,
        success: this.mesCorrente !== mes,
        'mb-3': true // Mantém a classe de margem
      }
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

      this.pegaIndicadoresSecao(this.selectedSecao)
    },

    formatDateTime (isoString) {
      if (isoString === undefined) {
        return 'Sem Lançamentos'
      } else {
        const date = new Date(isoString)
        // Formata a data
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // Janeiro é 0!
        const year = date.getFullYear()

        // Formata a hora
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return `${day}/${month}/${year} (${hours}:${minutes}:${seconds})`
      }
    },

    escolheMesIndicador (mes) {
      this.mesCorrente = mes
      this.pegaIndicadoresSecao(this.selectedSecao)
    },

    checaMesDisabled (index) {
      if (this.anoBase === this.anoCorrente) {
        return this.capturaIndexMes < index
      } else {
        return false
      }
    },

    getCurrentDate () {
      // Obtém a data atual
      const currentDate = new Date()

      // Define os meses
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ]

      this.diaCorrente = currentDate.getDate()

      // Calcula o mês e ano de referência
      let mesIndex = currentDate.getMonth() - 1
      let anoRef = currentDate.getFullYear()

      // Ajusta o ano se o mês for janeiro
      if (mesIndex === 0) {
        mesIndex = 11
        anoRef -= 1
      }

      this.capturaIndexMes = mesIndex

      this.mesCorrente = months[mesIndex] // Retorna o mês anterior como texto
      this.anoCorrente = anoRef // Retorna o ano de referência
      this.anoBase = anoRef // Retorna o ano de referência
    },

    getColorForIndicator (indicador) {
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
    }

  }
}
</script>

<style>

.bgConfig {
  background-color: #CFE0BC !important;
}
</style>
