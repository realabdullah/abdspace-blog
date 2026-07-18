<script setup lang="ts">
withDefaults(defineProps<{ title?: string; description?: string; section?: string }>(), {
	title: "Abdullahi Odesanmi",
	description: "Notes on frontend engineering, tools and experiments.",
	section: "Writings",
});
</script>

<template>
	<div class="flex h-full w-full flex-col justify-between bg-[#f2f0e9] p-16 text-[#171714]">
		<div class="flex items-center justify-between border-b border-[#171714]/20 pb-6 text-[20px] tracking-[0.14em] uppercase">
			<span>ABD<span class="ml-1 text-[#e65d43]">·</span></span
			><span class="text-[#77766f]">{{ section }}</span>
		</div>
		<div class="flex max-w-[1040px] flex-col">
			<h1 class="m-0 text-[82px] leading-[0.92] font-semibold tracking-[-0.065em]">{{ title }}</h1>
			<p class="mt-8 max-w-[820px] text-[26px] leading-[1.35] text-[#77766f]">{{ description }}</p>
		</div>
		<div class="flex items-center justify-between border-t border-[#171714]/20 pt-6 text-[18px] tracking-[0.12em] uppercase">
			<span>writings.abdspace.xyz</span><span class="text-[#e65d43]">06°26′N / 03°27′E</span>
		</div>
	</div>
</template>
