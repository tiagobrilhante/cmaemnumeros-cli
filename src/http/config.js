const urlDownload = 'http://localhost:8000/'
// const urlDownload = 'http://cmaemnumerosapi.cma.eb.mil.br/'

const baseURL = urlDownload + 'api/'

const versoes = [
  {
    id: '1.0.2',
    release: '032',
    latest: true,
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
