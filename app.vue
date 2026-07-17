<script setup lang="ts">
const route = useRoute();
const canonicalUrl = computed(() => `https://blog.abdspace.xyz${route.path === "/" ? "" : route.path}`);
useSeoMeta({
	ogSiteName: "Abdullahi Odesanmi — Writings",
	ogLocale: "en_NG",
	ogUrl: canonicalUrl,
	twitterCard: "summary_large_image",
	robots: "index, follow, max-image-preview:large",
});
useHead({
	htmlAttrs: { lang: "en" },
	link: [
		{ rel: "canonical", href: canonicalUrl },
		{ rel: "icon", href: "/favicon.svg" },
	],
});
</script>

<template><NuxtPage :transition="{ name: 'page', mode: 'out-in' }" /></template>
