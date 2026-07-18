<script setup lang="ts">
const route = useRoute();
const canonicalUrl = computed(() => `https://writings.abdspace.xyz${route.path === "/" ? "" : route.path}`);
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
	script: [{ innerHTML: `try{if(localStorage.getItem("abdspace-theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}` }],
});
</script>

<template>
	<NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
	<div class="fixed right-5 bottom-5 z-[100] sm:right-8 sm:bottom-8"><ThemeToggle /></div>
</template>
