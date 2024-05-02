<template>

  <v-main>

    <!--app bar / NOME DO TOTEM (posso isolar esse componente)-->
    <v-app-bar
      app
      color="rgb(255,255,255,0.4)"
      @contextmenu.prevent="disableRightClick"
    >

      <v-row>

        <!--botão para refresh da página-->
        <v-col align-self="center" cols="2">
          <v-btn rounded @click="refreshPage">
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </v-col>

        <!--nome do totem-->
        <v-col class="text-center">
          <h1 v-if="selected_lang === 'pt_br'">{{ totemConfigs.nome_totem }} </h1>
          <h1 v-else-if="selected_lang === 'en'">{{ totemConfigs.nome_totem_en }} </h1>
          <h1 v-else>{{ totemConfigs.nome_totem_es }} </h1>
        </v-col>

        <!-- selecao de idiomas-->
        <v-col class="text-right" cols="2" v-if="totemConfigs.permite_multi_lang">

          <!-- portugues-->
          <v-btn :elevation="ajusta_elevation_pt_br" :color="ajusta_color_pt_br" class="mt-1 pt-2 pb-3" rounded  @click="ajusta_linguagem('pt_br')">
            <v-img
              :src="require('@/assets/img/bra.png')"
              alt="Translate to en_us"
              class="mt-1 img_small"
            ></v-img>
          </v-btn>

          <!-- ingles-->
          <v-btn v-if="totemConfigs.en_habilitado" :elevation="ajusta_elevation_en" class="mt-1 pt-2 pb-3" rounded  :color="ajusta_color_en" @click="ajusta_linguagem('en')">
            <v-img
              :src="require('@/assets/img/eua.png')"
              alt="Translate to en_us"
              class="mt-1 img_small"
            ></v-img>
          </v-btn>

          <!-- espanhol-->
          <v-btn v-if="totemConfigs.es_habilitado" :elevation="ajusta_elevation_es" class="mt-1 pt-2 pb-3" rounded  :color="ajusta_color_es" @click="ajusta_linguagem('es')">
            <v-img
              :src="require('@/assets/img/spain.png')"
              alt="Translate to en_us"
              class="mt-1 img_small"
            ></v-img>
          </v-btn>
        </v-col>
        <v-col cols="2" v-else />

      </v-row>

    </v-app-bar>

    <!--area de conteúdo-->
    <div @contextmenu.prevent="disableRightClick">

      <!-- conteúdo para Eventos-->
      <Evento v-if="totemConfigs.tipo_totem === 'data'" :selected_lang="selected_lang"
              :totemConfigs="totemConfigs"></Evento>

      <!-- conteúdo para outros assuntos - CURIOSIDADES-->
      <Assunto v-else :selected_lang="selected_lang" :totemConfigs="totemConfigs"></Assunto>

    </div>

  </v-main>

</template>

<script>import config from '../http/config'
import Assunto from '../components/index/Assunto'
import Evento from '../components/index/Evento'

export default {

  components: {
    Assunto,
    Evento
  },
  data () {
    return {
      configSis: config,
      clicable: true,
      usuario: {},
      totemConfigs: {},
      ajusta_elevation_pt_br: 21,
      ajusta_elevation_en: 0,
      ajusta_elevation_es: 0,
      ajusta_color_pt_br: 'black',
      ajusta_color_en: 'transparent',
      ajusta_color_es: 'transparent',
      selected_lang: 'pt_br'
    }
  },
  watch: {
    selected_lang (val) {
      this.ajusta_elevation_btn(val)
    }
  },

  computed: {},

  async mounted () {
    await this.getConfigs()
    this.ajusta_elevation_btn(this.selected_lang)
  },
  methods: {

    async getConfigs () {
      try {
        this.$http.get('totemconfig')
          .then(response => {
            this.totemConfigs = Object.assign({}, response.data)
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    disableRightClick (event) {
      event.preventDefault() // Impede o comportamento padrão do clique com o botão direito
    },

    refreshPage () {
      location.reload()
    },

    ajusta_linguagem (qual) {
      this.selected_lang = qual
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
.img_small {
  width: 30px;
}
</style>
