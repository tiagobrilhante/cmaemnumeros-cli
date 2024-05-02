<template>
  <v-main>
    <v-row align-content="center">
      <v-col align-self="center" class="text-center">
        <apexchart :options="options" :series="series"
                   type="pie"
                  ></apexchart>
      </v-col>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="estatisticas[2]"
          :search="search"
          class="elevation-21 mt-4"
          :items-per-page="-1"
          hide-default-footer
          dense
          :sort-desc="true"
          :calculate-widths="true"
        >

          <!--template do topo da tabela-->
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Estatísticas de Notas (Geral)</v-toolbar-title>

              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>

              <v-spacer></v-spacer>

              <!--Pesquisar-->
              <v-text-field
                append-icon="mdi-magnify"
                hide-details
                label="Pesquisar"
                placeholder="Pesquisar"
                single-line
                v-model="search"
              ></v-text-field>

            </v-toolbar>

          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-main>
</template>
<script>
import config from '../../../http/config'
import {mapGetters} from 'vuex'

export default {
  components: {},
  data: vm => ({
    configSis: config,
    series: [],
    options: {
      chart: {
        width: 600,
        type: 'pie'
      },
      labels: []
    },
    headers: [
      {
        text: 'Nota',
        align: 'start',
        value: 'label'
      },
      {
        text: 'Quantidades',
        align: 'start',
        value: 'score'
      }
    ],
    search: ''
  }),
  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  watch: {},
  props: {
    estatisticas: []
  },

  mounted () {
    if (this.estatisticas && this.estatisticas.length === 3) {
      // Cria um novo objeto de opções para garantir a reatividade, preservando configurações
      this.options = {
        ...this.options, // Copia todas as opções existentes
        labels: this.estatisticas[0], // Atualiza os rótulos
        // Se necessário, redefina explicitamente quaisquer configurações que possam ter sido perdidas
        chart: {
          width: this.options.chart.width, // Preserva a configuração de largura original
          type: 'pie'
        }
      }
      this.series = this.estatisticas[1]
    }
  },

  created () {
  },

  methods: {
    // separa as coisas

  }
}
</script>
