import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { getAllBlogPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticPaths = ["", "/blog", "/research", "/notes", "/assistant", "/about"];

  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((pathname) => ({
      url: `${baseUrl}/${locale}${pathname}`,
      changeFrequency: pathname === "" ? ("weekly" as const) : ("monthly" as const),
      priority: pathname === "" ? 1 : 0.7,
      lastModified: new Date()
    }))
  );

  const postEntriesByLocale = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getAllBlogPosts(locale);
      return posts.map((post) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        lastModified: new Date(post.date)
      }));
    })
  );

  return [...staticEntries, ...postEntriesByLocale.flat()];
}