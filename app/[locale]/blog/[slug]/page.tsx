import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/navigation";
import { mdxComponents } from "@/components/mdx-components";
import { defaultLocale, isLocale, type Locale } from "@/i18n/routing";
import { getBlogPost, getBlogStaticParams } from "@/lib/blog";

type Props = {
  params: { locale: string; slug: string };
};

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(date));
}

export async function generateStaticParams() {
  return getBlogStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const post = await getBlogPost(locale, params.slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      locale
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = params;
  if (!isLocale(locale)) notFound();

  const [t, post] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
    getBlogPost(locale, slug)
  ]);

  if (!post) notFound();

  return (
    <section className="space-y-6">
      <Link href="/blog" className="inline-flex text-sm font-medium text-teal-700 hover:text-teal-900">
        {"<- "}{t("backToBlog")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
        <article className="min-w-0">
          <header className="mb-8 border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{t("publishedOn")}: {formatDate(post.date, locale)}</span>
              <span>|</span>
              <span>{post.readingTimeMinutes} {t("readingTime")}</span>
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-slate-900">
              {post.title}
            </h1>
            <p className="mt-3 text-slate-600">{post.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-pre:my-6">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm]
                }
              }}
              components={mdxComponents}
            />
          </div>
        </article>

        {post.tableOfContents.length > 0 && (
          <aside className="surface h-fit p-4 lg:sticky lg:top-24">
            <h2 className="font-serif text-lg font-semibold text-slate-900">{t("toc")}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {post.tableOfContents.map((entry) => (
                <li key={`${entry.level}-${entry.id}`}>
                  <a
                    href={`#${entry.id}`}
                    className={[
                      "block text-slate-600 hover:text-teal-700",
                      entry.level === 3 ? "pl-4" : "pl-0"
                    ].join(" ")}
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
}