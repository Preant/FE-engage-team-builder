module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], theme: {
        extend: {
            fontFamily: {
                sans: ['Cinzel', 'serif']
            }, colors: {
                'rich_black': {
                    DEFAULT: '#171a21',
                    100: '#050507',
                    200: '#090a0d',
                    300: '#0e1014',
                    400: '#12151a',
                    500: '#171a21',
                    600: '#3c4457',
                    700: '#616e8c',
                    800: '#949eb5',
                    900: '#c9ceda'
                },
                'paynes_gray': {
                    DEFAULT: '#617073',
                    100: '#141717',
                    200: '#272d2e',
                    300: '#3b4445',
                    400: '#4f5a5d',
                    500: '#617073',
                    600: '#7f8f92',
                    700: '#9fabad',
                    800: '#bfc7c9',
                    900: '#dfe3e4'
                },
                'air_superiority_blue': {
                    DEFAULT: '#7a93ac',
                    100: '#171e24',
                    200: '#2e3b49',
                    300: '#44596d',
                    400: '#5b7692',
                    500: '#7a93ac',
                    600: '#96a9bd',
                    700: '#b0bfce',
                    800: '#cad4de',
                    900: '#e5eaef'
                },
                'prussian_blue': {
                    DEFAULT: '#16283c',
                    100: '#04080c',
                    200: '#091018',
                    300: '#0d1824',
                    400: '#122030',
                    500: '#16283c',
                    600: '#2d517a',
                    700: '#447bb9',
                    800: '#82a7d1',
                    900: '#c0d3e8'
                },
                'mauve': {
                    DEFAULT: '#d2b0f7',
                    100: '#29084d',
                    200: '#520f9a',
                    300: '#7c17e7',
                    400: '#a763f0',
                    500: '#d2b0f7',
                    600: '#dbc0f9',
                    700: '#e4d0fa',
                    800: '#eddffc',
                    900: '#f6effd'
                }
            }
        }
    }
}
