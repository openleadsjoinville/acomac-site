import type {
  GlobalContent,
  HomeContent,
  SobreContent,
  BeneficiosContent,
  ConveniosContent,
  CursosContent,
  EventosContent,
  ConectaAssociadosContent,
  ContatoContent,
} from "./schema";

const emptyExit = {
  enabled: false,
  title: "",
  description: "",
  image: "",
  ctaLabel: "",
  ctaHref: "",
};

export const defaultGlobal: GlobalContent = {
  brand: {
    logo: "/LOGO ACOMAC Joinville - 2020 - FINAL-01.avif",
    logoAlt: "ACOMAC Joinville",
  },
  header: {
    nav: [
      { label: "Início", href: "/#inicio" },
      { label: "A ACOMAC", href: "/sobre" },
      { label: "Benefícios", href: "/beneficios" },
      { label: "Cursos", href: "/cursos" },
      { label: "Eventos", href: "/eventos" },
      { label: "Convênios", href: "/convenios" },
      { label: "Conecta Associados", href: "/conecta-associados" },
      { label: "Blog", href: "/blog" },
      { label: "Contato", href: "/contato" },
    ],
    ctaLabel: "Associe-se",
    ctaHref: "#associe-se",
    topbar: {
      phone: "(47) 3435-0660",
      email: "acomac@acomacjoinville.com.br",
      city: "Joinville, SC",
    },
  },
  whatsapp: {
    number: "5547991103681",
    floatingEnabled: true,
    bubbleTitle: "Fale com a ACOMAC",
    bubbleText: "Tire suas dúvidas pelo WhatsApp",
    defaultMessage: "Olá! Vim pelo site e gostaria de mais informações.",
  },
  socials: {
    instagram: "https://instagram.com/acomacjoinville",
    facebook: "https://facebook.com/acomacjoinville",
    linkedin: "",
    youtube: "",
  },
  contactInfo: {
    address: "Rua Princesa Isabel, 438",
    addressLine2: "Costa e Silva",
    city: "Joinville - SC",
    phone: "(47) 3435-0660",
    whatsappLabel: "(47) 99999-9999",
    email: "acomac@acomacjoinville.com.br",
    hours: "Seg a Sex, 8h às 18h",
  },
  footer: {
    about:
      "A ACOMAC Joinville é a maior associação do varejo de material de construção de Santa Catarina. Desde 1983 unindo empresários e impulsionando o setor.",
    columns: [
      {
        title: "Institucional",
        links: [
          { label: "A ACOMAC", href: "/sobre" },
          { label: "Benefícios", href: "/beneficios" },
          { label: "Convênios", href: "/convenios" },
          { label: "Cursos", href: "/cursos" },
          { label: "Eventos", href: "/eventos" },
          { label: "Blog", href: "/blog" },
        ],
      },
      {
        title: "Associados",
        links: [
          { label: "Conecta Associados", href: "/conecta-associados" },
          { label: "Seja um associado", href: "/participe-do-conecta-associados" },
          { label: "Área do associado", href: "#" },
        ],
      },
      {
        title: "Contato",
        links: [
          { label: "Fale conosco", href: "/contato" },
          { label: "WhatsApp", href: "#" },
          { label: "Trabalhe conosco", href: "#" },
        ],
      },
    ],
    bottom:
      "© 2026 ACOMAC Joinville. Todos os direitos reservados. Desde 1983.",
  },
  cta: {
    badge: "Faça parte",
    title: "Junte-se à maior associação do varejo de SC",
    subtitle:
      "Capacitação, representatividade, convênios e uma rede que impulsiona o seu negócio.",
    primaryLabel: "Associe-se agora",
    primaryHref: "/participe-do-conecta-associados",
    secondaryLabel: "Fale com a gente",
    secondaryHref: "/contato",
  },
  contactForm: {
    title: "Entre em contato",
    subtitle: "Envie sua mensagem e retornaremos em breve.",
    submitLabel: "Enviar mensagem",
    successMessage: "Mensagem enviada com sucesso! Em breve entraremos em contato.",
  },
  blogBanner: {
    image: "",
    badge: "Blog ACOMAC",
    title: "Notícias, mercado e conteúdos para o varejo",
    subtitle:
      "Acompanhe os bastidores da ACOMAC, pesquisas de mercado e artigos pensados para lojistas do setor de materiais de construção.",
  },
  whatsappCtas: {
    associateNow: {
      label: "Associe-se agora",
      message:
        "Olá! Tenho interesse em me associar à ACOMAC Joinville e gostaria de receber mais informações sobre como participar.",
      whatsappNumber: "",
    },
    contactUs: {
      label: "Fale com a gente",
      message:
        "Olá! Vim pelo site da ACOMAC e gostaria de conversar com vocês.",
      whatsappNumber: "",
    },
    requestInfo: {
      label: "Solicitar informações",
      message:
        "Olá! Gostaria de receber mais informações sobre os serviços e benefícios da ACOMAC Joinville.",
      whatsappNumber: "",
    },
  },
};

export const defaultHome: HomeContent = {
  hero: {
    badge: "Desde 1983 — Joinville, SC",
    title: "A força do",
    titleHighlight: "varejo",
    titleSuffix: "da construção em SC",
    subtitle:
      "A maior associação do varejo de material de construção de Santa Catarina. Unindo empresários, promovendo capacitação e impulsionando negócios há mais de 40 anos.",
    backgroundVideo: "/hero-bg.mp4",
    backgroundImage: "",
    ctaPrimary: { label: "Associe-se agora", href: "/participe-do-conecta-associados" },
    ctaSecondary: { label: "Conheça a ACOMAC", href: "/sobre" },
    stats: [
      { value: "40+", label: "Anos de história" },
      { value: "350", label: "Associados" },
      { value: "1.500m²", label: "Sede própria" },
    ],
  },
  stats: [
    { value: "350", label: "Empresas associadas" },
    { value: "40+", label: "Anos de história" },
    { value: "40+", label: "Cursos por ano" },
    { value: "1.500m²", label: "De infraestrutura" },
  ],
  about: {
    badge: "Quem somos",
    title: "Construindo o futuro do varejo da construção",
    subtitle: "",
    paragraphs: [
      "A ACOMAC Joinville é a maior associação do varejo de materiais de construção de Santa Catarina. Fundada em 1983, nascemos da união de empresários que acreditavam na força coletiva para transformar o mercado.",
      "Ao longo de mais de quatro décadas, construímos uma trajetória de conquistas: capacitação profissional, representatividade, rodadas de negócios com a indústria e pesquisa de mercado que orienta decisões estratégicas.",
    ],
    image: "/Fachada acomac.png",
    highlights: [
      { value: "1983", label: "Ano de fundação" },
      { value: "1.500m²", label: "De infraestrutura" },
    ],
    ctaLabel: "Fale conosco",
    ctaHref: "/contato",
  },
  events: {
    badge: "Agenda",
    title: "Próximos eventos",
    subtitle: "Conheça os principais encontros, rodadas e feiras organizados pela ACOMAC.",
    items: [
      {
        title: "FENAC 2026",
        date: "2026-08-20",
        location: "Joinville — SC",
        description:
          "A maior feira do varejo de material de construção de Santa Catarina. Networking, rodadas de negócios e palestras com referências do setor.",
        image: "",
        href: "/eventos",
      },
      {
        title: "Café com associados",
        date: "2026-05-10",
        location: "Sede ACOMAC",
        description:
          "Encontro mensal para troca de experiências entre associados e debates sobre mercado.",
        image: "",
        href: "/eventos",
      },
    ],
    ctaLabel: "Ver todos os eventos",
    ctaHref: "/eventos",
  },
  benefits: {
    badge: "Benefícios",
    title: "Vantagens exclusivas para associados",
    subtitle:
      "Ser associado ACOMAC é ter acesso a uma rede que impulsiona o seu negócio.",
    items: [
      {
        title: "Capacitação",
        description:
          "Cursos, treinamentos e workshops com preços especiais para associados e suas equipes.",
        icon: "GraduationCap",
      },
      {
        title: "Convênios",
        description:
          "Descontos em saúde, odonto, farmácias, combustível e uma rede de parceiros comerciais.",
        icon: "Tags",
      },
      {
        title: "Representatividade",
        description:
          "Uma voz forte junto a órgãos públicos, indústria e entidades setoriais.",
        icon: "Megaphone",
      },
      {
        title: "Rodadas de negócios",
        description:
          "Encontros diretos com a indústria para negociação e relacionamento.",
        icon: "Handshake",
      },
      {
        title: "Pesquisa de mercado",
        description:
          "Dados e insights que orientam decisões estratégicas do seu negócio.",
        icon: "BarChart3",
      },
      {
        title: "Networking",
        description:
          "Conecte-se com os principais lojistas e fornecedores do varejo em SC.",
        icon: "Users",
      },
    ],
    ctaLabel: "Conheça todos os benefícios",
    ctaHref: "/beneficios",
  },
  infrastructure: {
    badge: "Estrutura",
    title: "Uma sede pronta para o associado",
    subtitle: "",
    paragraphs: [
      "Nossa sede de 1.500m² em Joinville recebe os associados para reuniões, treinamentos, cursos e eventos.",
      "Auditório, salas de treinamento e áreas de convivência preparadas para capacitar e conectar o setor.",
    ],
    image: "/Fachada acomac.png",
    features: [
      { title: "Auditório", description: "Espaço para palestras, assembleias e eventos da ACOMAC.", image: "/estrutura/auditorio.jpeg" },
      { title: "Sala de Reuniões", description: "Ambiente reservado para encontros e reuniões da diretoria.", image: "/estrutura/sala-de-reunioes.jpeg" },
      { title: "Sala de Treinamentos", description: "Estrutura completa para cursos presenciais e capacitação.", image: "/estrutura/sala-de-treinamentos.jpeg" },
      { title: "Quiosque", description: "Área de convivência para confraternização e networking.", image: "/estrutura/quiosque.jpeg" },
    ],
  },
  courses: {
    badge: "Academia",
    title: "Academia da Construção",
    subtitle:
      "Formação profissional reconhecida por lojistas e equipes do varejo de materiais de construção.",
    items: [
      {
        title: "Vendas Consultivas",
        description: "Técnicas de atendimento e fechamento para o varejo.",
        duration: "16h",
        image: "",
        tag: "Presencial",
      },
      {
        title: "Gestão de Loja",
        description: "Planejamento, KPIs, estoque e margem.",
        duration: "24h",
        image: "",
        tag: "Híbrido",
      },
      {
        title: "Marketing Digital",
        description: "Instagram, Google e anúncios para lojas do setor.",
        duration: "12h",
        image: "",
        tag: "Online",
      },
    ],
    ctaLabel: "Ver catálogo completo",
    ctaHref: "/cursos",
  },
  partners: {
    badge: "Parceiros",
    title: "Quem caminha com a gente",
    subtitle:
      "Indústrias, distribuidores e entidades que apoiam o varejo da construção.",
    logos: [],
    ctaLabel: "Seja um parceiro",
    ctaHref: "/contato",
  },
  news: {
    badge: "Notícias",
    title: "Últimas do setor",
    subtitle: "Informação pra você tomar decisões melhores.",
    items: [
      {
        title: "Varejo de construção cresce 4% em SC",
        excerpt: "Dados da pesquisa trimestral apontam recuperação.",
        date: "2026-03-12",
        image: "",
        href: "#",
      },
    ],
  },
  exitPopup: { ...emptyExit },
};

export const defaultSobre: SobreContent = {
  hero: {
    badge: "A ACOMAC",
    title: "40+ anos fortalecendo o varejo da construção",
    subtitle:
      "Conheça a história da maior associação do setor em Santa Catarina.",
    backgroundImage: "/Fachada acomac.png",
  },
  history: {
    title: "Nossa história",
    paragraphs: [
      "A ACOMAC Joinville nasceu em 1983 da união de empresários do varejo de materiais de construção.",
      "Desde então, construímos uma trajetória de conquistas, representatividade e capacitação para o setor.",
    ],
    image: "/Fachada acomac.png",
  },
  mission: {
    mission:
      "Representar e fortalecer o setor varejista de materiais de construção, promovendo ações que proporcionem benefícios diretos e indiretos aos associados.",
    vision:
      "Ser referência nacional como associação do varejo de materiais de construção, reconhecida pela excelência em representatividade e geração de valor.",
    values: [
      "Ética",
      "Transparência",
      "Cooperação",
      "Inovação",
      "Compromisso com o desenvolvimento sustentável",
    ],
  },
  timeline: [
    {
      year: "1983",
      title: "Fundação",
      description:
        "Nasce a ACOMAC Joinville, reunindo lojistas do setor da construção civil.",
    },
    {
      year: "1990",
      title: "Sede própria",
      description:
        "Conquista da sede no bairro Costa e Silva, marco de solidez institucional.",
    },
    {
      year: "2000",
      title: "Academia da Construção",
      description:
        "Criação do programa de capacitação técnica e gerencial para o setor.",
    },
    {
      year: "2010",
      title: "Expansão regional",
      description:
        "Ampliação da cobertura para 8 municípios do norte de Santa Catarina.",
    },
    {
      year: "Hoje",
      title: "Referência em SC",
      description:
        "Maior associação do varejo de materiais de construção do estado.",
    },
  ],
  team: {
    title: "Diretoria",
    subtitle: "As pessoas que fazem a ACOMAC acontecer.",
    members: [],
  },
  stats: [
    { value: "350", label: "Empresas associadas" },
    { value: "40+", label: "Anos de história" },
    { value: "8", label: "Municípios atendidos" },
    { value: "1.500m²", label: "De infraestrutura" },
  ],
  exitPopup: { ...emptyExit },
};

export const defaultBeneficios: BeneficiosContent = {
  hero: {
    badge: "Benefícios",
    title: "Tudo o que você ganha como associado",
    subtitle:
      "Capacitação, representatividade, convênios e uma rede de parceiros para impulsionar seu negócio.",
    backgroundImage: "",
  },
  intro: {
    title: "Por que ser associado?",
    paragraphs: [
      "Ser associado ACOMAC é ter acesso a uma rede de relacionamento, capacitação e vantagens que impulsionam o seu negócio.",
    ],
  },
  categories: [
    {
      title: "Capacitação",
      description: "Cursos, workshops e treinamentos com descontos especiais.",
      icon: "GraduationCap",
      items: [
        "Cursos presenciais",
        "Treinamentos in company",
        "Workshops e palestras",
        "Certificação ACOMAC",
      ],
    },
    {
      title: "Convênios e Parcerias",
      description: "Descontos em saúde, odonto, farmácias e muito mais.",
      icon: "Tags",
      items: [
        "Plano de saúde",
        "Plano odontológico",
        "Farmácias e drogarias",
        "Combustível e outros",
      ],
    },
    {
      title: "Representatividade",
      description: "Voz ativa junto a órgãos públicos e indústria.",
      icon: "Megaphone",
      items: [
        "Diálogo com prefeituras",
        "Representação junto ao governo estadual",
        "Relacionamento com indústria",
      ],
    },
    {
      title: "Networking",
      description: "Conecte-se com lojistas e fornecedores do setor.",
      icon: "Users",
      items: [
        "Encontros mensais",
        "Eventos e feiras",
        "Rodadas de negócios",
        "Grupos de trabalho",
      ],
    },
  ],
  ctaSection: {
    title: "Pronto para fazer parte?",
    subtitle:
      "Associe-se e comece a aproveitar todos os benefícios hoje mesmo.",
    ctaLabel: "Quero me associar",
    ctaHref: "/participe-do-conecta-associados",
  },
  exitPopup: { ...emptyExit },
};

export const defaultConvenios: ConveniosContent = {
  hero: {
    badge: "Convênios",
    title: "Rede de parceiros exclusiva para associados",
    subtitle:
      "Descontos em saúde, odonto, farmácias, combustível, educação e muito mais.",
    backgroundImage: "",
  },
  intro: {
    title: "Como funciona",
    paragraphs: [
      "Associados da ACOMAC Joinville têm acesso a descontos em uma rede de empresas parceiras.",
      "Basta apresentar o comprovante de associado para usufruir dos benefícios.",
    ],
  },
  categories: [
    { name: "Saúde", icon: "Heart" },
    { name: "Educação", icon: "GraduationCap" },
    { name: "Tecnologia", icon: "Laptop" },
    { name: "Alimentação", icon: "Utensils" },
    { name: "Jurídico", icon: "Scale" },
    { name: "Serviços", icon: "Briefcase" },
  ],
  partners: [],
  exitPopup: { ...emptyExit },
};

export const defaultCursos: CursosContent = {
  hero: {
    badge: "Academia da Construção",
    title: "Formação profissional para o varejo",
    subtitle:
      "Cursos presenciais, online e in company para lojistas e suas equipes.",
    backgroundImage: "",
  },
  intro: {
    title: "Sobre a Academia",
    paragraphs: [
      "A Academia da Construção é o programa de capacitação da ACOMAC Joinville, desenvolvido para formar e atualizar profissionais do varejo de materiais de construção.",
    ],
  },
  categories: ["Vendas", "Gestão", "Marketing", "Atendimento", "Técnico"],
  upcoming: [],
  catalog: [
    {
      title: "Vendas Consultivas no Varejo",
      description: "Técnicas modernas de atendimento e fechamento.",
      category: "Vendas",
      duration: "16h",
    },
    {
      title: "Gestão Financeira para Lojas",
      description: "Controle de caixa, margem e precificação.",
      category: "Gestão",
      duration: "20h",
    },
    {
      title: "Marketing Digital para Varejo",
      description: "Instagram, Google e conteúdo para lojas.",
      category: "Marketing",
      duration: "12h",
    },
  ],
  exitPopup: { ...emptyExit },
};

export const defaultEventos: EventosContent = {
  hero: {
    badge: "Eventos",
    title: "A agenda do varejo da construção",
    subtitle:
      "Feiras, rodadas de negócios e encontros que movimentam o setor em Santa Catarina.",
    backgroundImage: "",
  },
  featured: {
    title: "FENAC 2026",
    description:
      "A maior feira do varejo de material de construção de Santa Catarina.",
    date: "2026-08-20",
    location: "Joinville — SC",
    image: "",
    ctaLabel: "Saiba mais",
    ctaHref: "#",
  },
  upcoming: [
    {
      title: "Café com associados",
      description: "Encontro mensal de networking e troca de experiências.",
      date: "2026-05-10",
      location: "Sede ACOMAC",
      image: "",
      link: "",
    },
  ],
  past: [],
  exitPopup: { ...emptyExit },
};

export const defaultConectaAssociados: ConectaAssociadosContent = {
  hero: {
    badge: "Conecta Associados",
    title: "Conheça quem faz parte da ACOMAC",
    subtitle:
      "Encontre associados por segmento e conecte-se com os principais lojistas de SC.",
    backgroundImage: "",
  },
  intro: {
    title: "O que é o Conecta Associados?",
    paragraphs: [
      "Um diretório oficial dos associados ACOMAC, facilitando o networking entre lojistas, distribuidores e parceiros do setor.",
    ],
  },
  registerCta: {
    title: "Quer fazer parte?",
    subtitle:
      "Cadastre sua empresa e faça parte do maior diretório do varejo da construção em SC.",
    ctaLabel: "Cadastrar minha empresa",
  },
  exitPopup: { ...emptyExit },
};

export const defaultContato: ContatoContent = {
  hero: {
    badge: "Contato",
    title: "Fale com a ACOMAC",
    subtitle: "Estamos aqui para tirar dúvidas, ouvir sugestões e te atender.",
    backgroundImage: "",
  },
  address: {
    title: "Endereço",
    addressLines: [
      "Rua Princesa Isabel, 438",
      "Costa e Silva",
      "Joinville - SC",
    ],
  },
  phones: [{ label: "Central", value: "(47) 3435-0660" }],
  emails: [{ label: "Geral", value: "acomac@acomacjoinville.com.br" }],
  hours: [
    { days: "Segunda a Sexta", time: "8h às 18h" },
    { days: "Sábado", time: "Fechado" },
  ],
  mapEmbedUrl: "",
  departments: [
    {
      name: "Associação",
      description:
        "Adesão de novas empresas, emissão de contratos e suporte aos associados.",
      email: "acomac@acomacjoinville.com.br",
    },
    {
      name: "Eventos e Convênios",
      description:
        "FENAC, rodadas de negócios, parcerias comerciais e patrocínios.",
      email: "executivo@acomacjoinville.com.br",
    },
    {
      name: "Academia da Construção",
      description:
        "Inscrições em cursos, turmas corporativas e emissão de certificados.",
      email: "informe@acomacjoinville.com.br",
    },
    {
      name: "Locação de Espaço",
      description:
        "Auditório e salas de treinamento disponíveis para associados e parceiros.",
      email: "informe@acomacjoinville.com.br",
    },
    {
      name: "Telefonia e Certificado Digital",
      description:
        "Planos corporativos com operadoras parceiras e emissão de certificado digital.",
      email: "telefone@acomacjoinville.com.br",
    },
  ],
  exitPopup: { ...emptyExit },
};

export const pageDefaults = {
  home: defaultHome,
  sobre: defaultSobre,
  beneficios: defaultBeneficios,
  convenios: defaultConvenios,
  cursos: defaultCursos,
  eventos: defaultEventos,
  "conecta-associados": defaultConectaAssociados,
  contato: defaultContato,
} as const;
