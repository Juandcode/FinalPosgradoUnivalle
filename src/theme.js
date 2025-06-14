import {colorScheme, vars} from "nativewind";
import colors from "tailwindcss/colors";


export const colorsName = Object.create({
    headerLightBrand: colors.white,
    headerDarkBrand: colors.gray["800"],
    secondaryDarkBrand: colors.gray["700"],
    secondaryLightBrand: colors.white,
    primaryDarkBrand: colors.white,
    primaryLightBrand: colors.gray["900"],
});

export const themes = {
    brand: {
        light: vars({
            '--color-primary': colors.white,       // Negro (RGB)
            '--color-secondary': colorsName.secondaryDarkBrand, // Blanco (RGB)
            '--color-header': colorsName.headerLightBrand,
            '--color-error1': colors.red["600"],
        }),
        dark: vars({
            '--color-primary': colors.gray["900"],
            '--color-secondary': colorsName.secondaryLightBrand,
            '--color-header': colorsName.headerDarkBrand,
            '--color-border': colors.gray["100"],
            '--color-error1': colors.red["600"],
        })
    },
};
