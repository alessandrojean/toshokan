import dedent from 'dedent'

export default {
  app: {
    name: 'Toshokan',
    localeName: 'Português (Brasil)',
    localeFlag: 'BR',
    routes: {
      home: 'Início',
      signIn: 'Autentique-se',
      error: 'Erro crítico',
      notFound: 'Página não encontrada',
      about: {
        a11y: 'Acessibilidade',
        instructions: 'Instruções de uso',
        privacyPolicy: 'Política de Privacidade',
        termsOfUse: 'Termos de Uso'
      },
      dashboard: {
        home: 'Dashboard',
        library: 'Biblioteca',
        details: 'Detalhes',
        newBook: 'Novo livro',
        search: 'Busca',
        stats: 'Estatísticas',
        settings: 'Configurações'
      }
    }
  },
  a11y: {
    jumpToMain: 'Pular para o conteúdo principal',
    jumpToNavigation: 'Pular para a navegação principal',
    pageChanged: 'Página alterada para {pageTitle}.'
  },
  book: {
    book: 'Livro',
    volume: 'Volume #{number}',
    single: 'Volume único',
    read: 'Lido',
    unread: 'Não lido',
    currentVolume: 'Volume atual',
    emptySynopsis: 'A sinopse do livro não foi preenchida.',
    futureItem: 'Item futuro',
    properties: {
      id: 'Identificação',
      title: 'Título',
      author: 'Autor | Autores',
      authors: 'Autores',
      publisher: 'Editora',
      group: 'Grupo',
      dimensions: 'Dimensões',
      labelPrice: 'Preço de capa',
      paidPrice: 'Preço pago',
      store: 'Local da compra',
      boughtAt: 'Data de compra',
      status: 'Estado',
      readAt: 'Data de leitura',
      createdAt: 'Data de criação',
      updatedAt: 'Data de modificação',
      currency: 'Moeda',
      synopsis: 'Sinopse',
      notes: 'Observações',
      tags: 'Tags',
      language: 'Idioma'
    },
    coverSelector: {
      blankField: 'Campo não preenchido.',
      invalidUrl: 'Formato da URL inválido.',
      label: 'Imagem de capa',
      empty: {
        title: 'Nenhuma capa encontrada',
        description: 'Você pode adicionar uma personalizada abaixo.'
      },
      about: 'As imagens são obtidas da Amazon e dos sites das editoras.',
      custom: {
        title: 'Imagem personalizada',
        description: 'Você também pode adicionar uma nova imagem nas opções.',
        label: 'URL da Imagem',
        placeholder: 'Insira uma URL personalizada',
        add: 'Adicionar',
        error: 'Há um erro no formulário de imagem personalizada'
      }
    },
    form: {
      blankField: 'Campo não preenchido.',
      invalidValue: 'Valor inválido.',
      invalidNumber: 'Número inválido.',
      required: 'Obrigatório',
      optional: 'Opcional',
      markdown: 'O Markdown é suportado neste campo.',
      addNotes: 'Adicionar observações sobre este livro',
      addAuthor: 'Adicionar',
      addAuthorPlaceholder: 'Adicionar um autor…',
      removeAuthor: 'Remover este autor',
      addTag: 'Adicionar',
      addTagPlaceholder: 'Adicionar uma tag…',
      removeTag: 'Remover esta tag',
      example: {
        placeholder: 'ex. {0}',
        id: '9788583621508',
        title: 'A Nova Ilha do Tesouro',
        authors: 'Osamu Tezuka',
        publisher: 'NewPOP',
        group: 'Mangás',
        dimensions: '15 x 21',
        labelPrice: '26,90',
        paidPrice: '22,90',
        store: 'Amazon',
        synopsis: 'No meio dos pertences de seu falecido pai, o garoto Pete encontra…',
        notes: 'O mangá tem um autógrafo do Tezuka na primeira página.',
        boughtAt: '18/02/2021'
      },
      authorsHint: 'Separe os nomes utilizando o caractere de ponto-e-vírgula.',
      requiredHint: 'Os campos marcados com {0} são obrigatórios.',
      error: {
        title: 'O formulário dos metadados do livro possui {errorsCount}',
        count: 'um erro | {n} erros'
      }
    },
    deleteModal: {
      title: 'Deletar livro',
      message1: 'Você tem certeza de que deseja deletar este livro?',
      message2: 'Esta ação não pode ser revertida.',
      delete: 'Deletar',
      cancel: 'Cancelar'
    },
    createdModal: {
      title: 'Livro adicionado com sucesso',
      message: dedent`
        Os metadados do livro foram inseridos na planilha. Você pode
        visualizar a página do livro recém-criado ou repetir o processo
        de criação e adicionar mais um livro logo em sequência.
      `,
      view: 'Visualizar',
      newBook: 'Novo livro'
    }
  },
  isbn: {
    keyMissing: 'Chave de consulta inexistente.',
    searchError: 'Houve um erro durante a pesquisa.',
    invalid: 'O ISBN informado é inválido.'
  },
  sheet: {
    notFound: 'Planilha não encontrada.'
  },
  footer: {
    links: {
      a11y: 'Acessibilidade',
      instructions: 'Instruções de uso',
      privacyPolicy: 'Política de Privacidade',
      termsOfUse: 'Termos de Uso'
    },
    version: 'Toshokan v{version}',
    copyright: '© {year} Alessandro Jean. Todos os direitos reservados.',
    dev: 'Ambiente de desenvolvimento',
    lastUpdate: 'Última atualização feita em {0}.',
    donate: {
      actionDonate: 'Fazer uma doação',
      actionClose: 'Fechar',
      description: dedent`
        Se o projeto está te ajudando e você deseja fazer uma doação,
        utilize os códigos disponíveis abaixo. Agradecemos bastante
        a sua colaboração e seremos eternamente gratos.
      `
    }
  },
  pagination: {
    text: 'Página {0} de {1} de {2} resultados',
    previous: 'Anterior',
    previousPage: 'Página anterior',
    next: 'Próximo',
    nextPage: 'Próxima página',
    firstPage: 'Primeira página',
    lastPage: 'Última página',
    current: 'Página atual, ',
    goToPage: 'Ir para a página '
  },
  auth: {
    google: {
      signIn: 'Entrar',
      withGoogle: 'com Google',
      disconnectModal: {
        title: 'Desconectando de sua Conta do Google',
        message1: `
          A permissão de acesso e modificação de sua planilha da coleção
          será removida ao desconectar o Toshokan.
        `,
        message2: `
          Sua planilha da coleção não será apagada, e você ainda
          poderá acessar o arquivo em seu Google Drive.
        `,
        message3: `
          Você pode dar acesso novamente realizando um novo login.
        `,
        disconnect: 'Desconectar',
        cancel: 'Cancelar'
      }
    }
  },
  signIn: {
    title: 'Autentique-se',
    titleSr: 'para obter acesso ao Toshokan',
    subTitle: 'para obter acesso ao dashboard'
  },
  pageNotFound: {
    title: 'Página não encontrada',
    description: 'O conteúdo procurado não foi localizado.',
    goBack: 'Voltar para o início'
  },
  criticalError: {
    title: 'Erro crítico'
  },
  home: {
    leading1: 'Gerencie sua planilha da',
    leading2: 'coleção de mangás',
    shortDescription: `
      Visualize os dados e estatísticas em uma interface limpa e moderna,
      com recursos que permitem uma rápida criação de novos itens.
    `,
    features: {
      title: 'O intuito é facilitar o controle da coleção.',
      isbn: {
        title: 'Adicione novos livros por ISBN',
        description: `
          Preenchimento automático dos metadados através da
          pesquisa de ISBN-13.
        `
      },
      cover: {
        title: 'Imagens de capa automáticas',
        description: `
          Escolha dentre uma das opções encontradas ou adicione uma
          nova imagem personalizada.
        `
      },
      data: {
        title: 'Tenha controle sobre seus dados',
        description: `
          A planilha é um arquivo do Google Sheets que fica
          armazenado em seu Google Drive.
        `
      },
      openSource: {
        title: 'Site de código-aberto',
        description: `
          Qualquer um pode navegar pelo código e contribuir
          através do repositório no GitHub.
        `
      }
    },
    collection: {
      title: 'Ideal para também gerenciar a sua coleção de quadrinhos e livros',
      description: `
        Apesar do Toshokan ser inicialmente criado com a intenção
        de gerenciar mangás, a planilha é versátil para também suportar
        outras mídias impressas, como os quadrinhos e livros.

        Ao preencher a ficha catalográfica de cada item, você permite
        com que filtros possam ser utilizados na coleção para uma
        melhor organização do conteúdo cadastrado na planilha.
      `
    },
    cta: {
      title: 'Pronto para começar?',
      dashboard: 'Dashboard',
      instructions: 'Instruções de uso'
    },
    header: {
      instructions: 'Instruções de uso',
      dashboard: 'Dashboard'
    }
  },
  dashboard: {
    header: {
      links: {
        start: 'Início',
        dashboard: 'Dashboard',
        library: 'Biblioteca',
        statistics: 'Estatísticas'
      },
      search: {
        title: 'Pesquisa na coleção',
        link: 'Pesquisar na coleção',
        label: 'Pesquisar por',
        placeholder: 'Pesquisar na coleção',
        press: 'Pressione',
        ctrl: 'Ctrl',
        plus: 'mais',
        toFocus: 'para focar',
        enter: 'Enter',
        toSearch: 'para pesquisar',
        search: 'Pesquisar'
      },
      menu: {
        more: 'Mais',
        open: 'Abrir menu de usuário',
        settings: 'Configurações',
        signOut: 'Sair'
      }
    },
    details: {
      zoom: {
        view: 'Dar zoom na imagem',
        title: 'Capa do livro',
        close: 'Fechar'
      },
      header: {
        library: 'Biblioteca',
        author: 'Autor: | Autores:',
        authorListIncomplete: '{authors} e mais {number}',
        authorListComplete: '{authors} e {lastAuthor}',
        authorSeparator: ', ',
        authorLastSeparator: ' e ',
        status: 'Estado: ',
        group: 'Grupo: ',
        store: 'Loja da compra: ',
        edit: 'Editar',
        options: {
          title: 'Opções',
          amazon: 'Abrir na Amazon',
          updateCover: 'Alterar capa',
          markAs: 'Marcar como {status}',
          addToFavorites: 'Adicionar aos favoritos',
          removeFromFavorites: 'Remover dos favoritos',
          delete: 'Deletar'
        }
      },
      tabs: {
        metadata: 'Metadados do livro',
        notes: 'Observações',
        collection: 'Outros volumes'
      },
      info: {
        title: 'Informações do livro',
        dateUnknown: 'Desconhecida'
      },
      editDialog: {
        title: 'Edição do livro',
        description: 'Preencha as informações abaixo para alterar os dados do livro.'
      },
      editForm: {
        title: 'Metadados',
        description: `
          Edite as informações necessárias na planilha.
        `,
        cancel: 'Cancelar',
        finish: 'Concluir'
      },
      coverForm: {
        title: 'Imagem de capa',
        description: `
          Escolha uma imagem de capa do livro obtida automaticamente.
        `,
        cancel: 'Cancelar',
        finish: 'Concluir'
      },
      readingForm: {
        title: 'Leitura',
        description: `
          As datas de leitura são usadas para computar as estatísticas
          de livros lidos mensalmente. Defina-as de maneira precisa, se possível.
        `,
        options: {
          notReadYet: 'Ainda não li o livro',
          readToday: 'Terminei a leitura do livro hoje',
          readOtherDate: 'Terminei a leitura do livro em outra data'
        },
        fieldHelp: 'Deixe em branco caso desconheça.',
        actionClear: 'Limpar'
      },
      organizationForm: {
        title: 'Organização'
      }
    },
    home: {
      title: 'Dashboard',
      hello: 'Olá, {name}!',
      newBook: 'Novo livro',
      reload: 'Recarregar',
      viewAll: 'Visualizar todos',
      beta: {
        short: 'Serviço atualmente em beta!',
        full: `
          Este serviço está atualmente em beta,
          é possível que você encontre alguns bugs.
        `,
        close: 'Fechar'
      },
      overview: {
        title: 'Visão geral',
        item: 'um item | {n} itens',
        stats: {
          count: 'Contagem',
          read: 'Leitura',
          totalExpense: 'Gasto total',
          totalSavings: 'Economia total'
        },
        showValue: 'Mostrar o valor de {title}',
        hideValue: 'Ocultar o valor de {title}'
      },
      lastAdded: 'Últimos adicionados',
      latestReadings: 'Últimas leituras',
      groups: 'Grupos',
      empty: {
        title: 'Você ainda não possui nenhum livro',
        description: `
          Adicione pelo menos um livro para que as informações
          possam ser calculadas e disponibilizadas nesta página.
        `
      }
    },
    library: {
      title: 'Biblioteca',
      currentGroup: 'Grupo atual: ',
      allGroups: 'Todos os grupos',
      sortingBy: 'Ordenando por: ',
      filter: 'Filtrar',
      newBook: 'Novo livro',
      items: {
        current: 'Items do grupo {group}',
        tableColumns: {
          actions: 'Ações'
        },
        view: 'Visualizar'
      },
      filters: {
        title: 'Filtros',
        close: 'Fechar painel',
        closeMobile: 'Fechar',
        filter: 'Filtrar',
        visualization: 'Visualização',
        books: 'Livros',
        viewMode: {
          label: 'Modo de visualização',
          table: 'Tabela',
          grid: 'Grade'
        },
        gridMode: {
          label: 'Modo da grade',
          compact: 'Compacto',
          comfortable: 'Confortável'
        },
        group: 'Grupo',
        sortDirection: {
          label: 'Sentido',
          asc: 'Crescente',
          desc: 'Decrescente'
        },
        sortBy: 'Ordenar por',
        futureItems: {
          label: 'Itens futuros',
          indiferent: 'Indiferente',
          only: 'Somente',
          hide: 'Ocultar'
        }
      },
      empty: {
        title: 'Sua biblioteca está vazia',
        description: `
          Adicione um primeiro livro para começar a organizar
          melhor suas coleções e poder visualizar as estatísticas mensais.
        `
      }
    },
    newBook: {
      title: 'Novo livro',
      description: 'Preencha as informações abaixo para inserir o livro na planilha.',
      step: 'Etapa {0} de {1}',
      goBack: 'Voltar uma etapa',
      autoFill: {
        title: 'Busca',
        titleSr: 'a partir do ISBN',
        description: `
          Obtenha automaticamente os metadados do livro a partir de seu ISBN.
        `,
        ariaLabel: 'Pesquisa na CBL',
        label: 'ISBN para pesquisa',
        placeholder: 'Pesquisar por ISBN',
        press: 'Pressione',
        enter: 'Enter',
        toSearch: 'para pesquisar',
        searchPowered: 'Mecanismo de pesquisa por {0}{1}',
        cbl: 'CBL',
        search: 'Pesquisar',
        error: 'Houve um erro durante a pesquisa',
        noResults: 'Nenhum resultado encontrado.',
        fillManually: 'Preencher manualmente',
        editInfo: 'Editar informações',
        isbnAlert: {
          title: 'O que é o ISBN?',
          body: dedent`
            O ISBN é um sistema internacional de identificação de livros
            que atribui um identificador numérico único para cada item,
            permitindo a classificação por título, autores, país, editora
            e edição.

            Este código pode ser normalmente encontrado na página de expediente
            do livro, junto a ficha catalográfica, ou próximo ao código de
            barras. A busca aceita ambas as versões do código, a com 10
            dígitos e a com 13 dígitos, sendo esta última a mais utilizada
            recentemente.

            Caso o livro não possua um ISBN, você pode preencher as informações
            para a criação do item na planilha de modo manual.

            *[ISBN]: International Standard Book Number
          `,
          additionalInfo: 'Informações adicionais',
          wikipediaLink: 'https://pt.wikipedia.org/wiki/International_Standard_Book_Number'
        },
        existAlert: {
          title: 'Já existe um livro com este ISBN',
          body: 'Você pode optar por criar uma cópia se for de seu interesse.',
          actionView: 'Visualizar',
          actionMakeCopy: 'Criar uma cópia'
        }
      },
      metadata: {
        title: 'Informações',
        description: `
          Metadados que serão cadastrados na planilha.
        `,
        review: 'Revisar',
        findCover: 'Procurar capa'
      },
      cover: {
        title: 'Imagem de capa',
        description: `
          Escolha a imagem de capa do livro ou pule direto para a revisão.
        `,
        review: 'Revisar'
      },
      review: {
        title: 'Revisão',
        description: `
          Revise as informações antes de concluir o procedimento.
        `,
        dateUnknown: 'Desconhecida',
        finish: 'Concluir'
      }
    },
    search: {
      close: 'Fechar',
      title: 'Pesquisa',
      label: 'Pesquisar por',
      searchBy: 'Pesquisar por "{0}"',
      placeholder: 'O quê você deseja buscar?',
      results: 'Resultados',
      history: 'Histórico',
      removeFromHistory: 'Remover esta busca do histórico',
      noHistory: 'Sem buscas recentes.',
      resultCount: 'Um resultado encontrado | {count} resultados encontrados',
      noResultsFound: 'Nenhum resultado encontrado para "{0}".',
      searching: 'Pesquisando',
      clear: 'Limpar',
      keywords: {
        id: 'id',
        code: 'código',
        title: 'título',
        group: 'grupo',
        author: 'autor',
        publisher: 'editora',
        store: 'loja',
        notes: 'observações',
        tags: 'tag',
        boughtAt: 'comprado-em',
        boughtBefore: 'comprado-antes-de',
        boughtAfter: 'comprado-depois-de',
        readAt: 'lido-em',
        readBefore: 'lido-antes-de',
        readAfter: 'lido-depois-de',
        createdAt: 'criado-em',
        createdBefore: 'criado-antes-de',
        createdAfter: 'criado-depois-de',
        updatedAt: 'atualizado-em',
        updatedBefore: 'atualizado-antes-de',
        updatedAfter: 'atualizado-depois-de'
      }
    },
    settings: {
      title: 'Configurações',
      save: 'Salvar',
      appearence: {
        title: 'Aparência',
        description: 'Atualize suas configurações de aparência.',
        locale: {
          label: 'Idioma da aplicação',
          description: `
            O local também será utilizado para a formatação de números e datas.
          `
        },
        theme: {
          label: 'Tema',
          description: 'Defina o tema atual da aplicação.',
          system: 'Sistema',
          light: 'Claro',
          dark: 'Escuro'
        },
        viewMode: {
          label: 'Modo de visualização',
          description: `
            Define o layout utilizado para exibir os itens da biblioteca.
          `
        },
        gridMode: {
          label: 'Modo da grade',
          description: `
            Defina o layout do card utilizado para exibir os livros no modo de grade.
          `
        },
        spoilerModeSynopsis: {
          label: 'Ocultar as sinopses de livros não lidos',
          description: `
            Se ativado, as sinopses serão desfocadas para prevenir spoilers.
          `
        },
        spoilerModeCover: {
          label: 'Ocultar as capas de livros não lidos',
          description: `
            Se ativado, as capas serão desfocadas para prevenir spoilers.
          `
        }
      },
      privacy: {
        title: 'Privacidade',
        description: 'Atualize suas configurações de privacidade.',
        removeAccess: {
          label: 'Remover a permissão de acesso',
          description: `
            Remove a permissão de acesso do Toshokan de sua Conta do Google.
          `,
          remove: 'Remover acesso'
        }
      }
    },
    stats: {
      title: 'Estatísticas',
      moreSoon: 'Mais estatísticas em breve.',
      empty: {
        title: 'Você ainda não possui nenhum livro',
        description: `
          Adicione pelo menos um livro para que possamos começar a
          realizar os cálculos das estatísticas de sua biblioteca.
        `,
        action: 'New book'
      },
      tooEarly: {
        title: 'Ainda é cedo para exibir as estatísticas',
        description: `
          As estatísticas serão exibidas após o cadastro de pelo menos
          dois meses de compras de livros na biblioteca.
        `
      },
      booksBoughtAndRead: {
        title: 'Livros comprados e lidos por mês',
        bought: 'Livros comprados',
        read: 'Livros lidos'
      },
      publishersRankTitle: 'Rank de editoras',
      authorsRankTitle: 'Rank de autores',
      seriesRankTitle: 'Rank de séries',
      bookQuantity: 'Quantidade de livros',
      monthlyExpense: 'Gasto mensal'
    },
    sheetChooser: {
      title: 'Escolha uma planilha',
      description: 'Você pode visualizar e editar outras planilhas compartilhadas.',
      actionCancel: 'Cancelar',
      actionSelect: 'Selecionar',
      actionSelectSheet: 'Escolher planilha',
      owner: 'Proprietário',
      you: 'Você',
      lastModified: 'Última modificação',
      sharedWithYou: 'Compartilhada com você',
      readOnly: 'Somente leitura',
      readAndEdit: 'Leitura e edição',
      starred: 'Com estrela',
      label: 'Planilha',
      libraryOf: 'Biblioteca de',
      viewing: 'Visualizando a biblioteca de {0}'
    }
  },
  about: {
    a11y: {
      title: 'Acessibilidade',
      body: dedent`
        Este site possui alguns recursos de acessibilidade.

        ## Pular para o conteúdo

        Todas as páginas possuem um link interno para pular para
        o conteúdo principal. Ele pode ser utilizado por usuários
        que naveguem utilizando somente o teclado ou através de um
        leitor de tela para ir direto para a parte principal da página.

        ## Pular para a navegação

        Em páginas como o Dashboard, você também encontrará um link
        interno para pular diretamente para a navegação principal.

        ## Menus

        Os menus utilizados da biblioteca Headless UI seguem as recomendações
        dos padrões da WAI-ARIA. Os comandos com teclado podem ser consultados
        na [documentação do componente]({headlessUiLink}).


        ## Navegação

        O site possui carregamento dinâmico dos conteúdos. Quando
        a rota é alterada, o leitor de tela é informado através de uma
        modificação em um elemento de controle.

        ## Animações

        O site respeita a configuração no sistema operacional, se disponível,
        para desabilitar animações não-essenciais. Você pode encontrar
        esta configuração na seção de Acessibilidade de seu computador
        e/ou dispositivo.

        ## Problemas de acesso

        Caso encontre algum problema com o acesso ou alguma implementação
        feita de maneira incorreta, por favor, abra uma Issue no repositório
        no GitHub.
      `
    },
    instructions: {
      title: 'Instruções de uso',
      body: dedent`
        O Toshokan é um utilitário com o objetivo de prover uma interface
        de usuário amigável para um melhor gerenciamento de sua planilha
        de coleção de mangás, quadrinhos, livros e impressos em geral.

        A planilha, por sua vez, deve seguir um *template* bem estrito,
        que deve ser copiado para sua conta do Google Drive para que a aplicação
        possa ter acesso.

        A aplicação somente lê e altera as informações na planilha,
        assim você ainda tem controle total sobre seus dados da coleção e
        poderá manipulá-los facilmente caso queira exportá-los ou utilizá-los
        em outro serviço, por exemplo.

        ## Antes de começar

        Na primeira utilização, você deve realizar o procedimento de criação
        do arquivo da planilha que conterá suas informações da coleção.

        - Autentique-se com sua conta no site do [Google Drive]({googleDriveLink}).
        - Acesse [esta planilha]({templateSheetLink}) e faça uma
          cópia em <span class="command">Arquivo → Fazer uma cópia</span>.
        - **Não renomeie o arquivo**, o nome deve ser mantido como **Toshokan**.

        Nas próximas vezes, a planilha copiada será escolhida automaticamente.

        ## Autenticando-se no Toshokan

        Tendo copiado a planilha para seu Google Drive, você já pode começar
        a gerenciar sua coleção no Toshokan, autenticando-se com sua
        Conta do Google.

        - Acesse a página inicial e clique em
          <span class="command">Entrar com Google</span>.
        - Permita o acesso do Toshokan às informações requisitadas em sua conta.

        Nas próximas vezes, você não precisará conceder a permissão novamente.

        ### Sobre o uso de suas informações pessoais

        O Toshokan é uma aplicação de código-aberto, estática e totalmente
        renderizada no lado do navegador, isto é, não possuímos um servidor
        próprio para armazenar seus dados e nem nos comunicamos com
        serviços externos para repassar seus dados.

        Você pode remover a permissão de acesso
        do utilitário a suas planilhas e arquivos do Google Drive
        a qualquer momento em suas configurações da Conta do Google.

        Você pode ler mais sobre em nossa Política de Privacidade.

        ## Criando o primeiro livro

        Ao entrar pela primeira vez, por conta da planilha estar vazia,
        você será informado e convidado a criar o primeiro livro através
        do utilitário.

        Caso a pesquisa por ISBN esteja habilitada, você poderá realizar
        a pesquisa e obter um formulário pré-preenchido com os metadados
        do livro na próxima etapa, isso se o código é válido e um livro
        com tal código existe no banco de dados do provedor.

        {figure1}

        O ISBN para a pesquisa pode ser digitado com ou sem os hífens,
        e a pesquisa também funciona para livros mais antigos que utilizem
        o ISBN de 10 dígitos. Entretanto, a pesquisa só irá retornar
        resultados de livros publicados no território nacional, ou seja,
        livros em que o código começa com **978-85** ou **978-65**.

        Caso a pesquisa não retorne nenhum resultado ou o livro não
        possui um ISBN brasileiro, você poderá optar por
        **Preencher manualmente**.

        {figure2}

        As informações do livro no provedor de pesquisa não necessariamente
        estão corretas e/ou seguem um padrão, portanto na maioria das vezes
        você precisará realizar pequenos ajustes nos metadados. Na imagem acima,
        o mangá teve seu título e autor cadastrado com caixa alta, e precisa
        ser arrumado.

        ### Os metadados do livro

        Abaixo você encontra uma explicação sucinta de cada metadado.

        Identificação
        : Geralmente o ISBN do livro, mas outros códigos únicos como
          o ISSN ou EAN podem ser utilizados em sua ausência.
          Em publicações independentes, o valor **N/A**
          (não se aplica) pode ser utilizado.

        Título
        : Nome oficial do livro. Em casos de publicações seriadas, isto
          é, com mais de um volume, pode-se utilizar o caractere
          **#** (cerquilha) seguido do número.

          **Exemplo:** Lobo Solitário #05: O Segredo do Vento Sul

        Autores
        : Pessoas envolvidas na criação do livro, tais como escritores,
          roteiristas, desenhistas, letristas etc. Em caso de múltiplas pessoas,
          você deve separar os nomes pelo caractere de
          **ponto-e-vírgula**.

          **Exemplo:** Kazuo Koike; Goseki Kojima

        Editora
        : Editora que lançou a edição nacional do livro. Algumas vezes
          o valor retornado pelo provedor é incorreto e o utilitário realizará
          a correção, mas pode ser que você ainda precise modificar manualmente.

        Grupo
        : Grupo que este livro possui em comum com outros em sua coleção.
          Apesar de idealmente o recomendado ser utilizar o tipo de publicação
          (tal como "livros", "quadrinhos" ou "mangás"), você também pode, se
          desejar, utilizar o nome da obra em casos com vários volumes.

          Você deve preencher esta informação manualmente sempre.

        Dimensões
        : Relação de largura e altura, em centímetros. Você deve utilizar
          o caractere **x** para separar os valores, que
          podem ter no máximo um dígito na casa decimal.

        Preço de capa
        : Preço cheio do livro. Você pode utilizar até dois dígitos
          para as casas decimais.

          Em caso de livros importados, você poderá trocar a moeda
          na caixa de seleção ao lado, escolhendo pelo código equivalente
          no [ISO 4217]({iso4217link}).

        Preço pago
        : Preço promocional pago na compra. Quando não se aplicar,
          você deve preencher com o valor do preço de capa.
          Você também pode trocar a moeda utilizada.

        Loja
        : Local onde a compra do livro foi realizada. Você pode preencher
          com o valor **Desconhecido** quando não se recordar
          ou quando não quiser preencher.

        Data de entrada
        : Data quando o item entrou na sua coleção. É utilizado para
          gerar as estatísticas de gastos mensais. Caso você não recorde
          ou não possua mais esta informação, você pode deixar o valor
          do campo em branco apagando o dia, mês e ano.

        {figure3}

        ### Imagem de capa

        Após preencher os metadados do livro, você poderá escolher uma
        imagem de capa obtida automaticamente da Amazon ou do site da editora,
        ou providenciar uma URL válida para uma imagem personalizada.

        Caso você queira deixar o sem imagem, basta não selecionar
        nenhuma das opções.

        {figure4}

        ### Revisão das informações

        Com os metadados preenchidos e a imagem de capa escolhida,
        você pode realizar uma última revisão das informações antes
        de concluir o procedimento e adicionar o novo livro na planilha.

        {figure5}

        Caso todas as informações estejam corretas, você deve
        clicar em <span class="command">Concluir</span>.

        {figure6}

        Com isso, o livro será adicionado na planilha e você poderá em
        seguida optar por <span class="command">Visualizar</span>,
        caso queira ir direto para a página com as informações,
        ou <span class="command">Novo livro</span> caso queira
        adicionar um em sequência.

        {figure7}

        Agora o livro está salvo na planilha e você já pode continuar
        o procedimento ao inserir novos ou explorar sua biblioteca
        através do item <span class="command">Biblioteca</span>
        na navegação principal.
      `,
      legend1: 'Primeira etapa: pesquisa por ISBN.',
      legend2: 'Segunda etapa: preenchimento dos metadados do livro.',
      legend3: 'Metadados do livro preenchidos corretamente.',
      legend4: 'Terceira etapa: escolha da imagem de capa.',
      legend5: 'Quarta etapa: revisão das informações.',
      legend6: 'Diálogo de confirmação de criação.',
      legend7: 'Página das informações do livro.'
    },
    privacyPolicy: {
      title: 'Política de Privacidade',
      body: dedent`
        A política de privacidade aplica-se a todas as páginas deste site.

        ## Informações coletadas

        O Toshokan precisa receber algumas informações pessoais de sua
        Conta do Google para que o utilitário possa funcionar corretamente.

        Todas as informações recebidas são tratadas no navegador e não
        são armazenadas e nem retransmitidas para algum serviço externo.
        Além disso, o site é de código-aberto, ou seja, qualquer um pode
        inspecionar o código e apontar quaisquer problemas no repositório
        no GitHub.

        ### Informações que você fornece

        Estas informações são obtidas quando você concede permissão
        para que o Toshokan acesse a planilha da coleção.

        - **Suas informações pessoais**. Utilizamos seu
          nome, e-mail e foto de perfil de sua conta do Google para
          personalizar a interface de usuário. O sistema de autenticação
          do Google fornece estas informações por padrão e não é possível
          optar por não recebê-las.
        - **Seus arquivos do Google Drive**. Requisitamos
          um escopo de somente-leitura de informações dos seus arquivos
          no Google Drive para que possamos encontrar o ID da planilha
          da coleção. Não temos acesso aos conteúdos dos arquivos, com
          exceção da planilha em si.
        - **Suas planilhas no Google Sheets**. Precisamos
          de acesso de leitura e escrita em suas planilhas para poder
          obter os dados e gravar novas informações da coleção. Somente
          os dados desta planilha da coleção são lidos e modificados.

        Você pode remover completamente a permissão de acesso do Toshokan
        a sua Conta do Google seguindo as instruções
        [neste artigo]({googleHelpLink}) da Central de Ajuda do Google.
        Após remover a permissão de acesso, não teremos mais acesso a
        seus dados.

        ### Como utilizamos as informações

        Não armazenamos suas informações em nenhum servidor do site.
        O Toshokan é somente um site com conteúdo estático. As informações
        recebidas de sua Conta do Google são armazenadas temporariamente
        na memória durante a utilização do site. Quando você realiza
        o logoff ou fecha o site, as informações são automaticamente
        deletadas. Elas só serão requisitadas novamente ao sistema de
        autenticação do Google na próxima vez que você utilizar o site
        e de fato se autenticar.

        ## Compartilhamento de dados com terceiros

        Não realizamos o compartilhamento de nenhuma informação ou dado
        pessoal de sua Conta do Google, bem como o conteúdo de suas planilhas
        e dos arquivos de seu Google Drive com terceiros. Tal fato pode ser
        comprovado através de uma inspeção do código-fonte do site no
        repositório público no GitHub.

        Por ser um site de código-aberto, qualquer um pode clonar o código
        em sua totalidade ou criar uma ramificação, modificar, compilar
        e hospedar em seu próprio servidor. Não temos controle e nem
        responsabilidade sobre outras instâncias ou ramificações do
        Toshokan que não sejam esta neste site ({demoBuildLink}).
        Pedimos que sempre se atente se está acessando do site de
        demonstração ou de sua própria versão local, como recomendado
        nas instruções do arquivo README.md do repositório.

        Apesar de não compartilharmos nenhum dado pessoal seu com terceiros,
        nos reservamos ao direito de incluir futuramente links de compra
        de produtos que participem do produto de afiliados de algumas lojas.
        Estes links não incluem nenhuma informação pessoal, mas os sites das
        lojas podem possuir algum mecanismo de monitoramento e identificação
        única, as quais não temos responsabilidade e nem controle. Você pode
        obter mais informações em relação a esta prática nos Termos de Uso e
        Política de Privacidade das lojas.

        ## Atualizações em nossa Política de Privacidade

        Podemos alterar ou atualizar nossa Política de Privacidade.
        Iremos informá-lo sobre alterações a esta Política de Privacidade,
        se apropriado, e atualizar a data de "Última atualização" na
        parte inferior desta página. Por favor, verifique nossa Política
        de Privacidade periodicamente.

        ## Lei Geral de Proteção de Dados Pessoais (LGPD)

        Esta seção se aplica ao processamento de dados pessoais dentro
        da lei brasileira e complementa a nossa Política de Privacidade.

        Dentro da Lei Geral de Proteção de Dados Pessoais, você tem
        o direito de acessar, retificar, possuir, deletar, e confirmar
        que processamos seus dados. Em certas circunstâncias, você também
        tem o direito de se opor e restringir o processamento de
        seus dados pessoais. Esta página fornece informações nas seções
        anteriores sobre como processamos e utilizamos seus dados.

        Você pode remover completamente a permissão de acesso do Toshokan
        a sua Conta do Google seguindo as instruções
        [neste artigo]({googleHelpLink}) da Central de Ajuda do Google.
        Após remover a permissão de acesso, não teremos mais acesso a
        seus dados.

        Informações sobre como o Google se responsabiliza com seus dados
        segundo a LGPD podem ser obtidas [neste artigo]({googleLgpdLink})
        da Central de Ajuda do Google.

        O conteúdo completo da Lei Nº 13.709,
        de 14 de Agosto de 2018, pode ser acessado através
        [desta página]({lgpdLawLink}) no site do Planalto Federal.
      `
    },
    termsOfUse: {
      title: 'Termos de Uso',
      body: dedent`
        Esta página lista os termos de uso do site Toshokan.

        **Por favor, leia cuidadosamente estes termos, pois ao acessar ou usar
        qualquer parte deste site, você automaticamente concorda com eles.
        Se não concordar com os termos, você não poderá acessar o site
        ou usar quaisquer de seus serviços.**

        Reservamos o direito de alterar esses termos a qualquer momento.
        É sua responsabilidade verificar as alterações feitas nesta página
        periodicamente. Seu acesso ao site após a publicação de quaisquer
        alterações constitui aceitação de tais alterações. Você pode revisar
        a versão mais atual dos termos a qualquer momento nesta página.

        ## Comunicação eletrônica

        Você entende que o seu conteúdo pode ser transferido sem criptografia
        e pode: **(a)** ser transmitido por várias redes; e
        **(b)** sofrer alterações para se adaptar e se adequar
        às exigências técnicas de conexão de redes ou dispositivos. As
        informações de autenticação sempre são criptografadas durante
        a transferência entre redes.

        ## Serviços de Terceiros

        Utilizamos o [Serviço de Autenticação do Google]({googleSignInLink}),
        bem como o Google Drive e Google Sheets. Ao utilizar este site e se
        autenticar através da sua Conta do Google, você concorda
        com os [Termos de Serviço]({googleTermsLink}) e a
        [Política de Privacidade]({googlePrivacyPolicyLink}) do Google.

        ## Política de Privacidade

        Ao utilizar este site, você concorda com nossa Política de Privacidade.
      `
    }
  }
}
