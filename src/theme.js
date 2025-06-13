import {colorScheme, vars} from "nativewind";
import colors from "tailwindcss/colors";


export const colorsName = Object.create({
    headerLightBrand: colors.white,
    headerDarkBrand: colors.gray["800"],
});

export const themes = {
    brand: {
        light: vars({
            '--color-primary': colors.white,       // Negro (RGB)
            '--color-secondary': colors.gray["700"], // Blanco (RGB)
            '--color-header': colorsName.headerLightBrand,
            '--color-error1': colors.red["600"],
        }),
        dark: vars({
            '--color-primary': colors.gray["900"],
            '--color-secondary': colors.white,
            '--color-header': colorsName.headerDarkBrand,
            '--color-border': colors.gray["100"],
            '--color-error1': colors.red["600"],
        })
    },
};
