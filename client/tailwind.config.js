/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-teal-dark': '#1A4D4A', // RoxPaint Dark Teal
        'brand-teal-medium': '#257470', // RoxPaint Medium Teal
        'brand-orange': '#FF6B35',    // RoxPaint Orange
        'brand-gray-light': '#F3F4F6', // Light background for cards
        'brand-text-dark': '#1F2937',  // Dark text
        'brand-text-light': '#FFFFFF', // Light text (white)
      }
    },
  },
  plugins: [],
}
