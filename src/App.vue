<template>
  <v-app :style="estilosDiv" class="bgApp" id="inspire">
    <router-view/>
    <Footer/>
  </v-app>
</template>

<script>import Footer from './components/footer/Footer'

export default {
  components: {
    Footer
  },
  data () {
    return {
      totemConfigs: {}
    }
  },
  created () {
    this.getConfigs() // Chama getConfigs quando o componente é criado
  },
  computed: {
    estilosDiv () {
      if (this.totemConfigs.bg_img) {
        return {
          backgroundImage: `url(${this.$configSis.urlDownload}${this.totemConfigs.bg_img}) !important`,
          backgroundRepeat: 'no-repeat !important',
          backgroundSize: 'cover !important',
          backgroundColor: `${this.totemConfigs.bg_color}`
        }
      } else {
        return {
          backgroundColor: `${this.totemConfigs.bg_color}`
        }
      }
    }
  },
  methods: {
    getConfigs () {
      try {
        this.$http.get('totemconfig')
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
  .bgApp {
    width: 100%;
    height: 100%;
  }
</style>
