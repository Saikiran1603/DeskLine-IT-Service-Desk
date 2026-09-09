/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0E1420',
          900: '#141C2B',
          800: '#1C2637',
          700: '#293449',
          600: '#3A465D',
          500: '#5B6880',
          400: '#8A94A6',
          300: '#B8C0CC',
          200: '#DCE1E8',
          100: '#EEF1F5',
          50: '#F7F9FB',
        },
        signal: {
          teal: '#1B8C8C',
          tealDark: '#146868',
          amber: '#C77F1A',
          rose: '#C4433F',
          violet: '#6E5AC7',
          moss: '#3E8C5A',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,20,32,0.06), 0 1px 0 rgba(14,20,32,0.04)',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
      },
    },
  },
  plugins: [],
}
