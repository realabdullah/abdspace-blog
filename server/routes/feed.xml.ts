export default defineEventHandler(async (event) => {
	const posts = await queryCollection(event, "blog").order("createdAt", "DESC").all();
	const baseUrl = useRuntimeConfig().public.siteUrl || "https://blog.abdspace.xyz";
	const items = posts
		.map(
			(post) =>
				`<item><title><![CDATA[${post.title}]]></title><link>${baseUrl}/${post.slug}</link><guid>${baseUrl}/${post.slug}</guid><description><![CDATA[${post.description}]]></description><pubDate>${new Date(post.createdAt).toUTCString()}</pubDate></item>`,
		)
		.join("");
	setHeader(event, "content-type", "application/rss+xml; charset=utf-8");
	return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Abdullahi Odesanmi — Writings</title><link>${baseUrl}</link><description>Notes on frontend engineering, tools and experiments.</description>${items}</channel></rss>`;
});
