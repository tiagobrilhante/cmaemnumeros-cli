<template>
  <v-main class="bgConfig">
    <BarraNavegacao></BarraNavegacao>

    <CabecalhoAA/>

    <v-container fluid>

      <v-row>

        <!--espaço-->
        <v-col cols="1"></v-col>

        <!--Espaço de exibição de quiz-->
        <v-col>

          <v-alert color="rgb(255,255,255,0.4)" rounded="xl">

            <!--Cabeçalho e adiciona quiz-->
            <v-row class="mb-3">

              <v-col align-self="center">
                <v-row>
                  <v-col>
                    <h3>Administração de Quiz</h3>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn color="primary" rounded small @click="openDialogCadastraEditaQuiz('Cadastro', {})">
                      <v-icon class="mr-4" x-small>mdi-plus-circle</v-icon>
                      Cadastrar Novo Quiz
                    </v-btn>
                  </v-col>
                </v-row>

              </v-col>

            </v-row>

            <v-divider></v-divider>

            <!-- alert para quiz não cadastrado-->
            <v-alert v-if="quizzes.length === 0" class="mt-8" rounded="xl" type="warning">
              Ainda não existem Questionários (quiz) cadastrados.
            </v-alert>

            <!-- espaço para quiz cadastrado-->
            <v-alert v-else elevation="21" rounded="xl">
              <h4>Questionários Cadastrados</h4>
              <br>

              <!-- loop para os quiz-->
              <v-row v-for="quiz in quizzes" :key="quiz.id">

                <v-col>

                  <v-alert color="red lighten-4" rounded="xl">

                    <!-- Cabeçalho  gerenciamento do quiz _ btns -->
                    <v-row no-gutters>
                      <v-col>
                        <v-alert elevation="10" rounded="xl">
                          <v-row>
                            <v-col><h3>Gerenciamento de QUIZ</h3></v-col>
                            <v-col class="text-right">

                              <!-- estatísticas-->
                              <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">

                                  <v-btn
                                    color="primary"
                                    rounded
                                    small
                                    v-bind="attrs"
                                    @click="showEstatisticas(quiz)"
                                    v-on="on">
                                    <v-icon small>mdi-magnify</v-icon>
                                  </v-btn>
                                </template>
                                <span>Estatísticas do Quiz</span>
                              </v-tooltip>

                              <!--Editar quiz-->
                              <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">

                                  <v-btn
                                    color="warning"
                                    rounded
                                    small
                                    v-bind="attrs"
                                    @click="openDialogCadastraEditaQuiz('Edição', quiz)"
                                    v-on="on">
                                    <v-icon small>mdi-pen</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar Quiz</span>
                              </v-tooltip>

                              <!--desativar Quiz-->
                              <v-tooltip v-if="quiz.ativo" top>
                                <template v-slot:activator="{ on, attrs }">

                                  <v-btn
                                    color="secondary"
                                    rounded
                                    small
                                    v-bind="attrs"
                                    @click="ativaDesativaQuiz(quiz, 'desativa')"
                                    v-on="on">
                                    <v-icon small>mdi-cancel</v-icon>
                                  </v-btn>
                                </template>
                                <span>Desativar Quiz</span>
                              </v-tooltip>

                              <!--Ativar Quiz-->
                              <v-tooltip v-else top>
                                <template v-slot:activator="{ on, attrs }">

                                  <v-btn
                                    color="success"
                                    rounded
                                    small
                                    v-bind="attrs"
                                    @click="ativaDesativaQuiz(quiz, 'ativa')"
                                    v-on="on">
                                    <v-icon small>mdi-check</v-icon>
                                  </v-btn>
                                </template>
                                <span>Ativar Quiz</span>
                              </v-tooltip>

                              <!--Excluir Quiz-->
                              <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">

                                  <v-btn
                                    color="error"
                                    rounded
                                    small
                                    v-bind="attrs"
                                    @click="openDialogDeleteQuiz(quiz)"
                                    v-on="on">
                                    <v-icon small>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Excluir Quiz</span>
                              </v-tooltip>
                            </v-col>
                          </v-row>
                        </v-alert>
                      </v-col>
                    </v-row>

                    <!-- Cabeçalho-->
                    <v-row no-gutters>
                      <v-col>
                        <b>Cabeçalho:</b> <span class="text-justify" v-html="quiz.cabecalho"></span>
                      </v-col>
                    </v-row>

                    <!-- Cabeçalho eng-->
                    <v-row no-gutters v-if="totemConfigs.en_habilitado">
                      <v-col>
                        <b>Cabeçalho (Inglês):</b> <span v-if="quiz.cabecalho_en" class="text-justify"
                                                         v-html="quiz.cabecalho_en"/> <span v-else>Cabeçalho não traduzido para o inglês.</span>
                      </v-col>
                    </v-row>

                    <!-- Cabeçalho esp-->
                    <v-row no-gutters v-if="totemConfigs.es_habilitado">
                      <v-col>
                        <b>Cabeçalho (Espanhol):</b> <span v-if="quiz.cabecalho_es" class="text-justify"
                                                           v-html="quiz.cabecalho_es"/> <span v-else>Cabeçalho não traduzido para o espanhol.</span>
                      </v-col>
                    </v-row>

                    <br>
                    <hr>
                    <br>
                    <!-- Ativo / QtdVezRespondido / criado em  -->
                    <v-row no-gutters>
                      <v-col><b>Ativo: </b> <span v-if="quiz.ativo === 1">Sim</span><span v-else>Não</span></v-col>
                      <v-col><b>Qtd de vezes respondido: </b> {{ quiz.estatisticas.length }}</v-col>
                      <v-col><b>Criado em: </b>{{ formatarDataHora(quiz.created_at) }}</v-col>
                    </v-row>

                    <!--quantidade de perguntas / score máximo / pontuação por pergunta-->
                    <v-row no-gutters>
                      <v-col><b>Quantidade de perguntas: </b> {{ quiz.perguntas.length }}</v-col>
                      <v-col><b>Score Máximo: </b> {{ quiz.maxscore }}</v-col>
                      <v-col><b>Pontuação por pergunta: </b> {{ quiz.maxscore / quiz.perguntas.length }}</v-col>
                    </v-row>

                    <!--btn para exibir ocultar perguntas e respostas-->
                    <v-row>
                      <v-col>
                        <v-btn block @click="btnShowHideDetailsQuiz(quiz)">
                          {{ showHideDetailQuiz[quiz.id] ? 'Ocultar' : 'Exibir' }} perguntas e respostas cadastradas
                        </v-btn>
                      </v-col>
                    </v-row>

                    <!--espaço para perguntas e respostas-->
                    <v-row v-if="showHideDetailQuiz[quiz.id]" :key="'pr_'+quiz.id">
                      <v-col>
                        <v-alert v-for="pergunta in quiz.perguntas" :key="pergunta.id" color="yellow lighten-3">
                          <b>Enunciado:</b> <span class="text-justify" v-html="pergunta.enunciado"></span><br>
                          <span v-if="totemConfigs.en_habilitado">
                          <b>Enunciado(Inglês):</b> <span v-if="pergunta.enunciado_en" class="text-justify"
                                                          v-html="pergunta.enunciado_en"/><span v-else>Enunciado não traduzido para o inglês.</span><br>
                          </span>
                          <span v-if="totemConfigs.es_habilitado">
                          <b>Enunciado(Espanhol):</b> <span v-if="pergunta.enunciado_es" class="text-justify"
                                                            v-html="pergunta.enunciado_es"/><span v-else>Enunciado não traduzido para o espanhol.</span>
                          </span>

                          <br>
                          <hr>
                          <br>
                          <b>Respostas cadastradas: </b>

                          <ul>
                            <li v-for="resposta in pergunta.respostas" :key="resposta.id">{{ resposta.resposta }}
                              <span v-if="totemConfigs.en_habilitado">
                              <span v-if="resposta.resposta_en"> / <b>Inglês: </b> {{ resposta.resposta_en }}</span> <span v-else>Sem tradução para o inglês</span>
                              </span>
                              <span v-if="totemConfigs.es_habilitado">
                              <span v-if="resposta.resposta_es"> / <b>Espanhol: </b>  {{ resposta.resposta_es }}</span> <span v-else>Sem tradução para o espanhol</span>
                              </span>
                              <span v-if="resposta.correta ===1" class="bgCorreto"><b>( CORRETA )</b></span></li>
                          </ul>
                        </v-alert>
                      </v-col>
                    </v-row>

                  </v-alert>

                </v-col>

              </v-row>

            </v-alert>

          </v-alert>

        </v-col>

        <!--espaço-->
        <v-col cols="1"></v-col>

      </v-row>
    </v-container>

    <!--Dialog para Cadstro/Edição de Quiz-->
    <v-dialog v-model="dialogCadastroEdicaoQuiz" max-width="80%">

      <v-card>

        <!-- Title-->
        <v-card-title class="justify-center" primary-title>

          {{ textoDialogCadastroEdicao }} de Quiz

        </v-card-title>

        <v-card-text>

          <v-container fluid>

            <!-- explicação sobre quiz-->
            <v-row>
              <v-col>
                <v-alert dismissible type="info">
                  <p class="text-justify">
                    Um quiz deve possuir obrigatóriamente:</p>
                  <ul>
                    <li>Um cabeçalho, que ajuda a identificar o <b>tipo</b> de conteúdo a ser abordado</li>
                    <li>A pontuação máxima possível (caso acerte todas as perguntas)</li>
                    <li>No mínimo uma pergunta</li>
                    <li>Para cada pergunta, devem existir no mínimo 2 respostas possíveis, sendo que uma delas
                      obrigatóriamente será a verdadeira.
                    </li>
                  </ul>
                  <br>
                  <p>A pontuação será dividida entre o número de perguntas existentes de forma automática (se o score
                    máximo for 10 por exemplo, e existirem 5 perguntas, cada pergunta certa somará 2 pontos ao score do
                    avaliado.</p>
                </v-alert>
              </v-col>
            </v-row>

            <!--Cabecalho do quiz-->
            <v-row>
              <v-col>
                <span>Cabeçalho</span>
                <vue-editor v-model="selectedQuiz.cabecalho"></vue-editor>
                <span
                  class="caption">Se deixado em branco, a não será mostrado nenhum texto na chamada do Quiz.</span>
              </v-col>
            </v-row>

            <!--Cabecalho do quiz em ingles-->
            <v-row v-if="totemConfigs.en_habilitado">
              <v-col>
                <span>Cabeçalho (Inglês)</span>
                <vue-editor v-model="selectedQuiz.cabecalho_en"></vue-editor>
                <span
                  class="caption">Se deixado em branco, a não será mostrado nenhum texto na chamada do Quiz.</span>
              </v-col>
            </v-row>

            <!--Cabecalho do quiz em espanhol-->
            <v-row v-if="totemConfigs.es_habilitado">
              <v-col>
                <span>Cabeçalho (Espanhol)</span>
                <vue-editor v-model="selectedQuiz.cabecalho_es"></vue-editor>
                <span
                  class="caption">Se deixado em branco, a não será mostrado nenhum texto na chamada do Quiz.</span>
              </v-col>
            </v-row>

            <!--pontuação máxima e add pergunta-->
            <v-row>

              <!--Pontuação máxima-->
              <v-col>
                <span class="ml-3">Pontuação máxima do Quiz</span>
                <v-text-field
                  v-model="selectedQuiz.maxscore"
                  class="mr-3"
                  dense
                  label="Pontuação Máxima"
                  rounded
                  solo
                  type="number"
                ></v-text-field>
              </v-col>

              <!--Adicionar uma pergunta-->
              <v-col>

                <v-btn v-if="selectedQuiz.cabecalho !== ''" block class="mt-6" color="primary" @click="addQuestion">
                  Adicionar uma pergunta
                </v-btn>

              </v-col>

            </v-row>

            <!-- espaço para as perguntas-->
            <v-row v-for="pergunta in [...selectedQuiz.perguntas].reverse()" :key="pergunta.id">

              <v-col>

                <!-- pergunta em si-->
                <v-alert elevation="21">

                  <v-container fluid>

                    <!-- identificação da pergunta e excluir pergunta-->
                    <v-row>

                      <!-- identificação da pergunta-->
                      <v-col>
                        <h3>Pergunta:</h3>
                      </v-col>

                      <!-- excluir pergunta-->
                      <v-col class="text-right">
                        <!--Excluir-->
                        <v-tooltip v-if="selectedQuiz.perguntas.length > 1" top>
                          <template v-slot:activator="{ on, attrs }">

                            <v-btn
                              color="error"
                              small
                              v-bind="attrs"
                              @click="excluiPergunta(pergunta)" v-on="on">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </template>
                          <span>Excluir Pergunta</span>
                        </v-tooltip>
                      </v-col>

                    </v-row>

                    <!-- enunciado da pergunta-->
                    <v-row>
                      <v-col>
                        <span>Enunciado:</span>
                        <vue-editor v-model="pergunta.enunciado"></vue-editor>
                      </v-col>
                    </v-row>

                    <!-- enunciado da pergunta (Inglês)-->
                    <v-row v-if="totemConfigs.en_habilitado">
                      <v-col>
                        <span>Enunciado (Inglês):</span>
                        <vue-editor v-model="pergunta.enunciado_en"></vue-editor>
                      </v-col>
                    </v-row>

                    <!-- enunciado da pergunta(espanhol)-->
                    <v-row v-if="totemConfigs.es_habilitado">
                      <v-col>
                        <span>Enunciado (Espanhol):</span>
                        <vue-editor v-model="pergunta.enunciado_es"></vue-editor>
                      </v-col>
                    </v-row>

                    <!-- Adicionar resposta-->
                    <v-row v-if="pergunta.enunciado !== ''">
                      <v-col>
                        <v-btn color="success"
                               @click="addRespostaQuiz(pergunta)">
                          <v-icon class="mr-5">mdi-plus-circle</v-icon>
                          Adicionar opções de respostas
                        </v-btn>
                      </v-col>
                    </v-row>

                    <!-- caso não existam respostas-->
                    <v-row v-if="pergunta.respostas.length === 0 && pergunta.enunciado !== ''">
                      <v-col>
                        <v-alert type="error">Você precisa cadastrar ao menos duas respostas para a pergunta</v-alert>
                      </v-col>
                    </v-row>

                    <!-- espaço para respostas-->
                    <v-row v-for="resposta in [...pergunta.respostas].reverse()" v-else :key="resposta.id">

                      <v-col v-if="pergunta.enunciado !== ''">

                        <v-alert color="cyan">

                          <!-- input da rersposta e excuir respostas-->
                          <v-row>
                            <v-col cols="11">
                              <v-text-field
                                v-model="resposta.resposta"
                                class="ml-3"
                                dense
                                label="Resposta"
                                rounded
                                solo
                              ></v-text-field>
                            </v-col>

                            <v-col class="text-right">
                              <!--Excluir-->
                              <v-tooltip v-if="pergunta.respostas.length > 2" top>
                                <template v-slot:activator="{ on, attrs }">

                                  <v-btn
                                    block
                                    color="error"
                                    rounded
                                    v-bind="attrs"
                                    @click="excluiResposta(pergunta, resposta)" v-on="on">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Excluir Resposta</span>
                              </v-tooltip>
                            </v-col>
                          </v-row>

                          <!--responsta em ingles-->
                          <v-row v-if="totemConfigs.en_habilitado">
                            <v-col cols="11">
                              <v-text-field
                                v-model="resposta.resposta_en"
                                class="ml-3"
                                dense
                                label="Resposta (Inglês)"
                                rounded
                                solo
                              ></v-text-field>
                            </v-col>
                            <v-col></v-col>
                          </v-row>

                          <!-- resposta em espanhol-->
                          <v-row v-if="totemConfigs.es_habilitado">
                            <v-col cols="11">
                              <v-text-field
                                v-model="resposta.resposta_es"
                                class="ml-3"
                                dense
                                label="Resposta (Espanhol)"
                                rounded
                                solo
                              ></v-text-field>
                            </v-col>
                            <v-col></v-col>
                          </v-row>

                          <!-- é correto ou não, só pode haver uma-->
                          <v-row class="mt-0 pt-0" no-gutters>
                            <v-col class="mt-0 pt-0">
                              <v-checkbox
                                v-model="resposta.correta"
                                class="ml-3 mt-0 pt-0"
                                dense
                                hide-details
                                label="Resposta Correta"
                                @change="adjustOtherCorrect(pergunta.respostas, resposta)"
                              ></v-checkbox>
                            </v-col>
                          </v-row>

                        </v-alert>

                      </v-col>

                    </v-row>

                  </v-container>

                </v-alert>

              </v-col>

            </v-row>

          </v-container>

          <v-alert v-if="allErrorsMsg.length > 0" type="error">
            <ul>
              <li v-for="(erro, index) in allErrorsMsg" :key="index">{{ erro }}</li>
            </ul>
          </v-alert>

        </v-card-text>

        <!--actions-->
        <v-card-actions class="pb-5">

          <v-spacer></v-spacer>

          <v-btn
            color="grey lighten-1"
            @click="dialogCadastroEdicaoQuiz = false">
            Cancelar
          </v-btn>

          <v-btn
            color="success"
            @click="saveQuiz(textoDialogCadastroEdicao)">
            Salvar
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>

    <!--Dialog para deletar quiz-->
    <v-dialog v-model="dialogDeleteQuiz" max-width="800px">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar esse Quiz?
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
          <v-btn color="grey lighten-1" @click="dialogDeleteQuiz= false">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn color="red lighten-1" @click="deleteQuizConfirm">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog mostrar as estatísticas de um quiz-->
    <v-dialog v-model="dialogShowEstatistica" width="70%">
      <v-card>
        <v-card-title>
          Estatísticas do Quiz
        </v-card-title>
        <v-card-text class="text-center">
          <Estatisticas v-if="dialogShowEstatistica" :estatisticas="selectedQuizEstatisticas"></Estatisticas>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" @click="dialogShowEstatistica = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-main>

</template>
<script>
import BarraNavegacao from '../../components/barra-navegacao/BarraNavegacao.vue'
import CabecalhoAA from '../../components/areaAdministrativa/CabecalhoAA/CabecalhoAA.vue'
import config from '../../http/config'
import {mapGetters} from 'vuex'
import Estatisticas from '../../components/areaAdministrativa/quiz/Estatistica.vue'

export default {

  name: 'estatisticas',
  components: {BarraNavegacao, CabecalhoAA, Estatisticas},
  data: vm => ({
    configSis: config,
    totemConfigs: {
      nome_totem: '',
      nome_totem_en: '',
      nome_totem_es: '',
      permite_multi_lang: '',
      en_habilitado: '',
      es_habilitado: '',
      altura_index: '',
      largura_index: '',
      altura_detail: '',
      largura_detail: '',
      access_code: '',
      tipo_totem: ''
    },
    dialogCadastroEdicaoQuiz: false,
    indexOfPerguntas: 0,
    indexOfRespostas: 0,
    quizDefault: {
      cabecalho: '',
      cabecalho_en: '',
      cabecalho_es: '',
      maxscore: '',
      perguntas: []
    },
    selectedQuiz: {
      cabecalho: '',
      cabecalho_en: '',
      cabecalho_es: '',
      maxscore: '',
      perguntas: []
    },
    quizzes: [],
    showHideDetailQuiz: {},
    textShowHideDetail: 'Exibir',
    dialogDeleteQuiz: false,
    textoDialogCadastroEdicao: '',
    dialogShowEstatistica: false,
    selectedQuizEstatisticas: [],
    allErrorsMsg: ''
  }),
  computed: {
    ...mapGetters(['usuarioLogado', 'paginaEmAtulizacao'])
  },
  watch: {
    paginaEmAtulizacao (val) {
      if (val) {
        this.getConfigs()
      }
      this.$store.commit('PARA_ATUALIZAR_CONTEUDO')
    }
  },
  async mounted () {
    await this.getConfigs()
    await this.getQuizzes()
  },
  methods: {
    async getConfigs () {
      try {
        const response = await this.$http.get('totemconfig/plus')
        this.totemConfigs = Object.assign({}, response.data)
      } catch (erro) {
        console.log(erro)
      }
    },

    async getQuizzes () {
      try {
        const response = await this.$http.get('admquiz')
        this.quizzes = response.data
      } catch (erro) {
        console.log(erro)
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

    openDialogCadastraEditaQuiz (acao, objeto) {
      this.allErrorsMsg = ''
      if (acao === 'Cadastro') {
        this.selectedQuiz = JSON.parse(JSON.stringify(this.quizDefault))
      } else {
        this.selectedQuiz = objeto
        console.log(this.selectedQuiz)
      }
      this.textoDialogCadastroEdicao = acao
      this.dialogCadastroEdicaoQuiz = true
    },

    addQuestion () {
      const newQuestion = {
        id: this.indexOfPerguntas,
        enunciado: '',
        enunciado_en: '',
        enunciado_es: '',
        respostas: []
      }

      this.selectedQuiz.perguntas.push(newQuestion)

      this.indexOfPerguntas++

      // Chama addRespostaQuiz para a nova pergunta
      this.addRespostaQuiz(newQuestion)
    },

    addRespostaQuiz (pergunta) {
      let perguntaTarget = this.selectedQuiz.perguntas.find(p => p.id === pergunta.id)

      if (perguntaTarget && perguntaTarget.respostas) {
        if (perguntaTarget.respostas.length === 0) {
          perguntaTarget.respostas.push({
            id: perguntaTarget.respostas.length,
            resposta: '',
            resposta_en: '',
            resposta_es: '',
            correta: false
          })

          perguntaTarget.respostas.push({
            id: perguntaTarget.respostas.length,
            resposta: '',
            resposta_en: '',
            resposta_es: '',
            correta: false
          })
        } else {
          perguntaTarget.respostas.push({
            id: perguntaTarget.respostas.length,
            resposta: '',
            resposta_en: '',
            resposta_es: '',
            correta: false
          })
        }
      }
    },

    adjustOtherCorrect (respostas, resposta) {
      if (resposta.correta) {
        for (let i = 0; i < respostas.length; i++) {
          if (respostas[i].id !== resposta.id) {
            respostas[i].correta = false
          }
        }
      }
    },

    saveQuiz (acao) {
      // tenho que fazer as checagens de validação do front
      let errorMsg = []

      if (this.selectedQuiz.maxscore === '' || this.selectedQuiz.cabecalho === '') {
        if (this.selectedQuiz.maxscore === '') {
          errorMsg.push('O quiz precisa ter um score máximo.')
        }
        if (this.selectedQuiz.cabecalho === '') {
          errorMsg.push('O quiz precisa ter um cabeçalho.')
        }
      } else {
        if (this.selectedQuiz.perguntas.length === 0) {
          errorMsg.push('O quiz precisa ter no mínimo uma pergunta para ser cadastrado.')
        } else {
          for (let i = 0; i < this.selectedQuiz.perguntas.length; i++) {
            // cada pergunta precisa ter no mínimo 2 respostas e uma deslas tem que ser verdadeira (apenas uma)
            if (this.selectedQuiz.perguntas[i].respostas.length < 2) {
              errorMsg.push('Existem perguntas que não possuem 2 respostas possíveis.')
            }
            let contaVerdade = 0
            for (let j = 0; j < this.selectedQuiz.perguntas[i].respostas.length; j++) {
              if (this.selectedQuiz.perguntas[i].respostas[j].correta === true || this.selectedQuiz.perguntas[i].respostas[j].correta === 1) {
                contaVerdade++
              }
            }
            if (contaVerdade !== 1) {
              errorMsg.push('Existem perguntas com respostas sem existir uma marcado como verdadeira.')
            }
          }
        }
      }

      this.allErrorsMsg = errorMsg

      if (errorMsg.length === 0) {
        if (acao === 'Cadastro') {
          try {
            this.$http.post('admquiz', this.selectedQuiz)
              .then(() => {
                this.dialogCadastroEdicaoQuiz = false
                this.$toastr.s(
                  'Quiz cadastrado com sucesso', 'Sucesso!'
                )
                this.getQuizzes()
              })
              .catch(erro => console.log(erro))
          } catch (e) {
            console.log(e)
            this.$toastr.e(
              'Não foi possível cadastrar o Quiz', 'Erro!'
            )
          }
        } else {
          try {
            this.$http.put('admquiz/' + this.selectedQuiz.id, this.selectedQuiz)
              .then(() => {
                this.dialogCadastroEdicaoQuiz = false
                this.$toastr.s(
                  'Quiz editado com sucesso', 'Sucesso!'
                )
                this.getQuizzes()
              })
              .catch(erro => console.log(erro))
          } catch (e) {
            console.log(e)
            this.$toastr.e(
              'Não foi possível editar o Quiz', 'Erro!'
            )
          }
        }
      } else {
        this.$toastr.e(
          `Não foi possível realizar a ação de ${acao} do Quiz', 'Erro!`
        )
      }
    },

    formatarDataHora (dataHoraISO) {
      // Cria um objeto Date a partir da string ISO
      const data = new Date(dataHoraISO)

      // Formata os componentes da data
      const dia = String(data.getDate()).padStart(2, '0')
      const mes = String(data.getMonth() + 1).padStart(2, '0') // Janeiro é 0!
      const ano = data.getFullYear()

      // Formata os componentes da hora
      const horas = String(data.getHours()).padStart(2, '0')
      const minutos = String(data.getMinutes()).padStart(2, '0')
      const segundos = String(data.getSeconds()).padStart(2, '0')

      // Monta a string formatada
      return `${dia}/${mes}/${ano} (${horas}:${minutos}:${segundos})`
    },

    excluiPergunta (pergunta) {
      const index = this.selectedQuiz.perguntas.findIndex(p => p.id === pergunta.id)
      if (index !== -1) {
        this.selectedQuiz.perguntas.splice(index, 1)
      }
    },

    excluiResposta (pergunta, resposta) {
      const indexPergunta = this.selectedQuiz.perguntas.findIndex(p => p.id === pergunta.id)
      if (indexPergunta !== -1) {
        const indexResposta = this.selectedQuiz.perguntas[indexPergunta].respostas.findIndex(r => r.id === resposta.id)
        if (indexResposta !== -1) {
          this.selectedQuiz.perguntas[indexPergunta].respostas.splice(indexResposta, 1)
        }
      }
    },

    btnShowHideDetailsQuiz (quiz) {
      if (this.showHideDetailQuiz[quiz.id]) {
        this.$set(this.showHideDetailQuiz, quiz.id, false)
      } else {
        this.$set(this.showHideDetailQuiz, quiz.id, true)
      }
    },

    ativaDesativaQuiz (quiz, acao) {
      let objetoEnvio = {}
      objetoEnvio['id'] = quiz.id
      objetoEnvio['acao'] = acao
      try {
        this.$http.patch('admquiz/status', objetoEnvio)
        this.getQuizzes()
      } catch (erro) {
        console.log(erro)
      }
    },

    openDialogDeleteQuiz (quiz) {
      this.selectedQuiz = quiz
      this.dialogDeleteQuiz = true
    },

    deleteQuizConfirm () {
      this.$http.delete('admquiz/' + this.selectedQuiz.id)
        .then(() => {
          this.dialogDeleteQuiz = false
          this.$toastr.s(
            'Quiz removido com sucesso', 'Sucesso!'
          )
          this.getQuizzes()
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover o Quiz', 'Erro!'
          )
        })
    },

    showEstatisticas (quiz) {
      try {
        this.$http.get('statsquiz/' + quiz.id)
          .then((response) => {
            this.selectedQuizEstatisticas = response.data
            this.dialogShowEstatistica = true
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
        this.$toastr.e(
          'Não foi possível abrir as estatísticas do Quiz', 'Erro!'
        )
      }
    }
  }
}
</script>

<style>
.bgConfig {
  background-color: #6b5252 !important;
}

.bgCorreto {
  background-color: #fafcf9 !important;
}
</style>
