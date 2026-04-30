import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import BlogPostView from "@/components/public/BlogPostView";
import { buildPageMetadata, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost
    .findUnique({ where: { slug } })
    .catch(() => null);
  if (!post || !post.published) {
    return buildPageMetadata({
      title: "Post não encontrado",
      description: "Este conteúdo não está disponível.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }
  const description = (post.excerpt || post.content || "")
    .replace(/<[^>]+>/g, "")
    .slice(0, 200)
    .trim();
  return buildPageMetadata({
    title: post.title,
    description: description || `Leia "${post.title}" no blog da ${SITE_NAME}.`,
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.coverImage
      ? { url: post.coverImage, alt: post.title }
      : undefined,
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt?.toISOString(),
    authors: post.author ? [post.author] : undefined,
    tags: post.tags
      ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const description = (post.excerpt || post.content || "")
    .replace(/<[^>]+>/g, "")
    .slice(0, 200)
    .trim();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: post.coverImage ? absoluteUrl(post.coverImage) : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: { "@type": "Person", name: post.author || SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/LOGO%20ACOMAC%20Joinville%20-%202020%20-%20FINAL-01.avif`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    inLanguage: "pt-BR",
  };

  return (
    <ClientSiteChrome pageKey="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostView
        backHref="/blog"
        data={{
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          author: post.author,
          tags: post.tags,
          category: post.category,
          readTime: post.readTime,
          publishedAt: post.publishedAt,
        }}
      />
    </ClientSiteChrome>
  );
}
