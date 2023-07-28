/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans]
            }
        },
        screens: {
            sm: '640px',
            md: '768px',
            navLimit: '932px',
            lg: '1024px',
            xl: '1280px'
        }
    },
    plugins: []
};
