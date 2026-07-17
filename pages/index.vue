<script setup lang="ts">
const { data: posts } = await useAsyncData("blog-posts", () => queryCollection("blog").order("createdAt", "DESC").all());
useSeoMeta({
	title: "Writings — Abdullahi Odesanmi",
	description: "Notes on frontend engineering, tools, experiments and what I’m learning.",
});
</script>

<template>
	<div class="mx-auto min-h-screen max-w-[1440px] px-6 sm:px-10 lg:px-20">
		<header class="flex h-20 items-center justify-between border-b border-ink/15 font-mono text-[10px] tracking-[0.12em] uppercase">
			<NuxtLink to="https://www.abdspace.xyz" class="transition-colors hover:text-coral">← Abdspace</NuxtLink>
			<!-- <NuxtLink to="/admin" class="transition-colors hover:text-coral">Author access ↗</NuxtLink> -->
		</header>
		<main class="py-20 sm:py-28">
			<div class="grid gap-12 border-t border-ink pt-4 lg:grid-cols-[1fr_2fr]">
				<p class="font-mono text-[10px] tracking-[0.12em] text-stone-500 uppercase">(01) / Writings</p>
				<div>
					<h1 class="text-[clamp(3.5rem,9vw,9rem)] leading-[0.86] font-medium tracking-[-0.095em]">Notes &amp;<br /><em class="font-serif font-normal text-coral">observations.</em></h1>
					<p class="mt-10 max-w-xl text-base leading-relaxed text-stone-500">Writing on frontend engineering, tools, experiments and the things I’m learning along the way.</p>
				</div>
			</div>
			<ol class="mt-28 border-t border-ink/15">
				<li v-for="(post, index) in posts" :key="post.path" class="group grid gap-6 border-b border-ink/15 py-10 sm:grid-cols-[56px_1fr_160px] sm:items-start sm:gap-8 sm:py-14">
					<span class="font-mono text-[10px] text-stone-500">{{ String(index + 1).padStart(2, "0") }}</span>
					<div>
						<NuxtLink :to="`/${post.slug}`" class="text-3xl tracking-[-0.07em] transition-colors group-hover:text-coral sm:text-5xl">{{ post.title }}</NuxtLink>
						<p class="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500">
							{{ post.brief }}
						</p>
					</div>
					<div class="font-mono text-[10px] tracking-[0.1em] text-stone-500 uppercase sm:pt-2">
						<ClientOnly>{{ formatDate(post.createdAt) }}</ClientOnly
						><NuxtLink :to="`/${post.slug}`" class="mt-4 block text-coral">Read · {{ post.readTime }} min ↗</NuxtLink>
					</div>
				</li>
			</ol>
		</main>
		<footer class="flex min-h-20 items-center justify-between border-t border-ink/15 py-5 font-mono text-[10px] tracking-[0.1em] text-stone-500 uppercase">
			<NuxtLink to="https://www.abdspace.xyz">Abdullahi Odesanmi</NuxtLink><a href="/feed.xml">RSS ↗</a>
		</footer>
	</div>
</template>
