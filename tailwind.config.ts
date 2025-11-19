import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-poppins)'],
      },
      colors: {
        // Lawsons Studio brand colors - Improved for better contrast
        brand: {
          primary: "#28E8EB",      // Electric cyan - use sparingly
          "primary-dark": "#0DB5B8", // Darker cyan for light backgrounds
          secondary: "#ED474A",    // Neon red/pink
          accent: "#50468C",       // Indigo/violet
          "accent-light": "#6B5AAA", // Lighter indigo
          sky: "#4C9BD0",          // Sky blue
          magenta: "#A21556",      // Hot magenta
          dark: "#160F19",         // Dark base
          "dark-surface": "#1E1724", // Card backgrounds
          "dark-text": "#2D2D2D",  // Readable dark text
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #28E8EB, #4C9BD0, #ED474A, #A21556)",
        "gradient-accent": "linear-gradient(135deg, #A21556, #50468C)",
      },
    },
  },
  plugins: [],
};

export default config;
