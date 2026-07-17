import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const postSchema = z.object({
	title: z.string().min(1),
	createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "createdAt must be a valid ISO date"),
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case"),
	readTime: z.coerce.number().int().positive(),
	brief: z.string().min(1),
	description: z.string().min(1),
});

export default defineContentConfig({
	collections: {
		blog: defineCollection({
			type: "page",
			source: "blog/*.md",
			schema: postSchema,
		}),
	},
});
