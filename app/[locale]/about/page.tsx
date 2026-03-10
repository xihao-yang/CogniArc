import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/routing";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;

  return {
    title: locale === "zh" ? "\u5173\u4e8e" : "About",
    description:
      locale === "zh"
        ? "\u4e86\u89e3 CogniArc \u7684\u5199\u4f5c\u76ee\u6807\u4e0e\u7814\u7a76\u65b9\u5411\u3002"
        : "Learn about CogniArc and the goals behind this research journal."
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
      <p className="text-slate-700">{t("description")}</p>
      <p className="text-slate-600">{t("body")}</p>

      <div className="surface mt-6 p-5">
        <p className="text-sm font-medium text-slate-700">Focus areas</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Agent architecture and reliability</li>
          <li>Production engineering practices</li>
          <li>Tooling workflows for research iteration</li>
        </ul>
      </div>
    </section>
  );
}