<template>
  <v-row dense>
    <v-col>
      <v-alert elevation="12">
        <h3>Relatório de Pendências (Em construção)</h3>
        <v-alert class="text-justify" color="red lighten-3">

          <!-- mes e ano limite-->
          <v-row dense>

            <!-- mes limite-->
            <v-col>
              <span class="pl-3">Mês Limite</span>
              <v-select
                v-model="mesLimite"
                :items="mesOptions"
                dense
                label="Selecione o mês de limite"
                name="mesLimite"
                rounded
                solo
              ></v-select>

            </v-col>

            <!-- ano -->
            <v-col>
              <span class="pl-3">Ano de Verificação</span>
              <v-text-field
                v-model="ano_verifica_fim"
                :rules="anoRules()"
                dense
                label="Ano de Verificação"
                maxlength="4"
                rounded
                solo
                type="text"
                @input="filtraAno($event)"
              ></v-text-field>
            </v-col>

          </v-row>

          <v-row v-if="ano_verifica_fim && mesLimite" class="mt-0" dense>
            <v-col>
              <v-btn block class="secondary" rounded @click="fazPesquisa">Realizar Busca</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'

export default {
  name: 'relatorioPendencias',
  mixins: [logoutMixin],

  data: () => ({
    mesLimite: '',
    mesOptions: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
      'Outubro', 'Novembro', 'Dezembro'],
    ano_verifica_fim: ''
  }),

  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  created () {
  },
  watch: {},

  mounted () {
  },

  methods: {
    anoRules () {
      return [
        v => !!v || 'O ano é obrigatório',
        v => (v >= 1920 && v <= 2999) || 'O ano deve estar entre 1920 e 2999',
        v => (/^\d{4}$/).test(v) || 'O ano deve ter 4 dígitos'
      ]
    },

    filtraAno (event) {
      if (event && event.target) {
        let value = event.target.value
        // Remove caracteres que não são dígitos
        value = value.replace(/\D/g, '')
        // Limita a quantidade de dígitos para 4
        if (value.length > 4) {
          value = value.slice(0, 4)
        }
        // Atualiza o valor no input e no modelo
        event.target.value = value
        this.ano_verifica_fim = value
      }
    },

    transformaMes (mes) {
      if (mes === 1) return 'Janeiro'
      if (mes === 2) return 'Fevereiro'
      if (mes === 3) return 'Março'
      if (mes === 4) return 'Abril'
      if (mes === 5) return 'Maio'
      if (mes === 6) return 'Junho'
      if (mes === 7) return 'Julho'
      if (mes === 8) return 'Agosto'
      if (mes === 9) return 'Setembro'
      if (mes === 10) return 'Outubro'
      if (mes === 11) return 'Novembro'
      if (mes === 12) return 'Dezembro'
    },

    fazPesquisa () {
      console.log('do it')
    }
  }
}
</script>
<style>

</style>
