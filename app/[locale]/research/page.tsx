import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/routing";
import { getResearchProjects } from "@/lib/site-data";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;

  return {
    title: locale === "zh" ? "\u7814\u7a76" : "Research",
    description:
      locale === "zh"
        ? "\u7814\u7a76\u9879\u76ee\u5c55\u793a\u4e0e\u5b9e\u9a8c\u8fdb\u5c55\u3002"
        : "Showcase of research projects and ongoing implementation experiments."
  };
}

export default async function ResearchPage({ params }: Props) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "research" });
  const projects = getResearchProjects(locale);

  return (
    <section className="space-y-5">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
        <p className="mt-2 text-slate-600">{t("description")}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 reveal-stagger">
        {projects.map((project) => (
          <article key={project.slug} className="surface flex h-full flex-col p-5">
            <h2 className="text-xl font-semibold text-slate-900">{project.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex text-sm font-medium text-teal-700 hover:text-teal-900"
            >
              {t("viewProject")} {"->"}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}