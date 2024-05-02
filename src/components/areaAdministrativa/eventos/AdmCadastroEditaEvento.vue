<template>
  <!--adição de datas históricas-->
  <v-card>
    <v-card-title class="justify-center" primary-title>
      <v-row>
        <v-col></v-col>
        <v-col><h3 class="text-center">{{ typeOfAction }} de evento histórico</h3></v-col>
        <v-col class="text-right">
          <v-btn @click="closeDialog">X</v-btn>
        </v-col>
      </v-row>

    </v-card-title>

    <v-card-text>
      <hr>

      <br>

      <v-form @submit.prevent="saveEvento">

        <!--data e título do evento-->
        <v-row>

          <!--data do evento-->
          <v-col>
            <span class="pl-3">Insira a data do evento</span>

            <!--dia mes e ano-->
            <v-row>

              <!--dia-->
              <v-col>
                <span class="pl-3">Dia</span>

                <v-select
                  v-model="diaEvento"
                  :items="optionsDia"
                  class="ml-3"
                  clearable
                  dense
                  hint="Insira o dia do evento (de 1 a 31) caso deixe em branco o evento não se restringe a um dia"
                  label="Dia"
                  persistent-hint
                  rounded
                  solo
                ></v-select>
              </v-col>

              <!--mes-->
              <v-col>
                <span class="pl-3">Mês</span>

                <v-select
                  v-model="mesEvento"
                  :items="optionsMes"
                  class="ml-3"
                  clearable
                  dense
                  hint="Insira o mês do evento (de 1 a 12) caso deixe em branco o evento não se restringe a um mês"
                  label="Mês"
                  persistent-hint
                  rounded
                  solo
                ></v-select>
              </v-col>

              <!--ano-->
              <v-col>
                <span class="pl-3">Ano * (obrigatório)</span>
                <v-text-field
                  v-model="anoEvento"
                  :maxlength="4"
                  class="ml-3"
                  dense
                  hint="Insira o ano do evento ( 4 dígitos ) * obrigatório"
                  label="Ano"
                  max="9999"
                  min="1"
                  persistent-hint
                  rounded
                  solo
                  type="text"
                  @input="limitInput()"
                ></v-text-field>
              </v-col>

            </v-row>

          </v-col>

        </v-row>

        <!-- titulo do ecevnto em pt br e ingles -->
        <v-row>

          <!--titulo evento-->
          <v-col cols="6">
            <span class="pl-3">Título do evento * (obrigatório)</span>

            <v-text-field
              v-model="tituloEvento"
              class="ml-3"
              dense
              hint="Exemplo: Batalha dos Guararapes"
              label="Título do Evento"
              persistent-hint
              rounded
              solo
            ></v-text-field>

          </v-col>

          <!--titulo evento ingles-->
          <v-col cols ="6" v-if="totemConfigs.en_habilitado">
            <span class="pl-3">Título do evento (Inglês)</span>

            <v-text-field
              v-model="tituloEventoEng"
              class="ml-3"
              dense
              hint="Exemplo: Guararape's battle"
              label="Título do Evento (Inglês)"
              persistent-hint
              rounded
              solo
            ></v-text-field>

          </v-col>

        </v-row>

        <v-row v-if="totemConfigs.es_habilitado">
          <v-col>
            <!--titulo evento espanhol-->
            <v-col>
              <span class="pl-3">Título do evento (Espanhol)</span>

              <v-text-field
                v-model="tituloEventoSpa"
                class="ml-3"
                dense
                hint="Exemplo: Batalla de Guararapes"
                label="Título do Evento (Espanhol)"
                persistent-hint
                rounded
                solo
              ></v-text-field>

            </v-col>
          </v-col>
          <v-col></v-col>
        </v-row>

        <!--legenda e imagem-->
        <v-row>

          <!--legenda-->
          <v-col>

            <v-alert class="rounded-xl">
              <span>Legenda do evento</span>
              <vue-editor v-model="legendaEvento"></vue-editor>
              <span
                class="caption">Se deixado em branco, a não será mostrado nenhum texto como legenda.</span>
            </v-alert>

            <v-alert v-if="typeOfAction === 'Cadastro'" class="rounded-xl" color="warning">
              <p>Você pode cadastrar imagens adicionais para um evento, no entanto, é necessário que o evento principal
                seja criado primeiro. Ao salvar um evento, um novo modal para cadastro de imagens adicionais lhe será
                franqueado.</p>
              <p>A imagem principal, é aquela que aparecerá no card de abertura do evento.</p>

            </v-alert>
          </v-col>

          <!--imagem no caso de um cadastro de novo evento-->
          <v-col v-if="typeOfAction === 'Cadastro'">

            <span class="ml-3">Imagem</span>
            <v-file-input v-model="inputImagemEvento"
                          accept="image/*"
                          dense
                          hint="Escolha uma imagem no formato .png ou .jpg"
                          label="Escolha uma imagem (SFC)"
                          persistent-hint
                          placeholder="Insira uma imagem se for o caso"
                          rounded
                          show-size
                          solo
                          @change="selectImageEvento"
            ></v-file-input>

            <!--preview-->
            <v-alert v-if="previewImageEvento" elevation="10" rounded="xl">
              <h3>Preview:</h3>
              <img :src="previewImageEvento" alt="" class="v-responsive ml-auto mr-auto my-3 rounded-xl"/>

              <span class="pl-3">Fonte da imagem</span>

              <v-text-field
                v-model="fonteImagemPcpEvento"
                class="ml-3"
                dense
                hint="Exemplo: https://eb.mil.br/artigo233"
                label="Fonte da imagem"
                persistent-hint
                rounded
                solo
              ></v-text-field>

            </v-alert>

          </v-col>

          <!--imagem no caso de edição de um novo evento-->
          <v-col v-else-if="typeOfAction === 'Edição' && momentoEditImg" cols="6">

            <!--input par selecionar imagem nova-->
            <v-row v-if="momentoEditImg">
              <v-col>
                <span class="ml-3">Imagem</span>
                <v-file-input v-model="inputImagemEvento"
                              accept="image/*"
                              dense
                              hint="Escolha uma imagem no formato .png ou .jpg"
                              label="Escolha uma imagem (SFC)"
                              persistent-hint
                              placeholder="Insira uma imagem se for o caso"
                              rounded
                              show-size
                              solo
                              @change="selectImageEvento"
                ></v-file-input>

              </v-col>
            </v-row>

            <!--preview para a imagem nova selecionada-->
            <v-row v-if="previewImageEvento && momentoEditImg">
              <v-col>
                <!--preview-->
                <v-alert elevation="10" rounded="xl">
                  <h3>Preview:</h3>
                  <img :src="previewImageEvento" alt="img Preview" class="v-responsive my-3 rounded-xl"/>
                </v-alert>
              </v-col>

            </v-row>
            <!-- Fonte da imagem nova selecionada -->
            <v-row v-if="momentoEditImg">
              <v-col>
                <span class="pl-3">Fonte da imagem</span>

                <v-text-field
                  v-model="fonteImagemPcpEvento"
                  class="ml-3"
                  dense
                  hint="Exemplo: https://eb.mil.br/artigo233"
                  label="Fonte da imagem"
                  persistent-hint
                  rounded
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <!--btn cnacela altera img-->
            <v-row>
              <v-col v-if="momentoEditImg" class="text-right">
                <v-btn @click="retomaImgAntiga"> Cancelar Alteração de Imagem</v-btn>
              </v-col>
            </v-row>

          </v-col>

          <!--botoes editar e excluir-->
          <v-col v-else class="text-right" cols="6">

            <!--imagem existente-->
            <v-row>
              <v-col class="text-left">
                <span class="text-h6"> Imagem Principal:</span>
                <v-img v-if="evento.imagem !== null" :src="this.$configSis.urlDownload + evento.imagem"
                       class="rounded-xl v-responsive"/>

                <v-img v-else
                       :src="require('../../../assets/img/noimage.png')" aspect-ratio="1.5" class="rounded-xl"/>
              </v-col>
            </v-row>

            <!--editar-->
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="warning ajusteBtn" @click="editExistentImageEvento()">
                  <v-icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-pen
                  </v-icon>
                </v-btn>
              </template>
              <span>Editar Imagem</span>
            </v-tooltip>

            <!--excluir-->
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class=" error mr-5 ajusteBtn" @click="excluiImgEditEvento()">
                  <v-icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
              <span>Excluir Imagem</span>
            </v-tooltip>

            <!-- Fonte da imagem-->
            <v-row v-if="evento.imagem !== null">
              <v-col>
                <span class="pl-3">Fonte da imagem</span>

                <v-text-field
                  v-model="fonteImagemPcpEvento"
                  class="ml-3"
                  dense
                  hint="Exemplo: https://eb.mil.br/artigo233"
                  label="Fonte da imagem"
                  persistent-hint
                  rounded
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

          </v-col>

        </v-row>

        <!-- legenda em ingles e espanhol-->
        <v-row v-if="totemConfigs.permite_multi_lang">
          <!--ingles-->
          <v-col cols="6" v-if="totemConfigs.en_habilitado">
            <v-alert class="rounded-xl">
              <span>Legenda do evento (Inglês)</span>
              <vue-editor v-model="legendaEventoEng"></vue-editor>
              <span
                class="caption">Se deixado em branco, a não será mostrado nenhum texto como legenda.</span>
            </v-alert>
          </v-col>

          <!-- espanhol-->
          <v-col cols="6" v-if="totemConfigs.es_habilitado">
            <v-alert class="rounded-xl">
              <span>Legenda do evento (Espanhol)</span>
              <vue-editor v-model="legendaEventoSpa"></vue-editor>
              <span
                class="caption">Se deixado em branco, a não será mostrado nenhum texto como legenda.</span>
            </v-alert>
          </v-col>
        </v-row>

        <!--saiba mais-->
        <v-row>
          <v-col>
            <v-alert class="rounded-xl mb-0">
              <span>Saiba Mais</span>
              <vue-editor v-model="saibaMaisEvento"></vue-editor>
              <span
                class="caption">Se deixado em branco, a não será mostrado nenhum texto como Saiba Mais.</span>
            </v-alert>

          </v-col>
        </v-row>

        <!--saiba mais ingles-->
        <v-row v-if="totemConfigs.en_habilitado">
          <v-col>
            <v-alert class="rounded-xl mb-0">
              <span>Saiba Mais (Inglês)</span>
              <vue-editor v-model="saibaMaisEventoEng"></vue-editor>
              <span
                class="caption">Se deixado em branco, a não será mostrado nenhum texto como Saiba Mais.</span>
            </v-alert>

          </v-col>
        </v-row>

        <!--saiba mais em espanhol-->
        <v-row v-if="totemConfigs.es_habilitado">
          <v-col>
            <v-alert class="rounded-xl mb-0">
              <span>Saiba Mais (Espanhol)</span>
              <vue-editor v-model="saibaMaisEventoSpa"></vue-editor>
              <span
                class="caption">Se deixado em branco, a não será mostrado nenhum texto como Saiba Mais.</span>
            </v-alert>

          </v-col>
        </v-row>

        <AdmImagemAdicional :totemConfigs="totemConfigs" v-if="typeOfAction==='Edição'" :selectedEvento="evento"></AdmImagemAdicional>

        <!--btn action salvar cancelar-->
        <v-row>
          <v-col class="text-right">

            <!--cancelar-->
            <v-btn class="mr-5 warning" @click="closeDialog">Cancelar</v-btn>

            <!--salvar-->
            <v-btn class="success" type="submit">Salvar</v-btn>

          </v-col>

        </v-row>

      </v-form>

    </v-card-text>

    <!--Dialog para deletar imagem de evento-->
    <v-dialog v-model="dialogDeleteImagemEvento" max-width="800px">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar essa imagem?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>
          <div class="text-center">
            Essa ação é irreversível e imediata. Tenha certeza do que está fazendo.<br>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" @click="dialogDeleteImagemEvento= false">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn color="red lighten-1" @click="deleteImagemEventoConfirm">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog para perguntar se quer cadastrar imagem adicional no momento do cadastro de um novo evento-->
    <v-dialog v-model="dialogAddImagemAdicionalEventoPlus" max-width="80%" persistent>

      <!--Card de cadastro edição-->
      <v-card>

        <!--title-->
        <v-card-title>

          <v-icon class="mr-4">
            mdi-image-area
          </v-icon>
          <span class="headline">Gerenciamento de Imagens Adicionais --- </span>
          <br>
          <span v-if="!controladorExibicaoImgAdicional" class="headline">
                        Adicionar Imagem Extra em evento?</span>

        </v-card-title>

        <v-card-text>

          <h2 v-if="!controladorExibicaoImgAdicional">Você deseja adicionar mais imagens para esse evento?</h2>

          <v-alert v-if="!controladorExibicaoImgAdicional" class="mt-5" type="info">As imagens adicionais devem ter
            ligação com o evento adicionado, e servem
            para complementar a imagem principal.
          </v-alert>

          <AdmImagemAdicional v-if="controladorExibicaoImgAdicional" :selectedEvento="evento"></AdmImagemAdicional>

          <v-row v-if="!controladorExibicaoImgAdicional" class="mt-10">
            <v-col class="text-right">
              <v-btn color="primary" @click="opneSpaceForImgAdicional">Sim</v-btn>
            </v-col>
            <v-col class="text-left">
              <v-btn color="secondary" @click="closeDialog">Não</v-btn>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col class="text-center">
              <v-btn color="error" @click="closeDialog">Encerrar Cadastramento de Imagens Adicionais</v-btn>
            </v-col>
          </v-row>

        </v-card-text>

      </v-card>

    </v-dialog>

  </v-card>

</template>
<script>import {mapGetters} from 'vuex'
import config from '../../../http/config'
import AdmImagemAdicional from './AdmImagemAdicional'

export default {
  components: {AdmImagemAdicional},
  data: vm => ({
    configSis: config,
    optionsMes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    optionsDia: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    // input de data (dia mnes ano)
    diaEvento: '',
    mesEvento: '',
    anoEvento: '',
    // titulo
    tituloEvento: '',
    tituloEventoEng: '',
    tituloEventoSpa: '',
    // legenda
    legendaEvento: '',
    legendaEventoEng: '',
    legendaEventoSpa: '',
    // imagem do evento
    inputImagemEvento: undefined,
    currentImageEvento: undefined,
    previewImageEvento: undefined,
    // fonte da imagem pcp
    fonteImagemPcpEvento: '',
    // saiba mais
    saibaMaisEvento: '',
    saibaMaisEventoEng: '',
    saibaMaisEventoSpa: '',
    // para edição
    guardadorDeImg: null,
    momentoEditImg: false,
    imagemParaEdicao: {},
    // para exclusão da img pcp
    dialogDeleteImagemEvento: false,
    dialogAddImagemAdicionalEventoPlus: false,
    controladorExibicaoImgAdicional: false
  }),
  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  watch: {},
  props: {
    typeOfAction: String,
    evento: Object,
    totemConfigs: Object
  },

  created () {
    if (this.typeOfAction === 'Edição' && this.evento) {
      this.initializeFields()
    } else {
      this.resetCamposEvento()
    }
  },

  methods: {
    saveEvento () {
      let contadorFalha = 0
      // Verifica se o dia foi fornecido sem o mês ou o ano

      const dia = this.diaEvento ? String(this.diaEvento).trim() : ''
      const mes = this.mesEvento ? String(this.mesEvento).trim() : ''

      let mensagemErro = ''

      if (this.anoEvento === '') {
        mensagemErro += '<li>O campo ANO é obrigatório</li>'
        contadorFalha = 1
      }

      // Verifica se o dia foi fornecido sem o mês
      if (dia && !mes) {
        mensagemErro += '<li>Se você preenche o campo DIA, obrigatoriamente deve preenche o campo MÊS</li>'
        contadorFalha = 1
      }

      // Verifica se o dia foi fornecido sem o mês
      if (mes && this.anoEvento === '') {
        mensagemErro += '<li>Se você preenche o campo MÊS, obrigatoriamente deve preenche o campo ANO</li>'
        contadorFalha = 1
      }

      if (this.tituloEvento === '') {
        mensagemErro += '<li>O campo Título do evento é obrigatório</li>'
        contadorFalha = 1
      }

      if (contadorFalha === 1) {
        this.$toastr.e(
          '<ul>' +
          mensagemErro +
          '</ul>', 'Erro!'
        )
      } else {
        if (this.tituloEvento !== '' && this.anoEvento !== '') {
          let formData = new FormData()
          formData.append('dia', this.diaEvento)
          formData.append('mes', this.mesEvento)
          formData.append('ano', this.anoEvento)
          formData.append('nome', this.tituloEvento)
          formData.append('nome_en', this.tituloEventoEng)
          formData.append('nome_es', this.tituloEventoSpa)
          formData.append('legenda', this.legendaEvento)
          formData.append('legenda_en', this.legendaEventoEng)
          formData.append('legenda_es', this.legendaEventoSpa)
          formData.append('saibamais', this.saibaMaisEvento)
          formData.append('saibamais_en', this.saibaMaisEventoEng)
          formData.append('saibamais_es', this.saibaMaisEventoSpa)
          formData.append('fonteimagempcp', this.fonteImagemPcpEvento)
          // aqui eu verifico se é cadastro ou edição
          if (this.typeOfAction === 'Cadastro') {
            // em caso de cadastro de um novo evento
            formData.append('imagem', this.currentImageEvento)

            return this.$http.post('eventos', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((response) => {
              this.$toastr.s(
                'Evento cadastrado com sucesso', 'Sucesso!'
              )
              // faz emit para o principal
              this.$emit('resetaEventoSelecionado', response.data)
              this.dialogAddImagemAdicionalEventoPlus = true
              //  this.closeDialog()
            })
              .catch((error) => {
                console.log(error)
                this.$toastr.e(
                  'Não foi possível cadastrar o evento', 'Erro!'
                )
              })
          } else {
            // em caso de edição
            formData.append('imagem', this.inputImagemEvento)
            formData.append('id', this.evento.id)

            return this.$http.post('eventos/update', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(() => {
              this.resetCamposEvento()
              this.$toastr.s(
                'Evento alterado com sucesso', 'Sucesso!'
              )
              // faz emit para o principal
              this.closeDialog()
            })
              .catch(() => {
                this.$toastr.e(
                  'Não foi possível Alterar o evento', 'Erro!'
                )
              })
          }
        } else {
          this.$toastr.e(
            'Você deve preencher os campos obrigatórios.', 'Erro!'
          )
        }
      }
    },

    initializeFields () {
      this.diaEvento = this.evento.dia || ''
      this.mesEvento = this.evento.mes || ''
      this.anoEvento = this.evento.ano || ''
      this.tituloEvento = this.evento.nome || ''
      this.tituloEventoEng = this.evento.nome_en || ''
      this.tituloEventoSpa = this.evento.nome_es || ''
      this.legendaEvento = this.evento.legenda || ''
      this.legendaEventoEng = this.evento.legenda_en || ''
      this.legendaEventoSpa = this.evento.legenda_es || ''
      this.saibaMaisEvento = this.evento.saibamais || ''
      this.saibaMaisEventoEng = this.evento.saibamais_en || ''
      this.saibaMaisEventoSpa = this.evento.saibamais_es || ''
      this.fonteImagemPcpEvento = this.evento.fonteimagempcp || ''

      if (this.evento.image) {
        this.currentImageEvento = this.evento.image
        this.previewImageEvento = URL.createObjectURL(this.currentImageEvento)
      } else {
        this.currentImageEvento = undefined
        this.previewImageEvento = undefined
      }
    },

    selectImageEvento (image) {
      if (image === null || image === undefined) {
        this.currentImageEvento = undefined
        this.previewImageEvento = undefined
        this.inputImagemEvento = undefined
      } else {
        this.currentImageEvento = image
        this.previewImageEvento = URL.createObjectURL(this.currentImageEvento)
      }
    },

    limitInput () {
      // Certifique-se de que apenas números sejam inseridos
      this.anoEvento = this.anoEvento.replace(/\D/g, '')

      if (this.anoEvento.length > 4) {
        this.anoEvento = this.anoEvento.slice(0, 4) // Limita a 4 caracteres
      }
    },

    resetCamposEvento () {
      this.diaEvento = ''
      this.mesEvento = ''
      this.anoEvento = ''
      this.tituloEvento = ''
      this.tituloEventoEng = ''
      this.tituloEventoSpa = ''
      this.legendaEvento = ''
      this.legendaEventoEng = ''
      this.legendaEventoSpa = ''
      this.saibaMaisEvento = ''
      this.saibaMaisEventoEng = ''
      this.saibaMaisEventoSpa = ''
      this.currentImageEvento = undefined
      this.previewImageEvento = undefined
      this.inputImagemEvento = undefined
    },

    closeDialog () {
      this.resetCamposEvento()
      this.$emit('ajustarVisibilidade', false)
      this.$emit('adjustSelectedTypeOfContent', '')
      this.$emit('ajustaTipoContent')
      this.dialogAddImagemAdicionalEventoPlus = false
      this.controladorExibicaoImgAdicional = false
    },

    // métodos para edição (específico)
    editExistentImageEvento () {
      this.guardadorDeImg = this.evento.imagem
      this.imagemParaEdicao.imagem = null
      this.momentoEditImg = true
    },

    retomaImgAntiga () {
      this.imagemParaEdicao.imagem = this.guardadorDeImg
      this.guardadorDeImg = null
      this.momentoEditImg = false
    },

    // para exclusão de uma imagem pcp de evento
    excluiImgEditEvento () {
      this.dialogDeleteImagemEvento = true
    },

    deleteImagemEventoConfirm () {
      try {
        let objetoEnvio = {}
        objetoEnvio['id'] = this.evento.id

        this.$http.post('eventos/removeimagem', objetoEnvio)
          .then(response => {
            this.fonteImagemPcpEvento = null
            this.$emit('resetaEventoSelecionado', response.data)
            this.dialogDeleteImagemEvento = false
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    opneSpaceForImgAdicional () {
      this.controladorExibicaoImgAdicional = true
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
