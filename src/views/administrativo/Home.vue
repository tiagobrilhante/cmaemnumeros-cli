<template>
  <v-main class="bgConfig">

    <!--Barra de navegação da área administrativa-->
    <BarraNavegacao></BarraNavegacao>

    <!--Espaço para cabeçalho -->
    <CabecalhoAA/>

    <!-- administração de eventos-->
    <AdmEventos @ajustaTipoContent="getConfigs" v-if="totemConfigs.tipo_totem ==='data'" :totemConfigs="totemConfigs"></AdmEventos>
    <!-- administração de assuntos-->
    <AdmAssuntos @ajustaTipoContent="getConfigs" :totemConfigs="totemConfigs" v-else></AdmAssuntos>

  </v-main>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import config from '../../http/config'
import AdmEventos from '../../components/areaAdministrativa/eventos/AdmEventos.vue'
import AdmAssuntos from '../../components/areaAdministrativa/assuntos/AdmAssuntos.vue'
import BarraNavegacao from '../../components/barra-navegacao/BarraNavegacao.vue'
import CabecalhoAA from '../../components/areaAdministrativa/CabecalhoAA/CabecalhoAA.vue'

export default {
  name: 'home',
  mixins: [logoutMixin],
  components: {AdmEventos, AdmAssuntos, BarraNavegacao, CabecalhoAA},
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
    selectedTypeOfContent: ''
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
  },
  methods: {
    async getConfigs () {
      try {
        this.$http.get('totemconfig/plus')
          .then(response => {
            this.totemConfigs = Object.assign({}, response.data)
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

.bgConfig {
  background-color: #6b5252 !important;
}

.textlConfig {
  font-family: 'Impact', sans-serif;
  color: white;
}
</style>
