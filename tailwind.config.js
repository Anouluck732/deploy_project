/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{vue,js,ts,jsx,tsx}",
];

export const theme = {
  extend: {
    fontFamily: {
      'noto-sans-lao': ['Noto Sans Lao', 'sans-serif'],
    },
  },
};

export const plugins = [];
