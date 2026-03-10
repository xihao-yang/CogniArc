<<<<<<< HEAD
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
=======
# CogniArc

[English](#english) | [中文](#中文)

---

# English

## Overview

**CogniArc** is an AI-native personal research blog and knowledge space.

It combines:

- Technical blogging
- Research documentation
- Learning notes
- An AI assistant that helps visitors navigate the website

Instead of navigating only through menus, visitors can ask the AI guide questions such as:

> Where should I start reading?

and receive suggestions based on the site content.

The goal of CogniArc is to serve as a **long-term research notebook for AI systems, software engineering, and developer tools.**

---

## Features

- Next.js App Router architecture
- MDX-based blogging system
- Bilingual content (English / Chinese)
- AI assistant powered by OpenAI
- Structured sections for research and notes
- Clean academic-style layout

---

## Tech Stack

- Next.js
- TypeScript
- TailwindCSS
- MDX
- next-intl (i18n)
- OpenAI API

# 中文

## 项目简介

**CogniArc** 是一个 **AI 原生的个人研究博客与知识空间**。

它融合了：

- 技术博客  
- 研究记录  
- 学习笔记  
- AI 导览助手  

访问者不仅可以通过菜单浏览，还可以直接询问 AI：

> 我应该从哪里开始阅读？

AI 会根据网站内容给出推荐。

CogniArc 的目标是成为一个 **长期记录 AI、软件工程与开发工具研究过程的个人研究日志**。

---

## 主要功能

- 基于 **Next.js App Router** 构建  
- 使用 **MDX** 作为博客系统  
- **中英双语支持**  
- **AI 导览助手**  
- **Research / Notes** 结构化知识页面  
- 简洁的研究型网站布局  

---

## 技术栈

- Next.js  
- TypeScript  
- TailwindCSS  
- MDX  
- next-intl（国际化）  
- OpenAI API  

---

## 版本

### v0.1 – Initial Release

First working version of the website.

Features:

- Bilingual routing (`/en` `/zh`)
- Blog system based on MDX
- Research and notes sections
- AI guide that answers questions about the website
- Next.js deployment ready
>>>>>>> 2d00ffd4dc269b60d55c017cbe77f7ae70189feb

