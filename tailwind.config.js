import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  // darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      gray: colors.neutral,
      white: '#ffffff',
      mint: '#0BD986',
      lime: '#0BE651',
    },
    extend: {
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')({ strategy: 'class' })],
};
