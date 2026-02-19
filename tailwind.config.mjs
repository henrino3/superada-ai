/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				bg: '#0D0B09',
				text: '#E8DCC8',
				accent: '#C87533',
				muted: '#8B7E6A',
				border: '#2A241E',
				'card-bg': '#131008',
			},
			fontFamily: {
				serif: ['Georgia', "'Times New Roman'", 'serif'],
				sans: ['system-ui', '-apple-system', "'Helvetica Neue'", 'Arial', 'sans-serif'],
			},
			maxWidth: {
				prose: '800px',
			},
		},
	},
	plugins: [],
}
