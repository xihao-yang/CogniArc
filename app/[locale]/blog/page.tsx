import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { defaultLocale, isLocale, type Locale } from "@/i18n/routing";
import { getAllBlogPosts } from "@/lib/blog";

type Props = {
  params: { locale: string };
};

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(date));
}

export async function generateMetadata({ params }: Props) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;

  return {
    title: locale === "zh" ? "\u535a\u5ba2" : "Blog",
    description:
      locale === "zh"
        ? "\u67e5\u770b\u957f\u6587\u6280\u672f\u6587\u7ae0\u4e0e\u7814\u7a76\u53cd\u601d\u3002"
        : "Read long-form technical writing and research reflections.",
    openGraph: {
      title: locale === "zh" ? "CogniArc \u535a\u5ba2" : "CogniArc Blog"
    }
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getAllBlogPosts(locale);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
        <p className="text-slate-600">{t("description")}</p>
      </header>

      {posts.length === 0 ? (
        <p className="surface p-4 text-slate-600">{t("empty")}</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug} className="surface p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{t("publishedOn")}: {formatDate(post.date, locale)}</span>
                <span>|</span>
                <span>{post.readingTimeMinutes} {t("readingTime")}</span>
              </div>

              <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-slate-900">
                {post.title}
              </h2>
              <p className="mt-2 text-slate-600">{post.summary}</p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-teal-700 hover:text-teal-900">
                  {t("readMore")} {"->"}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}