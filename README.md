# Bilingual Personal Research Blog (Next.js 14)

## Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- MDX (`content/<locale>/blog/*.mdx`)
- `next-intl` for i18n routing
- OpenAI API for the Assistant page

## Quick start

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/en`
- `http://localhost:3000/zh`

## Environment variables

Create `.env.local`:

```env
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Project structure

```txt
app/
  [locale]/
    about/page.tsx
    assistant/page.tsx
    blog/[slug]/page.tsx
    blog/page.tsx
    layout.tsx
    notes/page.tsx
    page.tsx
    research/page.tsx
  api/assistant/route.ts
  globals.css
components/
  language-switcher.tsx
  mdx-components.tsx
  nav-bar.tsx
content/
  en/blog/welcome.mdx
  zh/blog/welcome.mdx
i18n/
  navigation.ts
  request.ts
  routing.ts
lib/
  blog.ts
messages/
  en.json
  zh.json
middleware.ts
```

## Writing blog posts

Add a new file in:

- `content/en/blog/<slug>.mdx`
- `content/zh/blog/<slug>.mdx`

Use frontmatter:

```mdx
---
title: "Post title"
description: "Short summary"
date: "2026-03-08"
tags:
  - tag1
  - tag2
---

Your MDX content here.
```

