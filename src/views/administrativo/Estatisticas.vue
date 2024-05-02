<template>
  <v-main class="bgConfig">
    <BarraNavegacao></BarraNavegacao>

    <CabecalhoAA/>

    <v-container fluid>

      <v-row>

        <!--espaço-->
        <v-col cols="1"></v-col>

        <!--Espaço de exibição de estatísticas-->
        <v-col>

          <!--Estatísticas para datas históricas e curiosidades-->
          <v-alert color="rgb(255,255,255,0.4)" rounded="xl">

            <!--Cabeçalho -->
            <v-row class="mb-3">

              <v-col align-self="center">
                <h3>Estatísticas</h3>
              </v-col>

            </v-row>

            <v-divider></v-divider>

            <!-- Estatísticas basicas-->
            <v-alert class="mt-3" rounded="xl">

              <!-- versão do cliente e da API-->
              <v-row no-gutters>
                <!--versão do cliente-->
                <v-col>
                  <b>Versão do Cliente: </b> {{ configSis.versaoSis }}
                </v-col>

                <!-- versão da API-->
                <v-col>
                  <b>Versão da API: </b> {{ apiVersion }}
                </v-col>

              </v-row>

              <!-- Tipo de Totem-->
              <v-row no-gutters>
                <v-col>
                  <b>Tipo de Totem: </b> <span v-if="totemConfigs.tipo_totem === 'data'">Datas Históricas</span><span
                  v-else>Curiosidades</span>
                </v-col>
              </v-row>

              <!-- quantidade de eventos cadastrados e quantidade total de acessos-->
              <v-row v-if="totemConfigs.tipo_totem != 'normal'" no-gutters>

                <!-- quantidade de eventoscadastrados-->
                <v-col>
                  <b>Quantidades de eventos cadastrados: </b> {{ quantidadeEvenntos }}
                </v-col>

                <!-- quantidade total de acessos-->
                <v-col>
                  <b>Quantidade Total de Acessos: </b> {{ acessos.reduce((soma, elemento) => soma + elemento, 0) }}
                </v-col>

              </v-row>

              <!-- Aqui é para totem normal-->
              <v-row v-else no-gutters>

                <!-- quantidade de assuntos-->
                <v-col>
                  <b>Quantidades de assuntos cadastrados: </b> {{ quantidadeEvenntos }}
                </v-col>

                <!-- quantidade total de acessos-->
                <v-col>
                  <b>Quantidade Total de Acessos: </b> {{ acessos.reduce((soma, elemento) => soma + elemento, 0) }}
                </v-col>

              </v-row>

              <!-- Evento Mais acessado-->
              <v-row v-if="totemConfigs.tipo_totem != 'normal'" no-gutters>
                <v-col>
                  <b>Evento com maior quantidade de acessos: </b> {{ conteudoMaisAcessado.ano }} -
                  {{ conteudoMaisAcessado.nome }} ( {{ conteudoMaisAcessado.acessos }} acessos)
                </v-col>
              </v-row>

              <!-- Assunto Mais acessada-->
              <v-row v-else no-gutters>
                <v-col>
                  <b>Assunto com maior quantidade de acessos: </b>
                  {{ conteudoMaisAcessado.nome_assunto }} ( {{ conteudoMaisAcessado.acessos }} acessos)
                </v-col>
                <v-col>
                  <b>Imagem com maior quantidade de acessos: </b>
                  {{ imgMaisAcessada.nome }} ( {{ imgMaisAcessada.acessos }} acessos)
                </v-col>
              </v-row>

            </v-alert>

            <!-- Área de Gráficos e tabela para Datas Históricas-->
            <v-alert v-if="totemConfigs.tipo_totem != 'normal'" class="mt-3" rounded="xl">

              <!--- btn para abrir/fechar tabela -->
              <v-btn v-if="!showTotalContent" class="rounded-xl" color="secondary" small @click="showHideTable"> Exibir
                Tabela de Dados
              </v-btn>

              <!-- chart-->
              <apexchart v-if="!carregandoDados && totemConfigs.tipo_totem ==='data'" :options="options" :series="series"
                         type="bar"
                         width="100%"></apexchart>

              <!--- tabela de dados-->
              <v-alert v-if="showTotalContent" class="elevation-10 mt-3 pb-8 pl-8 pr-8" color="cyan lighten-4"
                       rounded="xl">

                <!--- btn para abrir/fechar tabela -->
                <v-btn v-if="showTotalContent" class="rounded-xl" color="secondary" small @click="showHideTable">
                  Ocultar Tabela de Dados
                </v-btn>

                <!--DataTable-->
                <v-data-table
                  :calculate-widths="true"
                  :headers="headers"
                  :items="eventos"
                  :items-per-page="-1"
                  :search="search"
                  :sort-desc="true"
                  class="elevation-21 mt-4 rounded-xl"
                  dense
                  group-by="ano"
                  hide-default-footer
                  sort-by="ano"
                >

                  <!--template do topo da tabela-->
                  <template v-slot:top>
                    <v-toolbar
                      flat
                    >
                      <v-toolbar-title>Estatísticas de Acesso (Geral)</v-toolbar-title>

                      <v-divider
                        class="mx-4"
                        inset
                        vertical
                      ></v-divider>

                      <v-spacer></v-spacer>

                      <!--Pesquisar-->
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        hide-details
                        label="Pesquisar"
                        placeholder="Pesquisar"
                        single-line
                      ></v-text-field>

                    </v-toolbar>

                  </template>

                </v-data-table>

              </v-alert>

            </v-alert>

            <!-- Área de Gráficos e tabela para Curiosidades-->
            <v-alert v-else class="mt-3" rounded="xl">

              <!--- btn para abrir/fechar tabela -->
              <v-btn v-if="!showTotalContent" class="rounded-xl" color="secondary" small @click="showHideTable"> Exibir
                Tabela de Dados
              </v-btn>

              <!-- chart-->
              <apexchart v-if="!carregandoDados && totemConfigs.tipo_totem ==='normal'" :options="options" :series="series"
                         :type="tipoGrafico"
                         width="100%"></apexchart>

              <!--- tabela de dados-->
              <v-alert v-if="showTotalContent" class="elevation-10 mt-3 pb-8 pl-8 pr-8" color="cyan lighten-4"
                       rounded="xl">

                <!--- btn para abrir/fechar tabela -->
                <v-btn v-if="showTotalContent" class="rounded-xl" color="secondary" small @click="showHideTable">
                  Ocultar Tabela de Dados
                </v-btn>

                <!--DataTable-->
                <v-data-table
                  :calculate-widths="true"
                  :headers="headersAssunto"
                  :items="assuntos"
                  :items-per-page="-1"
                  :search="search"
                  :sort-desc="true"
                  class="elevation-21 mt-4 rounded-xl"
                  dense
                  hide-default-footer
                  sort-by="acessos"
                >

                  <!--template do topo da tabela-->
                  <template v-slot:top>
                    <v-toolbar
                      flat
                    >
                      <v-toolbar-title>Estatísticas de Acesso (Geral)</v-toolbar-title>

                      <v-divider
                        class="mx-4"
                        inset
                        vertical
                      ></v-divider>

                      <v-spacer></v-spacer>

                      <!--Pesquisar-->
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        hide-details
                        label="Pesquisar"
                        placeholder="Pesquisar"
                        single-line
                      ></v-text-field>

                    </v-toolbar>

                  </template>

                </v-data-table>

              </v-alert>

              <v-divider></v-divider>
              <hr>
              <hr>
              <hr>
              <hr>
              <hr>
              <v-divider class="pb-15"></v-divider>

              <!--- btn para abrir/fechar tabela -->
              <v-btn v-if="!showTotalContent2 && totemConfigs.tipo_totem ==='normal'" class="rounded-xl" color="secondary"
                     small @click="showHideTable2"> Exibir
                Tabela de Dados
              </v-btn>

              <!-- chart-->
              <apexchart v-if="!carregandoDados && totemConfigs.tipo_totem ==='normal'" :options="options2" :series="series2"
                         type="bar"
                         width="100%"></apexchart>

              <!--- tabela de dados-->
              <v-alert v-if="showTotalContent2" class="elevation-10 mt-3 pb-8 pl-8 pr-8" color="cyan lighten-4"
                       rounded="xl">

                <!--- btn para abrir/fechar tabela -->
                <v-btn v-if="showTotalContent2" class="rounded-xl" color="secondary" small @click="showHideTable2">
                  Ocultar Tabela de Dados
                </v-btn>

                <!--DataTable-->
                <v-data-table
                  :calculate-widths="true"
                  :headers="headersImagens"
                  :items="imagens"
                  :items-per-page="-1"
                  :search="search2"
                  :sort-desc="true"
                  class="elevation-21 mt-4 rounded-xl"
                  dense
                  hide-default-footer
                  sort-by="acessos"
                >

                  <!--template do topo da tabela-->
                  <template v-slot:top>
                    <v-toolbar
                      flat
                    >
                      <v-toolbar-title>Estatísticas de Acesso (Geral)</v-toolbar-title>

                      <v-divider
                        class="mx-4"
                        inset
                        vertical
                      ></v-divider>

                      <v-spacer></v-spacer>

                      <!--Pesquisar-->
                      <v-text-field
                        v-model="search2"
                        append-icon="mdi-magnify"
                        hide-details
                        label="Pesquisar"
                        placeholder="Pesquisar"
                        single-line
                      ></v-text-field>

                    </v-toolbar>

                  </template>

                </v-data-table>

              </v-alert>

            </v-alert>

          </v-alert>

        </v-col>

        <!--espaço-->
        <v-col cols="1"></v-col>

      </v-row>
    </v-container>

  </v-main>
</template>
<script>
import BarraNavegacao from '../../components/barra-navegacao/BarraNavegacao.vue'
import CabecalhoAA from '../../components/areaAdministrativa/CabecalhoAA/CabecalhoAA.vue'
import config from '../../http/config'
import {mapGetters} from 'vuex'

export default {

  name: 'estatisticas',
  components: {BarraNavegacao, CabecalhoAA},
  data: vm => ({
    configSis: config,
    totemConfigs: {
      nome_totem: '',
      altura_index: '',
      largura_index: '',
      altura_detail: '',
      largura_detail: '',
      access_code: '',
      tipo_totem: ''
    },
    carregandoDados: true,
    categorias: [],
    categorias2: [],
    acessos: [],
    acessos2: [],
    textoGrafico: '',
    quantidadeEvenntos: 0,
    conteudoMaisAcessado: {},
    imgMaisAcessada: {},
    tipoGrafico: 'bar',
    options: {
      series: [{
        name: 'Acessos',
        data: this.acessos
      }],
      chartOptions: {
        chart: {
          id: 'Estatísticas',
          type: this.tipoGrafico
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'center' // top, center, bottom
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val
        },
        offsetY: -20,
        style: {
          fontSize: '15px',
          colors: ['#304758']
        }
      },
      title: {
        text: this.textoGrafico,
        floating: true,
        align: 'top',
        style: {
          color: '#444'
        }
      },
      xaxis: {
        categories: this.categorias,
        position: 'bottom',
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        labels: {
          show: true,
          formatter: function (val) {
            return val
          }
        }
      }
    },
    options2: {
      series2: [{
        name: 'Acessos',
        data: this.imagens
      }],
      chartOptions: {
        chart: {
          id: 'Estatísticas',
          type: 'bar'
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'center' // top, center, bottom
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val
        },
        offsetY: -20,
        style: {
          fontSize: '15px',
          colors: ['#304758']
        }
      },
      labels: [],
      title: {
        text: 'Imagens mais acessadas (Série Histórica)',
        floating: true,
        align: 'top',
        style: {
          color: '#444'
        }
      },
      xaxis: {
        categories: this.categorias,
        position: 'bottom',
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        labels: {
          show: true,
          formatter: function (val) {
            return val
          }
        }
      },
      fill: {
        colors: ['#6b5252']
      }
    },
    eventos: [],
    assuntos: [],
    imagens: [],
    tipoAtual: '',
    headers: [
      {
        text: 'Ano',
        align: 'start',
        value: 'ano'
      },
      {
        text: 'Evento',
        align: 'start',
        value: 'nome'
      },
      {
        text: 'acessos',
        align: 'start',
        value: 'acessos'
      }
    ],
    headersAssunto: [
      {
        text: 'Assunto',
        align: 'start',
        value: 'nome_assunto'
      },
      {
        text: 'acessos',
        align: 'start',
        value: 'acessos'
      }
    ],
    headersImagens: [
      {
        text: 'Imagem',
        align: 'start',
        value: 'nome'
      },
      {
        text: 'acessos',
        align: 'start',
        value: 'acessos'
      }
    ],
    search: '',
    search2: '',
    showTotalContent: false,
    showTotalContent2: false,
    apiVersion: ''
  }),
  computed: {
    ...mapGetters(['usuarioLogado', 'paginaEmAtulizacao'])
  },
  watch: {
    tipoAtual (newValue, oldValue) {
      if (newValue !== oldValue && oldValue !== '') {
        location.reload()
      }
    },
    paginaEmAtulizacao (val) {
      if (val) {
        this.getConfigs()
      }
      this.$store.commit('PARA_ATUALIZAR_CONTEUDO')
    }
  },
  async mounted () {
    await this.getConfigs()
    await this.getApiVersion()
  },
  methods: {
    async getConfigs () {
      try {
        const response = await this.$http.get('totemconfig/plus')
        this.totemConfigs = Object.assign({}, response.data)
        await this.getEstatisticas()
      } catch (erro) {
        console.log(erro)
      }
    },

    async getApiVersion () {
      try {
        const response = await this.$http.get(this.configSis.urlDownload)
        const htmlString = response.data

        // Usar uma expressão regular para encontrar a versão da API
        const regex = /<b>Versão da api:<\/b> (\d+\.\d+)/
        const match = htmlString.match(regex)

        if (match) {
          this.apiVersion = match[1]
        } else {
          this.apiVersion = 'Versão da API não encontrada.'
        }
      } catch (erro) {
        console.log(erro)
      }
    },

    async getEstatisticas () {
      try {
        const response = await this.$http.get('estatisticas/' + this.totemConfigs.tipo_totem)

        this.tipoAtual = this.totemConfigs.tipo_totem
        this.categorias = response.data[0]
        this.acessos = response.data[1]
        this.quantidadeEvenntos = response.data[2]
        this.conteudoMaisAcessado = response.data[3]

        if (this.totemConfigs.tipo_totem === 'data') {
          this.eventos = response.data[4]
          this.textoGrafico = 'Acessos a eventos (Série histórica - por ANO)'
          this.tipoGrafico = 'bar'
        } else {
          this.assuntos = response.data[4]
          this.imgMaisAcessada = response.data[5]
          this.categorias2 = response.data[6]
          this.acessos2 = response.data[7]
          this.imagens = response.data[8]
          this.textoGrafico = 'Acesso a assuntos (série Histórica)'
          this.tipoGrafico = 'pie'
        }
        this.carregandoDados = false
        this.updateChart()
      } catch (erro) {
        console.log(erro)
      }
    },

    updateChart () {
      const newData = this.acessos
      const newCategories = this.categorias
      const newTextoGrafico = this.textoGrafico
      const newQualTipo = this.tipoGrafico

      if (this.totemConfigs.tipo_totem === 'data') {
        // nesse cado são estatísticas de datas históricas
        // In the same way, update the series option
        this.series = [{
          name: 'Acessos',
          data: newData
        }]
        this.options.xaxis.categories = newCategories
        this.options.title.text = newTextoGrafico
        this.options.chartOptions.chart.type = newQualTipo

        this.options.chartOptions.plotOptions = {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'center' // top, center, bottom
            }
          }
        }

        this.options.dataLabels = {
          enabled: true,
          formatter: function (val) {
            return val
          },
          offsetY: -20,
          style: {
            fontSize: '15px',
            colors: ['#304758']
          }
        }
      } else {
        // aqui estou lidando com imagens e assuntos

        // In the same way, update the series option
        this.series = newData
        this.options.labels = newCategories
        this.options.title.text = newTextoGrafico
        this.options.xaxis.categories = newCategories
        this.options.chartOptions.chart.type = newQualTipo
        this.options.dataLabels = {
          enabled: true,
          formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex]
          },
          style: {
            fontSize: '20px',
            colors: ['#304758']
          }
        }

        const newCategories2 = this.categorias2
        const newData2 = this.acessos2

        this.series2 = [{
          name: 'Acessos',
          data: newData2
        }]

        this.options2.xaxis.categories = newCategories2
      }
    },

    converterDataParaFormatoBrasileiro (dataIso) {
      const data = new Date(dataIso)
      const dia = String(data.getDate()).padStart(2, '0')
      const mes = String(data.getMonth() + 1).padStart(2, '0')
      const ano = String(data.getFullYear())
      const hora = String(data.getHours()).padStart(2, '0')
      const minutos = String(data.getMinutes()).padStart(2, '0')
      const segundos = String(data.getSeconds()).padStart(2, '0')
      return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`
    },

    showHideTable () {
      if (this.showTotalContent) {
        this.showTotalContent = false
      } else {
        this.showTotalContent = true
      }
    },

    showHideTable2 () {
      if (this.showTotalContent2) {
        this.showTotalContent2 = false
      } else {
        this.showTotalContent2 = true
      }
    }
  }
}
</script>

<style>
.bgConfig {
  background-color: #6b5252 !important;
}
</style>
