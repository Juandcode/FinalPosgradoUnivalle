/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.jsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      nunito: 'Nunito-Bold',
    },
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      error1: "var(--color-error1)",
      header: "var(--color-header)",
    },
    extend: {
      fontFamily: {
        nunito: 'Nunito-Bold',
      },
      fontSize: {
        dynamic: "var(--font-size-dynamic)",
      },
      textColor:({theme})=>({
        ...theme('colors'),
      }),
      borderColor: ({ theme }) => ({
        ...theme('colors'), // Hereda todos los colores de la paleta
        'custom': '#ccc', // Agrega un color personalizado
      }),
    },
  },
  plugins: [
    // Set a default value on the `:root` element
    // ({ addBase }) =>
    //     addBase({
    //       ":root": {
    //         "--color-values": "255 0 0",
    //         "--color-rgb": "rgb(158,107,107)",
    //       },
    //     }),
  ],
}
