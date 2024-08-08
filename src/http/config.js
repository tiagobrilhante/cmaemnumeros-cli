const urlDownload = 'http://localhost:8000/'
// const urlDownload = 'http://cmaemnumerosapi.cma.eb.mil.br/'

const baseURL = urlDownload + 'api/'

const versoes = [
  {
    id: '1.4.0',
    release: '312',
    latest: true,
    data: '08/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Grande update na interface de lançamento de dados',
      'Implementada as naturezas de dados avançada em categorias, permitindo o uso de números inteiros e de ponto flutuante',
      'Correção de bugs'
    ]
  },
  {
    id: '1.3.6',
    release: '221',
    latest: false,
    data: '06/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Corrigido o bug que exibia pendências de uma seção diferente da do usuário',
      'Melhorias na interface de pesquisa de indicadores/categorias',
      'Correção de bugs'
    ]
  },
  {
    id: '1.3.5',
    release: '213',
    latest: false,
    data: '05/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Melhorado o sistema de verificação de pendências',
      'Corrigido o bug que exibia categorias inativas nas pesquisas',
      'Ajustado o tamanho da tabela para "dense" e o tamanho do texto nas mesmas',
      'Correção de bugs'
    ]
  },
  {
    id: '1.3.4',
    release: '201',
    latest: false,
    data: '05/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Ajustado o perfil de Auditor',
      'Agora é possível verificar as pendências na tela do formulário',
      'Melhorias na tela de ferramentas administrativas',
      'Correção de bugs'
    ]
  },
  {
    id: '1.3.3',
    release: '192',
    latest: false,
    data: '02/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Implementado o sistema de Relatório de Pendências',
      'Correção de bugs'
    ]
  },
  {
    id: '1.3.2',
    release: '189',
    latest: false,
    data: '02/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Implementado o total anual',
      'Correção do bug que estourava o espaço das tabelas em dispositivos com telas pequenas',
      'Correção de bugs'
    ]
  },
  {
    id: '1.3.1',
    release: '177',
    latest: false,
    data: '01/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Iniciada a implementação do relatório de pendências',
      'Corrigido o bug que mantinha o estado do botão de colapsar/expandir categorias, ao mudar de seção (na visão em categorias)',
      'Correção de bugs'
    ]
  },
  {
    id: '1.3.0',
    release: '170',
    latest: false,
    data: '01/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Agora é possivel observar quantos dados estão faltosos na visão de categorias. (ainda não coerente com periodicidade de lançamento)',
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.9',
    release: '152',
    latest: false,
    data: '01/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Ajustado o bug que resetava um indicador quando fosse removido todo o valor do input caso existisse',
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.8',
    release: '152',
    latest: false,
    data: '01/08/2024',
    detalhesVisiveis: false,
    detalhes: [
      'corrigido o bug que gerava valores duplicados no indicador',
      'Correção de bugs'
    ]
  },
  {
    id: '1.2.7',
    release: '132',
    latest: false,
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
