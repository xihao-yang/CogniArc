import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { slugify } from "@/lib/slug";

function getNodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (typeof node === "object" && "props" in node) {
    return getNodeText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

function headingClasses(level: 2 | 3) {
  return level === 2
    ? "mt-10 scroll-mt-28 border-b border-slate-200 pb-2 text-2xl font-semibold tracking-tight"
    : "mt-8 scroll-mt-28 text-xl font-semibold tracking-tight";
}

export const mdxComponents: MDXComponents = {
  a: (props) => (
    <a
      {...props}
      className="font-medium text-teal-700 underline decoration-teal-200 decoration-2 underline-offset-4 hover:text-teal-900"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noreferrer" : undefined}
    />
  ),
  h2: (props) => {
    const text = getNodeText(props.children);
    return <h2 {...props} id={slugify(text)} className={headingClasses(2)} />;
  },
  h3: (props) => {
    const text = getNodeText(props.children);
    return <h3 {...props} id={slugify(text)} className={headingClasses(3)} />;
  },
  blockquote: (props) => (
    <blockquote
      {...props}
      className="border-l-4 border-slate-300 bg-slate-50 px-4 py-1 text-slate-700"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="overflow-x-auto rounded-lg border border-slate-300 bg-slate-950 p-4 text-slate-100"
    />
  ),
  code: (props) => (
    <code
      {...props}
      className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.92em] text-slate-800"
    />
  )
};