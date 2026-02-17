import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/date";

export const revalidate = 3600;

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found"
    };
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-7">
      <Link
        className="inline-flex text-sm font-medium text-cyan-300 transition hover:text-cyan-200 light:text-cyan-700"
        href="/blog"
      >
        ← Back to blog
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-slate-400 light:text-slate-500">
          <span>{formatDate(post.date)}</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
        <p className="text-quiet">{post.excerpt}</p>
      </header>

      <div className="surface-panel rounded-3xl border p-6 sm:p-8">
        <div className="prose prose-invert max-w-none light:prose-slate">
          <MDXRemote components={mdxComponents} source={post.content} />
        </div>
      </div>
    </article>
  );
}
