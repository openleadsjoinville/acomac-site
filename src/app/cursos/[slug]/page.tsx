import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getGlobalContent } from "@/lib/content/get";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import CourseDetailView from "@/components/public/CourseDetailView";
import { buildPageMetadata, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { resumo } from "@/lib/rich-text";

// ISR igual ao /blog/[slug]: gerada sob demanda no primeiro acesso, cacheada no
// CDN e revalidada a cada 5 min ou quando o curso é salvo no admin
// (revalidateCursos em @/lib/revalidate).
export const revalidate = 300;

async function getCourse(slug: string) {
  return prisma.course.findUnique({ where: { slug } }).catch(() => null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course || !course.published) {
    return buildPageMetadata({
      title: "Curso não encontrado",
      description: "Este curso não está disponível.",
      path: `/cursos/${slug}`,
      noIndex: true,
    });
  }
  const description =
    resumo(course.description || course.content, 200) ||
    `Conheça o curso "${course.title}" da Academia da Construção da ${SITE_NAME}.`;
  return buildPageMetadata({
    title: course.title,
    description,
    path: `/cursos/${course.slug}`,
    image: course.image ? { url: course.image, alt: course.title } : undefined,
  });
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course || !course.published) notFound();

  const global = await getGlobalContent();
  const fallbackWhatsapp = global?.whatsapp?.number ?? "";

  const description = resumo(course.description || course.content, 200);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description,
    url: `${SITE_URL}/cursos/${course.slug}`,
    image: course.image ? absoluteUrl(course.image) : undefined,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(course.instructor
      ? { instructor: { "@type": "Person", name: course.instructor } }
      : {}),
    ...(course.startDate
      ? {
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "onsite",
            startDate: course.startDate.toISOString(),
            ...(course.endDate ? { endDate: course.endDate.toISOString() } : {}),
            location: {
              "@type": "Place",
              name: `Sede da ${SITE_NAME}`,
              address: "Joinville, SC",
            },
          },
        }
      : {}),
    inLanguage: "pt-BR",
  };

  return (
    <ClientSiteChrome pageKey="cursos">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CourseDetailView
        course={{
          slug: course.slug,
          title: course.title,
          description: course.description,
          content: course.content,
          category: course.category,
          duration: course.duration,
          level: course.level,
          price: course.price,
          instructor: course.instructor,
          image: course.image,
          ctaType: course.ctaType,
          ctaLabel: course.ctaLabel,
          ctaHref: course.ctaHref,
          ctaWhatsappNumber: course.ctaWhatsappNumber,
          ctaWhatsappMessage: course.ctaWhatsappMessage,
          startDate: course.startDate ? course.startDate.toISOString() : null,
          endDate: course.endDate ? course.endDate.toISOString() : null,
        }}
        fallbackWhatsapp={fallbackWhatsapp}
      />
    </ClientSiteChrome>
  );
}
