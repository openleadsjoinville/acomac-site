import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const STATIC_ROUTES: Array<{
  path: string;
  changefreq: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/sobre", changefreq: "monthly", priority: 0.9 },
  { path: "/beneficios", changefreq: "monthly", priority: 0.9 },
  { path: "/cursos", changefreq: "weekly", priority: 0.9 },
  { path: "/eventos", changefreq: "weekly", priority: 0.9 },
  { path: "/convenios", changefreq: "monthly", priority: 0.8 },
  { path: "/conecta-associados", changefreq: "weekly", priority: 0.8 },
  { path: "/blog", changefreq: "daily", priority: 0.8 },
  { path: "/contato", changefreq: "yearly", priority: 0.7 },
  { path: "/participe-do-conecta-associados", changefreq: "yearly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changefreq,
    priority: r.priority,
  }));

  const [posts, events, courses] = await Promise.all([
    prisma.blogPost
      .findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true, publishedAt: true },
        orderBy: { publishedAt: "desc" },
      })
      .catch(() => []),
    prisma.event
      .findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => []),
    prisma.course
      .findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => []),
  ]);

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt ?? p.publishedAt ?? now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${SITE_URL}/eventos#${e.slug}`,
    lastModified: e.updatedAt ?? now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const courseEntries: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/cursos#${c.slug}`,
    lastModified: c.updatedAt ?? now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries, ...eventEntries, ...courseEntries];
}
