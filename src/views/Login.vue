<template>
  <v-main class="bgLogin">

    <BarraNavegacao></BarraNavegacao>

    <v-container fluid>

      <!--form para login-->
      <v-form @submit.prevent="efetuarLogin">
        <v-container>
          <br>

          <!--cabeçalho-->
          <v-row>

            <v-col cols="8" offset="2">
              <v-card class="ma-0" rounded>
                <v-row >
                  <v-col cols="2" class="text-left">

                    <v-img class="ml-12" width="50%" :src="require('@/assets/img/logoEb.png')"></v-img>

                  </v-col>
                  <v-col cols="8" class="text-center"><h1>{{ configSis.nomeSis }}</h1><br>
                    <h3>{{ configSis.labelSis }}</h3>
                  </v-col>
                  <v-col cols="2" class="text-right">

                    <v-img width="50%" :src="require('@/assets/img/logoEb.png')"></v-img>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="8"
              offset="2"
            >
              <v-card
                elevation="10"
                rounded="lg"
              >

                <!--card titel-->
                <v-card-title>
                  <v-icon class="mr-4">
                    fa fa-user
                  </v-icon>
                  Login
                </v-card-title>
                <v-card-text>
                  <v-container>

                    <!--email-->
                    <v-row no-gutters>
                      <v-col>
                        <v-text-field
                          clearable
                          dense
                          id="email"
                          label="Email"
                          name="email"
                          outlined
                          placeholder="Insira o seu email"
                          required
                          v-model="usuario.email"
                        />
                      </v-col>
                    </v-row>

                    <!--Password-->
                    <v-row no-gutters>
                      <v-col>
                        <v-text-field
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show1 ? 'text' : 'password'"
                          @click:append="show1 = !show1"
                          clearable
                          counter
                          dense
                          hint="No mínimo 6 caracteres"
                          label="Senha"
                          name="password"
                          outlined
                          required
                          v-model="usuario.password"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!--logar e cadastro-->
                    <v-row no-gutters>
                      <!--logar-->
                      <v-col class="text-left">
                        <v-btn
                          color="primary"
                          elevation="2"
                          type="submit"
                        >Entrar
                        </v-btn>
                      </v-col>
                    </v-row>

                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-container>

  </v-main>

</template>

<script>import config from '../http/config'
import {mapGetters} from 'vuex'
import AcessoAdmPanel from '.././components/areaAdministrativa/AcessoAdmPanel'
import BarraNavegacao from '../components/barra-navegacao/BarraNavegacao'

export default {

  components: {
    AcessoAdmPanel, BarraNavegacao
  },
  data () {
    return {
      configSis: config,
      usuario: {},
      show1: false,
      show2: false,
      dialogAcesso: false,
      dialogNewUser: false
    }
  },
  computed: {

    ...mapGetters(['usuarioEstaLogado', 'usuarioLogado'])

  },
  methods: {
    retornaTotem () {
      this.$store.commit('DESLOGAR_USUARIO')
      this.$router.push({name: 'index'})
    },

    efetuarLogin () {
      this.$store.dispatch('efetuarLogin', this.usuario)
        .then(response => {
          if (response.user.reset) {
            this.$router.push({name: 'reset'})
          } else {
            this.$router.push({name: 'home'})
          }
        })
        .catch(erro => {
          if (erro.request.status === 401) {
            this.$toastr.e(
              'Login ou senha inválidos', 'Erro!'
            )
          }
        })
    },

    openDialogAcesso () {
      this.dialogAcesso = true
    }
  }
}
</script>
<style>

.bgLogin {
  background-color: #67b4ba !important;
}
</style>
x
