<template>
  <div>

    <v-app-bar
      app
      color="#556b2f"
    >

      <v-toolbar-title>{{ configSis.nomeSis }}
        <v-chip class="ml-4 mr-10" small> {{ configSis.labelSis }}</v-chip>
      </v-toolbar-title>

      <!--home-->
      <template v-if="usuarioEstaLogado && usuarioResetado">
        <div class="text-center">
          <v-menu
            rounded="xl"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="mr-4"
                     color="black"
                     dark
                     rounded
                     to="/home"
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon small>mdi-home</v-icon>
              </v-btn>
            </template>
          </v-menu>
        </div>
      </template>

      <!--configurações-->
      <template v-if="usuarioEstaLogado && usuarioResetado">
        <div class="text-center">
          <v-menu
            bottom
            offset-y
            open-on-hover
            rounded="xl"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="black"
                     dark
                     rounded
                     to="/gerindicadores"
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon class="mr-3" small>mdi-cogs</v-icon>
                Configurações de Indicadores
              </v-btn>
            </template>
          </v-menu>
        </div>
      </template>

      <!--Ferramentas Administrativas-->
      <template v-if="usuarioEstaLogado && usuarioResetado && usuarioLogado.tipo === 'Administrador'">
        <div class="text-center">
          <v-menu
            bottom
            offset-y
            open-on-hover
            rounded="xl"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="ml-5"
                     color="black"
                     dark
                     rounded
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon class="mr-3" small>mdi-wrench</v-icon>
                Ferramentas Administrativas
              </v-btn>
            </template>

            <v-list>

              <!-- gerenciamento de usuários-->
              <v-list-item to="/admuser">
                <v-list-item-title>
                  <v-icon class="pr-3" small>mdi-account</v-icon>
                  Gerenciamento de Usuários
                </v-list-item-title>
              </v-list-item>

              <!-- Gerenciamento de Quiz-->
              <!--
              <v-list-item to="/admquiz">
                <v-list-item-title>
                  <v-icon class="pr-3" small>mdi-format-list-checks</v-icon>
                  Gerenciamento de Quiz
                </v-list-item-title>
              </v-list-item>
              -->

              <!-- acompanhamento de histórico-->
              <!--
              <v-list-item to="/historico">
                <v-list-item-title>
                  <v-icon class="pr-3" small>mdi-list-box</v-icon>
                  Acompanhamento de Histórico
                </v-list-item-title>
              </v-list-item>
              -->

              <!-- edstatísticas de uso-->
              <!--
              <v-list-item to="/estatisticas">
                <v-list-item-title>
                  <v-icon class="pr-3" small>mdi-chart-bar-stacked</v-icon>
                  Estatísticas
                </v-list-item-title>
              </v-list-item>
              -->

              <!-- Backup-->
              <!--
              <v-list-item to="/bkupbanco">
                <v-list-item-title>
                  <v-icon class="pr-3" small>mdi-database</v-icon>
                  Backup
                </v-list-item-title>
              </v-list-item>
              -->

            </v-list>
          </v-menu>
        </div>
      </template>

      <v-spacer></v-spacer>

      <!-- BARRA DE NAVEGACAO LOGADO-->
      <OpcoesUsuario v-if="usuarioEstaLogado"/>

    </v-app-bar>

  </div>
</template>

<script>import OpcoesUsuario from './OpcoesUsuario'
import config from '../../http/config'
import {mapGetters} from 'vuex'

export default {
  data: () => ({
    configSis: config,
    dialogGeneric70: false,
    selectedTypeOfContent: ''
  }),

  components: {
    OpcoesUsuario
  },

  computed: {
    ...mapGetters(['usuarioEstaLogado', 'usuarioLogado', 'paginaEmAtulizacao', 'usuarioResetado'])
  },

  methods: {
    openDialogAdmUser () {
      this.dialogGeneric70 = true
      this.selectedTypeOfContent = 'AdmUser'
    },
    openDialogAdmConfig () {
      this.dialogGeneric70 = true
      this.selectedTypeOfContent = 'AdmConfig'
    },
    refreshPage () {
      this.$store.commit('ATUALIZAR_CONTEUDO')
    },
    retornaTotem () {
      this.$store.commit('DESLOGAR_USUARIO')
      this.$router.push({name: 'index'})
    }
  }
}
</script>

<style>

</style>
