<template>
  <div class="text-right">

    <v-btn @click="abreDialogSenha()"
           color="secondary"
           dark
    >
      <i class="fa fa-cog"></i>
    </v-btn>

    <!--Dialog para inserir senha de acesso-->
    <v-dialog max-width="350px" v-model="dialogSenha">
      <v-card>
        <v-card-title class="justify-center" primary-title> Senha de Acesso</v-card-title>

        <v-card-text>

          <v-row align-content="center" class="text-center">
            <v-col>
              <v-btn @click=componenteSenha(1)>1</v-btn>
            </v-col>
            <v-col>
              <v-btn @click=componenteSenha(2)>2</v-btn>
            </v-col>
            <v-col>
              <v-btn @click=componenteSenha(3)>3</v-btn>
            </v-col>
          </v-row>
          <v-row align-content="center" class="text-center">
            <v-col>
              <v-btn @click=componenteSenha(4)>4</v-btn>
            </v-col>
            <v-col>
              <v-btn @click=componenteSenha(5)>5</v-btn>
            </v-col>
            <v-col>
              <v-btn @click=componenteSenha(6)>6</v-btn>
            </v-col>
          </v-row>
          <v-row align-content="center" class="text-center">
            <v-col>
              <v-btn @click=componenteSenha(7)>7</v-btn>
            </v-col>
            <v-col>
              <v-btn @click=componenteSenha(8)>8</v-btn>
            </v-col>
            <v-col>
              <v-btn @click=componenteSenha(9)>9</v-btn>
            </v-col>
          </v-row>
          <v-row align-content="center" class="text-center">
            <v-col>
              <v-btn @click=checarsenha()>*</v-btn>
            </v-col>
            <v-col>
              <v-btn @click=componenteSenha(0)>0</v-btn>
            </v-col>
            <v-col>
              <v-btn @click=limpasenha()>#</v-btn>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions class="pb-5 mr-5">
          <v-spacer></v-spacer>
          <v-btn
            @click="dialogSenha=false"
            color="error"
            elevation="2">Cancelar
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </div>

</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import {validationMixin} from 'vuelidate'

export default {
  data: () => ({
    dialogSenha: false,
    password: ''
  }),
  mixins: [logoutMixin, validationMixin],
  methods: {
    abreDialogSenha () {
      this.dialogSenha = true
      this.password = ''
    },
    componenteSenha (valor) {
      this.password += valor
    },
    checarsenha () {
      let objetoEnvio = {}
      objetoEnvio['cod_acesso'] = this.password
      try {
        this.$http.post('totemconfig/admarea', objetoEnvio)
          .then(response => {
            if (response.data) {
              this.dialogSenha = false
              this.$emit('ajustarVisibilidade', false)
              this.$router.push({name: 'login'})
            } else {
              this.password = ''
              this.$toastr.e(
                'Você não tem permissão para acessar a esta área', 'Erro!'
              )
            }
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },
    limpasenha () {
      this.password = ''
    }
  },
  computed: {
    ...mapGetters(['usuarioResetado', 'usuarioLogado'])

  }
}
</script>
