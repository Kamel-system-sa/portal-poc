/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        mainColor: "#005B4F",
        primary: "#00796B",
        
        // Status Colors
        danger: "#D64545",
        warning: "#F2C94C",
        info: "#2F80ED",
        success: "#27AE60",
        
        // Blue (B2B Centers)
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8"
        },
        
        // Green (B2C Centers)
        green: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D"
        },
        
        // Purple (B2G Centers)
        purple: {
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7E22CE"
        },
        
        // Orange (Email)
        orange: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          600: "#EA580C"
        },
        
        // Indigo (Bravo Code)
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          600: "#4F46E5"
        },
        
        // Pink (Hawiya)
        pink: {
          50: "#FDF2F8",
          100: "#FCE7F3",
          600: "#DB2777"
        },
        
        // Red (Inactive Status)
        red: {
          100: "#FEE2E2",
          500: "#EF4444",
          600: "#DC2626"
        },
        
        // Gray (Texts & Backgrounds)
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827"
        },
        
        // White
        white: "#FFFFFF"
      }
    },
  },
  plugins: [],
};
