import type { Metadata } from "next";
import type { Event } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getPageContent } from "@/lib/content/get";
import { EventosClient, type DBEvent } from "./eventos-client";
import { buildPageMetadata } from "@/lib/site";

// ISR: cacheado no CDN, regenerado a cada 5 min e na hora em que um evento é
// criado/editado/removido no admin (ver revalidateEventos em @/lib/revalidate).
export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "Eventos da ACOMAC — FENAC, Rodadas de Negócios e Networking",
  description:
    "Confira a agenda de eventos da ACOMAC Joinville: FENAC, rodadas de negócios, encontros com fornecedores, premiações e palestras para o setor de materiais de construção.",
  path: "/eventos",
});

function eventIsPast(ev: { date: Date; endDate: Date | null }, now: Date): boolean {
  const ref = ev.endDate ?? ev.date;
  return ref.getTime() < now.getTime();
}

function toDBEvent(e: {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: Date;
  endDate: Date | null;
  location: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  ctaType: string;
  ctaWhatsappNumber: string;
  ctaWhatsappMessage: string;
  featured: boolean;
}): DBEvent {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.description,
    date: e.date.toISOString(),
    endDate: e.endDate ? e.endDate.toISOString() : null,
    location: e.location,
    image: e.image,
    ctaLabel: e.ctaLabel,
    ctaHref: e.ctaHref,
    ctaType: e.ctaType,
    ctaWhatsappNumber: e.ctaWhatsappNumber,
    ctaWhatsappMessage: e.ctaWhatsappMessage,
    featured: e.featured,
  };
}

export default async function EventosPage() {
  const [page, events] = await Promise.all([
    getPageContent("eventos"),
    // .catch([]) evita quebrar o build/ISR se o DB estiver indisponível na hora
    // da pré-renderização; o ISR regenera com os dados reais no próximo ciclo.
    prisma.event
      .findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { date: "asc" }],
      })
      .catch(() => [] as Event[]),
  ]);

  const now = new Date();

  const featured =
    events.find((e) => e.featured && !eventIsPast(e, now)) ??
    events.find((e) => e.featured) ??
    null;

  const upcoming = events
    .filter((e) => !eventIsPast(e, now) && e.id !== featured?.id)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(toDBEvent);

  const past = events
    .filter((e) => eventIsPast(e, now) && e.id !== featured?.id)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(toDBEvent);

  const hero = {
    badge: page.hero.badge,
    title: page.hero.title,
    subtitle: page.hero.subtitle,
  };

  return (
    <EventosClient
      hero={hero}
      featuredEvent={featured ? toDBEvent(featured) : null}
      upcoming={upcoming}
      past={past}
    />
  );
}
