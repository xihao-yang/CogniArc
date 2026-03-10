import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const localeCandidate = await requestLocale;
  const locale = localeCandidate && isLocale(localeCandidate) ? localeCandidate : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});