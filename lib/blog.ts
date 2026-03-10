import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { locales } from "@/i18n/routing";
import { slugify } from "@/lib/slug";

export type SiteLocale = (typeof locales)[number];

export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type BlogPostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  locale: SiteLocale;
  readingTimeMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  tableOfContents: TocEntry[];
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function toDateNumber(date: string) {
  const value = Number(new Date(date));
  return Number.isFinite(value) ? value : 0;
}

function resolveBlogDir(locale: SiteLocale) {
  return path.join(CONTENT_ROOT, locale, "blog");
}

function stripMdx(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~-]/g, " ");
}

function estimateReadingTimeMinutes(content: string) {
  const text = stripMdx(content);
  const latinWordCount = (text.match(/[A-Za-z0-9_]+/g) || []).length;
  const cjkCharCount = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const tokenCount = latinWordCount + Math.ceil(cjkCharCount / 2);
  return Math.max(1, Math.ceil(tokenCount / 220));
}

function cleanHeadingText(raw: string) {
  return raw
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]/g, "")
    .trim();
}

function extractTableOfContents(content: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const matches = content.matchAll(/^(##|###)\s+(.+)$/gm);

  for (const match of matches) {
    const level = match[1] === "##" ? 2 : 3;
    const text = cleanHeadingText(match[2]);
    if (!text) continue;
    entries.push({ id: slugify(text), text, level });
  }

  return entries;
}

async function parsePost(filePath: string, locale: SiteLocale, slug: string) {
  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);
  const summary = String(data.summary ?? data.description ?? "");
  const readingTimeMinutes = estimateReadingTimeMinutes(content);

  return {
    title: String(data.title ?? slug),
    summary,
    date: String(data.date ?? "1970-01-01"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    locale,
    content,
    readingTimeMinutes,
    tableOfContents: extractTableOfContents(content)
  };
}

export async function getAllBlogPosts(locale: SiteLocale): Promise<BlogPostMeta[]> {
  const blogDir = resolveBlogDir(locale);

  let filenames: string[] = [];
  try {
    filenames = await fs.readdir(blogDir);
  } catch {
    return [];
  }

  const posts = await Promise.all(
    filenames
      .filter((name) => name.endsWith(".mdx"))
      .map(async (filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        const post = await parsePost(path.join(blogDir, filename), locale, slug);

        return {
          slug,
          title: post.title,
          summary: post.summary,
          date: post.date,
          tags: post.tags,
          locale,
          readingTimeMinutes: post.readingTimeMinutes
        } satisfies BlogPostMeta;
      })
  );

  return posts.sort((a, b) => toDateNumber(b.date) - toDateNumber(a.date));
}

export async function getBlogPost(locale: SiteLocale, slug: string): Promise<BlogPost | null> {
  const filePath = path.join(resolveBlogDir(locale), `${slug}.mdx`);

  try {
    const post = await parsePost(filePath, locale, slug);

    return {
      slug,
      title: post.title,
      summary: post.summary,
      date: post.date,
      tags: post.tags,
      locale,
      content: post.content,
      readingTimeMinutes: post.readingTimeMinutes,
      tableOfContents: post.tableOfContents
    };
  } catch {
    return null;
  }
}

export async function getBlogStaticParams() {
  const all = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getAllBlogPosts(locale);
      return posts.map((post) => ({ locale, slug: post.slug }));
    })
  );

  return all.flat();
}