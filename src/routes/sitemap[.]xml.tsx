import { createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/lib/blog-posts";

const SITE = "https://agil2.lovable.app";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/persiana-rolo-blackout", priority: "0.9", changefreq: "weekly" },
  { path: "/persiana-solar-screen", priority: "0.9", changefreq: "weekly" },
  { path: "/cortina-romana", priority: "0.9", changefreq: "weekly" },
  { path: "/persiana-double-vision", priority: "0.9", changefreq: "weekly" },
  { path: "/persiana-painel", priority: "0.9", changefreq: "weekly" },
  { path: "/persiana-vertical", priority: "0.9", changefreq: "weekly" },
  { path: "/persiana-horizontal", priority: "0.9", changefreq: "weekly" },
  { path: "/persiana-juiz-de-fora", priority: "0.8", changefreq: "weekly" },
  { path: "/persiana-rio-de-janeiro", priority: "0.8", changefreq: "weekly" },
  { path: "/persiana-belo-horizonte", priority: "0.8", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const today = new Date().toISOString().split("T")[0];

        const urls = [
          ...STATIC_PAGES.map(
            (p) =>
              `  <url>\n    <loc>${SITE}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
          ),
          ...blogPosts.map(
            (post) =>
              `  <url>\n    <loc>${SITE}/blog/${post.slug}</loc>\n    <lastmod>${post.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
          ),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
