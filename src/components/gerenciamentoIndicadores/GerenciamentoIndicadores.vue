<template>
  <v-main class="bgConfig">
    <BarraNavegacao></BarraNavegacao>

    <v-container fluid>
      <!--Banner-->
      <v-alert
        class="p-5"
        elevation="21"
      >
        <v-row>
          <v-col cols="9">
            <h2>
              <v-icon
                class="mr-4"
                size="36">
                mdi-chart-line
              </v-icon>
              Configurações de Indicadores
            </h2>

          </v-col>
          <v-col class="text-right" cols="3">
            <v-btn class="primary" @click="openDialogAddEditIndicador('add')">Adicionar Novo</v-btn>
          </v-col>
        </v-row>

      </v-alert>

      <!--DataTable-->
      <v-data-table
        :headers="headers"
        :items="indicadores"
        :search="search"
        class="elevation-21 mt-4"
        sort-by="categoria.secao.sigla"
      >
        <!-- template para titulo e search-->
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <!-- Título da tabela-->
            <v-toolbar-title>Tabela de Indicadores Cadastradas</v-toolbar-title>

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

        <!--Template de green -->
        <template v-slot:item.green="{ item }">

          <v-chip
            class="ml-0"
            color="green"
            text-color="black">
            {{ item.green }}
          </v-chip>

        </template>

        <!--Template de yellow -->
        <template v-slot:item.yellow_1="{ item }">

          <v-chip
            color="yellow"
            text-color="black">
            {{ item.yellow_1 }}
          </v-chip>
          <v-chip
            color="yellow"
            text-color="black"
          >
            {{ item.yellow_2 }}
          </v-chip>

        </template>

        <!--Template de red -->
        <template v-slot:item.red="{ item }">

          <v-chip
            color="red"
            text-color="white">
            {{ item.red }}
          </v-chip>

        </template>

        <!--Template de botões para editar, excluir -->
        <template v-slot:item.actions="{ item }">

          <!--editar-->
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="mr-2"
                small
                v-bind="attrs"
                @click="openDialogAddEditIndicador('edit', item)"
                v-on="on"
              >
                mdi-pen
              </v-icon>
            </template>
            <span>Editar Indicador</span>
          </v-tooltip>

          <!--Excluir -->
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="mr-2"
                small
                v-bind="attrs"
                @click="deleteIndicador(item)"
                v-on="on"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Excluir Indicador</span>
          </v-tooltip>

        </template>

      </v-data-table>
    </v-container>

    <!-- melhorar no edit não esta carregando s seção-->
    <!--Dialog para add/edit indicador-->
    <v-dialog v-model="dialogAddEditIndicadores" max-width="70%">
      <v-card>
        <v-form @submit.prevent="efetuarCadastroEditIndicador">

          <v-card-title primary-title>
            <v-row>
              <v-col></v-col>
              <v-col class="text-center">

                <span v-if="areaGerenciamentoCategorias">Gerenciamento de categorias</span>
                <span v-else>
                  <span v-if="tipoAcao === 'add'">Adicionar novo Indicador</span>
                  <span v-else>Edição de Indicadores</span>
                </span>

              </v-col>
              <v-col class="text-right">
                <v-btn :class="seletorClasseBtn" small @click="showHideGerencimantoCategoria">
                  <v-icon class="mr-4" small> mdi-cogs</v-icon>
                  <span v-if="areaGerenciamentoCategorias">Fechar Gerenciamento de categorias</span>
                  <span v-else>Abrir gerenciamento de categorias</span>
                </v-btn>
              </v-col>
            </v-row>

          </v-card-title>

          <v-card-text>

            <GerenciamentoCategorias v-if="areaGerenciamentoCategorias"></GerenciamentoCategorias>

            <v-container v-else fluid>

              <!-- secao e categoria-->
              <v-row dense>

                <!-- seção -->
                <v-col>
                  <span class="pl-3">Selecione a Seção do Indicador</span>
                  <v-autocomplete
                    v-model="editedIndicador.secao_id"
                    :items="secoes"
                    clearable
                    dense
                    item-text="sigla"
                    item-value="id"
                    label="Selecione a seção responsável pelo Indicador"
                    name="secao"
                    rounded
                    solo
                    @change="getCategoriaPorSecao"
                  ></v-autocomplete>
                </v-col>

                <!-- Categoria-->
                <v-col v-if="categoriasPorSecao.length > 0">
                  <span class="pl-3">Selecione a Categoria do Indicador</span>
                  <v-autocomplete
                    v-model="editedIndicador.categoria_id"
                    :items="categoriasPorSecao"
                    clearable
                    dense
                    item-text="nome"
                    item-value="id"
                    label="Selecione a seção responsável pelo Indicador"
                    name="secao"
                    rounded
                    solo
                  ></v-autocomplete>
                </v-col>

                <!-- alerta em caso de não existir categoria-->
                <v-col
                  v-else-if="editedIndicador.secao_id !== '' && categoriasPorSecao.length <= 0 && editedIndicador.secao_id !== null">
                  <v-alert class="mt-6" dense rounded="xxl" type="warning">
                    Ainda não existem categorias cadastradas para essa seção.
                  </v-alert>
                </v-col>

                <!--estado incial-->
                <v-col v-else>
                </v-col>

              </v-row>

              <!-- nome do indicador e tendencia-->
              <v-row dense>

                <!-- nome_indicador -->
                <v-col>
                  <span class="pl-3">Nome do Indicador</span>
                  <v-text-field
                    v-model="editedIndicador.nome"
                    dense
                    label="Nome do indicador"
                    rounded
                    solo
                  ></v-text-field>
                </v-col>

                <!-- tendência-->
                <v-col>
                  <span class="pl-3">Tendência</span>
                  <v-select
                    v-model="editedIndicador.tendencia"
                    :items="tendencia_opt"
                    dense
                    label="Selecione a tendência do indicador"
                    name="tendencia"
                    rounded
                    solo
                  ></v-select>
                </v-col>

              </v-row>

              <!-- Cards de acompanhamento - verde - amarelo - vermelho -->
              <v-alert v-if="editedIndicador.tendencia" elevation="8">
                <h3 class="text-center">Cards de acompanhamento</h3> <br>

                <!-- verde - amarelo - vermelho -->
                <v-row dense>

                  <!-- verde-->
                  <v-col>
                    <v-alert color="green">
                      <h4>Índice satisfatório</h4>
                      <span v-if="editedIndicador.tendencia === 'Quanto maior melhor'"> maior ou igual</span>
                      <span v-else> menor ou igual</span>
                      <v-text-field
                        v-model="editedIndicador.green"
                        class="pt-0 mt-4 pb-0 mb-0"
                        dense
                        hide-details
                        label="Satisfatório"
                        rounded
                        solo
                        type="number"
                      ></v-text-field>
                    </v-alert>
                  </v-col>

                  <!--amarelo-->
                  <v-col>
                    <v-alert color="yellow">
                      <h4>Índice em alerta</h4>
                      Intervalo
                      <v-row dense>
                        <v-col>
                          <v-text-field
                            v-model="editedIndicador.yellow_1"
                            class="pt-0 mt-4 pb-0 mb-0"
                            dense
                            hide-details
                            label="Alerta 1"
                            rounded
                            solo
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            v-model="editedIndicador.yellow_2"
                            class="pt-0 mt-4 pb-0 mb-0"
                            dense
                            hide-details
                            label="Alerta 2"
                            rounded
                            solo
                            type="number"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-col>

                  <!-- vermelho-->
                  <v-col>
                    <v-alert class="white--text" color="red">
                      <h4>Índice em perigo</h4>
                      <span v-if="editedIndicador.tendencia === 'Quanto maior melhor'"> Menor ou igual</span>
                      <span v-else>maior ou igual</span>
                      <v-text-field
                        v-model="editedIndicador.red"
                        class="pt-0 mt-4 pb-0 mb-0"
                        dense
                        hide-details
                        label="Perigo"
                        rounded
                        solo
                        type="number"
                      ></v-text-field>
                    </v-alert>
                  </v-col>
                </v-row>

              </v-alert>

              <!-- objetivo do indicador-->
              <v-row>
                <v-col>
                  <span class="pl-3">Objetivo do Indicador (Anual)</span>
                  <v-text-field
                    v-model="editedIndicador.objetivo"
                    dense
                    label="Objetivo Anual do indicador"
                    rounded
                    solo
                    type="number"
                  ></v-text-field>
                </v-col>

                <!-- ajuste de col-->
                <v-col>

                </v-col>
              </v-row>

            </v-container>

          </v-card-text>

          <!-- actions-->
          <v-card-actions v-if="!areaGerenciamentoCategorias" class="pb-5">
            <v-row>
              <v-col class="text-right mr-4">
                <v-btn color="warning lighten-1" @click="dialogAddEditIndicadores = false">Cancelar</v-btn>
                <span class="pl-5 pr-5"></span>
                <v-btn color="success" type="submit">
                  <span v-if="tipoAcao === 'add'">Cadastrar</span><span v-else>Alterar</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>

        </v-form>
      </v-card>

    </v-dialog>

    <!--Dialog para deletar indicador-->
    <v-dialog v-model="dialogDelete" max-width="800px">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar o Indicador {{ editedIndicador.nome }}?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>
          <v-row class="text-center">
            <v-col>
              <p>Essa ação é irreversível. Tenha certeza do que está fazendo.</p>
              <p>Todos os dados armazenados nesse indicador, serão removidos também!</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" @click="closeDelete">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn color="red lighten-1" @click="deleteIndicadorConfirm">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-main>
</template>

<script>import config from '../../http/config'
import BarraNavegacao from '../../components/barra-navegacao/BarraNavegacao.vue'
import GerenciamentoCategorias from '../../components/gerenciamentoIndicadores/GerenciamentoCategorias.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'gerindicadores',
  components: {BarraNavegacao, GerenciamentoCategorias},
  data: vm => ({
    configSis: config,
    dialogAddEditIndicadores: false,
    dialogDelete: false,
    tipoAcao: '',
    defaultIndicador: {
      'secao_id': '',
      'categoria_id': '',
      'nome': '',
      'tendencia': '',
      'objetivo': '',
      'green': '',
      'yellow_1': '',
      'yellow_2': '',
      'red': ''
    },
    editedIndicador: {
      'secao_id': '',
      'categoria_id': '',
      'nome': '',
      'tendencia': '',
      'objetivo': '',
      'green': '',
      'yellow_1': '',
      'yellow_2': '',
      'red': ''
    },
    secoes: [],
    categoriasPorSecao: [],
    tendencia_opt: ['Quanto maior melhor', 'Quanto menor melhor'],
    areaGerenciamentoCategorias: false,
    seletorClasseBtn: 'primary',
    indicadores: [],
    editedIndex: -1,
    search: '',
    headers: [
      {
        text: 'Seção Responsável',
        align: 'start',
        value: 'categoria.secao.sigla'
      },
      {
        text: 'Categoria',
        align: 'start',
        value: 'categoria.nome'
      },
      {
        text: 'Nome',
        align: 'start',
        value: 'nome'
      },
      {
        text: 'Tendência',
        align: 'start',
        value: 'tendencia'
      },
      {
        text: 'Objetivo (anual)',
        align: 'center',
        value: 'objetivo'
      },
      {
        text: 'Verde',
        align: 'center',
        value: 'green'
      },
      {
        text: 'Amarelo (intervalo)',
        align: 'center',
        value: 'yellow_1'
      },
      {
        text: 'Vermelho',
        align: 'center',
        value: 'red'
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  watch: {},
  async mounted () {
    await this.getSecao()

    await this.getIndicadores()
  },
  methods: {
    async getSecao () {
      try {
        this.$http.get('secao')
          .then(response => {
            this.secoes = response.data
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    async getIndicadores () {
      try {
        this.$http.get('indicadores')
          .then(response => {
            this.indicadores = response.data
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    async getCategoriaPorSecao () {
      try {
        this.$http.get('categorias/porsecao/' + this.editedIndicador.secao_id)
          .then(response => {
            this.categoriasPorSecao = response.data
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    openDialogAddEditIndicador (tipo, item) {
      this.tipoAcao = tipo
      if (tipo === 'add') {
        this.editedIndicador = Object.assign({}, this.defaultIndicador)
      } else {
        this.editedIndicador = Object.assign({}, item)
        this.editedIndex = this.indicadores.indexOf(item)
      }
      this.dialogAddEditIndicadores = true
    },

    showHideGerencimantoCategoria () {
      this.areaGerenciamentoCategorias = !this.areaGerenciamentoCategorias
      if (!this.areaGerenciamentoCategorias) {
        this.seletorClasseBtn = 'primary'
      } else {
        this.seletorClasseBtn = 'secondary'
      }
    },

    efetuarCadastroEditIndicador () {
      console.log('estou aqui')
      let arrayVal = this.validadoresCampos()
      if (arrayVal[0] > 0) {
        this.$toastr.e(
          arrayVal[1], 'Erro!'
        )
      } else {
        let objetoParaEnvio = {}
        objetoParaEnvio['nome'] = this.editedIndicador.nome
        objetoParaEnvio['categoria_id'] = this.editedIndicador.categoria_id
        objetoParaEnvio['tendencia'] = this.editedIndicador.tendencia
        objetoParaEnvio['objetivo'] = this.editedIndicador.objetivo
        objetoParaEnvio['green'] = this.editedIndicador.green
        objetoParaEnvio['yellow_1'] = this.editedIndicador.yellow_1
        objetoParaEnvio['yellow_2'] = this.editedIndicador.yellow_2
        objetoParaEnvio['red'] = this.editedIndicador.red

        if (this.tipoAcao === 'add') {
          console.log('entrei em add')
          console.log(objetoParaEnvio)
          // aqui eu vou adicionar o usuario
          try {
            this.$http.post('indicadores', objetoParaEnvio)
              .then(response => {
                this.indicadores.push(response.data)
                this.$nextTick(() => {
                  this.editedIndicador = Object.assign({}, this.defaultIndicador)
                  this.editedIndex = -1
                })
                this.dialogAddEditIndicadores = false
                this.$toastr.s(
                  'Indicador cadastrado com sucesso', 'Sucesso!'
                )
              })
              .catch(erro => console.log(erro))
          } catch (e) {
            this.$toastr.e(
              'Houve um erro na tentativa de execução: <br>' + e, 'Erro!'
            )
          }
        } else {
          // aqui vou editar
          try {
            this.$http.put('indicadores/' + this.editedIndicador.id, objetoParaEnvio)
              .then(response => {
                Object.assign(this.indicadores[this.editedIndex], response.data)
                this.$toastr.s(
                  'Indicador alterado com sucesso', 'Sucesso!'
                )
                this.$nextTick(() => {
                  this.editedIndicador = Object.assign({}, this.defaultIndicador)
                  this.editedIndex = -1
                })
                this.dialogAddEditIndicadores = false
              })
              .catch(erro => console.log(erro))
          } catch (e) {
            this.$toastr.e(
              'Houve um erro na tentativa de execução: <br>' + e, 'Erro!'
            )
          }
        }
      }
    },

    validadoresCampos () {
      let msgRetornoErro = ''
      let contador = 0

      if (this.editedIndicador.nome === '') {
        msgRetornoErro += '<li>O Nome não pode ser vazio.</li>'
        contador++
      }
      if (this.editedIndicador.categoria_id === '') {
        msgRetornoErro += '<li>Selecione uma Categoria.</li>'
        contador++
      }
      if (this.editedIndicador.tendencia === '') {
        msgRetornoErro += '<li>A tendência não pode ser vazia.</li>'
        contador++
      }
      if (this.editedIndicador.objetivo === '') {
        msgRetornoErro += '<li>O Objetivo não pode ser vazio.</li>'
        contador++
      }
      if (this.editedIndicador.green === '') {
        msgRetornoErro += '<li>O índice satisfatório não pode ser vazio.</li>'
        contador++
      }
      if (this.editedIndicador.yellow_1 === '' || this.editedIndicador.yellow_2 === '') {
        msgRetornoErro += '<li>O índice em alerta deve apresentar 2 valores.</li>'
        contador++
      }
      if (this.editedIndicador.red === '') {
        msgRetornoErro += '<li>O índice em perigo não pode ser vazio.</li>'
        contador++
      }
      msgRetornoErro = '<ul>' + msgRetornoErro + '</ul>'
      return [contador, msgRetornoErro]
    },

    deleteIndicador (item) {
      this.editedIndex = this.indicadores.indexOf(item)
      this.editedIndicador = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteIndicadorConfirm () {
      this.$http.delete('indicadores/' + this.editedIndicador.id)
        // eslint-disable-next-line no-return-assign
        .then(() => {
          this.indicadores.splice(this.editedIndex, 1)
          this.closeDelete()
          this.$toastr.s(
            'Indicador removido com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover o Indicador', 'Erro!'
          )
        })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedIndicador = this.defaultIndicador
        this.editedIndex = -1
      })
    }
  }
}
</script>
<style>
.bgConfig {
  background-color: #CFE0BC !important;
}
</style>
