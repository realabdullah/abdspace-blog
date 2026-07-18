<script setup lang="ts">
const config = useRuntimeConfig();
const studioConfigured = Boolean(config.public.studioConfigured);

if (studioConfigured) {
	await navigateTo("/_studio", { redirectCode: 302 });
}
</script>

<template>
	<main v-if="!studioConfigured" class="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
		<div>
			<p class="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-coral">Authoring unavailable</p>
			<h1 class="mb-4 text-3xl font-semibold tracking-[-0.04em]">Studio authentication is not configured.</h1>
			<p class="text-base leading-7 text-ink/65 dark:text-paper/65">Set the GitHub OAuth variables on the production deployment, then redeploy the writings site.</p>
		</div>
	</main>
</template>
