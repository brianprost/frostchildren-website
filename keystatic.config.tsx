/**
 * * This is the Keystatic configuration file. It is used to define the collections and fields that will be used in the Keystatic CMS.
 *
 * ! This works in conjunction with Astro content collections. If you update one, you must update the other.
 *
 * Access keystatic interface at /admin or /keystatic
 * This works in local mode in dev, then cloud mode in prod
 * Cloud deployment is free to sign up (up to 3 users per team)
 * Docs: https://keystatic.com/docs/cloud
 * Create a Keystatic Cloud account here: https://keystatic.cloud/
 */

import { config } from "@keystatic/core"
import { collection, fields, singleton } from "@keystatic/core"

export default config({
	// works in local mode in dev, then cloud mode in prod
	storage: import.meta.env.DEV === true ? { kind: "local" } : { kind: "cloud" },
	// cloud deployment is free to sign up (up to 3 users per team)
	// docs: https://keystatic.com/docs/cloud
	// create a Keystatic Cloud account here: https://keystatic.cloud/
	cloud: { project: "frost-children/website" },
	ui: {
		brand: { name: "Frost Children" }
	},
	singletons: {
		/**
		 * * Bio and Config singleton
		 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
		 */
		config: singleton({
			label: "Bio and Config",
			path: `src/data/bio/`,
			format: { contentField: "bio" },
			schema: {
				name: fields.text({
					label: "Name",
					validation: {
						isRequired: true
					}
				}),
				bio: fields.mdx({
					label: "Bio",
					extension: "md", // force .md extension as we don't need mdx
					options: {
						bold: true,
						italic: true,
						strikethrough: true,
						code: true,
						heading: false,
						blockquote: false,
						orderedList: true,
						unorderedList: true,
						table: false,
						link: true,
						image: false,
						divider: false,
						codeBlock: false
					}
				}),
				theme: fields.select({
					label: "Theme",
					options: [
						{ label: "Dark", value: "dark" },
						{ label: "Light", value: "light" }
					],
					defaultValue: "dark"
				}),
				avatar: fields.image({
					label: "Avatar",
					publicPath: "./",
					validation: {
						isRequired: true
					}
				}),
			}
		})
	},

	/**
	 * * Socials collection
	 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
	 */
	collections: {
		socials: collection({
			label: "Socials",
			path: `src/data/socials/*`,
			columns: ["order"],
			slugField: "title",
			schema: {
				title: fields.slug({
					name: {
						label: "Title"
					}
				}),
				url: fields.text({
					label: "URL",
					validation: {
						isRequired: true
					}
				}),
				order: fields.number({
					label: "Order",
					validation: {
						isRequired: true
					}
				}),
				icon: fields.select({
					label: "Icon",
					options: [
						{ label: "Github", value: "github" },
						{ label: "Twitter", value: "twitter" },
						{ label: "Bluesky", value: "bluesky" },
						{ label: "Mastodon", value: "mastodon" },
						{ label: "LinkedIn", value: "linkedin" },
						{ label: "Instagram", value: "instagram" },
						{ label: "Threads", value: "threads" },
						{ label: "Facebook", value: "facebook" },
						{ label: "YouTube", value: "youtube" },
						{ label: "Twitch", value: "twitch" },
						{ label: "TikTok", value: "tiktok" },
						{ label: "Snapchat", value: "snapchat" },
						{ label: "Reddit", value: "reddit" },
						{ label: "Pinterest", value: "pinterest" },
						{ label: "Medium", value: "medium" },
						{ label: "Dev", value: "dev" },
						{ label: "Dribbble", value: "dribbble" },
						{ label: "Behance", value: "behance" },
						{ label: "Codepen", value: "codepen" },
						{ label: "Product Hunt", value: "producthunt" },
						{ label: "Discord", value: "discord" },
						{ label: "Slack", value: "slack" },
						{ label: "WhatsApp", value: "whatsapp" },
						{ label: "Telegram", value: "telegram" },
						{ label: "Email", value: "email" }
					],
					defaultValue: "github"
				})
			}
		}),

		/**
		 * * Links collection
		 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
		 */
		links: collection({
			label: "Links",
			path: `src/data/links/*`,
			columns: ["order"],
			slugField: "title",
			schema: {
				title: fields.slug({
					name: {
						label: "Title"
					}
				}),
				description: fields.text({
					label: "Description",
					validation: {
						isRequired: true
					}
				}),
				url: fields.text({
					label: "URL",
					validation: {
						isRequired: true
					}
				}),
				order: fields.number({
					label: "Order",
					validation: {
						isRequired: true
					}
				})
			}
		})
	}
})
