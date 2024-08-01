const urlDownload = 'http://localhost:8000/'
// const urlDownload = 'http://cmaemnumerosapi.cma.eb.mil.br/'

const baseURL = urlDownload + 'api/'

const versoes = [
  {
    id: '1.2.7',
    release: '132',
    latest: true,
    data: '01/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Melhorias na interface de visualização do usuário',
      'Agora é possível gerar gráficos em pizza do total acumulado no ano',
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.6',
    release: '107',
    latest: false,
    data: '31/07/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Agora é possível desativar categorias de indicadores',
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.5',
    release: '105',
    latest: false,
    data: '30/07/2024',
    detalhesVisiveis: false,
    detalhes: [
      'ajustada a visualização de tabelas de indicadores',
      'É possivel verificar informações de indicadores e categorias em tempo real',
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.4',
    release: '105',
    latest: false,
    data: '30/07/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Corrigido o erro onde um valor de indicador não era exibido na coluna correta, na visualização por categorias',
      'Implementado o sistema avançado de categorias',
      'Implementado o sistema de cálculo de total de indicadores',
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.3',
    release: '097',
    latest: false,
    data: '29/07/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.2',
    release: '095',
    latest: false,
    data: '29/07/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Melhorias na interface de administração',
      'Agora é possível gerar gráficos por mês',
      'Corrigido problemas relativos ao CORS',
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.1',
    release: '083',
    latest: false,
    data: '26/07/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Melhorias na interface de administração',
      'Implementado o sistema de verificação de integridade do banco (para administrador)',
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.0',
    release: '074',
    latest: false,
    data: '25/07/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Melhorias na interface de administração',
      'Finalizado o sistema de pesquisa de indicadores',
      'Correção de bugs'
    ]
  },
  {
    id: '1.1',
    release: '065',
    latest: false,
    data: '25/07/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Melhorias na interface de administração',
      'Evolução do formulário de cadastro',
      'Agora o usuário tem a tela bloqueada ao gravar valores, até que seja processado de forma correta',
      'Foi implementada a tela de visualização geral e visualização por categoria',
      'Foi implementada a visão em gráficos de categorias',
      'Iniciado o sistema de pesquisa de indicadores',
      'Correção de bugs'
    ]
  },
  {
    id: '1.0.2',
    release: '032',
    latest: false,
    data: '19/06/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Melhorias na interface de administração',
      'Correção de bugs'
    ]
  },
  {
    id: '1.0.1',
    release: '025',
    latest: false,
    data: '08/06/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Implementada a tela de resumo de informações do ano',
      'Correção de bugs'
    ]
  },
  {
    id: '1.0 A',
    release: '001 (alpha)',
    latest: false,
    data: '02/05/2024',
    detalhesVisiveis: false,
    detalhes: [
      'É iniciado o processo de desenvolvimento do Sistema CMA em Números em 02 de Maio de 2024',
      'Utiliza Vue no front e Lumen no back'
    ]
  }
]

const nomeSis = 'CMA em Números'
const versaoSis = versoes[0].id
const labelSis = 'Sistema de Gerenciamento de Indicadores do CMA'
const criador = 'TC Brilhante'
// info geral
const revisarForm = 'Revise os campos do formulário.'

export default {
  urlDownload,
  baseURL,
  nomeSis,
  versaoSis,
  labelSis,
  criador,
  // info geral
  revisarForm,
  // versoes
  versoes
}
