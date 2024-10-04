module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                'rich_black': {
                    DEFAULT: '#040f0f',
                    100: '#010303',
                    200: '#020606',
                    300: '#030a0a',
                    400: '#030d0d',
                    500: '#040f0f',
                    600: '#195d5d',
                    700: '#2dabab',
                    800: '#64d6d6',
                    900: '#b2eaea'
                },
                'pakistan_green': {
                    DEFAULT: '#04471c',
                    100: '#010e06',
                    200: '#021d0b',
                    300: '#032b11',
                    400: '#033a16',
                    500: '#04471c',
                    600: '#099a3c',
                    700: '#0eec5c',
                    800: '#5bf591',
                    900: '#adfac8'
                },
                'forest_green': {
                    DEFAULT: '#248232',
                    100: '#071a0a',
                    200: '#0e3514',
                    300: '#164f1e',
                    400: '#1d6a28',
                    500: '#248232',
                    600: '#33ba47',
                    700: '#5ed370',
                    800: '#94e29f',
                    900: '#c9f0cf'
                },
                'gunmetal': {
                    DEFAULT: '#2d3a3a',
                    100: '#090c0c',
                    200: '#121717',
                    300: '#1b2323',
                    400: '#232e2e',
                    500: '#2d3a3a',
                    600: '#506868',
                    700: '#759595',
                    800: '#a3b8b8',
                    900: '#d1dcdc'
                },
                'baby_powder': {
                    DEFAULT: '#fcfffc',
                    100: '#006500',
                    200: '#00ca00',
                    300: '#30ff30',
                    400: '#95ff95',
                    500: '#fcfffc',
                    600: '#fbfffb',
                    700: '#fcfffc',
                    800: '#fdfffd',
                    900: '#fefffe'
                }
            }
        }
    },
    plugins: []
}
