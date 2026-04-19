import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import BlogPostView from "@/components/public/BlogPostView";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  return (
    <ClientSiteChrome pageKey="home">
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
