import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

type BlogFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
  readTime: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function sortByDateDesc<T extends { date: string }>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function validateFrontmatter(
  data: Partial<BlogFrontmatter>,
  slug: string
): BlogFrontmatter {
  if (!data.title || !data.date || !data.excerpt) {
    throw new Error(`Missing required frontmatter in blog post: ${slug}`);
  }

  return {
    title: data.title,
    date: data.date,
    excerpt: data.excerpt
  };
}

export async function getPostSlugs() {
  const entries = await fs.readdir(BLOG_CONTENT_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.replace(/\.mdx$/, ""));
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const slugs = await getPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`);
      const source = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(source);
      const frontmatter = validateFrontmatter(data as Partial<BlogFrontmatter>, slug);
      const stats = readingTime(content);

      return {
        slug,
        ...frontmatter,
        readTime: stats.text
      };
    })
  );

  return sortByDateDesc(posts);
}

export async function getLatestPosts(limit = 3) {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`);

  try {
    const source = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(source);
    const frontmatter = validateFrontmatter(data as Partial<BlogFrontmatter>, slug);
    const stats = readingTime(content);

    return {
      slug,
      ...frontmatter,
      readTime: stats.text,
      content
    };
  } catch {
    return null;
  }
}
