import { locales } from "@/i18n/routing";

export type SiteLocale = (typeof locales)[number];

type LocalizedText = Record<SiteLocale, string>;

export type ResearchProject = {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  href: string;
  featured: boolean;
};

type ResearchSeed = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  techStack: string[];
  href: string;
  featured?: boolean;
};

const RESEARCH_PROJECTS: ResearchSeed[] = [
  {
    slug: "agent-evals",
    title: {
      en: "Agent Evaluation Workbench",
      zh: "Agent \u8bc4\u6d4b\u5de5\u4f5c\u53f0"
    },
    description: {
      en: "Benchmarking multi-step tool-use reliability with reproducible test suites.",
      zh: "\u4f7f\u7528\u53ef\u590d\u73b0\u6d4b\u8bd5\u5957\u4ef6\u8bc4\u4f30\u591a\u6b65\u5de5\u5177\u8c03\u7528\u7684\u53ef\u9760\u6027\u3002"
    },
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI API"],
    href: "https://github.com",
    featured: true
  },
  {
    slug: "memory-retrieval",
    title: {
      en: "Memory Retrieval Study",
      zh: "\u8bb0\u5fc6\u68c0\u7d22\u7814\u7a76"
    },
    description: {
      en: "Comparing context window, vector retrieval, and hybrid memory pipelines.",
      zh: "\u5bf9\u6bd4\u4e0a\u4e0b\u6587\u7a97\u53e3\u3001\u5411\u91cf\u68c0\u7d22\u4e0e\u6df7\u5408\u8bb0\u5fc6\u7ba1\u7ebf\u3002"
    },
    techStack: ["Python", "FAISS", "FastAPI", "Redis"],
    href: "https://github.com",
    featured: true
  },
  {
    slug: "devtool-observability",
    title: {
      en: "Developer Tooling Observability",
      zh: "\u5f00\u53d1\u5de5\u5177\u53ef\u89c2\u6d4b\u6027"
    },
    description: {
      en: "Tracing task latency and failure modes across agent orchestration layers.",
      zh: "\u5728 Agent \u7f16\u6392\u5c42\u4e2d\u8ddf\u8e2a\u4efb\u52a1\u5ef6\u8fdf\u4e0e\u5931\u8d25\u6a21\u5f0f\u3002"
    },
    techStack: ["OpenTelemetry", "Node.js", "Grafana", "Docker"],
    href: "https://github.com",
    featured: true
  },
  {
    slug: "mdx-knowledge-base",
    title: {
      en: "MDX Research Knowledge Base",
      zh: "MDX \u7814\u7a76\u77e5\u8bc6\u5e93"
    },
    description: {
      en: "Designing a bilingual publishing workflow for research notes and technical essays.",
      zh: "\u8bbe\u8ba1\u53cc\u8bed\u7814\u7a76\u7b14\u8bb0\u4e0e\u6280\u672f\u6587\u7ae0\u7684\u53d1\u5e03\u6d41\u7a0b\u3002"
    },
    techStack: ["Next.js", "MDX", "next-intl", "TailwindCSS"],
    href: "https://github.com",
    featured: false
  }
];

type NoteSeed = {
  title: LocalizedText;
  summary: LocalizedText;
};

type NoteCategorySeed = {
  key: "frontend" | "backend" | "frameworks" | "devtools";
  label: LocalizedText;
  notes: NoteSeed[];
};

export type NoteCategory = {
  key: NoteCategorySeed["key"];
  label: string;
  notes: {
    title: string;
    summary: string;
  }[];
};

const NOTE_CATEGORIES: NoteCategorySeed[] = [
  {
    key: "frontend",
    label: { en: "Frontend", zh: "\u524d\u7aef" },
    notes: [
      {
        title: {
          en: "Streaming UI patterns in App Router",
          zh: "App Router \u4e2d\u7684\u6d41\u5f0f UI \u6a21\u5f0f"
        },
        summary: {
          en: "Use progressive loading boundaries for content-heavy research pages.",
          zh: "\u5728\u5185\u5bb9\u5bc6\u96c6\u9875\u9762\u4e2d\u4f7f\u7528\u6e10\u8fdb\u5f0f\u52a0\u8f7d\u8fb9\u754c\u3002"
        }
      },
      {
        title: {
          en: "Accessible interaction checklist",
          zh: "\u53ef\u8bbf\u95ee\u4ea4\u4e92\u68c0\u67e5\u6e05\u5355"
        },
        summary: {
          en: "Audit focus states, keyboard navigation, and semantic landmarks.",
          zh: "\u5ba1\u6838\u7126\u70b9\u72b6\u6001\u3001\u952e\u76d8\u5bfc\u822a\u4e0e\u8bed\u4e49\u6807\u8bb0\u3002"
        }
      }
    ]
  },
  {
    key: "backend",
    label: { en: "Backend", zh: "\u540e\u7aef" },
    notes: [
      {
        title: {
          en: "Structured API error envelopes",
          zh: "\u7ed3\u6784\u5316 API \u9519\u8bef\u54cd\u5e94"
        },
        summary: {
          en: "Keep machine-parseable error codes for assistant and tool endpoints.",
          zh: "\u4e3a\u52a9\u624b\u4e0e\u5de5\u5177\u7aef\u70b9\u4fdd\u6301\u53ef\u673a\u5668\u89e3\u6790\u7684\u9519\u8bef\u4ee3\u7801\u3002"
        }
      },
      {
        title: {
          en: "Token budget instrumentation",
          zh: "Token \u9884\u7b97\u76d1\u63a7"
        },
        summary: {
          en: "Track prompt/response token usage to optimize model cost and latency.",
          zh: "\u8ddf\u8e2a Prompt \u4e0e\u56de\u590d token \u4f7f\u7528\uff0c\u4f18\u5316\u6210\u672c\u4e0e\u5ef6\u8fdf\u3002"
        }
      }
    ]
  },
  {
    key: "frameworks",
    label: { en: "Frameworks", zh: "\u6846\u67b6" },
    notes: [
      {
        title: {
          en: "next-intl route ownership",
          zh: "next-intl \u8def\u7531\u89c4\u5219"
        },
        summary: {
          en: "Maintain locale-aware links through centralized navigation helpers.",
          zh: "\u901a\u8fc7\u96c6\u4e2d\u5bfc\u822a\u5de5\u5177\u4fdd\u6301\u591a\u8bed\u94fe\u63a5\u4e00\u81f4\u6027\u3002"
        }
      },
      {
        title: {
          en: "MDX authoring conventions",
          zh: "MDX \u5199\u4f5c\u89c4\u8303"
        },
        summary: {
          en: "Use stable frontmatter keys to simplify SEO and content tooling.",
          zh: "\u7edf\u4e00 frontmatter \u5b57\u6bb5\uff0c\u964d\u4f4e SEO \u4e0e\u5185\u5bb9\u5de5\u5177\u7684\u590d\u6742\u5ea6\u3002"
        }
      }
    ]
  },
  {
    key: "devtools",
    label: { en: "Dev tools", zh: "\u5f00\u53d1\u5de5\u5177" },
    notes: [
      {
        title: {
          en: "CLI-first debugging loop",
          zh: "CLI \u4f18\u5148\u7684\u8c03\u8bd5\u95ed\u73af"
        },
        summary: {
          en: "Capture reproducible diagnostics before patching behavior changes.",
          zh: "\u5728\u4fee\u590d\u4e4b\u524d\u5148\u7559\u5b58\u53ef\u590d\u73b0\u7684\u8bca\u65ad\u8bb0\u5f55\u3002"
        }
      },
      {
        title: {
          en: "Automated regression snapshots",
          zh: "\u81ea\u52a8\u5316\u56de\u5f52\u5feb\u7167"
        },
        summary: {
          en: "Use baseline screenshots and logs to catch subtle UI regressions.",
          zh: "\u901a\u8fc7\u57fa\u7ebf\u622a\u56fe\u4e0e\u65e5\u5fd7\u53ca\u65f6\u53d1\u73b0 UI \u7ec6\u5fae\u56de\u5f52\u3002"
        }
      }
    ]
  }
];

export function getResearchProjects(locale: SiteLocale): ResearchProject[] {
  return RESEARCH_PROJECTS.map((item) => ({
    slug: item.slug,
    title: item.title[locale],
    description: item.description[locale],
    techStack: item.techStack,
    href: item.href,
    featured: Boolean(item.featured)
  }));
}

export function getFeaturedResearchProjects(locale: SiteLocale, limit = 3): ResearchProject[] {
  return getResearchProjects(locale)
    .filter((item) => item.featured)
    .slice(0, limit);
}

export function getNoteCategories(locale: SiteLocale): NoteCategory[] {
  return NOTE_CATEGORIES.map((category) => ({
    key: category.key,
    label: category.label[locale],
    notes: category.notes.map((note) => ({
      title: note.title[locale],
      summary: note.summary[locale]
    }))
  }));
}