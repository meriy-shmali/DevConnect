/** @type {import('tailwindcss').Config} */
import tailwindcssRtl from 'tailwindcss-rtl';
export default {
  darkMode: 'class',
  content: [
    
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{css}" 
  ],
  
  theme: {
    extend: {
  
    },
  },
   experimental: {
    optimizeUniversalDefaults: true,
  },
  plugins: [
    tailwindcssRtl 
    ],
}

