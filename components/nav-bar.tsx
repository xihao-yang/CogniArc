"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

const LINKS = [
  { key: "home", href: "/" },
  { key: "blog", href: "/blog" },
  { key: "research", href: "/research" },
  { key: "notes", href: "/notes" },
  { key: "assistant", href: "/assistant" },
  { key: "about", href: "/about" }
] as const;

export function NavBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            CA
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-slate-900">CogniArc</span>
        </Link>

        <div className="ml-auto">
          <LanguageSwitcher />
        </div>

        <nav className="flex w-full flex-wrap items-center gap-1 text-sm">
          {LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={[
                  "rounded-full px-3 py-1.5 transition",
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                ].join(" ")}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}