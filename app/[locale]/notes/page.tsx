import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/routing";
import { getNoteCategories } from "@/lib/site-data";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;

  return {
    title: locale === "zh" ? "\u7b14\u8bb0" : "Notes",
    description:
      locale === "zh"
        ? "\u6309\u5206\u7c7b\u5c55\u793a\u7684\u6280\u672f\u5b66\u4e60\u7b14\u8bb0\u3002"
        : "Technical notes grouped by frontend, backend, frameworks, and dev tools."
  };
}

export default async function NotesPage({ params }: Props) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "notes" });
  const categories = getNoteCategories(locale);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
        <p className="mt-2 text-slate-600">{t("description")}</p>
      </header>

      <div className="space-y-6">
        {categories.map((category) => (
          <section key={category.key} className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
              {category.label}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {category.notes.map((note) => (
                <article key={note.title} className="surface p-4">
                  <h3 className="font-medium text-slate-900">{note.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{note.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}