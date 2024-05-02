<template>
  <div>

    <!--espaço administrativo-->
    <v-container fluid>

      <v-row>

        <!--espaço-->
        <v-col cols="1"></v-col>

        <!--Espaço para o conteúdo de eventos-->
        <v-col>

          <!--Configurações de conteúdo-->
          <v-alert color="rgb(255,255,255,0.4)" rounded="xl">

            <!--Cabeçalho, btn add evento SFC-->
            <v-row class="mb-3">

              <!--Cabeçalho-->
              <v-col align-self="center">
                <h3>Configurações de Conteúdo ( Datas Históricas )</h3>
              </v-col>

              <!--add evento-->
              <v-col align-self="center" class="text-right">
                <v-btn @click="openDialogAdmCadastraEditaEvento('Cadastro', {})">Adicionar Evento
                </v-btn>
              </v-col>

            </v-row>

            <v-divider></v-divider>

            <!--DataTable-->
            <v-data-table
              :headers="headersEventos"
              :items="eventos"
              :search="searchEventos"
              class="elevation-21 mt-4"
              sort-by="ano"
            >

              <!--template do topo da tabela-->
              <template v-slot:top>
                <v-toolbar
                  flat
                >
                  <v-toolbar-title>Tabela de Eventos Cadastrados</v-toolbar-title>

                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  ></v-divider>

                  <v-spacer></v-spacer>

                  <!--Pesquisar-->
                  <v-text-field
                    v-model="searchEventos"
                    append-icon="mdi-magnify"
                    hide-details
                    label="Pesquisar"
                    placeholder="Pesquisar"
                    single-line
                  ></v-text-field>

                </v-toolbar>

              </template>

              <!--Template de datas -->
              <template v-slot:item.ano="{ item }">

                <span v-if="item.dia"> {{ item.dia }}/</span><span v-if="item.mes">{{ item.mes }}/</span><span
                v-if="item.ano">{{ item.ano }}</span>

              </template>

              <!--Template de nome -->
              <template v-slot:item.nome="{ item }">

                <ul>
                  <li>{{ item.nome }}</li>
                  <li v-if="totemConfigs.en_habilitado">
                    <span v-if="item.nome_en">
                      {{ item.nome_en }}
                    </span>
                    <span v-if="!item.nome_en" class="atencao">
                      Not assigned yet
                    </span>
                  </li>
                  <li v-if="totemConfigs.es_habilitado">
                    <span v-if="item.nome_es">
                      {{ item.nome_es }}
                    </span>
                    <span v-if="!item.nome_es" class="atencao">
                      Aún no asignado
                    </span>
                  </li>
                </ul>

              </template>

              <!--Template de legendas -->
              <template v-slot:item.legenda="{ item }">

                <h3>LEGENDA:</h3>

                <span v-if="item.legenda === '' || item.legenda === null" class="text-no-wrap warning"> ---- SEM LEGENDA ---- </span>
                <v-alert v-else class="text-justify mt-0 mb-o pt-0 pb-0"
                         color="green lighten-4" dense
                         v-html="'<h3>Portugês</h3>'+ item.legenda"></v-alert>

                <span v-if="totemConfigs.en_habilitado && (item.legenda_en === '' || item.legenda_en === null)"
                      class="text-no-wrap warning"> ---- SEM LEGENDA (Inglês) ---- </span>
                <v-alert v-if="totemConfigs.en_habilitado && item.legenda_en" class="text-justify mt-0 mb-o pt-0 pb-0"
                         color="blue lighten-4" dense
                         v-html="'<h3>Inglês</h3>'+ item.legenda_en"></v-alert>

                <span v-if="totemConfigs.es_habilitado && (item.legenda_es === '' || item.legenda_es === null)"
                      class="text-no-wrap warning"> ---- SEM LEGENDA (Espanhol) ---- </span>
                <v-alert v-if="totemConfigs.es_habilitado && item.legenda_es" class="text-justify mt-0 mb-o pt-0 pb-0"
                         color="red lighten-4" dense
                         v-html="'<h3>Espanhol</h3>'+ item.legenda_es"></v-alert>

                <hr>
                <h3>SAIBA MAIS:</h3>
                <span v-if="item.saibamais === '' || item.saibamais === null" class="text-no-wrap warning"> ---- SEM SAIBA MAIS ---- </span>
                <v-alert v-else class="text-justify mt-0 mb-o pt-0 pb-0"
                         color="green lighten-5" dense
                         v-html="'<h3>Portugês</h3>'+ item.saibamais"></v-alert>

                <span v-if="totemConfigs.en_habilitado && (item.saibamais_en === '' || item.saibamais_en === null)"
                      class="text-no-wrap warning"> ---- SEM SAIBA MAIS (Inglês)---- </span>
                <v-alert v-if="totemConfigs.en_habilitado && item.saibamais_en" class="text-justify mt-0 mb-o pt-0 pb-0"
                         color="blue lighten-5" dense
                         v-html="'<h3>Inglês</h3>'+ item.saibamais_en"></v-alert>

                <span v-if="totemConfigs.es_habilitado && (item.saibamais_es === '' || item.saibamais_es === null)"
                      class="text-no-wrap warning"> ---- SEM SAIBA MAIS (Espanhol)---- </span>
                <v-alert v-if="totemConfigs.es_habilitado && item.saibamais_es" class="text-justify mt-0 mb-o pt-0 pb-0"
                         color="red lighten-5" dense
                         v-html="'<h3>Espanhol</h3>'+ item.saibamais_es"></v-alert>

              </template>

              <!--Template de imagens -->
              <template v-slot:item.imagem="{ item }">

                <span v-if="item.imagem === null" class="text-no-wrap warning"> ---- SEM IMAGEM ----</span> <span
                v-else><v-icon @click="showImg(item)">mdi-magnify</v-icon></span>

              </template>

              <!--Template de botões para editar, excluir -->
              <template v-slot:item.actions="{ item }">

                <!--editar-->
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class=""
                      small
                      v-bind="attrs"
                      @click="openDialogAdmCadastraEditaEvento('Edição', item)"
                      v-on="on"
                    >
                      mdi-pen
                    </v-icon>
                  </template>
                  <span>Editar Evento</span>
                </v-tooltip>
                <!--Excluir-->
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class=""
                      small
                      v-bind="attrs"
                      @click="deleteEvento(item)"
                      v-on="on"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>Excluir evento</span>
                </v-tooltip>

              </template>

            </v-data-table>

          </v-alert>

        </v-col>

        <!--espaço-->
        <v-col cols="1"></v-col>

      </v-row>

    </v-container>

    <!--Dialog para Conteúdos-->
    <v-dialog v-model="dialogGeneric70" max-width="85%" persistent>

      <!-- CADASTRO E EDIÇÃO-->
      <AdmCadastroEditaEvento
        v-if="selectedTypeOfContent ==='AdmCadastraEditaEvento'" :evento="selectedEvento"
        :totemConfigs="totemConfigs" :typeOfAction="selectTypeOfAction"
        @adjustSelectedTypeOfContent="selectedTypeOfContent = $event" @ajustaTipoContent="getEventos"
        @ajustarVisibilidade="dialogGeneric70 = $event" @resetaEventoSelecionado="selectedEvento = $event"
      />

      <!-- auxilio na animação de fechamento do dialog-->
      <v-card v-else>
        <v-card-title class="justify-center" primary-title>
          <h3 class="text-center"></h3>
        </v-card-title>
        <v-card-text>
          <v-alert>
          </v-alert>
        </v-card-text>
      </v-card>

    </v-dialog>

    <!--Dialog para mostrar a imagem de um evento -->
    <v-dialog v-model="dialogShowImagemEvento" max-width="70%">
      <v-card>
        <v-card-title>
          Visualização de Imagem
        </v-card-title>
        <v-card-text>
          <v-img :src="this.$configSis.urlDownload + imgEventoShow"
                 class="rounded-xl v-responsive ml-auto mr-auto"/>

          <v-alert class="mt-2" color="grey lighten-2">

            <span v-if="imgEventoFonteShow !== null || imgEventoFonteShow !== ''">{{ imgEventoFonteShow }}</span>
            <span v-if="imgEventoFonteShow === null || imgEventoFonteShow === ''"> Sem Fonte</span>

          </v-alert>

          <hr v-if="listaImgAdicional.length > 0">
          <br v-if="listaImgAdicional.length > 0">
          <h2 v-if="listaImgAdicional.length > 0">Imagens Adicionais</h2>
          <br v-if="listaImgAdicional.length > 0">
          <v-alert v-for="imgadic in listaImgAdicional" v-if="listaImgAdicional.length > 0" :key="imgadic.id"
                   color="blue lighten-3">

            <v-container>
              <v-row>
                <v-col>

                  <v-img :src="configSis.urlDownload + imgadic.imagem"
                         class="rounded-xl v-responsive"/>

                  <br>
                  <v-alert color="white">
                    <h3>Descrição</h3> <br>
                    <b>Português: </b> {{ imgadic.descricao }}<br>
                    <b>Inglês: </b> {{ imgadic.descricao_en }}<br>
                    <b>Espanhol: </b> {{ imgadic.descricao_es }}
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>

          </v-alert>

        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" @click="dialogShowImagemEvento = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- REVISAR -->

    <!--Dialog para deletar evento-->
    <v-dialog v-model="dialogDeleteEvento" max-width="800px">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar esse evento?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>
          <div class="text-center">
            Essa ação é irreversível. Tenha certeza do que está fazendo.<br>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" @click="dialogDeleteEvento= false">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn color="red lighten-1" @click="deleteEventoConfirm">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import config from '../../../http/config'
import AdmUser from '../AdmUser'
import AdmConfig from '../AdmConfig'
import AdmCadastroEditaEvento from './AdmCadastroEditaEvento'

export default {
  name: 'home',
  mixins: [logoutMixin],
  components: {AdmUser, AdmConfig, AdmCadastroEditaEvento},
  data: vm => ({
    configSis: config,
    dialogGeneric70: false,
    eventos: [],
    headersEventos: [
      {
        text: 'Data',
        align: 'start',
        value: 'ano'
      },
      {
        text: 'Nome',
        align: 'start',
        value: 'nome'
      },
      {
        text: 'Legenda / Saiba Mais',
        value: 'legenda'
      },
      {
        text: 'Imagem',
        value: 'imagem',
        align: 'center',
        sortable: false
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false
      }
    ],
    searchEventos: '',
    dialogShowImagemEvento: false,
    imgEventoShow: '',
    imgEventoFonteShow: '',
    dialogDeleteEvento: false,
    selectedEvento: {},
    dialogEditEvento: false,
    dialogDeleteImagemEvento: false,
    guardadorDeImg: null,
    momentoEditImg: false,
    optionsMes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    optionsDia: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    indexNewImgAdicionalEvento: 0,
    eventoNewImgAdicional: [],
    objetoEventoNewImgAdicional: [],
    dialogAddImagemAdicionalEvento: false,
    dialogDeleteImagemAdicionalEvento: false,
    imagemAdicionalParaDeletar: {},
    selectedTypeOfContent: '',
    selectTypeOfAction: '',
    listaImgAdicional: []
  }),
  props: {
    totemConfigs: Object
  },
  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  watch: {
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },
  async mounted () {
    await this.getEventos()
  },
  methods: {

    async getEventos () {
      try {
        this.$http.get('eventos')
          .then(response => {
            this.eventos = response.data
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    openDialogAdmCadastraEditaEvento (action, objeto) {
      this.dialogGeneric70 = true
      this.selectTypeOfAction = action
      this.selectedEvento = objeto
      if (action === 'Cadastro' || action === 'Edição') {
        this.selectedTypeOfContent = 'AdmCadastraEditaEvento'
      }
    },

    deleteEvento (item) {
      this.selectedEvento = item
      this.dialogDeleteEvento = true
    },

    deleteEventoConfirm () {
      this.$http.delete('eventos/' + this.selectedEvento.id)
        .then(() => {
          this.dialogDeleteEvento = false
          this.$toastr.s(
            'Evento removido com sucesso', 'Sucesso!'
          )
          this.getEventos()
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover o Evento', 'Erro!'
          )
        })
    },

    showImg (imagem) {
      this.imgEventoShow = ''
      this.listaImgAdicional = []
      this.imgEventoFonteShow = ''
      this.dialogShowImagemEvento = true
      this.imgEventoShow = imagem.imagem
      this.imgEventoFonteShow = imagem.fonteimagempcp
      this.listaImgAdicional = imagem.imagens_adicionais
    }

  }
}
</script>

<style>
.atencao {
  background-color: yellow;
}
</style>
