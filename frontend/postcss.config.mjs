/** @type {import('postcss-load-config').Config} */
const config = {
  theme: {
  container: {
    center: true,
    padding: {
      DEFAULT: '1rem',
      sm: '2rem',
      md: '3rem',
      lg: '4rem',
      xl: '5rem',
      '2xl': '6rem',
    },
    screens: {
      sm: '576px',    // Custom breakpoint
      md: '768px',
      lg: '992px',    // Custom breakpoint
      xl: '1200px',   // Custom breakpoint
      '2xl': '1400px' // Custom breakpoint
    }
  }
},
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
