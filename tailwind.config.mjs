/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				bg: '#f5f0ea',
				'bg-dark': '#1a1412',
				text: '#171717',
				'text-dark': '#e8ddd0',
				muted: '#737373',
				'muted-dark': '#a89888',
				accent: '#f97316',
				border: '#e5e5e5',
				'border-dark': '#3a2e28',
			},
			fontFamily: {
				serif: ['Playfair Display', 'Georgia', 'serif'],
				sans: ['system-ui', '-apple-system', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
