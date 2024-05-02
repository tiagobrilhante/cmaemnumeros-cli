<template>
  <div>

    <v-app-bar
      app
      color="#6b5252"
    >

      <v-toolbar-title>{{ configSis.nomeSis }}
        <v-chip small class="ml-4 mr-10"> {{ configSis.labelSis }}</v-chip>
      </v-toolbar-title>

      <!--home-->
      <template v-if="usuarioEstaLogado">
        <div class="text-center">
          <v-menu
            rounded="xl"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn rounded
                     color="black"
                     dark
                     v-bind="attrs"
                     v-on="on"
                     class="mr-4"
                     to="/home"
              >
                <v-icon small>mdi-home</v-icon>
              </v-btn>
            </template>
          </v-menu>
        </div>
      </template>

      <!--configurações-->
      <template v-if="usuarioEstaLogado">
        <div class="text-center">
          <v-menu
            open-on-hover
            bottom
            rounded="xl"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn rounded
                     color="black"
                     dark
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon class="mr-3" small>mdi-cogs</v-icon>
                Configurações
              </v-btn>
            </template>

            <v-list>
              <!--- Configuracoes do totem-->
              <v-list-item @click="openDialogAdmConfig">
                <v-list-item-title><v-icon small class="pr-3">mdi-cog</v-icon>Administrar Configurações do Totem</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>

      <!--Ferramentas Administrativas-->
      <template v-if="usuarioEstaLogado">
        <div class="text-center">
          <v-menu
            open-on-hover
            bottom
            rounded="xl"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn rounded
                     color="black"
                     dark
                     class="ml-5"
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon class="mr-3" small>mdi-wrench</v-icon>
                Ferramentas Administrativas
              </v-btn>
            </template>

            <v-list>

              <!-- gerenciamento de usuários-->
              <v-list-item @click="openDialogAdmUser">
                <v-list-item-title><v-icon small class="pr-3">mdi-account</v-icon> Gerenciamento de Usuários</v-list-item-title>
              </v-list-item>

              <!-- Gerenciamento de Quiz-->
              <v-list-item to="/admquiz">
                <v-list-item-title><v-icon small class="pr-3">mdi-format-list-checks</v-icon> Gerenciamento de Quiz</v-list-item-title>
              </v-list-item>

              <!-- acompanhamento de histórico-->
              <v-list-item to="/historico">
                <v-list-item-title><v-icon small class="pr-3">mdi-list-box</v-icon> Acompanhamento de Histórico</v-list-item-title>
              </v-list-item>

              <!-- edstatísticas de uso-->
              <v-list-item to="/estatisticas">
                <v-list-item-title><v-icon small class="pr-3">mdi-chart-bar-stacked</v-icon> Estatísticas</v-list-item-title>
              </v-list-item>

              <!-- Backup-->
              <v-list-item to="/bkupbanco">
                <v-list-item-title><v-icon small class="pr-3">mdi-database</v-icon> Backup</v-list-item-title>
              </v-list-item>

            </v-list>
          </v-menu>
        </div>
      </template>

      <v-spacer></v-spacer>

      <!-- BARRA DE NAVEGACAO LOGADO-->
      <OpcoesUsuario v-if="usuarioEstaLogado"/>

      <v-btn v-else @click="retornaTotem()">Sair</v-btn>

      <!--Dialog para chamada de administrações -->
      <v-dialog max-width="70%" v-model="dialogGeneric70">

        <AdmUser v-if="selectedTypeOfContent ==='AdmUser'" @ajustarVisibilidade="dialogGeneric70 = $event"
                 @adjustSelectedTypeOfContent="selectedTypeOfContent = $event"/>

        <AdmConfig v-if="selectedTypeOfContent ==='AdmConfig'" @ajustarVisibilidade="dialogGeneric70 = $event"
                   @adjustSelectedTypeOfContent="selectedTypeOfContent = $event"
                   @ajustaTipoContent="refreshPage" />

      </v-dialog>

    </v-app-bar>

  </div>
</template>

<script>import OpcoesUsuario from './OpcoesUsuario'
import AdmUser from '../../components/areaAdministrativa/AdmUser'
import AdmConfig from '../areaAdministrativa/AdmConfig'
import config from '../../http/config'
import {mapGetters} from 'vuex'

export default {
  data: () => ({
    configSis: config,
    dialogGeneric70: false,
    selectedTypeOfContent: ''
  }),

  components: {
    AdmUser,
    AdmConfig,
    OpcoesUsuario
  },

  computed: {

    ...mapGetters(['usuarioEstaLogado', 'usuarioLogado', 'paginaEmAtulizacao'])

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
