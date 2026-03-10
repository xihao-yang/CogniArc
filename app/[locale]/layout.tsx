import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChatWidget } from "@/components/chat-widget";
import { NavBar } from "@/components/nav-bar";
import { defaultLocale, isLocale, locales } from "@/i18n/routing";
import "@/app/globals.css";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

const SITE = {
  en: {
    title: "CogniArc Research Journal",
    description:
      "Personal academic and technical writing on AI agents, software engineering, and developer tooling."
  },
  zh: {
    title: "CogniArc \u7814\u7a76\u65e5\u5fd7",
    description:
      "\u5173\u4e8e AI Agent\u3001\u8f6f\u4ef6\u5de5\u7a0b\u4e0e\u5f00\u53d1\u5de5\u5177\u7684\u4e2a\u4eba\u5b66\u672f\u4e0e\u6280\u672f\u5199\u4f5c\u3002"
  }
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const meta = SITE[locale];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: meta.title,
      template: `%s | ${meta.title}`
    },
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        zh: "/zh"
      }
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
      type: "website",
      locale
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-teal-100/40 to-transparent" />
            <NavBar />
            <main className="page-enter mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
            <ChatWidget />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}