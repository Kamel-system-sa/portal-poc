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
        primaryColor: "#00796B",
        secondaryColor: "#00A896",
        
        // Status Colors
        danger: "#D64545",
        warning: "#F2C94C",
        info: "#2F80ED",
        success: "#27AE60",
        
        // Additional Gray Variants
        grayBG: "#F5F7FA",
        customgray: "#9CA3AF",
        bordergray: "#E5E7EB",
        gray100: "#F3F4F6",
        lightGray: "#F9FAFB",
        
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
        
        // Teal (for variety)
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E"
        },
        
        // Amber (for variety)
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309"
        },
        
        // Cyan (for variety)
        cyan: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490"
        },
        
        // Violet (for variety)
        violet: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9"
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
