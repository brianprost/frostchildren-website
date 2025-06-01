// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: ["@nuxtjs/tailwindcss", "@nuxt/fonts"],
	css: ["~/assets/css/main.css"],
	fonts: {
		families: [
			// { name: "Nippo", provider: "fontshare" },
			{ name: "EB_Garamond", provider: "google" },
		],
	},
	app: {
		head: {
			title: "Frost Children",
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{
					hid: "description",
					name: "description",
					content: "Official website for Frost Children",
				},
			],
			link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		},
	},
});
