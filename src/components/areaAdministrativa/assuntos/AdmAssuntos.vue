<template>
  <!--administração de assuntos e imagens-->
  <v-container fluid>

    <v-row>

      <!--espaço-->
      <v-col cols="1"></v-col>

      <!--configurações  de conteúdo para assuntos e imagens-->
      <v-col>

        <!--Configurações de conteúdo para assuntos e imagens-->
        <v-alert color="rgb(255,255,255,0.4)" rounded="xl">

          <!--Cabeçalho -->
          <v-row class="mb-3">

            <v-col align-self="center">
              <h3>Configurações de Conteúdo ( <span> Totem Normal </span>
                )</h3>
            </v-col>

          </v-row>

          <v-divider></v-divider>

          <!--Administração assuntos, e de imagens e textos e inserir nova imagem-->
          <v-container fluid>

            <!-- Area de seleção de assuntos/imagens-->
            <v-row class="mt-1">

              <!--Seleção de assuntos e adm de assuntos-->
              <v-col>

                <span class="ml-0 textoBranco">Selecione o assunto</span>

                <!--select de assuntos e btn Adm Assuntos-->
                <v-row>

                  <!--select de assuntos-->
                  <v-col cols="10">
                    <v-autocomplete
                      v-model="myAssunto"
                      :items="assuntoSelect"
                      clearable
                      dense
                      item-text="nome_assunto"
                      item-value="id"
                      label="Selecione o Assunto"
                      name="nome_assunto"
                      return-object
                      rounded
                      solo
                      @change="getAtualAssunto"
                    ></v-autocomplete>
                  </v-col>

                  <!--btn Administracão assuntos-->
                  <v-col>
                    <template>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn block rounded v-bind="attrs" @click="openDialogAdmAssunto"
                                 v-on="on">
                            <v-icon>mdi-pencil-box-outline</v-icon>
                          </v-btn>

                        </template>
                        <span>Administração de Assuntos</span>
                      </v-tooltip>
                    </template>
                  </v-col>

                </v-row>

              </v-col>

              <!--Separacao-->
              <v-col></v-col>

            </v-row>

            <!--Area de visualização de imagem e ajustes de imagens-->
            <v-row v-if="myAssunto !== null && myAssunto !== undefined && myAssunto !== ''">

              <!--exibição de Imagens e Ajustes de imagens-->
              <v-col align-self="start" cols="6">
                <v-row class="mb-5">
                  <v-col><span class="ml-0 textoBranco">Imagem</span></v-col>
                </v-row>

                <!--Alert de Imagem-->
                <v-alert color="white" rounded="xl">

                  <v-img v-if="qtdImg !== 0"
                         :src="this.$configSis.urlDownload + imagemAtual.imagem" aspect-ratio="1.5" class="rounded-xl"/>

                  <v-img v-else
                         :src="require('../../../assets/img/noimage.png')" aspect-ratio="1.5" class="rounded-xl"/>

                  <v-alert v-if="imagemAtual.fonte" class="mt-3" color="grey lighten-3" rounded="xl">
                    <b>Fonte: </b> {{ imagemAtual.fonte }}
                  </v-alert>

                  <!-- paginação, exclusão e edição de imagem-->
                  <v-row class="mt-2">

                    <!--Pagination-->
                    <v-col class="text-left">
                      <v-btn v-for="objImg in arrayImages" v-if="qtdImg !== 0" :key="objImg.id"
                             class="primary mr-1 mb-2" retain-focus-on-click rounded small
                             @click="recebeImagemSolicitada(objImg.ordem)">
                        {{ objImg.ordem }}
                      </v-btn>
                    </v-col>

                    <!--Delete, ADD and Edit IMAGES-->
                    <v-col cols="4">

                      <!--Delete, add and Edit IMAGES-->
                      <v-row no-gutters>

                        <!--add-->
                        <v-col class="text-right mr-1">
                          <v-btn block class="primary" small @click="openDialogAddImg">
                            <v-icon small>mdi-plus</v-icon>
                          </v-btn>
                        </v-col>

                        <!--edit-->
                        <v-col v-if="qtdImg !== 0" class="text-right mr-1">
                          <v-btn block class="warning" small @click="openDialogEditImg">
                            <v-icon small>mdi-pen</v-icon>
                          </v-btn>
                        </v-col>

                        <!--delete-->
                        <v-col v-if="qtdImg !== 0" class="text-right">
                          <v-btn block class="error" small @click="openDialogDeletaImagem()">
                            <v-icon small>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>

                      </v-row>

                    </v-col>

                  </v-row>

                </v-alert>

              </v-col>

              <!--exibição de Legendas e saiba mais-->
              <v-col cols="6">

                <!--selecao de idiomas-->
                <v-row class="mb-1">
                  <v-col>
                    <span v-if="qtdImg !== 0" class="ml-0 textoBranco">Título e Legenda da Imagem</span>
                  </v-col>
                  <!-- selecao de idiomas-->
                  <v-col class="text-right">

                    <!-- portugues-->
                    <v-btn :color="ajusta_color_pt_br" :elevation="ajusta_elevation_pt_br" class="mt-1 pt-2 pb-3"
                           retain-focus-on-click rounded @click="ajusta_linguagem('pt_br')">
                      <v-img
                        :src="require('@/assets/img/bra.png')"
                        alt="Translate to en_us"
                        class="mt-1 img_small"
                      ></v-img>
                    </v-btn>

                    <!-- ingles-->
                    <v-btn v-if="totemConfigs.en_habilitado" :color="ajusta_color_en" :elevation="ajusta_elevation_en"
                           class="mt-1 pt-2 pb-3" retain-focus-on-click rounded
                           @click="ajusta_linguagem('en')">
                      <v-img
                        :src="require('@/assets/img/eua.png')"
                        alt="Translate to en_us"
                        class="mt-1 img_small"
                      ></v-img>
                    </v-btn>

                    <!-- espanhol-->
                    <v-btn v-if="totemConfigs.es_habilitado" :color="ajusta_color_es" :elevation="ajusta_elevation_es"
                           class="mt-1 pt-2 pb-3" retain-focus-on-click rounded
                           @click="ajusta_linguagem('es')">
                      <v-img
                        :src="require('@/assets/img/spain.png')"
                        alt="Translate to en_us"
                        class="mt-1 img_small"
                      ></v-img>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-alert v-if="qtdImg !== 0" class="mb-0 pb-0" color="white" dense rounded="xl">

                  <!--nome exib e ordem-->
                  <v-row class="text-center">
                    <v-col>
                      <h3>{{ nomeExibImg }} <span v-if="imagemAtual.banner"> ( Banner )</span></h3>
                      <h4>Ordem de Exibição: {{ imagemAtual.ordem }}</h4>
                    </v-col>
                  </v-row>

                  <!--Legenda e saiba mais-->
                  <v-row>
                    <v-col>
                      <!--legenda -->
                      <v-alert class="rounded-xl">
                        <p><b>Legenda:</b></p>
                        <div v-if="legendaExibImg" v-html="legendaExibImg"></div>
                        <span v-else> Sem Legenda</span>
                      </v-alert>

                      <!--saiba mais-->
                      <v-alert class="rounded-xl">
                        <p><b>Saiba Mais:</b></p>
                        <div v-if="saibamaisExibImg" v-html="saibamaisExibImg"></div>
                        <span v-else> Sem Saiba Mais</span>
                      </v-alert>

                    </v-col>
                  </v-row>

                </v-alert>
              </v-col>

            </v-row>

          </v-container>

        </v-alert>

      </v-col>

      <!--espaço-->
      <v-col cols="1"></v-col>

    </v-row>

    <!--Dialog para administrar assunto-->
    <v-dialog v-model="dialogAdmAssunto" max-width="70%">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-row>
            <v-col cols="10">
              Administração de Assuntos
            </v-col>
            <v-col cols="2">
              <v-btn @click="openDialogAddAssunto">Adicionar Assunto</v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>

          <v-container class="pt-5" fluid>

            <!--select de assuntos e btn Edit-->
            <v-row>

              <v-col>
                <v-data-table
                  :headers="headersAssuntos"
                  :items="assuntoSelect"
                  :search="searchAssuntos"
                  class="elevation-21 mt-4"
                  sort-by="ordem_exibicao"
                >
                  <template v-slot:top>
                    <v-toolbar
                      flat
                    >
                      <v-toolbar-title>Tabela de Assuntos Cadastrados</v-toolbar-title>

                      <v-divider
                        class="mx-4"
                        inset
                        vertical
                      ></v-divider>

                      <v-spacer></v-spacer>

                      <!--Pesquisar-->
                      <v-text-field
                        v-model="searchAssuntos"
                        append-icon="mdi-magnify"
                        hide-details
                        label="Pesquisar"
                        placeholder="Pesquisar"
                        single-line
                      ></v-text-field>

                    </v-toolbar>

                  </template>

                  <!--Template de botões para editar, excluir ASSUNTO -->
                  <template v-slot:item.actions="{ item }">

                    <!--editar -->
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="mr-2"
                          small
                          v-bind="attrs"
                          @click="editAssunto(item)"
                          v-on="on"
                        >
                          mdi-pen
                        </v-icon>
                      </template>
                      <span>Editar Assunto</span>
                    </v-tooltip>

                    <!--Excluir-->
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="mr-2"
                          small
                          v-bind="attrs"
                          @click="deleteAssunto(item)"
                          v-on="on"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                      <span>Excluir Assunto</span>
                    </v-tooltip>

                  </template>

                  <!-- tem plate de apresentar o assunto em outros idiomas-->
                  <template v-slot:item.nome_assunto="{item}">
                    {{ item.nome_assunto }} <span v-if="item.nome_assunto_en && totemConfigs.en_habilitado"> /  {{ item.nome_assunto_en }}</span> <span
                    v-if="!item.nome_assunto_en && totemConfigs.en_habilitado"> / Not assigned yet</span> <span v-if="item.nome_assunto_es && totemConfigs.es_habilitado" > / {{ item.nome_assunto_es }}</span>
                    <span v-if="!item.nome_assunto_es && totemConfigs.es_habilitado"> / Aún no asignado</span>
                  </template>

                </v-data-table>
              </v-col>

            </v-row>

          </v-container>

        </v-card-text>

        <!--Fechar janela adm Assunto-->
        <v-card-actions class="pb-5 mr-5">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            elevation="2"
            @click="dialogAdmAssunto=false">Fechar
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <!--Dialog para add assunto-->
    <v-dialog v-model="dialogAddAssunto" max-width="800px">
      <v-card>
        <v-form @submit.prevent="efetuarCadastroAssunto">
          <v-card-title class="justify-center" primary-title>
            Adicionar novo assunto
          </v-card-title>
          <v-card-text>

            <!--nome assunto-->
            <v-row no-gutters>
              <v-col>
                <span class="pl-3">Nome</span>
                <v-text-field
                  v-model="nomeNewAssunto"
                  class="ml-3"
                  dense
                  label="Nome Assunto"
                  rounded
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <!--nome assunto (ingles)-->
            <v-row v-if="totemConfigs.en_habilitado" no-gutters>
              <v-col>
                <span class="pl-3">Nome (Inglês)</span>
                <v-text-field
                  v-model="nomeNewAssuntoEng"
                  class="ml-3"
                  dense
                  label="Nome Assunto (Inglês)"
                  rounded
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <!--nome assunto (espanhol)-->
            <v-row v-if="totemConfigs.es_habilitado" no-gutters>
              <v-col>
                <span class="pl-3">Nome (Espanhol)</span>
                <v-text-field
                  v-model="nomeNewAssuntoSpa"
                  class="ml-3"
                  dense
                  label="Nome Assunto (Espanhol)"
                  rounded
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <!--ordem exibição-->
            <v-row no-gutters>
              <v-col>
                <span class="pl-3">Ordem de Exibição</span>
                <v-text-field
                  v-model="ordemNewAssunto"
                  class="ml-3"
                  dense
                  label="Ordem de Exibição"
                  min="1"
                  rounded
                  solo
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions class="pb-5">
            <v-spacer></v-spacer>
            <v-btn color="warning lighten-1" @click="dialogAddAssunto = false">Cancelar</v-btn>
            <span class="pl-5 pr-5"></span>
            <v-btn color="success" type="submit">Cadastrar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>

        </v-form>
      </v-card>

    </v-dialog>

    <!--Dialog para deletar assunto-->
    <v-dialog v-model="dialogDeleteAssunto" max-width="800px">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar esse assunto?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>
          <div class="text-center">Essa ação é irreversível. <br>
            Todas as imagens vinculadas a esse assunto também serão removidas.<br>
            Tenha certeza do que está fazendo.
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" @click="dialogDeleteAssunto = false">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn color="red lighten-1" @click="deleteAssuntoConfirm">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog para editar assunto-->
    <v-dialog v-model="dialogEditAssunto" max-width="800px">
      <v-card>
        <v-form @submit.prevent="editAssuntoConfirm">
          <v-card-title class="justify-center" primary-title>
            Editar Assunto
          </v-card-title>
          <v-card-text>

            <!--nome assunto-->
            <v-row no-gutters>
              <v-col>
                <span class="pl-3">Nome</span>
                <v-text-field
                  v-model="nomeEditAssunto"
                  class="ml-3"
                  dense
                  label="Nome Assunto"
                  rounded
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <!--nome assunto (ingles)-->
            <v-row v-if="totemConfigs.en_habilitado" no-gutters>
              <v-col>
                <span class="pl-3">Nome (Inglês)</span>
                <v-text-field
                  v-model="nomeEditAssuntoEng"
                  class="ml-3"
                  dense
                  label="Nome Assunto (Inglês)"
                  rounded
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <!--nome assunto (espanhol)-->
            <v-row v-if="totemConfigs.es_habilitado" no-gutters>
              <v-col>
                <span class="pl-3">Nome (Espanhol)</span>
                <v-text-field
                  v-model="nomeEditAssuntoSpa"
                  class="ml-3"
                  dense
                  label="Nome Assunto (Espanhol)"
                  rounded
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <!--ordem exibição-->
            <v-row no-gutters>
              <v-col>
                <span class="pl-3">Ordem de Exibição</span>
                <v-text-field
                  v-model="ordemEditAssunto"
                  class="ml-3"
                  dense
                  label="Ordem de Exibição"
                  min="1"
                  rounded
                  solo
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions class="pb-5">
            <v-spacer></v-spacer>
            <v-btn color="warning lighten-1" @click="dialogEditAssunto = false">Cancelar</v-btn>
            <span class="pl-5 pr-5"></span>
            <v-btn color="success" type="submit">Editar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>

        </v-form>
      </v-card>

    </v-dialog>

    <!--Dialog para add imagem-->
    <v-dialog v-model="dialogAddImagem" max-width="80%">

      <!--Card de cadastro edição-->
      <v-card>

        <!--title-->
        <v-card-title>

          <v-icon class="mr-4">
            mdi-image-area
          </v-icon>
          <span class="headline">
                       Adicionar Imagem</span>

        </v-card-title>

        <v-card-text>

          <v-container>

            <v-form @submit.prevent="saveImage">

              <!--nome e imagem-->
              <v-row dense>

                <!--nome-->
                <v-col>
                  <span class="ml-3">Nome da Imagem</span>
                  <v-text-field
                    v-model="nomeNewImage"
                    dense
                    hint="Por exemplo: Conquista de Monte Castelo (caso não coloque o nome, não aparecerá nada no Título da Imagem"
                    label="Nome da Imagem"
                    name="nome"
                    persistent-hint
                    placeholder="Insira um nome de referência"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>

                <!--imagem-->
                <v-col>
                  <span class="ml-3">Imagem * (Campo Obrigatório)</span>
                  <v-file-input v-model="inputImagem"
                                accept="image/*"
                                dense
                                hint="Escolha uma imagem no formato .png ou .jpg"
                                label="Escolha uma imagem"
                                persistent-hint
                                placeholder="Insira uma imagem"
                                rounded
                                show-size
                                solo
                                @change="selectImage"
                  ></v-file-input>

                </v-col>

              </v-row>

              <!--nome ingles / ordem de exibicão-->
              <v-row dense>

                <!--nome eng-->
                <v-col v-if="totemConfigs.en_habilitado" cols="6">
                  <span class="ml-3">Nome da Imagem (Inglês)</span>
                  <v-text-field
                    v-model="nomeNewImageEng"
                    dense
                    hint="Deve ser inserido o nome da imagem na lingua inglesa"
                    label="Nome da Imagem (Inglês)"
                    name="nome_en"
                    persistent-hint
                    placeholder="Insira um nome de referência (em inglês)"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>

                <!--ordem Exibicao-->
                <v-col cols="6">
                  <span class="ml-3">Ordem de Exibição</span>
                  <v-text-field
                    v-model="imagemNewOrdem"
                    class="mr-3"
                    dense
                    hint="Ordem em que a imagem será exibida na paginação. Caso não coloque nada, o sistema irá entender que essa imagem deverá ser adicionada no final da lista."
                    label="Ordem de exibição"
                    min="1"
                    persistent-hint
                    rounded
                    solo
                    type="number"
                  ></v-text-field>

                </v-col>

              </v-row>

              <!--nome espanhol e é banner-->
              <v-row dense>

                <!--nome espanhol-->
                <v-col v-if="totemConfigs.es_habilitado" cols="6">
                  <span class="ml-3">Nome da Imagem (Espanhol)</span>
                  <v-text-field
                    v-model="nomeNewImageSpa"
                    dense
                    hint="Deve ser inserido o nome da imagem na lingua espanhola"
                    label="Nome da Imagem (Espanhol)"
                    name="nome_es"
                    persistent-hint
                    placeholder="Insira um nome de referência (em espanhol)"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>

                <!--é banner?-->
                <v-col cols="6">

                  <v-checkbox
                    v-model="isImgNewBanner"
                    class="pl-3 pt-3"
                    hint="Se marcada, essa imagem será usada como referência do assunto na tela de navegação principal. Ao marcar a imagem como banner, caso haja mais de uma marcada, apenas a última será considerada para fins de exibição. Caso nenhuma seja marcada, a primeira imagem cadastrada será o banner"
                    label="É Banner"
                    persistent-hint
                  ></v-checkbox>

                </v-col>

              </v-row>

              <!--legenda e preview-->
              <v-row>

                <!--Legenda-->
                <v-col>

                  <v-alert class="rounded-xl">
                    <span>Legenda</span>
                    <vue-editor v-model="legendaNewImg"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como legenda.</span>
                  </v-alert>

                </v-col>

                <!--preview-->
                <v-col>
                  <v-alert v-if="previewImage" elevation="10" rounded="xl">
                    <h3>Preview:</h3>
                    <img :src="previewImage" alt="" class="v-responsive my-3 ml-auto mr-auto rounded-xl"/>
                  </v-alert>

                  <!--fonte-->
                  <v-col>
                    <span class="ml-3">Fonte da Imagem</span>
                    <v-text-field
                      v-model="fonteNewImagem"
                      dense
                      hint="Por exemplo: https://eb.mil.br/1256"
                      label="Fonta da Imagem"
                      name="nome"
                      persistent-hint
                      placeholder="Insira a fonte da Imagem (SFC)"
                      required
                      rounded
                      solo>

                    </v-text-field>

                  </v-col>

                </v-col>

              </v-row>

              <!--legenda ingles e espanhol-->
              <v-row v-if="totemConfigs.permite_multi_lang">
                <!--Legenda ingles-->
                <v-col v-if="totemConfigs.en_habilitado" cols="6">

                  <v-alert class="rounded-xl">
                    <span>Legenda (Inglês)</span>
                    <vue-editor v-model="legendaNewImgEng"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como legenda (Inglês).</span>
                  </v-alert>

                </v-col>

                <!--Legenda espanhol-->
                <v-col v-if="totemConfigs.es_habilitado" cols="6">

                  <v-alert class="rounded-xl">
                    <span>Legenda (Espanhol)</span>
                    <vue-editor v-model="legendaNewImgSpa"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como legenda (Espanhol).</span>
                  </v-alert>

                </v-col>
              </v-row>

              <!--saibamais-->
              <v-row>
                <v-col>

                  <v-alert class="rounded-xl">
                    <span>Saiba Mais</span>
                    <vue-editor v-model="saibaMaisNewImg"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como Saiba Mais.</span>
                  </v-alert>

                </v-col>
              </v-row>

              <!--saibamais (inglês)-->
              <v-row v-if="totemConfigs.en_habilitado">
                <v-col>

                  <v-alert class="rounded-xl">
                    <span>Saiba Mais (Inglês)</span>
                    <vue-editor v-model="saibaMaisNewImgEng"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como Saiba Mais (inglês).</span>
                  </v-alert>

                </v-col>
              </v-row>

              <!--saibamais espanhol-->
              <v-row v-if="totemConfigs.es_habilitado">
                <v-col>

                  <v-alert class="rounded-xl">
                    <span>Saiba Mais (Espanhol)</span>
                    <vue-editor v-model="saibaMaisNewImgSpa"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como Saiba Mais (Espanhol).</span>
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
                    @click="dialogAddImagem = false">
                    Cancelar
                  </v-btn>

                </v-col>

              </v-row>

            </v-form>

          </v-container>

        </v-card-text>

      </v-card>

    </v-dialog>

    <!--Dialog para deletar imagem-->
    <v-dialog v-model="dialogDeleteImagem" max-width="800px">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar a imagem?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>
          <div class="text-center">
            Essa ação é irreversível. Tenha certeza do que está fazendo.<br>
            A Legenda será excluída, e a ordem de exibição de todas as demais imagens será reajustada.
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" @click="dialogDeleteImagem = false">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn color="red lighten-1" @click="deleteImagemConfirm">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog para editar imagem-->
    <v-dialog v-model="dialogEditImagem" max-width="80%">

      <!--Card de edição-->
      <v-card>

        <!--title-->
        <v-card-title>

          <v-icon class="mr-4">
            mdi-image-edit
          </v-icon>
          <span class="headline">
                       Editar Imagem</span>

        </v-card-title>

        <v-card-text>

          <v-container>

            <v-form @submit.prevent="saveEditImage">

              <!--nome e eBanner-->
              <v-row dense>

                <!--nome-->
                <v-col>
                  <span class="ml-3">Nome da Imagem</span>
                  <v-text-field
                    v-model="nomeEditImage"
                    dense
                    hint="Por exemplo: Conquista de Monte Castelo (caso não coloque o nome, não aparecerá nada no Título da Imagem"
                    label="Nome da Imagem"
                    name="nome"
                    persistent-hint
                    placeholder="Insira um nome de referência"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>

                <!--é banner?-->
                <v-col>

                  <v-checkbox
                    v-model="isImgEditBanner"
                    class="pl-3 pt-3"
                    hint="Se marcada, essa imagem será usada como referência do assunto na tela de navegação principal. Ao marcar a imagem como banner, caso haja mais de uma marcada, apenas a última será considerada para fins de exibição. Caso nenhuma seja marcada, a primeira imagem cadastrada será o banner"
                    label="É Banner"
                    persistent-hint
                  ></v-checkbox>

                </v-col>

              </v-row>

              <!--nome ingles / assunto-->
              <v-row dense>

                <!--nome ingles-->
                <v-col v-if="totemConfigs.en_habilitado" cols="6">
                  <span class="ml-3">Nome da Imagem (Inglês)</span>
                  <v-text-field
                    v-model="nomeEditImageEng"
                    dense
                    hint="Insira o nome da imagem no idioma Inglês."
                    label="Nome da Imagem (Inglês)"
                    name="nome_edit_en"
                    persistent-hint
                    placeholder="Insira um nome de referência em inglês"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>

                <!--select de assunto-->
                <v-col>
                  <span class="ml-3">Assunto</span>
                  <v-autocomplete
                    v-model="myAssuntoEdit"
                    :items="assuntoSelect"
                    clearable
                    dense
                    item-text="nome_assunto"
                    item-value="id"
                    label="Selecione o Assunto"
                    name="nome_assunto"
                    rounded
                    solo
                  ></v-autocomplete>
                </v-col>

              </v-row>

              <!--Nome em espamnhol, ordem de exibicao, btn alterar image -->
              <v-row dense>

                <!--nome espanhol-->
                <v-col v-if="totemConfigs.es_habilitado" cols="6">
                  <span class="ml-3">Nome da Imagem (Espanhol)</span>
                  <v-text-field
                    v-model="nomeEditImageSpa"
                    dense
                    hint="Insira o nome da imagem no idioma Espanhol."
                    label="Nome da Imagem (Espanhol)"
                    name="nome_edit_es"
                    persistent-hint
                    placeholder="Insira um nome de referência em espanhol"
                    required
                    rounded
                    solo>

                  </v-text-field>

                </v-col>

                <!--ordem Exibicao-->
                <v-col>
                  <span class="ml-3">Ordem de Exibição</span>
                  <v-text-field
                    v-model="imagemEditOrdem"
                    class="ml-3"
                    dense
                    hint="Ordem em que a imagem será exibida na paginação. Caso não coloque nada, o sistema irá entender que essa imagem deverá ser adicionada no final da lista."
                    label="Ordem de exibição"
                    min="1"
                    persistent-hint
                    rounded
                    solo
                    type="number"
                  ></v-text-field>

                </v-col>

                <!--btn edita imagem-->
                <v-col class="text-right">
                  <v-btn class="mt-6 warning" rounded @click="toggleEditImagem"> {{ textoBtnAlteraCancela }}</v-btn>
                </v-col>

              </v-row>

              <!--legenda e preview-->
              <v-row>

                <!--Legenda -->
                <v-col>

                  <!--legenda-->
                  <v-alert class="rounded-xl">
                    <span>Legenda</span>
                    <vue-editor v-model="legendaEditImg"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como legenda.</span>
                  </v-alert>

                </v-col>

                <!--preview-->
                <v-col>

                  <!--se input imagem-->
                  <v-row v-if="showHideEditInputImage">
                    <!--imagem-->
                    <v-col>
                      <span class="ml-3">Imagem * (Campo Obrigatório)</span>
                      <v-file-input v-model="inputEditImagem"
                                    accept="image/*"
                                    dense
                                    hint="Escolha uma nova imagem no formato .png ou .jpg (a anterior será excluída)"
                                    label="Escolha uma imagem"
                                    persistent-hint
                                    placeholder="Insira uma imagem"
                                    rounded
                                    show-size
                                    solo
                                    @change="selectEditImage"

                      ></v-file-input>

                      <v-alert v-if="!previewEditImage" border="left" type="warning">Para finalizar a alteração da
                        imagem, após a escolha da
                        nova, é
                        necessário revisar os campos do formulário e apertar no botão "Salvar".<br>Isso destruirá a foto
                        anterior.
                      </v-alert>

                    </v-col>
                  </v-row>

                  <!--preview Img-->
                  <v-alert v-if="previewEditImage" elevation="10" rounded="xl">
                    <h3>Preview:</h3>
                    <img :src="previewEditImage" alt="" class="v-responsive my-3 ml-auto mr-auto rounded-xl"/>
                  </v-alert>

                  <!--mostra imagem atual-->
                  <v-row v-if="!showHideEditInputImage">
                    <v-col>
                      <v-img :src="this.$configSis.urlDownload + imagemAtual.imagem"
                             class="rounded-xl v-responsive ml-auto mr-auto" width="600px"/>
                    </v-col>
                  </v-row>

                  <!--fonte-->
                  <v-row>
                    <v-col>
                      <span class="ml-3">Fonte da Imagem</span>
                      <v-text-field
                        v-model="fonteEditImagem"
                        dense
                        hint="Por exemplo: https://eb.mil.br/1256"
                        label="Fonta da Imagem"
                        name="nome"
                        persistent-hint
                        placeholder="Insira a fonte da Imagem (SFC)"
                        required
                        rounded
                        solo>

                      </v-text-field>

                    </v-col>
                  </v-row>

                </v-col>

              </v-row>

              <!--legenda ingles e espanhol-->
              <v-row v-if="totemConfigs.permite_multi_lang">

                <!--Legenda ingles -->
                <v-col v-if="totemConfigs.en_habilitado" cols="6">
                  <v-alert class="rounded-xl">
                    <span>Legenda (Inglês)</span>
                    <vue-editor v-model="legendaEditImgEng"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como legenda (Inglês).</span>
                  </v-alert>

                </v-col>

                <!--Legenda espanhol -->
                <v-col v-if="totemConfigs.es_habilitado" cols="6">
                  <v-alert class="rounded-xl">
                    <span>Legenda (Espanhol)</span>
                    <vue-editor v-model="legendaEditImgSpa"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como legenda (Espanhol).</span>
                  </v-alert>

                </v-col>

              </v-row>

              <!-- saiba mais-->
              <v-row>
                <v-col>
                  <v-alert class="rounded-xl">
                    <span>Saiba Mais</span>
                    <vue-editor v-model="saibaMaisEditImg"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como Saiba Mais.</span>
                  </v-alert>
                </v-col>
              </v-row>

              <!-- saiba mais ingles-->
              <v-row v-if="totemConfigs.en_habilitado">
                <v-col>
                  <v-alert class="rounded-xl">
                    <span>Saiba Mais (Inglês)</span>
                    <vue-editor v-model="saibaMaisEditImgEng"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como Saiba Mais.(Inglês)</span>
                  </v-alert>
                </v-col>
              </v-row>

              <!-- saiba mais espanhol-->
              <v-row v-if="totemConfigs.es_habilitado">
                <v-col>
                  <v-alert class="rounded-xl">
                    <span>Saiba Mais (Espanhol)</span>
                    <vue-editor v-model="saibaMaisEditImgSpa"></vue-editor>
                    <span
                      class="caption">Se deixado em branco, a não será mostrado nenhum texto como Saiba Mais.(Espanhol)</span>
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
                    @click="dialogEditImagem = false">
                    Cancelar
                  </v-btn>

                </v-col>

              </v-row>

            </v-form>

          </v-container>

        </v-card-text>

      </v-card>

    </v-dialog>

  </v-container>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import config from '../../../http/config'

export default {
  name: 'home',
  mixins: [logoutMixin],
  components: {},
  data: vm => ({
    configSis: config,
    dialogGeneric70: false,
    assuntoSelect: [],
    editedIndex: -1,
    searchAssuntos: '',
    headersAssuntos: [
      {
        text: 'Ordem Exibição',
        align: 'start',
        value: 'ordem_exibicao'
      },
      {
        text: 'Nome',
        align: 'start',
        value: 'nome_assunto'
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false
      }
    ],
    dialogAdmAssunto: false,
    dialogDeleteAssunto: false,
    dialogEditAssunto: false,
    dialogAddAssunto: false,
    ordemNewAssunto: '',
    nomeNewAssunto: '',
    nomeNewAssuntoEng: '',
    nomeNewAssuntoSpa: '',
    editedAssuntoIndex: -1,
    editedAssunto: {},
    nomeEditAssunto: '',
    nomeEditAssuntoEng: '',
    nomeEditAssuntoSpa: '',
    ordemEditAssunto: '',
    dialogAddImagem: false,
    editedImageIndex: -1,
    abrePreviewEdit: false,
    currentImage: undefined,
    previewImage: undefined,
    inputImagem: undefined,
    legendaImg: '',
    nomeNewImage: '',
    nomeNewImageEng: '',
    nomeNewImageSpa: '',
    fonteNewImagem: '',
    imagemNewOrdem: '',
    isImgNewBanner: false,
    legendaNewImg: '',
    legendaNewImgEng: '',
    legendaNewImgSpa: '',
    saibaMaisNewImg: '',
    saibaMaisNewImgEng: '',
    saibaMaisNewImgSpa: '',
    myAssunto: '',
    qtdImg: 0,
    arrayImages: [],
    imagemAtual: {},
    nomeExibImg: '',
    legendaExibImg: '',
    saibamaisExibImg: '',
    dialogDeleteImagem: false,
    dialogEditImagem: false,
    nomeEditImage: '',
    nomeEditImageEng: '',
    nomeEditImageSpa: '',
    imagemEditOrdem: '',
    isImgEditBanner: false,
    legendaEditImg: '',
    legendaEditImgEng: '',
    legendaEditImgSpa: '',
    fonteEditImagem: '',
    saibaMaisEditImg: '',
    saibaMaisEditImgEng: '',
    saibaMaisEditImgSpa: '',
    myAssuntoEdit: {},
    previewEditImage: undefined,
    currentEditImage: undefined,
    inputEditImagem: undefined,
    showHideEditInputImage: false,
    textoBtnAlteraCancela: 'Alterar a Imagem Atual',
    selectedTypeOfContent: '',
    selected_lang: 'pt_br',
    naoTraduzidoEn: 'Not translated yet',
    naoTraduzidoEs: 'Aún no traducido',
    ajusta_elevation_pt_br: 21,
    ajusta_elevation_en: 0,
    ajusta_elevation_es: 0,
    ajusta_color_pt_br: 'black',
    ajusta_color_en: 'transparent',
    ajusta_color_es: 'transparent'
  }),
  computed: {
    formTitle () {
      return this.editedImageIndex === -1 ? this.textoBtnNovaPos : this.textoBtnEditarPos
    },
    ...mapGetters(['usuarioLogado', 'paginaEmAtulizacao'])
  },
  props: {
    totemConfigs: Object
  },
  watch: {
    dialogDelete (val) {
      val || this.closeDelete()
    },

    dialogAddImagem (val) {
      if (this.editedIndex === -1) {
        this.currentImage = undefined
        this.previewImage = undefined
        this.inputImagem = undefined
      }
      val || this.closeAddImge()
    }

  },
  async mounted () {
    await this.getAssuntos()
  },
  methods: {
    async getAssuntos () {
      try {
        this.$http.get('assunto')
          .then(response => {
            this.assuntoSelect = response.data
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    retornaTotem () {
      this.$store.commit('DESLOGAR_USUARIO')
      this.$router.push({name: 'index'})
    },

    // ASSUNTO
    editAssunto (item) {
      this.editedAssuntoIndex = this.assuntoSelect.indexOf(item)
      this.editedAssunto = Object.assign({}, item)
      this.nomeEditAssunto = this.editedAssunto.nome_assunto
      this.nomeEditAssuntoEng = this.editedAssunto.nome_assunto_en
      this.nomeEditAssuntoSpa = this.editedAssunto.nome_assunto_es
      this.ordemEditAssunto = this.editedAssunto.ordem_exibicao
      this.dialogEditAssunto = true
    },

    closeDeleteAssunto () {
      this.dialogDeleteAssunto = false
      this.$nextTick(() => {
        this.editedAssunto = {}
        this.editedAssuntoIndex = -1
      })
    },

    openDialogAdmAssunto () {
      this.dialogAdmAssunto = true
    },

    deleteAssunto (item) {
      this.editedAssuntoIndex = this.assuntoSelect.indexOf(item)
      this.editedAssunto = Object.assign({}, item)
      this.dialogDeleteAssunto = true
    },

    deleteAssuntoConfirm () {
      this.$http.delete('assunto/' + this.editedAssunto.id)
        .then(() => {
          this.getAssuntos()
          this.closeDeleteAssunto()
          this.$toastr.s(
            'Assunto removido com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover o Assunto', 'Erro!'
          )
        })
    },

    efetuarCadastroAssunto () {
      if (this.nomeNewAssunto === '') {
        this.$toastr.e(
          'Não foi possível realizar o cadastro! O nome do assunto deve ser preenchido.', 'Erro!'
        )
      } else {
        let objetoParaEnvio = {}
        objetoParaEnvio['nome_assunto'] = this.nomeNewAssunto
        objetoParaEnvio['nome_assunto_en'] = this.nomeNewAssuntoEng
        objetoParaEnvio['nome_assunto_es'] = this.nomeNewAssuntoSpa
        objetoParaEnvio['ordem_exibicao'] = this.ordemNewAssunto

        try {
          this.$http.post('assunto', objetoParaEnvio)
            .then(() => {
              this.getAssuntos()
              this.dialogAddAssunto = false
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      }
    },

    openDialogAddAssunto () {
      this.nomeNewAssunto = ''
      this.nomeNewAssuntoEng = ''
      this.nomeNewAssuntoSpa = ''
      this.ordemNewAssunto = ''
      this.dialogAddAssunto = true
    },

    editAssuntoConfirm () {
      if (this.nomeEditAssunto === '' || this.nomeEditAssunto === null) {
        this.$toastr.e(
          'Não foi possível alterar o Assunto.', 'Verifique novamente os campos!'
        )
      } else {
        let objetoParaEnvio = {}
        objetoParaEnvio['nome_assunto'] = this.nomeEditAssunto
        objetoParaEnvio['nome_assunto_en'] = this.nomeEditAssuntoEng
        objetoParaEnvio['nome_assunto_es'] = this.nomeEditAssuntoSpa
        objetoParaEnvio['ordem_exibicao'] = this.ordemEditAssunto

        this.$http.put('assunto/' + this.editedAssunto.id, objetoParaEnvio)
          .then(() => {
            this.getAssuntos()
            this.$toastr.s(
              'Assunto alterado com sucesso', 'Sucesso!'
            )
            this.dialogEditAssunto = false
          }, err => {
            console.log(err)
            this.$toastr.e(
              'Não foi possível alterar o Assunto.', 'Erro!'
            )
          })
      }
    },

    // Fim Assunto

    openDialogAddImg () {
      this.dialogAddImagem = true
      this.abrePreviewEdit = false
      this.currentImage = undefined
      this.previewImage = undefined
      this.inputImagem = undefined
      this.legendaImg = ''
      this.nomeNewImage = ''
      this.nomeNewImageEng = ''
      this.nomeNewImageSpa = ''
      this.imagemNewOrdem = ''
      this.isImgNewBanner = false
      this.legendaNewImg = ''
      this.legendaNewImgEng = ''
      this.legendaNewImgSpa = ''
      this.saibaMaisNewImg = ''
      this.saibaMaisNewImgEng = ''
      this.saibaMaisNewImgSpa = ''
      this.fonteNewImagem = ''
    },

    openDialogEditImg () {
      this.dialogEditImagem = true
      this.abrePreviewEdit = false
      this.currentEditImage = undefined
      this.previewEditImage = undefined
      this.inputEditImagem = undefined
      this.showHideEditInputImage = false
      this.textoBtnAlteraCancela = 'Alterar a Imagem Atual'

      this.nomeEditImage = this.imagemAtual.nome
      this.nomeEditImageEng = this.imagemAtual.nome_en
      this.nomeEditImageSpa = this.imagemAtual.nome_es
      this.imagemEditOrdem = this.imagemAtual.ordem

      this.isImgEditBanner = this.imagemAtual.banner
      this.legendaEditImg = this.imagemAtual.legenda
      this.legendaEditImgEng = this.imagemAtual.legenda_en
      this.legendaEditImgSpa = this.imagemAtual.legenda_es
      this.fonteEditImagem = this.imagemAtual.fonte
      this.saibaMaisEditImg = this.imagemAtual.saibamais
      this.saibaMaisEditImgEng = this.imagemAtual.saibamais_en
      this.saibaMaisEditImgSpa = this.imagemAtual.saibamais_es
      this.myAssuntoEdit = this.imagemAtual.assunto_id
    },

    getAtualAssunto () {
      try {
        this.$http.get('img/assunto/' + this.myAssunto.id)
          .then(response => {
            this.getImgExib(response.data)
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    getImgExib (arrayImgIni) {
      if (arrayImgIni.length === 0) {
        this.qtdImg = 0
      } else {
        this.qtdImg = arrayImgIni.length
        this.arrayImages = arrayImgIni
        this.imagemAtual = arrayImgIni[0]
        this.nomeExibImg = this.imagemAtual.nome
        this.legendaExibImg = this.imagemAtual.legenda
        this.saibamaisExibImg = this.imagemAtual.saibamais
      }
    },

    saveImage () {
      // ARRUMAR
      if (this.currentImage !== undefined) {
        let formData = new FormData()
        formData.append('imagem', this.currentImage)
        formData.append('fonte', this.fonteNewImagem)
        formData.append('nome', this.nomeNewImage)
        formData.append('nome_en', this.nomeNewImageEng)
        formData.append('nome_es', this.nomeNewImageSpa)
        formData.append('ordem', this.imagemNewOrdem)
        formData.append('banner', this.isImgNewBanner)
        formData.append('legenda', this.legendaNewImg)
        formData.append('legenda_en', this.legendaNewImgEng)
        formData.append('legenda_es', this.legendaNewImgSpa)
        formData.append('saibamais', this.saibaMaisNewImg)
        formData.append('saibamais_en', this.saibaMaisNewImgEng)
        formData.append('saibamais_es', this.saibaMaisNewImgSpa)
        formData.append('assunto_id', this.myAssunto.id)
        return this.$http.post('img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.getAtualAssunto()
          this.$toastr.s(
            'Imagem cadastrada com sucesso', 'Sucesso!'
          )
          this.dialogAddImagem = false
        })
          .catch(() => {
            this.$toastr.e(
              'Não foi possível cadastrar a imagem', 'Erro!'
            )
            this.dialogAddImagem = false
          })
      } else {
        this.$toastr.e(
          'Você deve selecionar ao menos uma Imagem.', 'Erro!'
        )
      }
    },

    saveEditImage () {
      let formData = new FormData()
      formData.append('id', this.imagemAtual.id)
      formData.append('imagem', this.currentEditImage)
      formData.append('nome', this.nomeEditImage)
      formData.append('nome_en', this.nomeEditImageEng)
      formData.append('nome_es', this.nomeEditImageSpa)
      formData.append('ordem', this.imagemEditOrdem)
      formData.append('banner', this.isImgEditBanner)
      formData.append('fonte', this.fonteEditImagem)
      formData.append('legenda', this.legendaEditImg)
      formData.append('legenda_en', this.legendaEditImgEng)
      formData.append('legenda_es', this.legendaEditImgSpa)
      formData.append('saibamais', this.saibaMaisEditImg)
      formData.append('saibamais_en', this.saibaMaisEditImgEng)
      formData.append('saibamais_es', this.saibaMaisEditImgSpa)
      formData.append('assunto_id', this.myAssuntoEdit)
      formData.append('trocaImagem', this.showHideEditInputImage)
      return this.$http.post('img/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.dialogEditImagem = false
        this.getAtualAssunto()
        this.$toastr.s(
          'Imagem editada com sucesso', 'Sucesso!'
        )
        this.dialogAddImagem = false
      })
        .catch(() => {
          this.$toastr.e(
            'Não foi possível editar a imagem', 'Erro!'
          )
          this.dialogAddImagem = false
        })
    },

    selectImage (image) {
      if (image === null || image === undefined) {
        this.currentImage = undefined
        this.previewImage = undefined
        this.inputImagem = undefined
      } else {
        this.currentImage = image
        this.previewImage = URL.createObjectURL(this.currentImage)
      }
    },

    selectEditImage (image) {
      if (image === null || image === undefined) {
        this.currentEditImage = undefined
        this.previewEditImage = undefined
        this.inputEditImagem = undefined
      } else {
        this.currentEditImage = image
        this.previewEditImage = URL.createObjectURL(this.currentEditImage)
      }
    },

    closeAddImge () {
      this.dialogAddImagem = false
    },

    recebeImagemSolicitada (ordem) {
      for (let i = 0; i < this.arrayImages.length; i++) {
        if (ordem === this.arrayImages[i].ordem) {
          this.imagemAtual = this.arrayImages[i]
          // portugues
          if (this.selected_lang === 'pt_br') {
            // nome
            this.nomeExibImg = this.imagemAtual.nome
            if (this.imagemAtual.nome === null || this.imagemAtual.nome === 'null' || this.imagemAtual.nome === '') {
              this.nomeExibImg = 'Sem nome cadastrado'
            }
            // legenda
            this.legendaExibImg = this.imagemAtual.legenda
            if (this.imagemAtual.legenda === null || this.imagemAtual.legenda === 'null' || this.imagemAtual.legenda === '') {
              this.legendaExibImg = 'Sem legenda cadastrada'
            }
            // saibamais
            this.saibamaisExibImg = this.imagemAtual.saibamais
            if (this.imagemAtual.saibamais === null || this.imagemAtual.saibamais === 'null' || this.imagemAtual.saibamais === '') {
              this.legendaExibImg = 'Sem Saiba Mais cadastrado'
            }
          } else if (this.selected_lang === 'en') {
            // ingles

            // nome
            this.nomeExibImg = this.imagemAtual.nome_en
            if (this.imagemAtual.nome_en === null || this.imagemAtual.nome_en === 'null' || this.imagemAtual.nome_en === '') {
              this.nomeExibImg = 'Sem nome cadastrado (Inglês)'
            }

            // legenda
            this.legendaExibImg = this.imagemAtual.legenda_en
            if (this.imagemAtual.legenda_en === null || this.imagemAtual.legenda_en === 'null' || this.imagemAtual.legenda_en === '') {
              this.legendaExibImg = 'Sem legenda cadastrada (Inglês)'
            }
            // saiba mais
            this.saibamaisExibImg = this.imagemAtual.saibamais_en
            if (this.imagemAtual.saibamais_en === null || this.imagemAtual.saibamais_en === 'null' || this.imagemAtual.saibamais_en === '') {
              this.saibamaisExibImg = 'Sem Saiba Mais cadastrado (Inglês)'
            }
          } else {
            // espanhol
            this.nomeExibImg = this.imagemAtual.nome_es
            if (this.imagemAtual.nome_es === null || this.imagemAtual.nome_es === 'null' || this.imagemAtual.nome_es === '') {
              this.nomeExibImg = 'Sem nome cadastrado (Espanhol)'
            }
            this.legendaExibImg = this.imagemAtual.legenda_es
            if (this.imagemAtual.legenda_es === null || this.imagemAtual.legenda_es === 'null' || this.imagemAtual.legenda_es === '') {
              this.legendaExibImg = 'Sem legenda cadastrada (Espanhol)'
            }
            this.saibamaisExibImg = this.imagemAtual.saibamais_es
            if (this.imagemAtual.saibamais_es === null || this.imagemAtual.saibamais_es === 'null' || this.imagemAtual.saibamais_es === '') {
              this.saibamaisExibImg = 'Sem Saiba Mais cadastrado (Espanhol)'
            }
          }
        }
      }
    },

    openDialogDeletaImagem () {
      this.dialogDeleteImagem = true
    },

    deleteImagemConfirm () {
      this.$http.delete('img/' + this.imagemAtual.id)
        .then(() => {
          this.getAtualAssunto()
          this.dialogDeleteImagem = false
          this.$toastr.s(
            'Imagem removida com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover a Imagem', 'Erro!'
          )
        })
    },

    toggleEditImagem () {
      this.currentEditImage = undefined
      this.previewEditImage = undefined
      this.inputEditImagem = undefined
      if (this.showHideEditInputImage) {
        this.showHideEditInputImage = false
        this.textoBtnAlteraCancela = 'Alterar a Imagem Atual'
      } else {
        this.showHideEditInputImage = true
        this.textoBtnAlteraCancela = 'Cancelar alteração de Imagem'
      }
    },

    ajusta_linguagem (qual) {
      // tipos possiveis
      // pt_br
      // en
      // es

      this.nomeExibImg = ''
      this.legendaExibImg = ''
      this.saibamaisExibImg = ''
      this.selected_lang = qual

      this.ajusta_elevation_btn(qual)

      if (qual === 'pt_br') {
        // nome
        this.nomeExibImg = this.imagemAtual.nome
        if (this.imagemAtual.nome === null || this.imagemAtual.nome === 'null' || this.imagemAtual.nome === '') {
          this.nomeExibImg = 'Sem nome cadastrado'
        }
        // legenda
        this.legendaExibImg = this.imagemAtual.legenda
        if (this.imagemAtual.legenda === null || this.imagemAtual.legenda === 'null' || this.imagemAtual.legenda === '') {
          this.legendaExibImg = 'Sem legenda cadastrada'
        }
        // saibamais
        this.saibamaisExibImg = this.imagemAtual.saibamais
        if (this.imagemAtual.saibamais === null || this.imagemAtual.saibamais === 'null' || this.imagemAtual.saibamais === '') {
          this.legendaExibImg = 'Sem Saiba Mais cadastrado'
        }
      }
      if (qual === 'en') {
        // nome
        this.nomeExibImg = this.imagemAtual.nome_en
        if (this.imagemAtual.nome_en === null || this.imagemAtual.nome_en === 'null' || this.imagemAtual.nome_en === '') {
          this.nomeExibImg = 'Sem nome cadastrado (Inglês)'
        }

        // legenda
        this.legendaExibImg = this.imagemAtual.legenda_en
        if (this.imagemAtual.legenda_en === null || this.imagemAtual.legenda_en === 'null' || this.imagemAtual.legenda_en === '') {
          this.legendaExibImg = 'Sem legenda cadastrada (Inglês)'
        }
        // saiba mais
        this.saibamaisExibImg = this.imagemAtual.saibamais_en
        if (this.imagemAtual.saibamais_en === null || this.imagemAtual.saibamais_en === 'null' || this.imagemAtual.saibamais_en === '') {
          this.saibamaisExibImg = 'Sem Saiba Mais cadastrado (Inglês)'
        }
      }
      if (qual === 'es') {
        // espanhol
        this.nomeExibImg = this.imagemAtual.nome_es
        if (this.imagemAtual.nome_es === null || this.imagemAtual.nome_es === 'null' || this.imagemAtual.nome_es === '') {
          this.nomeExibImg = 'Sem nome cadastrado (Espanhol)'
        }
        this.legendaExibImg = this.imagemAtual.legenda_es
        if (this.imagemAtual.legenda_es === null || this.imagemAtual.legenda_es === 'null' || this.imagemAtual.legenda_es === '') {
          this.legendaExibImg = 'Sem legenda cadastrada (Espanhol)'
        }
        this.saibamaisExibImg = this.imagemAtual.saibamais_es
        if (this.imagemAtual.saibamais_es === null || this.imagemAtual.saibamais_es === 'null' || this.imagemAtual.saibamais_es === '') {
          this.saibamaisExibImg = 'Sem Saiba Mais cadastrado (Espanhol)'
        }
      }
    },

    ajusta_elevation_btn (qual) {
      if (qual === 'pt_br') {
        this.ajusta_elevation_pt_br = 21
        this.ajusta_elevation_en = 0
        this.ajusta_elevation_es = 0
        this.ajusta_color_pt_br = 'black'
        this.ajusta_color_en = 'transparent'
        this.ajusta_color_es = 'transparent'
      } else if (qual === 'en') {
        this.ajusta_elevation_pt_br = 0
        this.ajusta_elevation_en = 21
        this.ajusta_elevation_es = 0
        this.ajusta_color_pt_br = 'transparent'
        this.ajusta_color_en = 'black'
        this.ajusta_color_es = 'transparent'
      } else {
        this.ajusta_elevation_pt_br = 0
        this.ajusta_elevation_en = 0
        this.ajusta_elevation_es = 21
        this.ajusta_color_pt_br = 'transparent'
        this.ajusta_color_en = 'transparent'
        this.ajusta_color_es = 'black'
      }
    }
  }
}
</script>

<style>

.textoBranco {
  color: white;
}

.img_small {
  width: 30px;
}
</style>
