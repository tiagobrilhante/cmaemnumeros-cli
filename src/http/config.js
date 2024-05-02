const urlDownload = 'http://localhost:8000/'
// const urlDownload = 'http://totemapi2.cma.eb.mil.br/'
// const urlDownload = 'http://totemapi.12rm.eb.mil.br/'

const baseURL = urlDownload + 'api/'

const versoes = [
  {
    id: '2.8',
    release: '201',
    latest: true,
    data: '02/05/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Todo o conteúdo do totem pode ser disponibilizado em 3 idiomas (pt_br, en, es)',
      'Correção de bugs'
    ]
  },
  {
    id: '2.7',
    release: '195',
    latest: false,
    data: '26/04/2024',
    detalhesVisiveis: false,
    detalhes: [
      'revisão de código da API',
      'melhorias nos validadores de formulários',
      'Correção de bugs'
    ]
  },
  {
    id: '2.6',
    release: '191',
    latest: false,
    data: '24/04/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Melhoria no design gráfico da seleção de idiomas',
      'Correção de bugs'
    ]
  },
  {
    id: '2.5',
    release: '182',
    latest: false,
    data: '23/04/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Possibilidade de acesso do conteúdo na lingua Inglesa (EUA)',
      'Realocação do acesso da área administrativa no footer.',
      'Correção de bugs'
    ]
  },
  {
    id: '2.4',
    release: '170',
    latest: false,
    data: '19/02/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Correção de bugs',
      'Saneamento de código'
    ]
  },
  {
    id: '2.3',
    release: '155',
    latest: false,
    data: '19/02/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Foi ajustada a interface de quiz para totem de datas históricas.',
      'Melhoria no sistema de informações sobre versões.',
      'Correção de bugs',
      'Saneamento de código'
    ]
  },
  {
    id: '2.2',
    release: '123',
    latest: false,
    data: '17/01/2024',
    detalhesVisiveis: false,
    detalhes: [
      'Agora é possível gerar backup de todo o conteúdo do Totem (Banco de Dados e arquivos)',
      'Foi remodelado o detalhamento de versões no footer',
      'Correção de bugs',
      'Saneamento de código'
    ]
  },
  {
    id: '2.1',
    release: '110',
    latest: false,
    data: '20/12/2023',
    detalhesVisiveis: false,
    detalhes: [
      'Liberado o acesso ao histórico de alterações',
      'Liberado o acesso para a área de estatísticas',
      'Correção de bugs',
      'Refatoração dos componentes, permitindo maior legibilidade para desenvolvedores',
      'Melhoria da interface gráfica',
      'Implementado o menu administrativo separado do conteúdo da landpage',
      'Agora o administrador pode alterar a própria senha'
    ]
  },
  {
    id: '2.0',
    release: '071',
    latest: false,
    data: '18/12/2023',
    detalhesVisiveis: false,
    detalhes: [
      'Agora é possível listar as fontes de imagens presentes em assuntos.',
      'Correção de bugs',
      'Refatoração dos componentes, permitindo maior legibilidade para desenvolvedores',
      'Melhoria da interface gráfica'
    ]
  },
  {
    id: '1.2',
    release: '043',
    latest: false,
    data: '11/12/2023',
    detalhesVisiveis: false,
    detalhes: [
      'Foi ajustado o tamanho do título de um evento.',
      'Correção de bugs',
      'Saneamento de código',
      'Melhoria da interface gráfica'
    ]
  },
  {
    id: '1.1',
    release: '035',
    latest: false,
    data: '28/11/2023',
    detalhesVisiveis: false,
    detalhes: [
      'Agora é possivel editar o texto de Legenda e Saiba Mias com um editor RTF.',
      'Agora o dialog de consumo de informação começa com a letra maior',
      'O alinhamento das imagens está posicionado no topo dos dialog de exibição',
      'Correção de bugs',
      'Melhoria da interface gráfica'
    ]
  },
  {
    id: '1.0',
    release: '022',
    latest: false,
    data: '01/11/2023',
    detalhesVisiveis: false,
    detalhes: [
      'É disponibilizado ao público em 01 de novembro de 2023.'
    ]
  },
  {
    id: '1.0 A',
    release: '001 (alpha)',
    latest: false,
    data: '24/07/2023',
    detalhesVisiveis: false,
    detalhes: [
      'É iniciado o processo de desenvolvimento do EBTotem em 24 de julho de 2023',
      'Utiliza Vue no front e Lumen no back'
    ]
  }
]

const nomeSis = 'EBTotem'
const versaoSis = versoes[0].id
const labelSis = 'Sistema de Totens'
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
