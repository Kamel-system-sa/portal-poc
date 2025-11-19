/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainColor: "#005B4F",
        primary: "#00796B",
        danger: "#D64545",
        warning: "#F2C94C",
        info: "#2F80ED",
        success: "#27AE60",
        gray: "#808080",
        
      }
    },
  },
  plugins: [],
};
