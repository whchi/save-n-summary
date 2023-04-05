/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  mode: 'jit',
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: ['prettier'],
};
