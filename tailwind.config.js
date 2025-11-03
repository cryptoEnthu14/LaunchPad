/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'radium-purple': '#8C6BE0',
        'radium-blue': '#3B82F6',
        'radium-dark': '#0F0F1E',
        'radium-darker': '#070710',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-radium': 'linear-gradient(135deg, #8C6BE0 0%, #3B82F6 100%)',
      },
    },
  },
  plugins: [],
}
