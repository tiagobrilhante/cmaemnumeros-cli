<template>

  <v-card>
    <!--Configurações do Totem-->

    <v-card-text>
      <v-alert v-if="usuarioEstaLogado" color="rgb(255,255,255,0.4)">
        <v-form @submit.prevent="doUpdateTotemConfig">
          <h3>Configurações do TOTEM</h3>
          <v-divider></v-divider>

          <!--nome do totem, cod acesso , possui quiz, larguras e alturas de imagem-->
          <v-row class="mt-1">

            <!--nome do totem, cod acesso e possui quiz-->
            <v-col>

              <!--nome totem-->
              <v-row no-gutters>
                <v-col>
                  <span class="ml-3">Nome do Totem</span>
                  <v-text-field
                    dense
                    label="Nome do Totem"
                    rounded
                    solo
                    v-model="totemConfigs.nome_totem"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- multi idiomas-->
              <v-row no-gutters>
                <v-col>
                  <v-checkbox class="pt-0 mt-0"
                    v-model="totemConfigs.permite_multi_lang"
                    label="Habilitar multi-idiomas"
                  ></v-checkbox>
                </v-col>
              </v-row>

              <v-row no-gutters v-if="totemConfigs.permite_multi_lang">
                <v-col>
                  <v-checkbox class="pt-0 mt-0"
                              v-model="totemConfigs.en_habilitado"
                              label="Disponibilizar Inglês"
                  ></v-checkbox>
                </v-col>

                <v-col>
                  <v-checkbox class="pt-0 mt-0"
                              v-model="totemConfigs.es_habilitado"
                              label="Disponibilizar Espanhol"
                  ></v-checkbox>
                </v-col>
              </v-row>

              <!--nome totem ingles-->
              <v-row no-gutters v-if="totemConfigs.permite_multi_lang && totemConfigs.en_habilitado">
                <v-col>
                  <span class="ml-3">Nome do Totem (Inglês)</span>
                  <v-text-field
                    dense
                    label="Nome do Totem (Inglês)"
                    rounded
                    solo
                    v-model="totemConfigs.nome_totem_en"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!--nome totem espanhol-->
              <v-row no-gutters v-if="totemConfigs.permite_multi_lang && totemConfigs.es_habilitado">
                <v-col>
                  <span class="ml-3">Nome do Totem (Espanhol)</span>
                  <v-text-field
                    dense
                    label="Nome do Totem (Espanhol)"
                    rounded
                    solo
                    v-model="totemConfigs.nome_totem_es"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!--Possui Quiz-->
              <v-row no-gutters>
                <v-col>
                  <span class="ml-3">Esse totem possui QUIZ?</span>
                  <v-alert class="mt-0 mb-0" color="white" dense>
                    <v-radio-group class="mt-0 mb-0"
                                   hide-details
                                   mandatory
                                   row
                                   v-model="totemConfigs.quiz"
                    >
                      <v-radio
                        label="Sim"
                        value="Sim"
                      ></v-radio>
                      <v-radio
                        label="Não"
                        value="Não"
                      ></v-radio>
                    </v-radio-group>
                  </v-alert>
                </v-col>
              </v-row>

            </v-col>

            <!--medidas das imagens-->
            <v-col>

              <!--Altura e Largura Imagem INDEX-->
              <v-row no-gutters>

                <!--Altura Imagem Index-->
                <v-col>
                  <span class="ml-3">Altura Imagem (Index)</span>
                  <v-text-field
                    class="mr-3"
                    dense
                    label="Altura Imagem"
                    rounded
                    solo
                    type="number"
                    v-model="totemConfigs.altura_index"
                  ></v-text-field>
                </v-col>

                <!--Largura Imagem Index-->
                <v-col>
                  <span class="ml-6">Largura Imagem (Index)</span>
                  <v-text-field
                    class="ml-3"
                    dense
                    label="Largura Imagem"
                    rounded
                    solo
                    type="number"
                    v-model="totemConfigs.largura_index"
                  ></v-text-field>
                </v-col>

              </v-row>

              <!--Altura e Largura Imagem DETALHE-->
              <v-row no-gutters>

                <!--Altura Imagem DETALHE-->
                <v-col>
                  <span class="ml-3">Altura Imagem (Detalhe)</span>
                  <v-text-field
                    class="mr-3"
                    dense
                    label="Altura Imagem"
                    rounded
                    solo
                    type="number"
                    v-model="totemConfigs.altura_detail"
                  ></v-text-field>
                </v-col>

                <!--Largura imagem DETALHE-->
                <v-col>
                  <span class="ml-6">Largura Imagem (Detalhe)</span>
                  <v-text-field
                    class="ml-3"
                    dense
                    label="Largura Imagem"
                    rounded
                    solo
                    type="number"
                    v-model="totemConfigs.largura_detail"
                  ></v-text-field>
                </v-col>

              </v-row>

              <!--cod acesso-->
              <v-row no-gutters>
                <v-col>
                  <span class="ml-3">Código de Acesso a Área Administrativa</span>
                  <v-text-field
                    dense
                    label="Código do Totem"
                    rounded
                    solo
                    v-model="totemConfigs.access_code"
                  ></v-text-field>
                </v-col>
              </v-row>

            </v-col>

          </v-row>

          <!--tipo de totem / ajustar e cancelar / imagem de fundo-->
          <v-row>
            <!--tipo de totem / cor de fundo / ajustar e cancelar-->
            <v-col cols="6">

              <!--tipo totem-->
              <v-row>
                <v-col>
                  <span class="ml-3">Tipo de Totem</span>
                  <v-alert class="mt-0 mb-0" color="white" dense>
                    <v-radio-group class="mt-0 mb-0"
                                   hide-details
                                   mandatory
                                   row
                                   v-model="totemConfigs.tipo_totem"
                    >
                      <v-radio
                        label="Conteúdo Normal"
                        value="normal"
                      ></v-radio>
                      <v-radio
                        label="Datas Históricas"
                        value="data"
                      ></v-radio>
                    </v-radio-group>
                  </v-alert>
                </v-col>
              </v-row>

              <!--cor de fundo-->
              <v-row>
                <v-col align-self="center" class="text-center">
                  <span class="">Cor de Fundo</span>
                  <v-color-picker
                    class="ml-auto mr-auto"
                    dot-size="20"
                    hide-mode-switch
                    mode="hexa"
                    v-model="totemConfigs.bg_color"
                    width="400"
                  ></v-color-picker>
                </v-col>
              </v-row>

              <!--ajustar ou cancelar-->
              <v-row class="mt-16">
                <v-col cols="6">
                  <v-btn @click="closeDialog" block color="warning">Sair</v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn block type="submit">Ajustar Parâmetros do Totem</v-btn>
                </v-col>
              </v-row>

            </v-col>

            <!--imagem de fundo-->
            <v-col cols="6" align-self="stretch" class="text-left">
              <span class="ml-3">Imagem de fundo</span>
              <v-img :src="this.$configSis.urlDownload + this.totemConfigs.bg_img"
                     class="rounded-xl ml-auto" aspect-ratio="1.5"
                     v-if="this.totemConfigs.bg_img !== null"/>

              <v-img :src="require('../../assets/img/noimage.png')"
                     v-else class="rounded-xl" aspect-ratio="1.5"/>

              <!--editar e excluir BG-->
              <v-row v-if="this.totemConfigs.bg_img !== null">
                <v-col class="text-right">
                  <!--editar-->
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="editBG()" class="ajusteBtn warning">
                        <v-icon
                          small
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-pen
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Editar Background</span>
                  </v-tooltip>

                  <!--excluir-->
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="excluiBG()" class="ajusteBtn error mr-10">
                        <v-icon
                          small
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Excluir Background</span>
                  </v-tooltip>
                </v-col>
              </v-row>

              <!--TEM QUE FAZER-->
              <v-row class="mt-5" v-else>
                <v-col>
                  <v-btn @click="addNewBG" block rounded>Adicionar Imagem de Background</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-alert>

      <v-container v-else>
        <v-alert type="error">

          Você não tem permissão para estar aqui

        </v-alert>

        <!--Sairr-->
        <v-row class="mt-16">
          <v-col></v-col>
          <v-col class="text-right">
            <v-btn @click="closeDialog" block color="warning">Fechar</v-btn>
          </v-col>
        </v-row>
      </v-container>

    </v-card-text>

    <!--Dialog para alterar o bg-->
    <v-dialog max-width="800px" v-model="dialogUpdateBG">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          Alteração de Imagem de Fundo (Background)
        </v-card-title>
        <v-card-text>
          <div class="text-center">
            <v-row>
              <!--preview-->
              <v-col>

                <span class="ml-3">Imagem * (Campo Obrigatório)</span>
                <v-file-input @change="selectEditBG"
                              accept="image/*"
                              dense
                              hint="Escolha uma nova imagem no formato .png ou .jpg (a anterior será excluída)"
                              label="Escolha uma imagem"
                              persistent-hint
                              placeholder="Insira uma imagem"
                              rounded
                              show-size
                              solo
                              v-model="inputEditBG"

                ></v-file-input>

                <!--preview Img-->
                <v-alert elevation="10" rounded="xl" v-if="previewEditBG">
                  <h3>Preview:</h3>
                  <img :src="previewEditBG" alt="" class="v-responsive my-3 rounded-xl"/>
                </v-alert>

              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn @click="dialogUpdateBG= false" color="grey lighten-1">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn @click="updateBgConfirm" color="primary lighten-1">Alterar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>

</template>
<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import config from '../../http/config'

export default {
  mixins: [logoutMixin],
  components: {},
  data: vm => ({
    configSis: config,
    totemConfigs: {
      nome_totem: '',
      nome_totem_en: '',
      nome_totem_es: '',
      altura_index: '',
      largura_index: '',
      altura_detail: '',
      largura_detail: '',
      access_code: '',
      quiz: '',
      permite_multi_lang: '',
      en_habilitado: '',
      es_habilitado: ''
    },
    dialogUpdateBG: false,
    currentEditBG: undefined,
    previewEditBG: undefined,
    inputEditBG: undefined
  }),
  computed: {
    ...mapGetters(['usuarioLogado', 'usuarioEstaLogado'])
  },
  watch: {},
  async mounted () {
    await this.getConfigs()
  },
  methods: {

    async getConfigs () {
      this.totemConfigs = {}
      try {
        this.$http.get('totemconfig/plus')
          .then(response => {
            this.totemConfigs = Object.assign({}, response.data)
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    doUpdateTotemConfig () {
      if (this.totemConfigs.nome_totem === '' || this.totemConfigs.access_code === '' || this.totemConfigs.largura_detail === '' || this.totemConfigs.altura_detail === '' || this.totemConfigs.altura_index === '' || this.totemConfigs.largura_index === '') {
        this.$toastr.e(
          'Revise todos os campos! Não podem existir camos Vazios.', 'Erro!'
        )
      } else {
        try {
          this.$http.post('totemconfig', this.totemConfigs)
            .then(() => {
              this.closeDialog()
              this.$toastr.s(
                'Alterações efetuadas.', 'Sucesso!'
              )
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      }
    },

    // ----------------------- //
    //       Background IMG    //
    // ----------------------- //

    editBG () {
      this.dialogUpdateBG = true
      this.currentEditBG = undefined
      this.previewEditBG = undefined
      this.inputEditBG = undefined
    },

    selectEditBG (image) {
      if (image === null || image === undefined) {
        this.currentEditBG = undefined
        this.previewEditBG = undefined
        this.inputEditBG = undefined
      } else {
        this.currentEditBG = image
        this.previewEditBG = URL.createObjectURL(this.currentEditBG)
      }
    },

    updateBgConfirm () {
      if (this.inputEditBG === undefined) {
        this.$toastr.e(
          'É necessário o envio de uma imagem.', 'Erro!'
        )
      } else {
        let formData = new FormData()
        formData.append('imagem', this.inputEditBG)
        return this.$http.post('totemconfig/updatebg', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.currentEditBG = undefined
          this.previewEditBG = undefined
          this.inputEditBG = undefined
          this.dialogUpdateBG = false
          this.getConfigs()
          this.$toastr.s(
            'Background Alterado com sucesso.', 'Sucesso!'
          )
        })
          .catch(() => {
            this.$toastr.e(
              'Não foi possível Alterar o Background.', 'Erro!'
            )
          })
      }
    },

    excluiBG () {
      try {
        this.$http.get('totemconfig/removebg')
          .then(() => {
            this.totemConfigs.bg_img = null
            this.$toastr.s(
              'Background removido com sucesso', 'Sucesso!'
            )
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
      console.log('delete')
    },

    addNewBG () {
      this.dialogUpdateBG = true
      this.currentEditBG = undefined
      this.previewEditBG = undefined
      this.inputEditBG = undefined
    },

    closeDialog () {
      this.$emit('ajustarVisibilidade', false)
      this.$emit('adjustSelectedTypeOfContent', '')
      this.$emit('ajustaTipoContent')
    }
  }
}

</script>
<style>
.ajusteBtn {
  margin-top: -70px;
  margin-bottom: 10px;
}
</style>
