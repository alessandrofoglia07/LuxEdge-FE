/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const theme = {
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
                '-lg': { max: '1023px' },
                'homepage-limit': { max: '1621px', min: '1024px' }
            },
            colors: {
                primary: {
                    base: '#445069',
                    hover: '#252B48',
                    light: '#5B9A8B',
                    background: '#F7E987'
                }
            },
            backgroundImage: {
                'login-bg': "url('/loginbg.jpg')"
            },
            minHeight: {
                page: 'calc(100vh - 96px)'
            }
        }
    },
    plugins: []
};

export default theme;
