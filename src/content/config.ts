// Astro 콘텐츠 콜렉션 설정 - Keystatic 스키마와 일치
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// 블로그 포스트 (Keystatic에서 관리)
const posts = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        pubDate: z.coerce.date(),
    }),
});

export const collections = {
    posts,
};
