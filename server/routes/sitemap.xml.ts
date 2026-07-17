export default defineEventHandler(async (event) => {
	const posts = await queryCollection(event, "blog").all();
	const baseUrl = useRuntimeConfig().public.siteUrl || "https://blog.abdspace.xyz";
	const urls = [baseUrl, ...posts.map((post) => `${baseUrl}/${post.slug}`)].map((loc) => `<url><loc>${loc}</loc></url>`).join("");
	setHeader(event, "content-type", "application/xml; charset=utf-8");
	return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
});
