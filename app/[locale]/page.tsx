import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { defaultLocale, isLocale, type Locale } from "@/i18n/routing";
import { getAllBlogPosts } from "@/lib/blog";
import { getFeaturedResearchProjects } from "@/lib/site-data";

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
    title: locale === "zh" ? "\u9996\u9875" : "Home",
    description:
      locale === "zh"
        ? "CogniArc \u4e2a\u4eba\u7814\u7a76\u535a\u5ba2\uff1aAI Agent\u3001\u8f6f\u4ef6\u5de5\u7a0b\u4e0e\u5f00\u53d1\u5de5\u5177\u3002"
        : "CogniArc personal research blog on AI agents, software engineering, and tooling.",
    openGraph: {
      title: locale === "zh" ? "CogniArc \u9996\u9875" : "CogniArc Home"
    }
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();

  const [t, posts] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getAllBlogPosts(locale)
  ]);

  const recentPosts = posts.slice(0, 3);
  const featuredProjects = getFeaturedResearchProjects(locale, 3);

  return (
    <section className="space-y-8">
      <div className="surface overflow-hidden p-8 sm:p-10">
        <p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
          {t("badge")}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-xl text-slate-700">{t("subtitle")}</p>
        <p className="mt-4 max-w-3xl text-slate-600">{t("description")}</p>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700">{t("interestsTitle")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[t("interest1"), t("interest2"), t("interest3")].map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
            {t("recentTitle")}
          </h2>
          <Link href="/blog" className="text-sm font-medium text-teal-700 hover:text-teal-900">
            {t("viewAllBlog")}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3 reveal-stagger">
          {recentPosts.map((post) => (
            <article key={post.slug} className="surface p-5">
              <p className="text-xs text-slate-500">
                {formatDate(post.date, locale)} | {post.readingTimeMinutes} min
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{post.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{post.summary}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-900"
              >
                Read {"->"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
            {t("researchTitle")}
          </h2>
          <Link
            href="/research"
            className="text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            {t("viewAllResearch")}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3 reveal-stagger">
          {featuredProjects.map((project) => (
            <article key={project.slug} className="surface p-5">
              <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.techStack.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
            {t("assistantTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{t("assistantDescription")}</p>
        </div>
        <Link
          href="/assistant"
          className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          {t("openAssistant")}
        </Link>
      </section>
    </section>
  );
}