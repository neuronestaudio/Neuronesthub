/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        panel: '#0E1116',
        'panel-alt': '#12161C',
        bone: '#F3F3F0',
        ash: '#8D939C',
        'accent-signal': '#E0B100',
        'border-hairline': 'rgba(255,255,255,0.08)',
        danger: '#C8372D'
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'mono-spaced': '0.08em',
        'brand': '0.15em'
      }
    },
  },
  plugins: [],
}
