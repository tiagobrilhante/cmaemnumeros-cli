<template>
  <!-- container básico-->
  <v-row v-if="Object.keys(objetoPesquisa).length > 0" class="mt-0" dense>
    <v-col>
      <v-row dense>
        <v-col>
        </v-col>
        <v-col v-if="usuarioLogado.id !== objetoPesquisa.user_id" class="text-right">
          <v-btn color="primary" small @click="openDialogSaveTela">
            <v-icon class="pr-4" small>mdi-content-save-outline</v-icon>
            Salvar Tela
          </v-btn>
        </v-col>
      </v-row>

      <br>
      <v-alert color="cyan lighten-3" elevation="12">
        <h3>{{ objetoPesquisa.nome }}</h3>
        <v-row class="mt-4" dense>
          <v-col><b>Tipo de Gráfico: </b> <span v-if="objetoPesquisa.tipoGraph === 'pie'">Pizza</span> <span v-else>Barra</span>
          </v-col>
          <v-col><b>Forma de montagem: </b> {{ objetoPesquisa.objetoPesquisa.forma }}</v-col>

        </v-row>
        <v-row dense>
          <v-col>
            <span v-html="retornaDadosAjustados('Mês')"> </span>
          </v-col>
          <v-col>
            <span v-html="retornaDadosAjustados('Ano')"> </span>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col><b>Hash: </b> {{ objetoPesquisa.hash }}</v-col>
        </v-row>
      </v-alert>

      <v-alert elevation="12">
        <apexchart v-if="series.length > 0" ref="apexChart" :options="chartOptions" :series="series"
                   :type="objetoPesquisa.tipoGraph"
                   height="1000"/>

        <v-btn rounded :color="mostraTable ? 'primary' : 'secondary'" block small @click="mostraTable = !mostraTable">
          <span v-if="mostraTable">Ocultar dados</span>
          <span v-else>Mostrar dados</span>
        </v-btn>
        <!-- Nova tabela de dados -->
        <v-alert class="mt-4" elevation="12" v-if="mostraTable">
          <h3 class="mb-4">Dados do Gráfico</h3>

          <!-- Tabela para gráfico tipo pizza -->
          <v-simple-table v-if="objetoPesquisa.tipoGraph === 'pie'" dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">Indicador</th>
                <th class="text-right">Valor</th>
                <th class="text-right">Percentual (%)</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(valor, index) in series" :key="index">
                <td>{{ getLabel(index) }}</td>
                <td class="text-right">{{ formatValue(valor) }}</td>
                <td class="text-right">{{ calculatePercentage(valor) }}%</td>
              </tr>
<!--              <tr class="grey lighten-3">
                <td><strong>Total</strong></td>
                <td class="text-right"><strong>{{ formatValue(calculateTotal()) }}</strong></td>
                <td class="text-right"><strong>100%</strong></td>
              </tr>-->
              </tbody>
            </template>
          </v-simple-table>

          <!-- Tabela para gráfico tipo barra -->
          <v-simple-table v-else-if="objetoPesquisa.tipoGraph === 'bar'" dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">Período</th>
                <th v-for="(serie, index) in series" :key="index" class="text-right">
                  {{ serie.name || `Série ${index + 1}` }}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(_, rowIndex) in getRowCount()" :key="rowIndex">
                <td>{{ getCategory(rowIndex) }}</td>
                <td v-for="(serie, serieIndex) in series" :key="serieIndex" class="text-right">
                  {{ formatValue(getSerieValue(serie, rowIndex)) }}
                </td>
              </tr>
<!--              <tr class="grey lighten-3">
                <td><strong>Total</strong></td>
                <td v-for="(serie, index) in series" :key="'total-'+index" class="text-right">
                  <strong>{{ formatValue(calculateSeriesTotal(serie.data || [])) }}</strong>
                </td>
              </tr>-->
              </tbody>
            </template>
          </v-simple-table>
        </v-alert>
      </v-alert>

    </v-col>

    <!--Dialog para salvar tela-->
    <v-dialog v-model="dialogSaveTela" max-width="800px">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          Salvar Tela
        </v-card-title>
        <v-card-text>
          <!--nome da tela-->
          <v-row>
            <v-col>
              <span class="pl-3">Nome da Tela</span>
              <v-text-field
                v-model="objTela.nome"
                dense
                hint="Escreva algo para identificar essa tela"
                label="Nome da tela"
                rounded
                solo
              ></v-text-field>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="success" @click="doSaveTela">Salvar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn color="grey lighten-1" @click="dialogSaveTela = false">Cancelar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'

export default {
  name: 'tela',
  mixins: [logoutMixin],
  data: () => ({
    series: [],
    chartOptions: {
      title: {
        text: '', // Placeholder, será atualizado no mounted
        align: 'center',
        margin: 30,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '15px',
          color: '#263238'
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          const label = opts.w.config.labels[opts.seriesIndex]
          const absoluteValue = opts.w.config.series[opts.seriesIndex]
          return `${label}: ${val.toFixed(2)}% (${absoluteValue})`
        },
        style: {
          fontSize: '13px',
          colors: ['#ffffff']
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          blur: 5,
          opacity: 1
        }
      },
      chart: {
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          },
          autoSelected: 'zoom', // Ferramenta padrão selecionada
          export: {
            csv: {
              filename: undefined,
              columnDelimiter: ',',
              headerCategory: 'category',
              headerValue: 'value'
            },
            svg: {
              filename: undefined
            },
            png: {
              filename: undefined
            }
          }
        },
        zoom: {
          enabled: true,
          type: 'x', // Zoom apenas no eixo X
          autoScaleYaxis: true // Ajusta automaticamente o eixo Y ao fazer zoom
        },
        pan: {
          enabled: true,
          mode: 'x' // Pan apenas no eixo X
        }
      },
      legend: {
        show: true,
        position: 'top', // Coloca as legendas à direita
        floating: false, // Mantém as legendas não flutuantes
        horizontalAlign: 'center', // Alinha as legendas à esquerda da posição
        fontSize: '18px', // Aumenta o tamanho da fonte das legendas
        labels: {
          colors: ['#263238'], // Cor das legendas
          useSeriesColors: false
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          radius: 12,
          customHTML: undefined,
          onClick: undefined,
          offsetX: 0,
          offsetY: 0
        },
        itemMargin: {
          horizontal: 20, // Ajusta para que as legendas fiquem uma abaixo da outra
          vertical: 5 // Espaçamento entre as legendas
        },
        containerMargin: {
          left: 35,
          top: 0
        }
      }
    },
    loadedData: false,
    loadingBtn: false,
    dialogSaveTela: false,
    mostraTable: false,
    objTela: {
      nome: '',
      pesquisaFeita: {}
    },
    resultado: [],
    tipoGraph: '',
    objetoPesquisa: {}
  }),
  props: {
    selectedTela: Object
  },

  computed: {
    ...mapGetters(['usuarioLogado'])
  },

  async mounted () {
    await this.getSeries()
  },

  methods: {
    getSeries () {
      try {
        this.$http.post('tela/pegatelasespecifica', this.selectedTela)
          .then(response => {
            this.objetoPesquisa = response.data
            try {
              this.$http.post('/tela/montatela', this.objetoPesquisa.objetoPesquisa)
                .then(response => {
                  this.loadedData = true
                  this.resultado = response.data
                  if (this.objetoPesquisa.tipoGraph === 'pie') {
                    if (this.objetoPesquisa.objetoPesquisa.forma === 'Total de um ano específico') {
                      // Agrupar e calcular valores por indicador com base em 'mapeamento_total_anual'
                      const valoresPorIndicador = this.resultado.reduce((acc, r) => {
                        const nomeIndicador = r.indicador.nome
                        const mapeamento = r.indicador.categoria.mapeamento_total_anual

                        if (!acc[nomeIndicador]) {
                          acc[nomeIndicador] = {valores: [], total: 0}
                        }

                        acc[nomeIndicador].valores.push(r.valor)

                        if (mapeamento === 'Somatório') {
                          acc[nomeIndicador].total += r.valor
                        } else if (mapeamento === 'Máximo') {
                          acc[nomeIndicador].total = Math.max(acc[nomeIndicador].total, r.valor)
                        } else if (mapeamento === 'Mínimo') {
                          acc[nomeIndicador].total = (acc[nomeIndicador].total === 0) ? r.valor : Math.min(acc[nomeIndicador].total, r.valor)
                        }

                        return acc
                      }, {})

                      // Calculando médias nos casos em que é necessário
                      Object.keys(valoresPorIndicador).forEach(indicador => {
                        const mapeamento = this.resultado.find(r => r.indicador.nome === indicador).indicador.categoria.mapeamento_total_anual
                        if (mapeamento === 'Média') {
                          const soma = valoresPorIndicador[indicador].valores.reduce((a, b) => a + b, 0)
                          valoresPorIndicador[indicador].total = soma / valoresPorIndicador[indicador].valores.length
                        }
                      })

                      // Preparando os dados para o gráfico
                      this.series = Object.values(valoresPorIndicador).map(v => v.total)
                      this.chartOptions.labels = Object.keys(valoresPorIndicador)

                      // Habilitando dataLabels globalmente
                      this.chartOptions.dataLabels = {
                        enabled: true,
                        offsetY: -20, // Ajuste para posicionamento dos labels
                        style: {
                          fontSize: '20px',
                          colors: ['#ffffff']
                        },
                        formatter: function (val, opts) {
                          const label = opts.w.config.labels[opts.seriesIndex]
                          const absoluteValue = opts.w.config.series[opts.seriesIndex]

                          const formattedValue = Number.isInteger(absoluteValue)
                            ? absoluteValue.toLocaleString('pt-BR')
                            : absoluteValue.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })

                          return `${label}: ${val.toFixed(2)}% (${formattedValue})`
                        }
                      }

                      // Título do gráfico considerando anos da pesquisa
                      this.chartOptions.title.text =
                        'Total no ano: ' +
                        [...new Set(this.resultado.map(r => r.ano))].sort().join(', ') +
                        ' - ' +
                        [...new Set(this.resultado.map(r => r.indicador.categoria.nome))].join(', ') +
                        ' - ' +
                        [...new Set(this.resultado.map(r => r.indicador.nome))].join(', ')

                      this.chartOptions.tooltip = {
                        y: {
                          formatter: function (value) {
                            // Verifica se o valor é um inteiro
                            const formattedValue = Number.isInteger(value)
                              ? value.toLocaleString('pt-BR')
                              : value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

                            // Retorna o valor formatado
                            return formattedValue
                          }
                        }
                      }
                    } else {
                      this.series = this.resultado.map(r => r.valor)
                      this.chartOptions.labels = this.resultado.map(r => ` ${r.indicador.categoria.nome} - ${r.indicador.nome}  `)
                      this.chartOptions.title.text = [...new Set(this.resultado.map(r => r.indicador.categoria.nome))].join(' -X- ')

                      // Habilitando dataLabels globalmente
                      this.chartOptions.dataLabels = {
                        enabled: true,
                        offsetY: -20, // Ajuste para posicionamento dos labels
                        style: {
                          fontSize: '20px',
                          colors: ['#ffffff']
                        },
                        dropShadow: {
                          enabled: true,
                          top: 2,
                          left: 2,
                          right: 2,
                          bottom: 2,
                          blur: 5,
                          opacity: 1
                        },
                        formatter: function (val, opts) {
                          const label = opts.w.config.labels[opts.seriesIndex]
                          const absoluteValue = opts.w.config.series[opts.seriesIndex]

                          const formattedValue = Number.isInteger(absoluteValue)
                            ? absoluteValue.toLocaleString('pt-BR')
                            : absoluteValue.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })

                          return `${label}: ${val.toFixed(2)}% (${formattedValue})`
                        }
                      }
                    }
                  } else if (this.objetoPesquisa.tipoGraph === 'bar') {
                    if (this.objetoPesquisa.objetoPesquisa.forma === 'Ano específico') {
                      // Para gráficos do tipo "bar"
                      this.chartOptions.title.text = [...new Set(this.resultado.map(r => r.indicador.categoria.nome))].join(' -X- ')

                      // Preparando a lista única de meses e ordenando
                      const meses = [...new Set(this.resultado.map(r => r.mes))].sort((a, b) => a - b)

                      // Mapear as séries por indicador
                      this.series = [...new Set(this.resultado.map(r => `${r.indicador.categoria.nome} - ${r.indicador.nome}`))]
                        .map(nomeIndicador => {
                          return {
                            name: nomeIndicador,
                            data: meses.map(mes => {
                              // Busca o valor correspondente ao mês e indicador atual
                              const entry = this.resultado.find(r => r.mes === mes && `${r.indicador.categoria.nome} - ${r.indicador.nome}` === nomeIndicador)
                              return entry ? entry.valor : 0 // Retorna o valor ou 0 se não houver dado para o mês
                            })
                          }
                        })

                      // Função para gerar uma cor aleatória em formato hexadecimal
                      // eslint-disable-next-line no-inner-declarations
                      function generateRandomColor () {
                        const letters = '0123456789ABCDEF'
                        let color = '#'
                        for (let i = 0; i < 6; i++) {
                          color += letters[Math.floor(Math.random() * 16)]
                        }
                        return color
                      }

                      // Gerar cores aleatórias para cada série
                      this.chartOptions.colors = this.series.map(() => generateRandomColor())

                      // Configurando as categorias do eixo X com os meses correspondentes
                      this.chartOptions.xaxis = {
                        categories: meses.map(mes => {
                          const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                          return nomesMeses[mes - 1]
                        })
                      }

                      this.chartOptions.yaxis = {
                        labels: {
                          formatter: function (value) {
                            // Verifica se o valor é um inteiro
                            const formattedValue = Number.isInteger(value)
                              ? value.toLocaleString('pt-BR')
                              : value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

                            // Retorna o valor formatado
                            return formattedValue
                          },
                          style: {
                            fontSize: '12px',
                            colors: ['#304758']
                          }
                        }
                      }

                      // Configurações para exibir as informações diretamente no gráfico do tipo "bar"
                      this.chartOptions.plotOptions = {
                        bar: {
                          dataLabels: {
                            position: 'top', // Coloca os valores no topo das barras
                            formatter: function (val, opts) {
                              return `${val}` // Exibe apenas o valor na barra
                            },
                            style: {
                              fontSize: '12px',
                              colors: ['#000']
                            }
                          }
                        }
                      }

                      // Habilitando dataLabels globalmente
                      this.chartOptions.dataLabels = {
                        enabled: true,
                        offsetY: -20, // Ajuste para posicionamento dos labels
                        style: {
                          fontSize: '12px',
                          colors: ['#304758']
                        },
                        formatter: function (val, opts) {
                          return Number.isInteger(val)
                            ? val.toLocaleString('pt-BR') // Inteiros sem casas decimais
                            : val.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) // Decimais com duas casas
                        }
                      }

                      this.chartOptions.tooltip = {
                        y: {
                          formatter: function (value) {
                            // Verifica se o valor é um inteiro
                            const formattedValue = Number.isInteger(value)
                              ? value.toLocaleString('pt-BR')
                              : value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

                            // Retorna o valor formatado
                            return formattedValue
                          }
                        }
                      }
                    } else if (this.objetoPesquisa.objetoPesquisa.forma === 'Intervalo de anos' || this.objetoPesquisa.objetoPesquisa.forma === 'Intervalo de meses de um ano específico' || this.objetoPesquisa.objetoPesquisa.forma === 'Intervalo de meses de um intervalo de anos') {
                      // Para gráficos do tipo "bar"
                      this.chartOptions.title.text = [...new Set(this.resultado.map(r => r.indicador.categoria.nome))].join(' -X- ')

                      // Preparando uma lista única de anos e meses com dados, sem valores vazios
                      const mesesAnos = [...new Set(this.resultado.map(r => `${r.mes}-${r.ano}`))].sort((a, b) => {
                        const [mesA, anoA] = a.split('-').map(Number)
                        const [mesB, anoB] = b.split('-').map(Number)
                        return anoA !== anoB ? anoA - anoB : mesA - mesB
                      })

                      // Mapear as séries por indicador, somente para meses/anos com dados
                      this.series = [...new Set(this.resultado.map(r => `${r.indicador.categoria.nome} - ${r.indicador.nome}`))]
                        .map(nomeIndicador => {
                          return {
                            name: nomeIndicador,
                            data: mesesAnos.map(mesAno => {
                              const [mes, ano] = mesAno.split('-').map(Number)
                              // Busca o valor correspondente ao mês, ano e indicador atual
                              const entry = this.resultado.find(r => r.mes === mes && r.ano === ano && `${r.indicador.categoria.nome} - ${r.indicador.nome}` === nomeIndicador)
                              return entry ? entry.valor : null // Retorna o valor ou null se não houver dado para o mês/ano
                            }).filter(val => val !== null) // Remove os valores nulos
                          }
                        })

                      // Função para gerar uma cor aleatória em formato hexadecimal
                      // eslint-disable-next-line no-inner-declarations
                      function generateRandomColor () {
                        const letters = '0123456789ABCDEF'
                        let color = '#'
                        for (let i = 0; i < 6; i++) {
                          color += letters[Math.floor(Math.random() * 16)]
                        }
                        return color
                      }

                      // Gerar cores aleatórias para cada série
                      this.chartOptions.colors = this.series.map(() => generateRandomColor())

                      // Configurando as categorias do eixo X com os meses/anos correspondentes
                      this.chartOptions.xaxis = {
                        categories: mesesAnos.map(mesAno => {
                          const [mes, ano] = mesAno.split('-').map(Number)
                          const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                          return `${nomesMeses[mes - 1]} - ${ano}`
                        })
                      }

                      // Configurações para exibir as informações diretamente no gráfico do tipo "bar"
                      this.chartOptions.plotOptions = {
                        bar: {
                          dataLabels: {
                            position: 'top', // Coloca os valores no topo das barras
                            formatter: function (val, opts) {
                              return `${val}` // Exibe apenas o valor na barra
                            },
                            style: {
                              fontSize: '12px',
                              colors: ['#000']
                            }
                          }
                        }
                      }

                      // Habilitando dataLabels globalmente
                      this.chartOptions.dataLabels = {
                        enabled: true,
                        offsetY: -20, // Ajuste para posicionamento dos labels
                        style: {
                          fontSize: '12px',
                          colors: ['#304758']
                        },
                        formatter: function (value) {
                          // Verifica se o valor é um inteiro
                          const formattedValue = Number.isInteger(value)
                            ? value.toLocaleString('pt-BR')
                            : value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

                          // Retorna o valor formatado
                          return formattedValue
                        }
                      }

                      this.chartOptions.tooltip = {
                        y: {
                          formatter: function (value) {
                            // Verifica se o valor é um inteiro
                            const formattedValue = Number.isInteger(value)
                              ? value.toLocaleString('pt-BR')
                              : value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

                            // Retorna o valor formatado
                            return formattedValue
                          }
                        }
                      }

                      this.chartOptions.yaxis = {
                        labels: {
                          formatter: function (value) {
                            // Verifica se o valor é um inteiro
                            const formattedValue = Number.isInteger(value)
                              ? value.toLocaleString('pt-BR')
                              : value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

                            // Retorna o valor formatado
                            return formattedValue
                          },
                          style: {
                            fontSize: '12px',
                            colors: ['#304758']
                          }
                        }
                      }
                    } else if (this.objetoPesquisa.objetoPesquisa.forma === 'Total de um intervalo de anos') {
                      let valoresPorAnoEIndicador = {}
                      // Agrupar os dados por ano e indicador
                      valoresPorAnoEIndicador = this.resultado.reduce((acc, r) => {
                        const ano = r.ano
                        const indicador = r.indicador.nome
                        const mapeamento = r.indicador.categoria.mapeamento_total_anual

                        // Inicializar o objeto se não existir
                        if (!acc[ano]) acc[ano] = {}
                        if (!acc[ano][indicador]) {
                          acc[ano][indicador] = {valores: [], total: 0}
                        }

                        // Armazenar valor
                        acc[ano][indicador].valores.push(r.valor)

                        // Processar de acordo com o mapeamentoTotalAnual
                        if (mapeamento === 'Somatório') {
                          acc[ano][indicador].total += r.valor
                        } else if (mapeamento === 'Máximo') {
                          acc[ano][indicador].total = Math.max(acc[ano][indicador].total, r.valor)
                        } else if (mapeamento === 'Mínimo') {
                          acc[ano][indicador].total = (acc[ano][indicador].total === 0) ? r.valor : Math.min(acc[ano][indicador].total, r.valor)
                        }

                        return acc
                      }, {})

                      // Calculando médias onde necessário
                      Object.keys(valoresPorAnoEIndicador).forEach(ano => {
                        Object.keys(valoresPorAnoEIndicador[ano]).forEach(indicador => {
                          const mapeamento = this.resultado.find(r => r.indicador.nome === indicador && r.ano === parseInt(ano)).indicador.categoria.mapeamento_total_anual
                          if (mapeamento === 'Média') {
                            const dados = valoresPorAnoEIndicador[ano][indicador]
                            const soma = dados.valores.reduce((a, b) => a + b, 0)
                            dados.total = soma / dados.valores.length
                          }
                        })
                      })

                      this.chartOptions.xaxis = {
                        categories: [...new Set(this.resultado.map(r => r.indicador.nome))]
                      }

                      // Título do gráfico considerando anos da pesquisa
                      this.chartOptions.title.text =
                        'Totais por Indicador no intervalo: ' +
                        [...new Set(this.resultado.map(r => r.ano))].sort().join(' a ') +
                        ' - ' +
                        [...new Set(this.resultado.map(r => r.indicador.categoria.nome))].join(', ') +
                        ' - ' +
                        [...new Set(this.resultado.map(r => r.indicador.nome))].join(', ')

                      this.chartOptions.tooltip = {
                        y: {
                          formatter: function (value) {
                            // Verifica se o valor é um inteiro
                            const formattedValue = Number.isInteger(value)
                              ? value.toLocaleString('pt-BR')
                              : value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

                            // Retorna o valor formatado
                            return formattedValue
                          }
                        }
                      }

                      this.series = Object.keys(valoresPorAnoEIndicador).map(ano => ({
                        name: ano,
                        data: Object.values(valoresPorAnoEIndicador[ano]).map(dados => dados.total)
                      }))

                      // Configurações para exibir as informações diretamente no gráfico do tipo "bar"
                      this.chartOptions.plotOptions = {
                        bar: {
                          dataLabels: {
                            position: 'top', // Coloca os valores no topo das barras
                            formatter: function (val, opts) {
                              return Number.isInteger(val) ? val.toString() : val.toFixed(2) // Exibe sem casas decimais se for inteiro, senão com duas casas
                            },
                            style: {
                              fontSize: '12px',
                              colors: ['#000']
                            }
                          }
                        }
                      }

                      // Habilitando dataLabels globalmente
                      this.chartOptions.dataLabels = {
                        enabled: true,
                        offsetY: -20, // Ajuste para posicionamento dos labels
                        style: {
                          fontSize: '12px',
                          colors: ['#304758']
                        },
                        formatter: function (val, opts) {
                          return Number.isInteger(val)
                            ? val.toLocaleString('pt-BR') // Inteiros sem casas decimais
                            : val.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) // Decimais com duas casas
                        }
                      }

                      this.chartOptions.yaxis = {
                        labels: {
                          formatter: function (value) {
                            // Verifica se o valor é um inteiro
                            const formattedValue = Number.isInteger(value)
                              ? value.toLocaleString('pt-BR')
                              : value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

                            // Retorna o valor formatado
                            return formattedValue
                          },
                          style: {
                            fontSize: '12px',
                            colors: ['#304758']
                          }
                        }
                      }
                    }
                  }
                  this.$nextTick(() => {
                    this.redrawChart()
                  })
                })
                .catch(erro => console.log(erro))
            } catch (e) {
              console.log(e)
            }
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    redrawChart () {
      this.$refs.apexChart.updateOptions(this.chartOptions, true, true)
      this.$refs.apexChart.updateSeries(this.series, true)
    },

    retornaDadosAjustados (tipo) {
      /* formas
      Mês de um ano específico
      Intervalo de meses de um ano específico
      Ano específico
      Intervalo de anos
      Intervalo de meses de um intervalo de anos
      Total de um ano específico
      Total de um intervalo de anos
      */
      if (tipo === 'Mês') {
        if (this.objetoPesquisa.objetoPesquisa.forma === 'Mês de um ano específico') {
          return '<b>Mês:</b> ' + this.objetoPesquisa.objetoPesquisa.mes
        }
        if (this.objetoPesquisa.objetoPesquisa.forma === 'Intervalo de meses de um ano específico' || this.objetoPesquisa.objetoPesquisa.forma === 'Intervalo de meses de um intervalo de anos') {
          let meses = ''
          for (let i = 0; i < this.objetoPesquisa.objetoPesquisa.mes.length; i++) {
            let porVirgula = i < this.objetoPesquisa.objetoPesquisa.mes.length - 1 ? ', ' : ''
            meses += this.objetoPesquisa.objetoPesquisa.mes[i] + porVirgula
          }
          return '<b>Meses:</b> ' + meses
        }
        if (this.objetoPesquisa.objetoPesquisa.forma === 'Ano específico' || this.objetoPesquisa.objetoPesquisa.forma === 'Intervalo de anos' || this.objetoPesquisa.objetoPesquisa.forma === 'Total de um intervalo de anos' || this.objetoPesquisa.objetoPesquisa.forma === 'Total de um ano específico') {
          return '<b>Meses:</b> Todos'
        }
      } else {
        if (this.objetoPesquisa.objetoPesquisa.forma === 'Mês de um ano específico' || this.objetoPesquisa.objetoPesquisa.forma === 'Intervalo de meses de um ano específico' || this.objetoPesquisa.objetoPesquisa.forma === 'Ano específico' || this.objetoPesquisa.objetoPesquisa.forma === 'Total de um ano específico') {
          return '<b>Ano:</b> ' + this.objetoPesquisa.objetoPesquisa.ano_verifica_inicio
        }
        if (this.objetoPesquisa.objetoPesquisa.forma === 'Intervalo de meses de um intervalo de anos' || this.objetoPesquisa.objetoPesquisa.forma === 'Intervalo de anos' || this.objetoPesquisa.objetoPesquisa.forma === 'Total de um intervalo de anos') {
          let anos = 'entre: ' + this.objetoPesquisa.objetoPesquisa.ano_verifica_inicio + ' e ' + this.objetoPesquisa.objetoPesquisa.ano_verifica_fim
          return '<b>Anos:</b> ' + anos
        }
      }
    },

    openDialogSaveTela () {
      this.dialogSaveTela = true
    },

    doSaveTela () {
      if (this.objTela.nome === '') {
        this.$toastr.e(
          'O nome da tela é obrigatório', 'Erro!'
        )
      } else {
        this.objTela.pesquisaFeita = this.objetoPesquisa.objetoPesquisa
        try {
          this.$http.post('tela/savetela', this.objTela)
            .then(() => {
              this.$toastr.s(
                'Tela cadastrada com sucesso', 'Sucesso!'
              )
              this.dialogSaveTela = false
              this.objTela = {
                nome: '',
                pesquisaFeita: {}
              }
              this.$emit('ajustaTelasSalvas')
              this.$nextTick(() => {
                this.$emit('resetaTela')
              })
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      }
    },

    // Novos métodos seguros e compatíveis para a tabela
    getRowCount () {
      if (!this.series.length) return []

      // Se temos categories definidas, use seu comprimento
      if (this.chartOptions && this.chartOptions.xaxis && this.chartOptions.xaxis.categories) {
        return Array(this.chartOptions.xaxis.categories.length).fill(null)
      }

      // Caso contrário, use o comprimento do primeiro conjunto de dados
      return Array((this.series[0] && this.series[0].data && this.series[0].data.length) || 0).fill(null)
    },

    getLabel (index) {
      if (this.chartOptions && this.chartOptions.labels && this.chartOptions.labels[index]) {
        return this.chartOptions.labels[index]
      }
      return `Indicador ${index + 1}`
    },

    getCategory (index) {
      if (this.chartOptions && this.chartOptions.xaxis && this.chartOptions.xaxis.categories) {
        return this.chartOptions.xaxis.categories[index] || `Período ${index + 1}`
      }
      return `Período ${index + 1}`
    },

    getSerieValue (serie, index) {
      if (serie && serie.data && serie.data[index] !== undefined) {
        return serie.data[index]
      }
      return null
    },

    formatValue (value) {
      if (value === null || value === undefined) return '-'
      return Number.isInteger(value)
        ? value.toLocaleString('pt-BR')
        : value.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
    },

    calculateTotal () {
      if (!Array.isArray(this.series)) return 0
      return this.series.reduce((acc, curr) => acc + (Number(curr) || 0), 0)
    },

    calculateSeriesTotal (data) {
      if (!Array.isArray(data)) return 0
      return data.reduce((acc, curr) => acc + (Number(curr) || 0), 0)
    },

    calculatePercentage (value) {
      const total = this.calculateTotal()
      if (total === 0) return '0,00'
      return ((value / total) * 100).toFixed(2).replace('.', ',')
    }

  }
}
</script>

<style>
.apexcharts-toolbar {
  display: flex !important;
}

/* Adicione estes estilos para melhorar a aparência da tabela */
.v-data-table {
  background-color: white !important;
}

.v-data-table th {
  font-weight: bold !important;
  background-color: #f5f5f5 !important;
}

.v-data-table td, .v-data-table th {
  padding: 8px 16px !important;
}
</style>
