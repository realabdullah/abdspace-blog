<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;
const { data: post } = await useAsyncData(`post-${slug}`, () => queryCollection("writings").where("slug", "=", slug).first());
const { data: writings } = await useAsyncData("writing-order", () => queryCollection("writings").order("createdAt", "DESC").all());
if (!post.value) throw createError({ statusCode: 404, statusMessage: "Writing not found" });
const canonicalUrl = `https://writings.abdspace.xyz/${slug}`;
const writingIndex = computed(() => {
	const index = writings.value?.findIndex((writing) => writing.slug === post.value?.slug) ?? -1;
	return index >= 0 ? String(index + 1).padStart(2, "0") : "--";
});
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
defineOgImage("Writings", { title: post.value.title, description: post.value.description, section: "Writings" });
</script>

<template>
	<div class="article-page mx-auto min-h-screen max-w-[1440px] px-6 sm:px-10 lg:px-20">
		<header class="article-nav flex h-20 items-center justify-between border-b font-mono text-[10px] tracking-[0.12em] uppercase">
			<NuxtLink to="/" class="transition-colors hover:text-coral">← Writings</NuxtLink
			><NuxtLink to="https://www.abdspace.xyz" class="article-brand text-lg font-semibold tracking-[-0.035em]">ABD<span class="ml-0.5 text-coral">·</span></NuxtLink>
		</header>
		<main class="article-main min-w-0">
			<header class="article-hero">
				<div class="article-kicker font-mono text-[10px] tracking-[0.12em] uppercase">({{ writingIndex }}) / Writings</div>
				<div class="article-intro">
					<div class="article-meta font-mono text-[10px] tracking-[0.1em] uppercase">
						<span>{{ formatDate(post.createdAt) }}</span
						><span>·</span><span>{{ post.readTime }} min read</span>
					</div>
					<h1>{{ post.title }}</h1>
					<p class="article-summary">{{ post.brief }}</p>
				</div>
			</header>
			<div class="article-content-grid">
				<aside class="article-side-note font-mono text-[10px] tracking-[0.1em] uppercase">Read slowly.<br />Take what’s useful.</aside>
				<article class="article-body">
					<ContentRenderer :value="post" />
				</article>
			</div>
		</main>
		<footer class="article-footer flex min-h-20 items-center justify-between border-t py-5 font-mono text-[10px] tracking-[0.1em] uppercase">
			<NuxtLink to="/">← All writings</NuxtLink><NuxtLink to="https://www.abdspace.xyz/#contact">Start a conversation ↗</NuxtLink>
		</footer>
	</div>
</template>
