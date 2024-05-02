<template>
  <v-container fluid>
    <!-- imagens adicionais -->
    <v-row>
      <v-col>
        <v-alert color="red lighten-4" rounded="xl">
          <!--titulo e btn add imagens-->
          <v-row>
            <v-col cols="10"><h3>Imagens Adicionais</h3></v-col>
            <v-col class="text-right" cols="2">
              <v-btn class="primary" small
                     @click="openDialogAddImgAdicionalEvento">
                Adicionar Imagem
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-if="selectedEvento.imagens_adicionais && selectedEvento.imagens_adicionais.length > 0">
            <v-col>
              <v-alert v-for="imgadicional in selectedEvento.imagens_adicionais" :key="imgadicional.id">
                <v-row>
                  <v-col>
                    <v-img :src="configSis.urlDownload + '/' +  imgadicional.imagem"
                           aspect-ratio="1.5" class="rounded-xl"/>
                  </v-col>
                  <v-col>
                    <strong>Fonte: </strong>
                    <p v-if="imgadicional.fonte">{{ imgadicional.fonte }}</p>
                    <p v-else> Não existe uma fonte cadastrada.</p>
                  </v-col>
                  <v-col>
                    <p>
                      <strong>Descrição: </strong>{{ imgadicional.descricao }}
                    </p>
                    <p v-if="totemConfigs.en_habilitado">
                      <strong>Descrição (Inglês): </strong>
                      <span v-if="imgadicional.descricao_en">{{ imgadicional.descricao_en }}</span>
                      <span v-else>Não foi cadastrada um descrição em Inglês</span>
                    </p>
                    <p v-if="totemConfigs.es_habilitado">
                      <strong>Descrição (Espanhol): </strong>
                      <span v-if="imgadicional.descricao_es">{{ imgadicional.descricao_es }}</span>
                      <span v-else>Não foi cadastrada um descrição em Espanhol</span>
                    </p>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn color="error" @click="openDeleteImagem(imgadicional)">
                      <v-icon class="pr-3">mdi-delete</v-icon>
                      Excluir Imagem
                    </v-btn>
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>

        </v-alert>
      </v-col>

    </v-row>

    <!--Dialog para add imagem adicional de evento-->
    <v-dialog v-model="dialogAddImagemAdicionalEvento" max-width="80%">

      <!--Card de cadastro edição-->
      <v-card>

        <!--title-->
        <v-card-title>

          <v-icon class="mr-4">
            mdi-image-area
          </v-icon>
          <span class="headline">
                       Adicionar Imagem Extra em evento</span>

        </v-card-title>

        <v-card-text>

          <v-container>

            <v-form @submit.prevent="saveImageAdicionalEvento">

              <!-- imagem , fonte -->
              <v-row dense>

                <!--imagem-->
                <v-col>
                  <span class="ml-3">Imagem * (Campo Obrigatório)</span>
                  <v-file-input v-model="inputImagemEventoAdicional"
                                accept="image/*"
                                dense
                                hint="Escolha uma imagem no formato .png ou .jpg"
                                label="Escolha uma imagem"
                                persistent-hint
                                placeholder="Insira uma imagem"
                                rounded
                                show-size
                                solo
                                @change="selectImageAdicionalEvento"
                  ></v-file-input>

                </v-col>

                <!--fonte-->
                <v-col>
                  <span class="ml-3">Fonte da Imagem</span>
                  <v-text-field
                    v-model="fonteImagemPcpNewEventoAdicional"
                    dense
                    hint="Por exemplo: http://eb.mil.br/art24445"
                    label="Fonte da Imagem"
                    persistent-hint
                    placeholder="Insira a fonte da imagem"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>

              </v-row>

              <!--Descricao en ptbr e ingles-->
              <v-row dense>
                <!--descrição-->
                <v-col cols ="6">
                  <span class="ml-3">Descrição da Imagem</span>
                  <v-text-field
                    v-model="descricaoNewImgAdicionalEvento"
                    dense
                    hint="Por exemplo: Foto de Pedro teixeira desembarcando de navio."
                    label="Descrição da imagem"
                    persistent-hint
                    placeholder="Insira a descrição da imagem"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>

                <!--descrição (ingles)-->
                <v-col cols="6" v-if="totemConfigs.en_habilitado">
                  <span class="ml-3">Descrição da Imagem (Inglês)</span>
                  <v-text-field
                    v-model="descricaoNewImgAdicionalEventoEng"
                    dense
                    hint="Use o mesmo conteúdo traduzido para inglês."
                    label="Descrição da imagem (Inglês)"
                    persistent-hint
                    placeholder="Insira a descrição da imagem em Inglês"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>
              </v-row>

              <!--Descricao espanhol-->
              <v-row dense v-if="totemConfigs.es_habilitado">
                <!--descrição es-->
                <v-col>
                  <span class="ml-3">Descrição da Imagem (Espanhol)</span>
                  <v-text-field
                    v-model="descricaoNewImgAdicionalEventoSpa"
                    dense
                    hint="Insira o conteúdo da descrição em espanhol."
                    label="Descrição da imagem (Espanhol)"
                    persistent-hint
                    placeholder="Insira a descrição da imagem (Espanhol)"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>
                <v-col></v-col>
              </v-row>

              <!--preview-->
              <v-row>
                <v-col>

                  <v-alert v-if="previewImageEventoAdicional" elevation="10" rounded="xl">
                    <h3>Preview:</h3>
                    <img :src="previewImageEventoAdicional" alt=""
                         class="v-responsive my-3 ml-auto mr-auto rounded-xl"/>
                  </v-alert>
                </v-col>
              </v-row>

              <!--Botões-->
              <v-row>

                <v-col class="text-right">

                  <!--Salvar-->
                  <v-btn
                    color="green darken-1"
                    type="submit">
                    Salvar
                  </v-btn>

                  <!--Cancelar-->
                  <v-btn
                    class="ml-6"
                    color="red darken-1"
                    @click="dialogAddImagemAdicionalEvento = false">
                    Cancelar
                  </v-btn>

                </v-col>

              </v-row>

            </v-form>

          </v-container>

        </v-card-text>

      </v-card>

    </v-dialog>

    <!--Dialog para deletar imagem Adicional de um evento-->
    <v-dialog v-model="dialogDeleteImagemAdicionalEvento" max-width="800px">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar a imagem adicional?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>

          <v-img :src="configSis.urlDownload + '/' + imagemAdicionalParaDeletar.imagem"
                 aspect-ratio="1.5" class="rounded-xl"/>
          <v-row class="mt-4">
            <v-col class="text-center">
              <h2>Essa ação é irreversível. Tenha certeza do que está fazendo.</h2>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" @click="dialogDeleteImagemAdicionalEvento = false">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn color="red lighten-1" @click="deleteImagemAdicionalConfirm">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

</template>
<script>import config from '../../../http/config'

export default {
  components: {},
  data: vm => ({
    configSis: config,
    currentImageAdicionalEvento: undefined,
    previewImageEventoAdicional: undefined,
    inputImagemEventoAdicional: undefined,
    fonteImagemPcpNewEventoAdicional: '',
    descricaoNewImgAdicionalEvento: '',
    descricaoNewImgAdicionalEventoEng: '',
    descricaoNewImgAdicionalEventoSpa: '',
    dialogAddImagemAdicionalEvento: false,
    dialogDeleteImagemAdicionalEvento: false,
    imagemAdicionalParaDeletar: {}
  }),

  props: {
    selectedEvento: Object,
    totemConfigs: Object
  },
  methods: {

    openDialogAddImgAdicionalEvento () {
      this.currentImageEventoAdicional = undefined
      this.previewImageEventoAdicional = undefined
      this.inputImagemEventoAdicional = undefined
      this.fonteImagemPcpNewEventoAdicional = ''
      this.descricaoNewImgAdicionalEvento = ''
      this.descricaoNewImgAdicionalEventoEng = ''
      this.descricaoNewImgAdicionalEventoSpa = ''
      this.dialogAddImagemAdicionalEvento = true
    },

    selectImageAdicionalEvento (image) {
      if (image === null || image === undefined) {
        this.currentImageAdicionalEvento = undefined
        this.previewImageEventoAdicional = undefined
        this.inputImagemEventoAdicional = undefined
      } else {
        this.currentImageAdicionalEvento = image
        this.previewImageEventoAdicional = URL.createObjectURL(this.currentImageAdicionalEvento)
      }
    },

    saveImageAdicionalEvento () {
      if (this.currentImageAdicionalEvento !== undefined) {
        let formData = new FormData()
        formData.append('imagem', this.currentImageAdicionalEvento)
        formData.append('fonte', this.fonteImagemPcpNewEventoAdicional)
        formData.append('descricao', this.descricaoNewImgAdicionalEvento)
        formData.append('descricao_en', this.descricaoNewImgAdicionalEventoEng)
        formData.append('descricao_es', this.descricaoNewImgAdicionalEventoSpa)
        formData.append('evento_id', this.selectedEvento.id)
        return this.$http.post('eventos/adicionaimgadicional', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          this.selectedEvento = response.data
          this.$toastr.s(
            'Imagem Adicional cadastrada com sucesso', 'Sucesso!'
          )
          this.dialogAddImagemAdicionalEvento = false
        })
          .catch(() => {
            this.$toastr.e(
              'Não foi possível cadastrar a imagem adicional', 'Erro!'
            )
          })
      } else {
        this.$toastr.e(
          'Você deve selecionar ao menos uma Imagem.', 'Erro!'
        )
      }
    },

    openDeleteImagem (imagem) {
      this.dialogDeleteImagemAdicionalEvento = true
      this.imagemAdicionalParaDeletar = imagem
    },

    deleteImagemAdicionalConfirm () {
      this.$http.delete('eventos/deletaimgadicional/' + this.imagemAdicionalParaDeletar.id)
        .then(() => {
          for (let i = 0; i < this.selectedEvento.imagens_adicionais.length; i++) {
            if (this.selectedEvento.imagens_adicionais[i].id === this.imagemAdicionalParaDeletar.id) {
              this.selectedEvento.imagens_adicionais.splice(i, 1)
            }
          }

          this.dialogDeleteImagemAdicionalEvento = false
          this.$toastr.s(
            'Imagem removida com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover a Imagem', 'Erro!'
          )
        })
    }
  }
}
</script>
