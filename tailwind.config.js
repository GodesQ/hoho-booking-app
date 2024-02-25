import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    // theme: {
    //     extend: {
    //         colors: {
    //             primary: '#ab2001',
    //             secondary: '#f8e8e6'
    //         }
    //     },
    // },
    plugins: [nextui({
        themes: {
            lightRed: {
                extend: "light", // <- inherit default values from dark theme
                colors: {
                    background: "#ab2001",
                    foreground: "#ffffff",
                    primary: {
                        50: "#e6bcb3",
                        100: "#dda699",
                        200: "#d59080",
                        300: "#cd7967",
                        400: "#c4634d",
                        500: "#bc4d34",
                        600: "#b3361a",
                        700: "#FCADF9",
                        800: "#891a01",
                        900: "#9a1d01",
                        DEFAULT: "#ab2001",
                        foreground: "#ffffff",
                    },
                    focus: "#F182F6",
                },
                layout: {
                    fontSize: {
                        small: "16px",
                        medium: "20px",
                        large: "25px",
                        DEFAULT: "16px",
                    },
                    disabledOpacity: "0.3",
                    radius: {
                        small: "4px",
                        medium: "6px",
                        large: "8px",
                    },
                    borderWidth: {
                        small: "1px",
                        medium: "2px",
                        large: "3px",
                    },
                },
            }
        }
    })]
}
