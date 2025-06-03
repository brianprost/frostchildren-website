import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import keystatic from "@keystatic/astro"
import compress from "@playform/compress"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import cloudflare from "@astrojs/cloudflare"

// https://astro.build/config
export default defineConfig({
	site: "https://www.frostchildren.xyz",

	redirects: {
		"/admin": "/keystatic"
	},

	integrations: [
		react(),
		keystatic(),
		sitemap(),
		compress({
			HTML: true,
			JavaScript: true,
			CSS: false,
			Image: false,
			SVG: false
		})
	],

	vite: {
		plugins: [tailwindcss()]
	},

	adapter: cloudflare()
})
