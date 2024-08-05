<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-if="meusDados.length > 0" color="blue lighten-2" dense>

          <v-row>
            <v-col class="mb-auto mt-auto" cols="3">
              <v-btn :color="colorTextBtn" :loading="loaderBtnExpandir" small @click="expandeTodes">{{
                  textoBtnExpandirOcultar
                }}
              </v-btn>
            </v-col>
            <v-col>
              <!-- alertas de pendências-->
              <v-alert dismissible type="warning" dense class="mb-0" v-if="resultadoBusca.length > 0">
                <v-row>
                  <v-col cols="2"><h3>Alertas</h3></v-col>
                  <v-col>
                  <span v-if="resultadoBusca.length > 0">
                    <span v-if="resultadoBusca[0].categorias_pendentes.length > 0">Pendências: {{
                        resultadoBusca[0].categorias_pendentes.length
                      }}</span>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="ml-2 pb-1"
                        v-bind="attrs"
                        @click="openDialogMostraPendencia()"
                        v-on="on"
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>Exibir informações sobre as pendências</span>
                  </v-tooltip>
                  </span>
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>

        </v-alert>

        <!-- carregamento de dados - loading-->
        <v-alert v-else color="yellow lighten-2">
          <v-progress-circular
            class="mr-10"
            color="primary"
            indeterminate
          ></v-progress-circular>
          Aguarde o carregamento de dados...
        </v-alert>

        <!-- expandir e colapsar-->
        <v-alert v-for="categoria in meusDados" v-if="categoria.indicadores.length > 0 && categoria.categoria.ativo"
                 :key="categoria.categoria.id" color="green lighten-2"
                 elevation="12">

          <v-row v-if="categoria.expanded === false">

            <!-- nome da categoria e informações-->
            <v-col cols="7">
              <h3>
                <v-icon class="mr-5" @click="categoria.expanded = true">mdi-plus</v-icon>
                {{ categoria.categoria.nome }}
                <v-icon class="ml-5" @click="openDialogDetailsCategoria(categoria)">mdi-magnify</v-icon>
              </h3>
            </v-col>

            <!-- quantidade de indicadores -->
            <v-col cols="1">

              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-list-box-outline
                  </v-icon>
                </template>
                <span>Indicadores</span>
              </v-tooltip>
              {{ categoria.indicadores.length }}

            </v-col>

            <!-- dados faltosos -->
            <v-col cols="1">
              <v-tooltip v-if="retornaDadosFaltosos(categoria) !== 'Nenhum dado faltoso'" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-alert
                  </v-icon>
                </template>
                <span>Dados Previstos / Dados Faltosos</span>
              </v-tooltip>

              <span v-if="retornaDadosFaltosos(categoria) !== 'Nenhum dado faltoso'">{{
                  retornaDadosFaltosos(categoria)
                }}</span>

            </v-col>

            <!-- gerar gráfico anual -->
            <v-col class="text-right" cols="3">
              <v-btn class="primary" small @click="openGraphDialog(categoria)">
                <v-icon class="mr-4" small>mdi-chart-bar</v-icon>
                Gerar Gráfico Anual
              </v-btn>
            </v-col>

          </v-row>

          <v-data-table
            v-if="categoria.indicadores.length > 0 && categoria.categoria.ativo"
            v-show="categoria.expanded"
            :headers="headersDados"
            :items="categoria.indicadores"
            :items-per-page="-1"
            class="elevation-21"
            disable-pagination
            dense
            hide-default-footer
          >

            <!-- template para titulo e gerar gráfico-->
            <template v-slot:top>
              <v-toolbar class="green lighten-3"
                         flat
              >
                <!-- Título da tabela e gera gráfico-->
                <v-toolbar-title>
                  <v-icon class="mr-5" @click="categoria.expanded = false">mdi-minus</v-icon>
                  {{ categoria.categoria.nome }}
                  <v-icon class="ml-10" @click="openDialogDetailsCategoria(categoria)">mdi-magnify</v-icon>
                </v-toolbar-title>

                <v-row>
                  <v-col class="text-right">
                    <v-btn class="primary" small @click="openGraphDialog(categoria)">
                      <v-icon class="mr-4" small>mdi-chart-bar</v-icon>
                      Gerar Gráfico Anual
                    </v-btn>
                  </v-col>
                </v-row>

              </v-toolbar>

            </template>

            <!-- nome do inicador-->
            <template v-slot:item.indicador="{ item }">

              {{ item.indicador.nome }}
              <v-icon small @click="openDialogDetailsIndicador(item.indicador)">mdi-magnify</v-icon>

            </template>

            <!-- linhas para totais mensais e gerar gráficos -->
            <template v-if="categoria.indicadores.length > 1" v-slot:body.append>
              <tr class="cyan lighten-2">
                <td class="text-center">
                  Total (M)
                  <v-icon small @click="handleTotalAnoClick(categoria, 'mes')">mdi-information</v-icon>
                </td>
                <td v-for="(month, index) in arrayMonthSmall" :key="index" class="text-left">
                  <span class="texto_chip">{{ pegaSomaMes(categoria, index + 1) }}</span>
                </td>
                <td class="text-center">
                  <v-tooltip v-if="pegaSomaMes(categoria, 99) === 'Média'" top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>Total Anual em Média - não é possível estipular um valor</span>
                  </v-tooltip>
                  <span v-else>{{ pegaSomaMes(categoria, 99) }}</span>
                </td>
              </tr>
              <tr class="yellow lighten-4">
                <td class="text-center">
                  Gerar Gráfico<br>
                  Mensal
                </td>
                <td v-for="(month, index) in arrayMonthSmall" :key="index" class="text-left">
                  <v-btn v-if="mostraBtnMes(categoria, index)" color="secondary" x-small
                         @click="generateMonthGraph(categoria, index)">{{ month }}
                  </v-btn>
                </td>
                <td class="text-center">
                  <v-btn color="secondary" x-small @click="generateMonthGraph(categoria, 99)">Geral
                  </v-btn>
                </td>
              </tr>
            </template>

            <!-- chips de informação-->

            <!-- Janeiro-->
            <template v-slot:item.mes_1="{ item }">
        <span v-if="item.valor && retornaValorCorreto(item.valor, 1) !== undefined">
               <v-chip small v-if="item.indicador.meta === 1" class="texto_chip"
                       :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 1))"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 1)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 1)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 1) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 1) }}</span>
            </span>
              <span v-else class="text-center">-</span>
            </template>

            <!-- Fevereiro-->
            <template v-slot:item.mes_2="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 2) !== undefined">
               <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                       :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 2))"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 2)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 2)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 2) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 2) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Março-->
            <template v-slot:item.mes_3="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 3) !== undefined">
               <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                       :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 3))"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 3)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 3)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 3) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 3) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Abril-->
            <template v-slot:item.mes_4="{ item }">
            <span v-if="item.valor  && retornaValorCorreto(item.valor, 4) !== undefined">
              <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                      :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 4))"
              >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 4)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 4)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 4) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 4) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Maio-->
            <template v-slot:item.mes_5="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 5) !== undefined">
               <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                       :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 5))"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 5)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 5)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 5) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 5) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Junho-->
            <template v-slot:item.mes_6="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 6) !== undefined">
               <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                       :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 6))"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 6)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 6)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 6) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 6) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Julho-->
            <template v-slot:item.mes_7="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 7) !== undefined">
              <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                      :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 7))"
              >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 7)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 7)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 7) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 7) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Agosto-->
            <template v-slot:item.mes_8="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 8) !== undefined">
               <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                       :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 8))"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 8)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 8)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 8) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 8) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Setembro-->
            <template v-slot:item.mes_9="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 9) !== undefined">
              <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                      :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 9))"
              >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 9)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 9)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 9) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 9) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Outubro-->
            <template v-slot:item.mes_10="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 10) !== undefined">
               <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                       :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 10))"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 10)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 10)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 10) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 10) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Novembro-->
            <template v-slot:item.mes_11="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 11) !== undefined">
               <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                       :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 11))"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 11)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 11)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 11) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 11) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- Dezembro-->
            <template v-slot:item.mes_12="{ item }">
            <span v-if="item.valor && retornaValorCorreto(item.valor, 12) !== undefined">
               <v-chip v-if="item.indicador.meta === 1" small class="texto_chip"
                       :color="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 12))"
               >
                  <span v-if="getColorForIndicatorTable(item.indicador, retornaValorCorreto(item.valor, 12)) === 'red'"
                        class="white--text">{{
                      retornaValorCorreto(item.valor, 12)
                    }}</span>
              <span v-else class="black--text">{{ retornaValorCorreto(item.valor, 12) }}</span>
            </v-chip>
              <span v-else class="texto_chip">{{ retornaValorCorreto(item.valor, 12) }}</span>
            </span>
              <span v-else>-</span>
            </template>

            <!-- total-->
            <template v-slot:item.total_ano="{ item }">

              <td :class="getStatusClass('Active')" class="text-center">
                <span class="texto_chip">{{ getTotalAno(item, categoria) }}</span>
              </td>
            </template>

            <template v-slot:header.total_ano="{ header }">
              <v-icon small @click="handleTotalAnoClick(categoria, 'ano')">mdi-information</v-icon>
              {{ header.text }}
            </template>

          </v-data-table>

        </v-alert>

        <!-- dialog para ver gráfico-->
        <v-dialog v-model="dialogVerGrafico" :width="leDialogGraphWidth">
          <v-card>
            <v-card-title>
              Gráfico ({{ garphTipo }})
            </v-card-title>
            <v-card-text>
              <GeraGraphAno v-if="dialogVerGrafico" :dadosGraph="dadosGraph" :garphTipo="garphTipo"
                            :lelabels="labelpie" :nomeCategoria="nomeCategoria"/>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="secondary"
                @click="dialogVerGrafico = false"
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- dialog de detalhes de uma categoria-->
        <v-dialog v-model="dialogDetailsCategoria" width="30%">
          <v-card>
            <v-card-title>
              Detalhes da categoria
            </v-card-title>
            <v-card-text>
              <v-row v-if="categoriaDetalhe.categoria">
                <v-col>
                  <b>Nome: </b> {{ categoriaDetalhe.categoria.nome }}<br>
                  <b>Natureza: </b> {{ categoriaDetalhe.categoria.natureza }}<br>
                  <b>Periodicidade: </b> {{ categoriaDetalhe.categoria.periodicidade }}<br>
                  <b>Mapeamento de Total (Mensal)</b> {{ categoriaDetalhe.categoria.mapeamento_total_mensal }}<br>
                  <b>Mapeamento de Total (Anual)</b> {{ categoriaDetalhe.categoria.mapeamento_total_anual }}<br>

                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="secondary"
                @click="dialogDetailsCategoria = false"
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- dialog de detalhes de um indicador-->
        <v-dialog v-model="dialogDetailsIndicador" width="30%">
          <v-card>
            <v-card-title>
              Detalhes do indicador
            </v-card-title>
            <v-card-text>
              <v-row v-if="indicadorDetalhe">
                <v-col>
                  <b>Nome: </b> {{ indicadorDetalhe.nome }}<br>
                  <b>Meta: </b> <span v-if="indicadorDetalhe.meta">Sim</span><span v-else>Não</span><br>
                  <div v-if="indicadorDetalhe.meta">
                    <b>Tendência: </b> {{ indicadorDetalhe.tendencia }}<br>
                    <b>Objetivo: </b> {{ indicadorDetalhe.objetivo }}<br>
                    <b>Verde: </b> {{ indicadorDetalhe.green }}<br>
                    <b>Amarelo: </b> entre {{ indicadorDetalhe.yellow_1 }} e {{ indicadorDetalhe.yellow_2 }}<br>
                    <b>Vermelho: </b> {{ indicadorDetalhe.red }}
                  </div>

                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="secondary"
                @click="dialogDetailsIndicador = false"
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- dialog de detalhes sobre um total-->
        <v-dialog v-model="dialogDetailsTotal" width="30%">
          <v-card>
            <v-card-title>
              Tipo de Total Vigente
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  {{ tipoDeTotalVigente }}
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="secondary"
                @click="dialogDetailsTotal = false"
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--Dialog para ver pendências-->
        <v-dialog v-model="dialogMostraPendencia" max-width="800px">
          <v-card>
            <v-card-title class="justify-center" primary-title>
              <v-icon
                class="mr-4">
                fa fa-exclamation-triangle
              </v-icon>
              Pendências
              <v-icon
                class="ml-4">
                fa fa-exclamation-triangle
              </v-icon>

            </v-card-title>
            <v-card-text>
              <hr>
              <br>
              <h2>Foram encontradas as seguintes pendências:</h2>
              <br>
              <hr>
              <br>

              <ul v-if="resultadoBusca.length > 0">
                <li v-for="categoria in resultadoBusca[0].categorias_pendentes" :key="categoria.id" class="mb-3">
                  {{ categoria.categoria }}
                  <ul>
                    <li v-for="indicador in categoria.indicadores_pendentes" :key="indicador.id">
                      {{ indicador.indicador }} - Meses Pendentes: ( <span
                      v-for="(mes, index) in indicador.meses_pendentes"
                      :key="index">{{ transformaMes(mes) }} </span> )
                    </li>
                  </ul>
                </li>
              </ul>
            </v-card-text>
            <v-card-actions class="pb-5">
              <v-spacer></v-spacer>
              <v-btn color="grey lighten-1" @click="dialogMostraPendencia = false">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import GeraGraphAno from './GeraGraphAno.vue'

export default {
  name: 'categoriaView',
  mixins: [logoutMixin],
  components: {GeraGraphAno},
  data: () => ({
    headersDados: [
      {text: 'Indicador', align: 'center', value: 'indicador', sortable: false},
      {text: 'Janeiro', align: 'start', value: 'mes_1', sortable: false},
      {text: 'Fevereiro', align: 'start', value: 'mes_2', sortable: false},
      {text: 'Março', align: 'start', value: 'mes_3', sortable: false},
      {text: 'Abril', align: 'start', value: 'mes_4', sortable: false},
      {text: 'Maio', align: 'start', value: 'mes_5', sortable: false},
      {text: 'Junho', align: 'start', value: 'mes_6', sortable: false},
      {text: 'Julho', align: 'start', value: 'mes_7', sortable: false},
      {text: 'Agosto', align: 'start', value: 'mes_8', sortable: false},
      {text: 'Setembro', align: 'start', value: 'mes_9', sortable: false},
      {text: 'Outubro', align: 'start', value: 'mes_10', sortable: false},
      {text: 'Novembro', align: 'start', value: 'mes_11', sortable: false},
      {text: 'Dezembro', align: 'start', value: 'mes_12', sortable: false},
      {text: 'Total (A)', align: 'center', value: 'total_ano', sortable: false, class: 'grey lighten-2'}
    ],
    tempvalue: '-',
    meusDados: [],
    dialogVerGrafico: false,
    selectedCategoria: {},
    dadosGraph: [],
    nomeCategoria: '',
    arrayMonthSmall: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    garphTipo: '',
    labelpie: [],
    leDialogGraphWidth: '90%',
    dialogDetailsCategoria: false,
    categoriaDetalhe: {},
    dialogDetailsIndicador: false,
    indicadorDetalhe: {},
    dialogDetailsTotal: false,
    tipoDeTotalVigente: '',
    textoBtnExpandirOcultar: 'Expandir Todos',
    colorTextBtn: 'primary',
    loaderBtnExpandir: false,
    dialogMostraPendencia: false
  }),

  props: {
    selectedSecao: Object,
    anoCorrente: Number,
    resultadoBusca: Array
  },

  computed: {
    ...mapGetters(['usuarioLogado'])
  },

  created () {
  },

  watch: {
    selectedSecao: {
      deep: true, // Observa mudanças profundas no objeto
      handler (newVal, oldVal) {
        // Chama o método de busca sempre que a propriedade selectedSecao mudar
        this.pegaPorCategoria()
      }
    },
    anoCorrente: {
      deep: true, // Observa mudanças profundas no objeto
      handler (newVal, oldVal) {
        // Chama o método de busca sempre que a propriedade selectedSecao mudar
        this.pegaPorCategoria()
      }
    },
    meusDados: {
      handler (newVal) {
        if (newVal.length === 0) {
          this.textoBtnExpandirOcultar = 'Expandir Todos'
          this.colorTextBtn = 'primary'
        }
      },
      deep: true
    }
  },

  mounted () {
    this.pegaPorCategoria()
  },

  methods: {
    async pegaPorCategoria () {
      let objetoParaEnvio = {
        ano: this.anoCorrente,
        secao_id: this.selectedSecao.id
      }

      try {
        const response = await this.$http.post('valorindicador/porcat', objetoParaEnvio)
        const dadosOrdenados = response.data.map(categoria => {
          categoria.indicadores.forEach(indicador => {
            indicador.valor.sort((a, b) => a.mes - b.mes)
          })
          categoria.expanded = false
          return categoria
        })
        this.meusDados = dadosOrdenados
      } catch (e) {
        console.log(e)
      }
    },

    getColorForIndicator (indicador) {
      if (indicador.meta) {
        if (indicador.indicador_valor.length > 0) {
          const value = parseFloat(indicador.indicador_valor[0].valor)
          if (!isNaN(value)) {
            const lowerYellow = Math.min(indicador.yellow_1, indicador.yellow_2)
            const higherYellow = Math.max(indicador.yellow_1, indicador.yellow_2)

            if (indicador.tendencia === 'Quanto maior melhor') {
              if (value >= indicador.green) {
                return 'green' // Verde, se maior ou igual ao limite green
              } else if (value >= lowerYellow && value <= higherYellow) {
                return 'yellow' // Amarelo entre yellow_2 e green
              } else {
                return 'red' // Vermelho para valores abaixo de yellow_2
              }
            } else {
              if (value <= indicador.green) {
                return 'green' // Verde, se maior ou igual ao limite green
              } else if (value >= lowerYellow && value <= higherYellow) {
                return 'yellow' // Amarelo entre yellow_2 e green
              } else {
                return 'red' // Vermelho para valores abaixo de yellow_2
              }
            }
          }
        }
        return 'grey' // Cor padrão se o valor não for válido
      } else {
        return 'blue'
      }
    },

    getColorForIndicatorTable (indicador, valor) {
      if (indicador.meta) {
        const lowerYellow = Math.min(indicador.yellow_1, indicador.yellow_2)
        const higherYellow = Math.max(indicador.yellow_1, indicador.yellow_2)

        if (indicador.tendencia === 'Quanto maior melhor') {
          if (valor >= indicador.green) {
            return 'green' // Verde, se maior ou igual ao limite green
          } else if (valor >= lowerYellow && valor <= higherYellow) {
            return 'yellow' // Amarelo entre yellow_2 e green
          } else {
            return 'red' // Vermelho para valores abaixo de yellow_2
          }
        } else {
          if (valor <= indicador.green) {
            return 'green' // Verde, se maior ou igual ao limite green
          } else if (valor >= lowerYellow && valor <= higherYellow) {
            return 'yellow' // Amarelo entre yellow_2 e green
          } else {
            return 'red' // Vermelho para valores abaixo de yellow_2
          }
        }
      }
    },

    openGraphDialog (categoria) {
      this.selectedCategoria = categoria
      this.garphTipo = 'Anual'
      this.leDialogGraphWidth = '90%'

      // Ajustar a informação antes de passar
      let ajustes = []

      for (let i = 0; i < this.selectedCategoria.indicadores.length; i++) {
        let data = []

        // Ordenar os valores pelo mês
        this.selectedCategoria.indicadores[i].valor.sort((a, b) => a.mes - b.mes)

        for (let j = 0; j < this.selectedCategoria.indicadores[i].valor.length; j++) {
          data.push(this.selectedCategoria.indicadores[i].valor[j].valor)
        }

        ajustes.push({
          name: this.selectedCategoria.indicadores[i].indicador.nome,
          data: data
        })
      }

      this.dadosGraph = ajustes
      this.nomeCategoria = this.selectedCategoria.categoria.nome

      this.dialogVerGrafico = true
    },

    generateMonthGraph (categoria, indexMonth) {
      this.selectedCategoria = categoria
      this.garphTipo = 'Mensal'
      this.leDialogGraphWidth = '50%'

      let labels = []
      let series = []

      if (indexMonth === 99) {
        for (let i = 0; i < categoria.indicadores.length; i++) {
          labels.push(categoria.indicadores[i].indicador.nome)
          series.push(this.getTotalAno(categoria.indicadores[i], this.selectedCategoria))
        }

        this.dadosGraph = series
        this.labelpie = labels
        this.garphTipo = 'Geral - ' + this.anoCorrente
        this.nomeCategoria = this.selectedCategoria.categoria.nome

        this.dialogVerGrafico = true
      } else {
        let mes = indexMonth + 1

        for (let i = 0; i < categoria.indicadores.length; i++) {
          labels.push(categoria.indicadores[i].indicador.nome)

          for (let j = 0; j < categoria.indicadores[i].valor.length; j++) {
            if (categoria.indicadores[i].valor[j].mes === mes) {
              series.push(categoria.indicadores[i].valor[j].valor)
            }
          }
        }

        this.dadosGraph = series
        this.labelpie = labels
        this.nomeCategoria = this.selectedCategoria.categoria.nome

        this.dialogVerGrafico = true
      }
    },

    mostraBtnMes (categoria, indexMes) {
      let mes = indexMes + 1
      let labels = []
      let series = []

      for (let i = 0; i < categoria.indicadores.length; i++) {
        labels.push(categoria.indicadores[i].indicador.nome)

        for (let j = 0; j < categoria.indicadores[i].valor.length; j++) {
          if (categoria.indicadores[i].valor[j].mes === mes) {
            series.push(categoria.indicadores[i].valor[j].valor)
          }
        }
      }
      return series.length > 0
    },

    openDialogDetailsCategoria (categoria) {
      this.categoriaDetalhe = categoria
      this.dialogDetailsCategoria = true
    },

    openDialogDetailsIndicador (indicador) {
      this.indicadorDetalhe = indicador
      this.dialogDetailsIndicador = true
    },

    retornaValorCorreto (item, mes) {
      for (let i = 0; i < item.length; i++) {
        if (item[i].mes === mes) {
          return item[i].valor
        }
      }
    },

    pegaSomaMes (categoria, mes) {
      let arrayTrabalho = []

      if (mes === 99) {
        for (let i = 0; i < categoria.indicadores.length; i++) {
          for (let j = 0; j < categoria.indicadores[i].valor.length; j++) {
            arrayTrabalho.push(categoria.indicadores[i].valor[j].valor)
          }
        }

        if (categoria.categoria.mapeamento_total_anual === 'Somatório' || categoria.categoria.mapeamento_total_anual === 'Máximo' || categoria.categoria.mapeamento_total_anual === 'Mínimo') {
          if (arrayTrabalho.length === 0) {
            return '-'
          } else {
            return arrayTrabalho.reduce((a, b) => a + b, 0)
          }
        } else if (categoria.categoria.mapeamento_total_anual === 'Média') {
          if (arrayTrabalho.length === 0) {
            return '-'
          } else {
            return 'Média'
          }
        }
      } else {
        for (let i = 0; i < categoria.indicadores.length; i++) {
          for (let j = 0; j < categoria.indicadores[i].valor.length; j++) {
            if (categoria.indicadores[i].valor[j].mes === mes) {
              arrayTrabalho.push(categoria.indicadores[i].valor[j].valor)
            }
          }
        }

        if (categoria.categoria.mapeamento_total_mensal === 'Somatório') {
          if (arrayTrabalho.length === 0) {
            return '-'
          } else {
            return arrayTrabalho.reduce((a, b) => a + b, 0)
          }
        } else if (categoria.categoria.mapeamento_total_mensal === 'Média') {
          if (arrayTrabalho.length === 0) {
            return '-'
          } else {
            const average = arrayTrabalho.reduce((a, b) => a + b, 0) / arrayTrabalho.length
            return Number.isInteger(average) ? average : average.toFixed(2)
          }
        } else if (categoria.categoria.mapeamento_total_mensal === 'Mínimo') {
          if (arrayTrabalho.length === 0) {
            return '-'
          } else {
            return Math.min(...arrayTrabalho)
          }
        } else if (categoria.categoria.mapeamento_total_mensal === 'Máximo') {
          if (arrayTrabalho.length === 0) {
            return '-'
          } else {
            return Math.max(...arrayTrabalho)
          }
        }
      }
    },

    getTotalAno (indicador, categoria) {
      let arrayTrabalho = []

      for (let i = 0; i < indicador.valor.length; i++) {
        arrayTrabalho.push(indicador.valor[i].valor)
      }

      if (categoria.categoria.mapeamento_total_anual === 'Somatório') {
        if (arrayTrabalho.length === 0) {
          return '-'
        } else {
          return arrayTrabalho.reduce((a, b) => a + b, 0)
        }
      } else if (categoria.categoria.mapeamento_total_anual === 'Média') {
        if (arrayTrabalho.length === 0) {
          return '-'
        } else {
          const average = arrayTrabalho.reduce((a, b) => a + b, 0) / arrayTrabalho.length
          return Number.isInteger(average) ? average : parseFloat(average.toFixed(2))
        }
      } else if (categoria.categoria.mapeamento_total_anual === 'Mínimo') {
        if (arrayTrabalho.length === 0) {
          return '-'
        } else {
          return Math.min(...arrayTrabalho)
        }
      } else if (categoria.categoria.mapeamento_total_anual === 'Máximo') {
        if (arrayTrabalho.length === 0) {
          return '-'
        } else {
          return Math.max(...arrayTrabalho)
        }
      }

      return arrayTrabalho
    },

    handleTotalAnoClick (categoria, tipo) {
      this.dialogDetailsTotal = true
      if (tipo === 'ano') {
        this.tipoDeTotalVigente = categoria.categoria.mapeamento_total_anual
      } else {
        this.tipoDeTotalVigente = categoria.categoria.mapeamento_total_mensal
      }
    },

    getStatusClass (status) {
      if (status === 'Active') {
        return 'status-active'
      } else if (status === 'Inactive') {
        return 'status-inactive'
      }
      return ''
    },

    expandeTodes () {
      this.loaderBtnExpandir = true
      if (this.textoBtnExpandirOcultar === 'Expandir Todos') {
        for (let i = 0; i < this.meusDados.length; i++) {
          this.meusDados[i].expanded = true
        }

        this.textoBtnExpandirOcultar = 'Colapsar Todos'
        this.colorTextBtn = 'warning'
        this.loaderBtnExpandir = false
      } else {
        for (let i = 0; i < this.meusDados.length; i++) {
          this.meusDados[i].expanded = false
        }

        this.textoBtnExpandirOcultar = 'Expandir Todos'
        this.colorTextBtn = 'primary'
        this.loaderBtnExpandir = false
      }
    },

    getCurrentMonth () {
      const date = new Date()
      const month = date.getMonth() + 1 // getMonth() returns 0-11, so add 1
      return month.toString().padStart(2) // Ensure two digits
    },

    retornaDadosFaltosos (categoria) {
      const currentMonth = new Date().getMonth() // Get current month
      let missingCount = 0
      let totalExpected = 0

      for (let i = 0; i < categoria.indicadores.length; i++) {
        for (let month = 1; month <= currentMonth; month++) {
          totalExpected++
          const hasValue = categoria.indicadores[i].valor.some(v => v.mes === month)
          if (!hasValue) {
            missingCount++
          }
        }
      }

      if (missingCount === 0) {
        return 'Nenhum dado faltoso'
      } else {
        return `${totalExpected} / ${missingCount}`
      }
    },

    openDialogMostraPendencia () {
      this.dialogMostraPendencia = true
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
    }
  }
}

</script>
<style>
.status-active {
  background-color: #d4edda; /* Verde claro */
}

.status-inactive {
  background-color: #f8d7da; /* Vermelho claro */
}

.texto_chip {
  font-size: 1.1em !important;
}
</style>
