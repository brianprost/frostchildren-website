import cloudflare from "@astrojs/cloudflare"
import sitemap from "@astrojs/sitemap"
import compress from "@playform/compress"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
	site: "https://www.frostchildren.xyz",

	integrations: [
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
