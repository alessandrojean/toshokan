import dedent from 'dedent'

export default {
  app: {
    name: 'Toshokan',
    localeName: 'English (US)',
    localeFlag: 'US',
    routes: {
      home: 'Home',
      signIn: 'Sign in',
      error: 'Critical error',
      notFound: 'Page not found',
      about: {
        a11y: 'Accessibility',
        instructions: 'Instructions',
        privacyPolicy: 'Privacy Policy',
        termsOfUse: 'Terms of Use'
      },
      dashboard: {
        home: 'Dashboard',
        library: 'Library',
        details: 'Details',
        newBook: 'New book',
        search: 'Search',
        stats: 'Statistics',
        settings: 'Settings'
      }
    }
  },
  a11y: {
    jumpToMain: 'Jump to main content',
    jumpToNavigation: 'Jump to main navigation',
    pageChanged: 'Navigated to {pageTitle}.'
  },
  errors: {
    cookiesDisabled: 'The cookies are disabled. Enable them and refresh the page.',
    authStartedFailed: 'It was not possible to start the authentication system.',
    missingScopes: 'Some permissions were not granted to the app.',
    badQuery: 'There is a error in the query: {error}',
    refresh: 'Refresh the page',
    grantPermissions: 'Grant the permissions',
    unexpected: 'An unexpected error happened in the application.'
  },
  pwa: {
    newContent: {
      title: 'New content available',
      message: dedent`
        The app has a new version available anhd the page will
        be refreshed when you click in Reload.
      `,
      update: 'Reload',
      close: 'Close'
    }
  },
  book: {
    book: 'Book',
    volume: 'Volume #{number}',
    single: 'Single volume',
    read: 'Read',
    unread: 'Unread',
    currentVolume: 'Current',
    emptySynopsis: 'The book synopsis is empty.',
    future: 'Future',
    properties: {
      id: 'ID',
      title: 'Title',
      author: 'Author | Authors',
      authors: 'Authors',
      publisher: 'Publisher',
      group: 'Group',
      dimensions: 'Size',
      width: 'Width',
      height: 'Height',
      labelPrice: 'Label price',
      labelPriceCurrency: 'Label price currency',
      paidPrice: 'Paid price',
      paidPriceCurrency: 'Paid price currency',
      store: 'Store',
      boughtAt: 'Bought at',
      status: 'Status',
      readAt: 'Read at',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      currency: 'Currency',
      synopsis: 'Synopsis',
      notes: 'Notes',
      tags: 'Tags',
      language: 'Language'
    },
    coverSelector: {
      blankField: 'Field is required.',
      invalidUrl: 'Invalid URL.',
      label: 'Cover image',
      empty: {
        title: 'No covers found',
        description: 'You can add a custom one below.'
      },
      about: 'The images are obtained from Amazon and the publishers\' websites.',
      custom: {
        title: 'Custom image',
        description: 'You can also add a new image to the options.',
        label: 'Image URL',
        placeholder: 'Insert a custom URL',
        add: 'Add',
        error: 'There\'s an error in the custom image formulary'
      }
    },
    form: {
      blankField: 'Field is required.',
      invalidValue: 'Invalid value.',
      invalidNumber: 'Invalid number.',
      required: 'Required',
      optional: 'Optional',
      markdown: 'This field supports Markdown.',
      notInCollection: 'This book is not on the collection yet',
      addNotes: 'Add notes about this book',
      addAuthor: 'Add',
      addAuthorPlaceholder: 'Add an author…',
      removeAuthor: 'Remove this author',
      addTag: 'Add',
      addTagPlaceholder: 'Add a tag…',
      removeTag: 'Remove this tag',
      example: {
        placeholder: 'eg. {0}',
        id: '9781934287729',
        title: 'MW',
        authors: 'Osamu Tezuka',
        publisher: 'Vertical',
        group: 'Manga',
        dimensions: '16.5 x 20.9',
        labelPrice: '19.95',
        paidPrice: '15.95',
        store: 'Amazon',
        synopsis: 'A secret U.S. chemical weapon called "MW" accidentally leaks…',
        notes: 'The manga have a Tezuka autograph in the first page.',
        boughtAt: '02/18/2021'
      },
      authorsHint: 'Separate the names with the semicolon character.',
      requiredHint: 'Fields marked with {0} are required.',
      error: {
        title: 'The book metadata formulary has {errorsCount}',
        count: 'one error | {n} errors'
      }
    },
    deleteModal: {
      title: 'Delete the book',
      message1: 'Are you sure you want to delete this book?',
      message2: 'This action can\'t be undone.',
      delete: 'Delete',
      cancel: 'Cancel'
    },
    createdModal: {
      title: 'Book created with success',
      message: dedent`
        The book metadata was inserted in the sheet. You can view the
        page of the book created or repeat the creation process and add
        another book to the sheet.
      `,
      view: 'View',
      newBook: 'New book'
    }
  },
  isbn: {
    keyMissing: 'Authorization key missing.',
    searchError: 'There was an error during the search.',
    invalid: 'The informed ISBN is invalid.'
  },
  sheet: {
    notFound: 'Sheet not found.'
  },
  footer: {
    links: {
      a11y: 'Accessibility',
      instructions: 'Instructions',
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use'
    },
    version: 'Toshokan v{version}',
    copyright: '© {year} Alessandro Jean. All rights reserved.',
    dev: 'Development environment',
    lastUpdate: 'Latest update in {0}.',
    donate: {
      actionDonate: 'Make a donation',
      actionClose: 'Close',
      description: dedent`
        If the project is helping you and you want to make a donation,
        use the codes available below. We really appreciate it and we
        will be eternally grateful.
      `
    }
  },
  pagination: {
    text: 'Page {0} of {1} with {2} items',
    previous: 'Previous',
    previousPage: 'Previous page',
    next: 'Next',
    nextPage: 'Next page',
    firstPage: 'First page',
    lastPage: 'Last page',
    current: 'Current page, ',
    goToPage: 'Go to page '
  },
  auth: {
    google: {
      signIn: 'Sign in',
      withGoogle: 'with Google',
      disconnectModal: {
        title: 'Disconnecting from your Google Account',
        message1: `
          Disconnecting Toshokan will revoke its permission to access
          and modify your collection spreadsheet file.
        `,
        message2: `
          Your collection spreadsheet will not be erased,
          and you still can have access to the file in your Google Drive.
        `,
        message3: `
          You can grant the permissions again by signing in.
        `,
        disconnect: 'Disconnect',
        cancel: 'Cancel'
      }
    }
  },
  signIn: {
    title: 'Please sign in',
    titleSr: 'to use Toshokan',
    subTitle: 'to be redirected to the dashboard'
  },
  pageNotFound: {
    title: 'Page not found',
    description: 'The content you\'re looking for coudn\'t be found.',
    goBack: 'Go back to home',
    goBackDashboard: 'Go back to dashboard'
  },
  criticalError: {
    title: 'Critical error'
  },
  home: {
    leading1: 'Manage the sheet of your',
    leading2: ' {0} collection',
    types: {
      mangas: 'manga',
      manhwas: 'manhwa',
      manhuas: 'manhua',
      comics: 'comic book',
      books: 'book'
    },
    shortDescription: `
      Visualize the data and statistics in a clean and modern UI,
      with features that allows a quick creation of new items.
    `,
    features: {
      title: 'A more easy collection management.',
      isbn: {
        title: 'Add new books by their ISBN',
        description: `
          Autofill the book metadata by ISBN-13 search.
        `
      },
      cover: {
        title: 'Automatic cover images',
        description: `
          Choose between the options found or add a custom image.
        `
      },
      data: {
        title: 'Control over your data',
        description: `
          The sheet is a Google Spreadsheets file that is stored
          at your Google Drive.
        `
      },
      openSource: {
        title: 'Open source website',
        description: `
          Anyone can browse through the code and contribute
          by visiting the repository at GitHub.
        `
      }
    },
    collection: {
      title: 'Perfect to also manage your book and comic book collection',
      description: `
        Toshokan was initially created with the purpose of managing
        a manga collection, but since the sheet is created in a generic way,
        it also allows the creation of other printed medias, such as books
        and comic books.

        By filling the catalographic record of each item, you will permit
        that filters can be used in the collection to a better organization
        of the sheet contents.
      `
    },
    cta: {
      title: 'Ready to start?',
      dashboard: 'Dashboard',
      instructions: 'Instructions'
    },
    header: {
      dashboard: 'Dashboard',
      instructions: 'Instructions'
    }
  },
  dashboard: {
    header: {
      links: {
        start: 'Home',
        dashboard: 'Dashboard',
        library: 'Library',
        statistics: 'Statistics'
      },
      search: {
        title: 'Collection search',
        link: 'Search',
        label: 'Search by',
        placeholder: 'Search at the collection',
        press: 'Press',
        ctrl: 'Ctrl',
        plus: 'and',
        toFocus: 'to focus',
        enter: 'Enter',
        toSearch: 'to search',
        search: 'Search'
      },
      menu: {
        more: 'More',
        open: 'Open user menu',
        settings: 'Settings',
        signOut: 'Sign out'
      }
    },
    details: {
      zoom: {
        view: 'Zoom in',
        title: 'Book cover',
        close: 'Close'
      },
      header: {
        library: 'Library',
        author: 'Author: | Authors:',
        authorListIncomplete: '{authors} and more {number}',
        authorListComplete: '{authors} and {lastAuthor}',
        authorSeparator: ', ',
        authorLastSeparator: ' and ',
        status: 'Status: ',
        group: 'Group: ',
        store: 'Store: ',
        edit: 'Edit',
        options: {
          title: 'Options',
          amazon: 'Open at Amazon',
          updateCover: 'Update cover',
          markAs: 'Mark as {status}',
          addToFavorites: 'Add to favorites',
          removeFromFavorites: 'Remove from favorites',
          delete: 'Delete'
        }
      },
      tabs: {
        metadata: 'Book metadata',
        notes: 'Notes',
        collection: 'Other volumes'
      },
      info: {
        title: 'Book information',
        dateUnknown: 'Unknown'
      },
      editDialog: {
        title: 'Edit book',
        description: 'Update the required information at the sheet.'
      },
      editForm: {
        title: 'Book metadata',
        description: `
          Update the required information at the sheet.
        `,
        cancel: 'Cancel',
        finish: 'Finish'
      },
      coverForm: {
        title: 'Cover image',
        description: `
          Pick a book cover image obtained automatically.
        `,
        cancel: 'Cancel',
        finish: 'Finish'
      },
      readingForm: {
        title: 'Reading',
        description: `
          The reading date are used to compute the statistics of the
          monthly read books. Make them precise, if possible.
        `,
        options: {
          notReadYet: 'I have not read the book yet',
          readToday: 'I finished the reading today',
          readOtherDate: 'I finished the reading at other date'
        },
        fieldHelp: 'Leave it blank if you don\'t remember.',
        actionClear: 'Clear'
      },
      organizationForm: {
        title: 'Organization'
      }
    },
    home: {
      title: 'Dashboard',
      hello: 'Hello, {name}!',
      newBook: 'New book',
      reload: 'Reload',
      viewAll: 'View all',
      beta: {
        short: 'Service currently in beta testing!',
        full: `
          This service is currently in beta testing,
          it's possible that you find some bugs.
        `,
        close: 'Dismiss'
      },
      overview: {
        title: 'Overview',
        item: 'one item | {n} items',
        stats: {
          count: 'Count',
          read: 'Read',
          totalExpense: 'Total expense',
          totalSavings: 'Total savings'
        },
        showValue: 'Show value of {title}',
        hideValue: 'Hide value of {title}'
      },
      lastAdded: 'Books created recently',
      latestReadings: 'Latest readings',
      groups: 'Groups',
      empty: {
        title: 'You don\'t have any books yet',
        description: `
          Create at least one book to allow the information to
          be calculated and displayed at this page.
        `
      }
    },
    library: {
      title: 'Library',
      currentGroup: 'Current group: ',
      allGroups: 'All groups',
      groupCount: 'All groups | One group | {count} groups',
      sortingBy: 'Sorting by: ',
      filter: 'Filter',
      newBook: 'New book',
      items: {
        current: 'Items from all groups | Items from the group {count} | Items from {count} groups',
        tableColumns: {
          actions: 'Actions'
        },
        view: 'View'
      },
      filters: {
        title: 'Filters',
        close: 'Close panel',
        closeMobile: 'Close',
        apply: 'Apply',
        visualization: 'Display',
        books: 'Books',
        viewMode: {
          label: 'Display mode',
          table: 'Table',
          grid: 'Grid'
        },
        gridMode: {
          label: 'Grid mode',
          compact: 'Compact',
          comfortable: 'Comfortable'
        },
        groups: 'Groups',
        sortDirection: {
          label: 'Sort direction',
          asc: 'Ascending',
          desc: 'Descending'
        },
        sortBy: 'Sort by',
        futureItems: {
          label: 'Future itens',
          indiferent: 'Doesn\'t matter',
          only: 'Only',
          hide: 'Hide'
        }
      },
      empty: {
        title: 'Your library is empty',
        description: `
          Add the first book to start to better manage your
          collections and allow the display of the monthly statistics.
        `
      },
      noResults: {
        title: 'No results found',
        description: `
          There isn't any books related to the applied filters.
          Check the filters and try again!
        `
      }
    },
    newBook: {
      title: 'New book',
      description: 'Fill out the information below to create the book in the spreadsheet.',
      step: 'Step {0} of {1}',
      goBack: 'Previous step',
      autoFill: {
        title: 'Autofill',
        titleSr: 'by the ISBN',
        description: `
          Autofill the book metadata by the ISBN.
        `,
        ariaLabel: 'Search at CBL',
        label: 'ISBN to search',
        placeholder: 'Search by ISBN',
        press: 'Press',
        enter: 'Enter',
        toSearch: 'to search',
        searchPowered: 'Search powered by {0}{1}',
        cbl: 'CBL',
        search: 'Search',
        error: 'There was an error during the search.',
        noResults: 'No results found.',
        fillManually: 'Fill manually',
        editInfo: 'Edit book info',
        isbnAlert: {
          title: 'What is an ISBN?',
          body: dedent`
            The ISBN is an international book identification system that
            gives a unique numeric identifier for each item, allowing the
            classification by title, authors, country, publisher and edition.

            This code can be normally found next to the barcode. The search
            accepts both versions of the code, the 10-digit and the 13-digit.
            Books recently published usually have a 13-digit version.

            If the book does not have an ISBN, you can manually fill in the
            information needed to create the item in the spreadsheet.

            *[ISBN]: International Standard Book Number
          `,
          additionalInfo: 'Additional information',
          wikipediaLink: 'https://en.wikipedia.org/wiki/International_Standard_Book_Number'
        },
        existAlert: {
          title: 'A book with this ISBN already exists',
          body: 'You can make a copy if it\'s your need.',
          actionView: 'View',
          actionMakeCopy: 'Make a copy'
        }
      },
      metadata: {
        title: 'Book information',
        description: `
          This information will be added to the sheet.
        `,
        review: 'Review',
        findCover: 'Find cover'
      },
      cover: {
        title: 'Cover image',
        description: `
          Pick the book cover image or skip to the review step.
        `,
        review: 'Review'
      },
      review: {
        title: 'Review',
        description: `
          Review the information provided before finishing the procedure.
        `,
        dateUnknown: 'Unknown',
        finish: 'Finish'
      }
    },
    search: {
      close: 'Close',
      title: 'Search',
      label: 'Search by',
      searchBy: 'Search by "{0}"',
      placeholder: 'What you want to search for?',
      results: 'Results',
      history: 'History',
      removeFromHistory: 'Remove this search from history',
      noHistory: 'No recent searches.',
      resultCount: 'One result found | {count} results found',
      noResultsFound: 'No results found for "{0}".',
      searching: 'Searching',
      clear: 'Clear search',
      keywords: {
        id: 'id',
        code: 'code',
        title: 'title',
        group: 'group',
        author: 'author',
        publisher: 'publisher',
        store: 'store',
        notes: 'notes',
        tag: 'tag',
        boughtAt: 'bought-at',
        boughtBefore: 'bought-before',
        boughtAfter: 'bought-after',
        readAt: 'read-at',
        readBefore: 'read-before',
        readAfter: 'read-after',
        createdAt: 'created-at',
        createdBefore: 'created-before',
        createdAfter: 'created-after',
        updatedAt: 'updated-at',
        updatedBefore: 'updated-before',
        updatedAfter: 'updated-after'
      }
    },
    settings: {
      title: 'Settings',
      save: 'Save',
      appearence: {
        title: 'Appearence',
        description: 'Update your appearence settings.',
        locale: {
          label: 'Application language',
          description: `
            The language will also be used for number and date formatting.
          `
        },
        theme: {
          label: 'Theme',
          description: 'Define the current theme of the application.',
          system: 'System',
          light: 'Light',
          dark: 'Dark'
        },
        viewMode: {
          label: 'Display mode',
          description: `
            Define the layout used to display the library items.
          `
        },
        gridMode: {
          label: 'Grid mode',
          description: `
            Define the card layout used to display the books when grid mode is active.
          `
        },
        spoilerModeSynopsis: {
          label: 'Hide the synopsis of unread books',
          description: `
            If enabled, the synopsis will be blurred to prevent spoilers.
          `
        },
        spoilerModeCover: {
          label: 'Hide the covers of unread books',
          description: `
            If enabled, the covers will be blurred to prevent spoilers.
          `
        },
        blurNsfwCover: {
          label: 'Hide the covers of NSFW tagged books',
          description: `
            If enabled, the covers will be blurred if the book is tagged as NSFW.
          `
        }
      },
      privacy: {
        title: 'Privacy',
        description: 'Update your privacy settings.',
        removeAccess: {
          label: 'Remove access permission',
          description: `
            Removes the access permission granted to Toshokan from your Google Account.
          `,
          remove: 'Remove access'
        }
      }
    },
    stats: {
      title: 'Statistics',
      moreSoon: 'More statistics soon.',
      empty: {
        title: 'You don\'t have any books yet',
        description: `
          Create at least one book so we can start to do the calculation
          of your library statistics.
        `,
        action: 'New book'
      },
      tooEarly: {
        title: 'It\'s too early to display the statistics',
        description: `
          The statistics will be shown after books within the
          period of at least two months are created.
        `
      },
      booksBoughtAndRead: {
        title: 'Books bought and read per month',
        bought: 'Books bought',
        read: 'Books read'
      },
      publishersRankTitle: 'Publishers rank',
      authorsRankTitle: 'Authors rank',
      seriesRankTitle: 'Series rank',
      bookQuantity: 'Book quantity',
      monthlyExpense: 'Monthly expense'
    },
    sheetChooser: {
      title: 'Pick a sheet',
      description: 'You can view and edit other sheets shared with you.',
      actionCancel: 'Cancel',
      actionSelect: 'Select',
      actionSelectSheet: 'Change sheet',
      owner: 'Owner',
      you: 'You',
      lastModified: 'Last modified',
      sharedWithYou: 'Shared with you',
      readOnly: 'Read-only',
      readAndEdit: 'Read and edit permissions',
      starred: 'Starred',
      label: 'Sheet',
      libraryOf: 'Library owner',
      viewing: 'Viewing the library of {0}'
    }
  },
  about: {
    summary: 'Summary',
    a11y: {
      title: 'Accessibility',
      body: dedent`
        This site have some accessibility features.

        [[toc]]

        ## Jump to the content

        All pages have a internal link to jump to the main content.
        It can be used by users browsing with only the keyboard
        or by users that depend on a screenreader. Follow the link
        to get the focus directly in the page main content.

        ## Jump to the navigation

        In pages such as Dashboard, you will also find a internal
        link to jump directly to the main navigation.

        ## Menus

        The menus utilized in this website are from the Headless UI library,
        and they follow all the WAI-ARIA patterns for menu components.
        The keyboard shortcuts can be found at the
        [component documentation]({headlessUiLink}).

        ## Navigation

        This website load dinamically its content. When the page is
        changed, the screenreader will be updated by a modification
        of a control element.

        ## Animations

        This website follow the Operating System setting, if available,
        to disable non-essential animations. You can find this setting
        at the Accessibility section of your computer or device.

        ## Issues during access

        If you find some issue during the access or some wrong implementation
        of an accessibility feature, please report it at the repository
        on GitHub.
      `
    },
    instructions: {
      title: 'Instructions',
      body: dedent`
        Toshokan is a utility aiming to provide a friendly user interface
        for better management of your manga, comic and book collection
        spreadsheet.

        The spreadsheet must follow a strict template, that have to be
        copied to your Google Drive account so the application can
        have access to it.

        The application only reads and writes information on the
        spreadsheet, so you still have total control over your collection
        data and can have an easy access in case you want to export
        or use in other third party service.

        [[toc]]

        ## Before starting

        Before the first use, you have to create the spreadsheet
        file in your Google Drive that will store your collection information.

        - Sign in with your Google Account at the
          [Google Drive]({googleDriveLink}) website.
        - Access [this sheet]({templateSheetLink}) and create a copy
          by clicking on <span class="command">File → Make a copy</span>.
        - **Do not rename the file**, it should be named **Toshokan**.

        In the next time, the copied spreadsheet will be selected automatically.

        ## Signing in

        After you copied the spreadsheet to your Google Drive, you can
        start to use Toshokan, by signing in with your Google Account.

        - Access the homepage and click on
          <span class="command">Sign in with Google<span>.
        - Grant access to the information requested by Toshokan.

        In the next time, you will not need to grant the permissions again.

        ### Usage of your personal information

        Toshokan is a open source application and rendered at the browser
        side. We do not have a server that store your data and we also
        do not share your information with any third party services.

        You can remove the granted permissions of access to your Google
        Drive files and Google Sheets spreadsheets at any time
        on your Google Account settings.

        More information can be found in our Privacy Policy.

        ## Creating the first book

        When you sign in by the first time the sheet will be empty,
        and you will be asked to create the first book by using the wizard.

        If the ISBN search is available, you can search the book you
        want to add by typing the ISBN. If the book exists and the code
        is valid, you will be taken to the next step with some fields of
        the formulary already filled.

        {figure1}

        The ISBN used to search can be typed with or without the dashes,
        and the search also works with old books that have the ISBN
        with 10 digits. However, at the moment, the search will only
        work with Brazilian books that have the ISBN starting with
        **978-85** or **978-65**.

        If the search returns no results or the book don't have a
        Brazilian ISBN, you can use the **Fill manually** option.

        {figure2}

        The book metadata not always is right or follow a pattern, so
        you will probably need to fix some minor issues at the data.
        In the image above the manga had it title and author filled
        with upper case characters, and needs to be fixed.

        ### The book metadata

        Below you will find an brief explanation of each metadata.

        ID
        : Usually the ISBN of the book, but other unique codes such
          as ISSN or EAN can be used too. In independent publications,
          the **N/A** (not applicable) value can be used.

        Title
        : Official name of the book. In case of publications with more
          than one volume, you can use the **#** (number sign) character
          followed by the volume/issue number.

          **Example:** Lone Wolf and Cub #01: The Assassin's Road

        Authors
        : People involved in the creation of the book, such as writers,
          artists, letterers, etc. In case of multiple people, you
          must separate their names by using the **semicolon** character.

          **Example:** Kazuo Koike; Goseki Kojima

        Publisher
        : Publisher that released the book. Sometimes te value retorned
          by the search is incorrect and the tool will perform a fix,
          but you may still need to modify it manually.

        Group
        : The group the book has in common with the others in your collection.
          Although ideally it is recommended to use the publication type
          (such as "books", "comics" or "manga"), you can also use
          the name of the franchise in cases with multiple volumes.

          You must always manually fill this metadata.

        Size
        : Width and height ratio, *in centimeters*. You must use the
          **x** character to separate the values, wich can have a maximum
          of one digit in the decimal place.

        Label price
        : Full price of the book. You can use up to two digits for the
          decimal places.

          In case of imported books, you can change the currency in the
          select field on the side, choosing the equivalent
          [ISO 4217]({iso4217link}) code.

        Paid price
        : Promotional price paid in the book purchase. When not applicable,
          you must fill in the label price value. You can also change
          the currency.

        Store
        : Place where the book was purchase. You can fill it with the
          **Unknown** value when you don't remember or when you
          don't want to fill it.

        Bought at
        : Date when the book entered your collection. It is used to
          generate the monthly statistics. If you do not remember
          or do not have this information, you can leave the field
          value blank by erasing the day, month and year at the input.

        {figure3}

        ### Cover image

        After filling the book metadata, you can choose a cover image
        automatically obtained from Amazon or from the publisher's website,
        or provide a custom valid URL to another image.

        If you want to leave the book without a cover image, just do not
        select any option and skip to the next step.

        {figure4}

        ### Information review

        With all the metadata correct filled and the cover image choosen,
        you can do a last review on the information provided before
        finishing the wizard and creating the book at the spreadsheet.

        {figure5}

        If all information is correct, you must click on
        <span class="command">Finish</span>.

        {figure6}

        With this, the book will be added to the spreadsheet and you
        can then choose <span class="command">View</span>, if you want to
        go straight to the book page, or <span class="command">New book</span>
        if you want to add another book in sequence.

        {figure7}

        The book is now saved in the spreadsheet and you can repeat
        the wizard when you want to add new books. You can explore
        your library items via the <span class="command">Library</span>
        item in the main navigation.
      `,
      legend1: 'First step: ISBN search.',
      legend2: 'Second step: fill the book\'s metadata.',
      legend3: 'Book metadata correctly filled.',
      legend4: 'Third step: choosing the cover image.',
      legend5: 'Fourth step: information review.',
      legend6: 'Creation confirmation dialog.',
      legend7: 'Book information page.'
    },
    privacyPolicy: {
      title: 'Privacy Policy',
      body: dedent`
        This privacy policy applies to all pages in this website.

        [[toc]]

        ## Information we collect

        Toshokan must receive some personal information from your
        Google Account in order for the website to work properly.

        All received information is handled in the browser and is
        neither stored nor retransmitted to any third party service.
        Also, this website is open source, so anyone can inspect
        the code and point out any issues at the repository on GitHub.

        ### Information you provide

        This information is obtained when you grant permission for
        Toshokan to access your collection sheet.

        - **Your account information**. We use your name, e-mail and
          profile picture from your Google Account to customize the
          user interface. The Google Authentication Service provide
          this information by default and it's not possible to
          disable it.
        - **Your Google Drive files**. We request a read-only
          information scope from your Google Drive files so we
          can find the collection sheet ID. Besides the collection
          sheet, we do not have access to the content of the other files.
        - **Your Google Sheets spreadsheets**. We need read and write
          access to your spreadsheets so we can obtain the data and
          write new information about the collection. Only the
          collection sheet is read and modified.

        You can remove the permissions granted to Toshokan at any time
        from your Google Account by following the instructions at
        [this article]({googleHelpLink}) of the Google Account Help.
        When you remove the access permission, we will not have access
        anymore to your data.

        ### How we use information

        We do not store your information in the website server.
        Toshokan is just a static website. Your Google Account
        personal information is only stored at your local memory
        during your use of the tool. When you sign out or close
        the website, all the information is automatically erased.
        The information will only be requested again at the next
        time you use the website and sign in.

        ## Information we share with third party services

        We do not share neither any personal information or data from your
        Google Account nor your spreadsheets and files from your Google
        Drive with third party services. This can be comprovated
        by a inspection on the website source code at the public
        repository on GitHub.

        Since Toshokan is a open source project, anyone can clone
        or fork the repository and modify, compile and host in
        any other server. We do not have control or responsibility
        over other instances or Toshokan forks besides this
        website ({demoBuildLink}). Make sure to always check if
        you are accesing the demonstration website or your
        own local version, as recommended at the instructions
        on the README.md file in the repository.

        Although we do not share any of your personal data with
        third parties, we reserve the right to include affiliate
        links to purchase books in some stores in the future.
        These links do not include any personal information,
        but the store's websites may have some monitoring system
        and unique identification, which we have no responsibility
        or control. You can get more information regarding this
        practice in the store's Terms of Use and Privacy Policy.

        ## Updates to our policy

        We may amend or update our Privacy Policy. We will provide you
        notice of amendments to this Privacy Policy, as appropriate,
        and update the "Last modified" date at the top of this
        Privacy Policy. Please review our Privacy Policy from time to time.

        ## Brazilian General Data Protection Law (LGPD)

        This section applies to personal data processing activities
        under Brazilian law and supplements our Privacy Policy.

        Under the Brazilian General Data Protection Law (the "LGPD"),
        you have the right to access, rectify, port, erase, and confirm
        that we process your data. In certain circumstances, you also
        have the right to object to and to restrict the processing
        of your personal data. This page have more information at
        the previous sections about how we process and use your data.

        You can remove the permissions granted to Toshokan at any time
        from your Google Account by following the instructions at
        [this article]({googleHelpLink}) of the Google Account Help.
        When you remove the access permission, we will not have access
        anymore to your data.

        Information about how Google takes responsability for your
        data according to the Brazilian General Data Protection Law
        can be obtained in [this article]({googleLgpdLink}) from
        Google Account Help.

        The complete content of Law No. 13,709 of August 14, 2018,
        can be accessed through [this page]({lgpdLawLink}) on the
        Federal government of Brazil website.
      `
    },
    termsOfUse: {
      title: 'Terms of Use',
      body: dedent`
        This page contains the terms of use of the Toshokan website.

        **Please read this terms carefully, because by acessing
        or using any part of this website, you automatically agree
        with them. If you don't agree with the terms, you can't
        access this website or use any of its services.**

        We reserve our right to change these terms at any time.
        It is your responsability to periodically check changes
        made to this page. Your access to this website before
        those updates implies in your agreement of such changes.
        You can review the most current version of the terms
        at any time on this page.

        [[toc]]

        ## Electronic communication

        You understant that your content may be transferred unencrypted
        and may: **(a)** be transmitted over various networks; and **(b)**
        go through changes to adapt to the technical requirements of
        network or device connections. Authentication information is always
        encrypted during the transfer across networks.

        ## Third party services

        We use the [Google Authentication Service]({googleSignInLink})
        with Google Drive and Google Sheets. By using this website and
        authenticating with your Google Account, you agree with Google's
        [Service Terms]({googleTermsLink}) and
        [Privacy Policy]({googlePrivacyPolicyLink}).

        ## Privacy policy

        By using this website, you agree with our Privacy Policy.
      `
    }
  }
}
