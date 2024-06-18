<template>

  <v-container fluid>
    <!--Banner-->
    <v-alert
      elevation="21"
    >
      <!-- nome e btn add nova categoria-->
      <v-row>

        <!--nome-->
        <v-col cols="9">
          <h2>
            <v-icon
              class="mr-4"
              size="36">
              mdi-chart-line
            </v-icon>
            Gerenciamento de Categorias
          </h2>

        </v-col>

        <!-- btn add categoria-->
        <v-col class="text-right" cols="3">
          <v-btn class="primary" @click="openDialogAddEditCategoria('add')">Adicionar Nova Categoria</v-btn>
        </v-col>

      </v-row>

    </v-alert>

    <!--DataTable-->
    <v-data-table
      :headers="headers"
      :items="categorias"
      :search="search"
      class="elevation-21 mt-4"
      sort-by="nome"
    >
      <!-- template para titulo e search-->
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <!-- Título da tabela-->
          <v-toolbar-title>Tabela de Categorias Cadastradas</v-toolbar-title>

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

      <!--Template de botões para editar, excluir -->
      <template v-slot:item.actions="{ item }">

        <!--editar-->
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              small
              v-bind="attrs"
              @click="openDialogAddEditCategoria('edit', item)"
              v-on="on"
            >
              mdi-pen
            </v-icon>
          </template>
          <span>Editar Categoria</span>
        </v-tooltip>

        <!--Excluir-->
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              small
              v-bind="attrs"
              @click="deleteCategoria(item)"
              v-on="on"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Excluir Usuário</span>
        </v-tooltip>

      </template>

    </v-data-table>

    <!--Dialog para add/edit Categoria-->
    <v-dialog v-model="dialogAddEditCategoria" max-width="50%" persistent>
      <v-card>
        <v-form @submit.prevent="efetuarCadastroEditCategoria">

          <v-card-title class="justify-center" primary-title>
            <span v-if="tipoAcao === 'add'">Adicionar nova Categoria</span><span v-else>Edição de Categoria</span>
          </v-card-title>

          <v-card-text>
            <!--Nome-->
            <v-row>
              <v-col>
                <span class="pl-3">Nome da Categoria(Obrigatório)</span>
                <v-text-field
                  v-model="editedCategoria.nome"
                  class="ml-3"
                  dense
                  label="Nome da Categoria"
                  rounded
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <!--Secao-->
            <v-row>
              <v-col>
                <span class="pl-3">Seção (Obrigatório)</span>
                <v-autocomplete
                  v-model="editedCategoria.secao_id"
                  :items="secoes"
                  :readonly="somenteLeitura"
                  class="ml-3"
                  dense
                  item-text="sigla"
                  item-value="id"
                  label="Selecione a seção vinculada a essa categoria"
                  name="secao"
                  rounded
                  solo
                ></v-autocomplete>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions class="pb-5">

            <v-row>
              <v-col class="text-right mr-4">
                <v-btn color="warning lighten-1" @click="dialogAddEditCategoria = false">Cancelar</v-btn>
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

    <!--Dialog para deletar categoria-->
    <v-dialog v-model="dialogDelete" max-width="800px">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar a categoria {{ editedCategoria.nome }}?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>
          <div class="text-center">
            <p>Essa ação é irreversível. Tenha certeza do que está fazendo.</p>
            <p>Todos os indicadores vinculados a essa categoria serão excluídos!</p>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" @click="closeDelete">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn color="red lighten-1" @click="deleteCategoriaConfirm">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>

</template>

<script>import config from '../../http/config'
import {mapGetters} from 'vuex'

export default {
  name: 'gerindicadores',
  data: () => ({
    configSis: config,
    search: '',
    headers: [
      {
        text: 'Nome',
        align: 'start',
        value: 'nome'
      },
      {
        text: 'Seção Responsável',
        align: 'start',
        value: 'secao.sigla'
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false
      }
    ],
    somenteLeitura: false,
    dialogAddEditCategoria: false,
    dialogDelete: false,
    tipoAcao: '',
    defaultCategoria: {
      'nome': '',
      'secao_id': '',
      'secao': {}
    },
    editedCategoria: {
      'nome': '',
      'secao_id': '',
      'secao': {}
    },
    categorias: [],
    secoes: [],
    editedIndex: -1
  }),
  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  watch: {},
  async mounted () {
    await this.getCategorias()
    await this.getSecao()
  },
  methods: {
    async getCategorias () {
      if (this.usuarioLogado.tipo === 'Administrador') {
        try {
          this.$http.get('categorias')
            .then(response => {
              this.categorias = response.data
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      } else {
        try {
          this.$http.get('categorias/porsecao/' + this.usuarioLogado.secao_id)
            .then(response => {
              this.categorias = response.data
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      }
    },
    async getSecao () {
      try {
        this.$http.get('secao')
          .then(response => {
            if (this.usuarioLogado.tipo === 'Usuário') {
              for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].id === this.usuarioLogado.secao_id) {
                  this.secoes = [response.data[i]]
                  this.editedCategoria.secao_id = response.data[i]
                  this.somenteLeitura = true
                }
              }
            } else {
              this.secoes = response.data
              this.somenteLeitura = false
            }
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    openDialogAddEditCategoria (tipo, item) {
      this.tipoAcao = tipo
      if (tipo === 'add') {
        this.editedCategoria = Object.assign({}, this.defaultUser)
        if (this.usuarioLogado.tipo === 'Usuário') {
          this.editedCategoria.secao_id = this.usuarioLogado.secao_id
          this.somenteLeitura = true
        } else {
          this.somenteLeitura = false
        }
      } else {
        if (this.usuarioLogado.tipo === 'Usuário') {
          this.editedCategoria = Object.assign({}, item)
          this.editedIndex = this.categorias.indexOf(item)
          this.editedCategoria.secao_id = this.usuarioLogado.secao_id
          this.somenteLeitura = true
        } else {
          this.editedCategoria = Object.assign({}, item)
          this.editedIndex = this.categorias.indexOf(item)
          this.somenteLeitura = false
        }
      }
      this.dialogAddEditCategoria = true
    },

    efetuarCadastroEditCategoria () {
      let arrayVal = this.validadoresCampos()
      if (arrayVal[0] > 0) {
        this.$toastr.e(
          arrayVal[1], 'Erro!'
        )
      } else {
        let objetoParaEnvio = {}
        objetoParaEnvio['nome'] = this.editedCategoria.nome
        objetoParaEnvio['secao_id'] = this.editedCategoria.secao_id

        if (this.tipoAcao === 'add') {
          // aqui eu vou adicionar o usuario
          try {
            this.$http.post('categorias', objetoParaEnvio)
              .then(response => {
                this.categorias.push(response.data)
                this.$nextTick(() => {
                  this.editedCategoria = Object.assign({}, this.defaultCategoria)
                  this.editedIndex = -1
                })
                this.dialogAddEditCategoria = false
                this.$toastr.s(
                  'Categoria Cadastrada com sucesso', 'Sucesso!'
                )
                this.$emit('resetaSecao', this.usuarioLogado.tipo)
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
            this.$http.put('categorias/' + this.editedCategoria.id, objetoParaEnvio)
              .then(response => {
                Object.assign(this.categorias[this.editedIndex], response.data)
                this.$toastr.s(
                  'Categoria alterada com sucesso', 'Sucesso!'
                )
                this.$nextTick(() => {
                  this.editedCategoria = Object.assign({}, this.defaultCategoria)
                  this.editedIndex = -1
                })
                this.dialogAddEditCategoria = false
                this.$emit('resetaSecao', this.usuarioLogado.tipo)
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

      if (this.editedCategoria.nome === '') {
        msgRetornoErro += '<li>O Nome não pode ser vazio.</li>'
        contador++
      }
      if (this.editedCategoria.secao_id === '') {
        msgRetornoErro += '<li>Selecione uma seção.</li>'
        contador++
      }
      msgRetornoErro = '<ul>' + msgRetornoErro + '</ul>'
      return [contador, msgRetornoErro]
    },

    deleteCategoria (item) {
      this.editedIndex = this.categorias.indexOf(item)
      this.editedCategoria = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteCategoriaConfirm () {
      this.$http.delete('categorias/' + this.editedCategoria.id)
        // eslint-disable-next-line no-return-assign
        .then(() => {
          this.categorias.splice(this.editedIndex, 1)
          this.closeDelete()
          this.$toastr.s(
            'Categoria removida com sucesso', 'Sucesso!'
          )
          this.$emit('resetaSecao', this.usuarioLogado.tipo)
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover a categoria', 'Erro!'
          )
        })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedCategoria = Object.assign({}, this.defaultCategoria)
        this.editedIndex = -1
      })
    }
  }
}
</script>
<style>
</style>
