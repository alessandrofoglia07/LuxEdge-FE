/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans]
            },
            screens: {
                'nav-limit': '932px',
                '-md': { max: '767px' },
                '-sm': { max: '639px' },
                '-lg': { max: '1023px' }
            },
            colors: {
                primary: {
                    base: '#3b82f6',
                    hover: '#2563eb',
                    light: '#60a5fa'
                }
            },
            backgroundImage: {
                'login-bg': "url('/loginbg.jpg')"
            }
        }
    },
    plugins: []
};
