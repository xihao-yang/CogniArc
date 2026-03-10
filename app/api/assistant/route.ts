import OpenAI from "openai";
import { getAllBlogPosts, type BlogPostMeta } from "@/lib/blog";
import { isLocale, type Locale } from "@/i18n/routing";

export const runtime = "nodejs";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function formatBlogContext(posts: BlogPostMeta[], locale: Locale) {
  if (posts.length === 0) {
    return locale === "zh"
      ? "\u5f53\u524d\u6ca1\u6709\u53ef\u7528\u7684\u535a\u5ba2\u6587\u7ae0\u3002"
      : "No blog posts are currently available.";
  }

  return posts
    .slice(0, 6)
    .map((post, index) => {
      const compactSummary = post.summary.replace(/\s+/g, " ").trim().slice(0, 180);
      return `${index + 1}. ${post.title} | ${post.date} | /${locale}/blog/${post.slug} | ${compactSummary}`;
    })
    .join("\n");
}

function buildSystemPrompt(locale: Locale, posts: BlogPostMeta[]) {
  const blogContext = formatBlogContext(posts, locale);

  if (locale === "zh") {
    return [
      "\u4f60\u662f CogniArc \u4e2a\u4eba\u7814\u7a76\u535a\u5ba2\u7684\u5bfc\u89c8\u52a9\u624b\u3002",
      "\u8bf7\u4f7f\u7528\u7b80\u6d01\u4e2d\u6587\u56de\u7b54\uff0c\u4f18\u5148\u63d0\u4f9b\u53ef\u6267\u884c\u7684\u9605\u8bfb\u5efa\u8bae\u3002",
      "\u7ad9\u70b9\u680f\u76ee\uff1a\u9996\u9875\u3001\u535a\u5ba2\u3001\u7814\u7a76\u3001\u7b14\u8bb0\u3001\u52a9\u624b\u3001\u5173\u4e8e\u3002",
      "\u4f18\u5148\u4f7f\u7528\u4e0b\u65b9\u6587\u7ae0\u4e0a\u4e0b\u6587\u6765\u63a8\u8350\u5177\u4f53\u6587\u7ae0\u540d\u79f0\u548c\u8def\u5f84\u3002",
      "\u5982\u679c\u7528\u6237\u95ee\u201c\u4ece\u54ea\u5f00\u59cb\u8bfb\u201d\u7c7b\u95ee\u9898\uff0c\u6309\u4ee5\u4e0b\u987a\u5e8f\u56de\u7b54\uff1a",
      "1) \u63a8\u8350 2-3 \u7bc7\u6700\u65b0\u535a\u5ba2\u6587\u7ae0\uff1b2) \u5f15\u5bfc\u67e5\u770b\u7814\u7a76\u680f\uff1b3) \u8865\u5145\u9605\u8bfb\u7b14\u8bb0\u680f\u3002",
      "\u5982\u679c\u95ee\u9898\u8d85\u51fa\u7ad9\u70b9\u8303\u56f4\uff0c\u8bf7\u660e\u786e\u8bf4\u660e\u5e76\u7ed9\u51fa\u7ad9\u5185\u53ef\u8bfb\u680f\u76ee\u5efa\u8bae\u3002",
      "\u53ef\u7528\u535a\u5ba2\u6587\u7ae0\u4e0a\u4e0b\u6587\uff1a",
      blogContext
    ].join("\n");
  }

  return [
    "You are the guide assistant for the CogniArc personal research blog.",
    "Reply briefly and provide actionable reading recommendations.",
    "Site sections: Home, Blog, Research, Notes, Assistant, About.",
    "Use the blog context below to recommend specific posts by title and path.",
    "If the user asks where to start reading, answer in this order:",
    "1) Suggest 2-3 latest blog posts, 2) recommend the Research section, 3) suggest Notes.",
    "If the question is outside site scope, say so and redirect to relevant sections.",
    "Available blog context:",
    blogContext
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { message?: unknown; locale?: unknown };
    const message = typeof payload.message === "string" ? payload.message.trim() : "";
    const locale: Locale =
      typeof payload.locale === "string" && isLocale(payload.locale) ? payload.locale : "en";

    if (!message) {
      return Response.json({ error: "Invalid message." }, { status: 400 });
    }

    if (!client) {
      return Response.json(
        {
          error: "Missing OPENAI_API_KEY.",
          answer: "Missing OPENAI_API_KEY. Add it to .env.local before using the assistant."
        },
        { status: 500 }
      );
    }

    const posts = await getAllBlogPosts(locale);
    const systemPrompt = buildSystemPrompt(locale, posts);

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? "No answer generated.";
    return Response.json({ answer }, { status: 200 });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("[assistant] OpenAI API error", {
        status: error.status,
        type: error.type,
        code: error.code,
        message: error.message
      });

      const userMessageByCode: Record<string, string> = {
        invalid_api_key:
          "OpenAI API key is invalid. Update OPENAI_API_KEY in .env.local and restart the server.",
        insufficient_quota:
          "OpenAI quota is exhausted. Check billing and usage limits in your OpenAI account."
      };

      const safeAnswer =
        (error.code && userMessageByCode[error.code]) ||
        "OpenAI request failed. Check OPENAI_API_KEY, OPENAI_MODEL, network access, and account quota.";

      return Response.json(
        {
          error: "OpenAI request failed.",
          answer: safeAnswer,
          details: {
            status: error.status,
            type: error.type,
            code: error.code
          }
        },
        { status: error.status ?? 502 }
      );
    }

    console.error("[assistant] Unexpected error", error);

    return Response.json(
      {
        error: "Assistant request failed.",
        answer: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
