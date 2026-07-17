import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	modules: ["@nuxt/content", "@nuxt/eslint", "@nuxt/fonts", "@nuxt/image", "@nuxt/icon", "nuxt-og-image", "nuxt-studio"],
	css: ["~/assets/main.css"],
	devtools: { enabled: true },
	app: {
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			meta: [{ name: "theme-color", content: "#f2f0e9" }],
		},
	},
	site: {
		url: process.env.NUXT_SITE_URL || "https://blog.abdspace.xyz",
		name: "Abdullahi Odesanmi — Writings",
	},
	runtimeConfig: {
		public: {
			siteUrl: process.env.NUXT_SITE_URL || "https://blog.abdspace.xyz",
		},
	},
	content: {
		build: {
			markdown: {
				highlight: {
					theme: { default: "vitesse-light", dark: "vitesse-black" },
					langs: ["bash", "css", "html", "javascript", "json", "markdown", "md", "scss", "shell", "sql", "ts", "typescript", "vue", "yaml"],
				},
			},
		},
	},
	nitro: {
		prerender: { routes: ["/", "/feed.xml", "/sitemap.xml"], crawlLinks: true },
	},
	vite: { plugins: [tailwindcss()] },
	fonts: {
		families: [
			{ name: "Manrope", weights: [400, 500, 600, 700] },
			{ name: "DM Mono", weights: [400, 500] },
		],
	},
	studio: {
		repository: {
			provider: "github",
			owner: "realabdullah",
			repo: "abdspace-blog",
			branch: "master",
		},
		ai: { experimental: { collectionContext: true } },
	},
	compatibilityDate: "2024-11-01",
});
