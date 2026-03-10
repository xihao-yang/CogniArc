import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/routing";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;

  return {
    title: locale === "zh" ? "\u52a9\u624b" : "Assistant",
    description:
      locale === "zh"
        ? "\u4f7f\u7528\u5185\u7f6e AI \u52a9\u624b\u4e86\u89e3\u7f51\u7ad9\u7ed3\u6784\u4e0e\u5185\u5bb9\u3002"
        : "Use the built-in AI assistant to navigate the website content."
  };
}

export default async function AssistantPage({ params }: Props) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "assistant" });

  return (
    <section className="space-y-5">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
      <p className="max-w-3xl text-slate-600">{t("description")}</p>

      <div className="surface max-w-3xl p-5">
        <h2 className="font-serif text-xl font-semibold text-slate-900">How to use</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Open the floating chat button at the bottom-right corner.</li>
          <li>Ask about sections, topics, or recommended reading order.</li>
          <li>The assistant responds using this site context via <code>/api/assistant</code>.</li>
        </ol>
      </div>
    </section>
  );
}