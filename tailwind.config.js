/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
			"accent": "#0ea0ef",
			"accent-darker": "#0075b5",
			"white": "#ffffff",
			"gray": "#cccccc",
			"black": "#000000"
		},
  },
  plugins: [],
}
