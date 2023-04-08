module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
