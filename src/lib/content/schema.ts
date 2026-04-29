import { z } from "zod";

// ---------- Reusable atoms ----------

export const LinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

/**
 * CTA que abre WhatsApp com mensagem pré-preenchida.
 * Se `whatsappNumber` estiver vazio, usa o número global do site.
 */
export const WhatsAppCtaSchema = z.object({
  label: z.string(),
  message: z.string(),
  whatsappNumber: z.string().default(""),
});

export type WhatsAppCta = z.infer<typeof WhatsAppCtaSchema>;

export const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const ImageSchema = z.object({
  src: z.string(),
  alt: z.string().default(""),
});

export const CardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  image: z.string().optional(),
  href: z.string().optional(),
});

export const ExitPopupSchema = z.object({
  enabled: z.boolean().default(false),
  title: z.string().default(""),
  description: z.string().default(""),
  image: z.string().default(""),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default(""),
});

// ---------- GLOBAL ----------

export const GlobalSchema = z.object({
  brand: z.object({
    logo: z.string().default("/LOGO ACOMAC Joinville - 2020 - FINAL-01.avif"),
    logoAlt: z.string().default("ACOMAC Joinville"),
  }),
  header: z.object({
    nav: z.array(LinkSchema),
    ctaLabel: z.string(),
    ctaHref: z.string(),
    topbar: z.object({
      phone: z.string(),
      email: z.string(),
      city: z.string(),
    }),
  }),
  whatsapp: z.object({
    number: z.string(), // without +, like "5547999999999"
    floatingEnabled: z.boolean().default(true),
    bubbleTitle: z.string().default("Fale com a ACOMAC"),
    bubbleText: z.string().default("Tire suas dúvidas pelo WhatsApp"),
    defaultMessage: z.string().default("Olá! Vim pelo site e gostaria de mais informações."),
  }),
  socials: z.object({
    instagram: z.string().default(""),
    facebook: z.string().default(""),
    linkedin: z.string().default(""),
    youtube: z.string().default(""),
  }),
  contactInfo: z.object({
    address: z.string(),
    addressLine2: z.string().default(""),
    city: z.string(),
    phone: z.string(),
    whatsappLabel: z.string().default(""),
    email: z.string(),
    hours: z.string().default(""),
  }),
  footer: z.object({
    about: z.string(),
    columns: z.array(
      z.object({
        title: z.string(),
        links: z.array(LinkSchema),
      })
    ),
    bottom: z.string(),
  }),
  cta: z.object({
    badge: z.string().default(""),
    title: z.string(),
    subtitle: z.string(),
    primaryLabel: z.string(),
    primaryHref: z.string(),
    secondaryLabel: z.string(),
    secondaryHref: z.string(),
  }),
  contactForm: z.object({
    title: z.string(),
    subtitle: z.string(),
    submitLabel: z.string(),
    successMessage: z.string().default("Mensagem enviada com sucesso!"),
  }),
  /**
   * CTAs do site que abrem o WhatsApp com mensagem personalizada.
   * Cada chave é usada por um conjunto de botões (Associe-se / Fale com a gente / etc.).
   */
  whatsappCtas: z
    .object({
      associateNow: WhatsAppCtaSchema.default({
        label: "Associe-se agora",
        message:
          "Olá! Tenho interesse em me associar à ACOMAC Joinville e gostaria de receber mais informações sobre como participar.",
        whatsappNumber: "",
      }),
      contactUs: WhatsAppCtaSchema.default({
        label: "Fale com a gente",
        message:
          "Olá! Vim pelo site da ACOMAC e gostaria de conversar com vocês.",
        whatsappNumber: "",
      }),
      requestInfo: WhatsAppCtaSchema.default({
        label: "Solicitar informações",
        message:
          "Olá! Gostaria de receber mais informações sobre os serviços e benefícios da ACOMAC Joinville.",
        whatsappNumber: "",
      }),
    })
    .default({
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
    }),
  blogBanner: z
    .object({
      image: z.string().default(""),
      badge: z.string().default("Blog ACOMAC"),
      title: z.string().default("Notícias, mercado e conteúdos para o varejo"),
      subtitle: z
        .string()
        .default(
          "Acompanhe os bastidores da ACOMAC, pesquisas de mercado e artigos pensados para lojistas do setor de materiais de construção."
        ),
    })
    .default({
      image: "",
      badge: "Blog ACOMAC",
      title: "Notícias, mercado e conteúdos para o varejo",
      subtitle:
        "Acompanhe os bastidores da ACOMAC, pesquisas de mercado e artigos pensados para lojistas do setor de materiais de construção.",
    }),
});

export type GlobalContent = z.infer<typeof GlobalSchema>;

// ---------- HOME ----------

export const HomeSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    titleHighlight: z.string(),
    titleSuffix: z.string(),
    subtitle: z.string(),
    backgroundVideo: z.string().default("/hero-bg.mp4"),
    backgroundImage: z.string().default(""),
    ctaPrimary: LinkSchema,
    ctaSecondary: LinkSchema,
    stats: z.array(StatSchema),
  }),
  stats: z.array(StatSchema),
  about: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    paragraphs: z.array(z.string()),
    image: z.string(),
    highlights: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    ctaLabel: z.string(),
    ctaHref: z.string(),
  }),
  events: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        date: z.string(),
        location: z.string(),
        description: z.string(),
        image: z.string(),
        href: z.string().default(""),
      })
    ),
    ctaLabel: z.string(),
    ctaHref: z.string(),
  }),
  benefits: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(CardSchema),
    ctaLabel: z.string(),
    ctaHref: z.string(),
  }),
  infrastructure: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    paragraphs: z.array(z.string()),
    image: z.string(),
    features: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        image: z.string().default(""),
      })
    ),
  }),
  courses: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        duration: z.string().default(""),
        image: z.string().default(""),
        tag: z.string().default(""),
      })
    ),
    ctaLabel: z.string(),
    ctaHref: z.string(),
  }),
  partners: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    logos: z.array(z.object({ name: z.string(), image: z.string() })),
    ctaLabel: z.string(),
    ctaHref: z.string(),
  }),
  news: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        excerpt: z.string(),
        date: z.string(),
        image: z.string(),
        href: z.string().default(""),
      })
    ),
  }),
  exitPopup: ExitPopupSchema,
});

export type HomeContent = z.infer<typeof HomeSchema>;

// ---------- SOBRE ----------

export const SobreSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string().default(""),
  }),
  history: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()),
    image: z.string(),
  }),
  mission: z.object({
    mission: z.string(),
    vision: z.string(),
    values: z.array(z.string()),
  }),
  timeline: z.array(
    z.object({
      year: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
  team: z.object({
    title: z.string(),
    subtitle: z.string(),
    members: z.array(
      z.object({
        name: z.string(),
        role: z.string(),
        image: z.string(),
      })
    ),
  }),
  stats: z.array(StatSchema),
  exitPopup: ExitPopupSchema,
});

export type SobreContent = z.infer<typeof SobreSchema>;

// ---------- BENEFICIOS ----------

export const BeneficiosSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string().default(""),
  }),
  intro: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()),
  }),
  categories: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().default(""),
      items: z.array(z.string()),
    })
  ),
  ctaSection: z.object({
    title: z.string(),
    subtitle: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
  }),
  exitPopup: ExitPopupSchema,
});

export type BeneficiosContent = z.infer<typeof BeneficiosSchema>;

// ---------- CONVENIOS ----------

export const ConveniosSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string().default(""),
  }),
  intro: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()),
  }),
  categories: z.array(
    z.object({
      name: z.string(),
      icon: z.string().default(""),
    })
  ),
  partners: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      description: z.string(),
      discount: z.string().default(""),
      logo: z.string().default(""),
      link: z.string().default(""),
    })
  ),
  exitPopup: ExitPopupSchema,
});

export type ConveniosContent = z.infer<typeof ConveniosSchema>;

// ---------- CURSOS ----------

export const CursosSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string().default(""),
  }),
  intro: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()),
  }),
  categories: z.array(z.string()),
  upcoming: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
      duration: z.string(),
      instructor: z.string(),
      category: z.string(),
      price: z.string(),
      image: z.string().default(""),
      link: z.string().default(""),
    })
  ),
  catalog: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      duration: z.string().default(""),
    })
  ),
  exitPopup: ExitPopupSchema,
});

export type CursosContent = z.infer<typeof CursosSchema>;

// ---------- EVENTOS ----------

export const EventosSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string().default(""),
  }),
  featured: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    location: z.string(),
    image: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
  }),
  upcoming: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
      location: z.string(),
      image: z.string().default(""),
      link: z.string().default(""),
    })
  ),
  past: z.array(
    z.object({
      title: z.string(),
      date: z.string(),
      image: z.string().default(""),
    })
  ),
  exitPopup: ExitPopupSchema,
});

export type EventosContent = z.infer<typeof EventosSchema>;

// ---------- CONECTA ASSOCIADOS ----------

export const ConectaAssociadosSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string().default(""),
  }),
  intro: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()),
  }),
  registerCta: z.object({
    title: z.string(),
    subtitle: z.string(),
    ctaLabel: z.string(),
  }),
  exitPopup: ExitPopupSchema,
});

export type ConectaAssociadosContent = z.infer<typeof ConectaAssociadosSchema>;

// ---------- CONTATO ----------

export const ContatoSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string().default(""),
  }),
  address: z.object({
    title: z.string(),
    addressLines: z.array(z.string()),
  }),
  phones: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  emails: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  hours: z.array(
    z.object({
      days: z.string(),
      time: z.string(),
    })
  ),
  mapEmbedUrl: z.string().default(""),
  /**
   * Departamentos exibidos na seção "Nossos departamentos" da página de contato.
   * Cada item gera um card com nome, descrição e e-mail próprio.
   */
  departments: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        email: z.string(),
      })
    )
    .default([]),
  exitPopup: ExitPopupSchema,
});

export type ContatoContent = z.infer<typeof ContatoSchema>;

// ---------- page registry ----------

export const PAGE_KEYS = [
  "home",
  "sobre",
  "beneficios",
  "convenios",
  "cursos",
  "eventos",
  "conecta-associados",
  "contato",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export const pageSchemas = {
  home: HomeSchema,
  sobre: SobreSchema,
  beneficios: BeneficiosSchema,
  convenios: ConveniosSchema,
  cursos: CursosSchema,
  eventos: EventosSchema,
  "conecta-associados": ConectaAssociadosSchema,
  contato: ContatoSchema,
} as const;

export type PageContentMap = {
  home: HomeContent;
  sobre: SobreContent;
  beneficios: BeneficiosContent;
  convenios: ConveniosContent;
  cursos: CursosContent;
  eventos: EventosContent;
  "conecta-associados": ConectaAssociadosContent;
  contato: ContatoContent;
};
