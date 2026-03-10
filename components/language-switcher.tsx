"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LANGS = ["en", "zh"] as const;

export function LanguageSwitcher() {
  const t = useTranslations("lang");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSwitch(nextLocale: string) {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white p-1 shadow-sm">
      {LANGS.map((item) => {
        const active = item === locale;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onSwitch(item)}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition",
              active
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            ].join(" ")}
          >
            {t(item)}
          </button>
        );
      })}
    </div>
  );
}