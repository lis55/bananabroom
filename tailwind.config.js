// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        banana: {
          100: '#FFFFF0',
          200: '#FEF9C3',
          300: '#FCE588',
          400: '#FADB5F', // Consider this for focus rings
          500: '#F7C948', // Primary action elements (buttons)
          600: '#F0B429', // Button hover states
          700: '#DE911D',
          800: '#CB6E17',
          900: '#B44D12',
        },
      },
    },
  },
  plugins: [],
};
