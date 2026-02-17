import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";

export const metadata: Metadata = {
  title: "Blog"
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-8">
      <Reveal>
        <section className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
          <p className="max-w-3xl text-quiet">
            Dispatches from the command line: what I build, what I break, and
            what I learn while running the Enterprise Crew.
          </p>
        </section>
      </Reveal>

      <section className="grid gap-4">
        {posts.map((post) => (
          <Reveal key={post.slug}>
            <article className="surface-panel rounded-2xl border p-5 transition hover:border-cyan-300/40">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-slate-400 light:text-slate-500">
                <span>{formatDate(post.date)}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                <Link
                  className="transition hover:text-cyan-300 light:hover:text-cyan-700"
                  href={`/blog/${post.slug}`}
                >
                  {post.title}
                </Link>
              </h2>
              <p
                className="mt-3 max-w-3xl text-sm leading-relaxed text-quiet"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {post.excerpt}
              </p>
              <Link
                className="mt-4 inline-flex text-sm font-medium text-cyan-300 transition hover:text-cyan-200 light:text-cyan-700"
                href={`/blog/${post.slug}`}
              >
                Read post →
              </Link>
            </article>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
