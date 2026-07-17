<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;
const { data: post } = await useAsyncData(`post-${slug}`, () => queryCollection("blog").where("slug", "=", slug).first());
if (!post.value) throw createError({ statusCode: 404, statusMessage: "Writing not found" });
const canonicalUrl = `https://blog.abdspace.xyz/${slug}`;
useSeoMeta({
	title: `${post.value.title} — Abdullahi Odesanmi`,
	description: post.value.description,
	ogTitle: post.value.title,
	ogDescription: post.value.description,
	ogType: "article",
	ogUrl: canonicalUrl,
	articlePublishedTime: post.value.createdAt,
	twitterCard: "summary_large_image",
});
useHead({
	link: [{ rel: "canonical", href: canonicalUrl }],
	script: [
		{
			type: "application/ld+json",
			innerHTML: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "BlogPosting",
				headline: post.value.title,
				description: post.value.description,
				datePublished: post.value.createdAt,
				mainEntityOfPage: canonicalUrl,
				author: {
					"@type": "Person",
					name: "Abdullahi Odesanmi",
					url: "https://www.abdspace.xyz",
				},
			}),
		},
	],
});
</script>

<template>
	<div class="mx-auto min-h-screen max-w-[1440px] px-6 sm:px-10 lg:px-20">
		<header class="flex h-20 items-center justify-between border-b border-ink/15 font-mono text-[10px] tracking-[0.12em] uppercase">
			<NuxtLink to="/" class="transition-colors hover:text-coral">← Writings</NuxtLink
			><NuxtLink to="https://www.abdspace.xyz" class="text-lg font-semibold tracking-[-0.035em]">ABD<span class="ml-0.5 text-coral">·</span></NuxtLink>
		</header>
		<main class="grid min-w-0 gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20 lg:py-28">
			<aside class="font-mono text-[10px] tracking-[0.12em] text-stone-500 uppercase">
				(01) / Journal<span class="mt-4 block">{{ post.readTime }} min read</span>
			</aside>
			<article class="min-w-0 max-w-3xl">
				<div class="font-mono text-[10px] tracking-[0.1em] text-stone-500 uppercase">
					{{ formatDate(post.createdAt) }}
				</div>
				<h1 class="mt-6 text-[clamp(2.65rem,7vw,7rem)] leading-[0.92] font-medium tracking-[-0.08em] break-words">
					{{ post.title }}
				</h1>
				<p class="mt-10 border-l-2 border-coral pl-5 text-base leading-relaxed text-stone-500">
					{{ post.brief }}
				</p>
				<div class="my-14 border-t border-ink/15"></div>
				<div class="prose-writing max-w-none min-w-0 text-[15px] leading-[1.85] text-stone-700">
					<ContentRenderer :value="post" />
				</div>
			</article>
		</main>
		<footer class="flex min-h-20 items-center justify-between border-t border-ink/15 py-5 font-mono text-[10px] tracking-[0.1em] text-stone-500 uppercase">
			<NuxtLink to="/">← All writings</NuxtLink><NuxtLink to="https://www.abdspace.xyz/#contact">Start a conversation ↗</NuxtLink>
		</footer>
	</div>
</template>
