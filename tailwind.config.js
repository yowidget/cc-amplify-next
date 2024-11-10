/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'capitalone': {
          'blue': '#101D2A',        // Primary Capital One blue
          'blue-light': '#0071C5',   // Secondary blue for accents
          'red': '#BB3530',          // Primary Capital One red
          'red-dark': '#A30015',     // Darker red for hover or active states
          'gray': '#4B4B4B',         // Neutral gray for text
          'gray-light': '#E9E9E9',   // Light gray for backgrounds or borders
          'white': '#FFFFFF',        // Standard white for backgrounds
        },
      },
    },
  },
  plugins: [],
}

