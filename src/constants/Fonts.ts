export const fonts = {
    primary: {
        light: 'FT Polar Light',
        regular: 'FT Polar Regular',
        medium: 'FT Polar Medium',
        semibold: 'FT Polar SemiBold',
        bold: 'FT Polar Bold'
    },
    secondary: {
        light: 'Trans Sans Light',
        regular: 'Trans Sans Regular',
        medium: 'Trans Sans Medium',
        bold: 'Trans Sans Bold'
    },
    code: {
        light: 'MD IO Light',
        regular: 'MD IO Regular',
        medium: 'MD IO Medium',
        semibold: 'MD IO SemiBold',
        bold: 'MD IO Bold'
    }
}

export const loadFonts = {
    [fonts.primary.light]: require('../assets/fonts/FTPolar/FTPolarTrialLight.otf'),
    [fonts.primary.regular]: require('../assets/fonts/FTPolar/FTPolarTrialRegular.otf'),
    [fonts.primary.medium]: require('../assets/fonts/FTPolar/FTPolarTrialMedium.otf'),
    [fonts.primary.semibold]: require('../assets/fonts/FTPolar/FTPolarTrialSemibold.otf'),
    [fonts.primary.bold]: require('../assets/fonts/FTPolar/FTPolarTrialBold.otf'),
    [fonts.secondary.light]: require('../assets/fonts/TransSans/trnsl.ttf'),
    [fonts.secondary.regular]: require('../assets/fonts/TransSans/trnss.ttf'),
    [fonts.secondary.medium]: require('../assets/fonts/TransSans/trnsm.ttf'),
    [fonts.secondary.bold]: require('../assets/fonts/TransSans/trnssb.ttf'),
    [fonts.code.light]: require('../assets/fonts/MDIOTypeface/MDIO_Light.ttf'),
    [fonts.code.regular]: require('../assets/fonts/MDIOTypeface/MDIO_Regular.ttf'),
    [fonts.code.medium]: require('../assets/fonts/MDIOTypeface/MDIO_Medium.ttf'),
    [fonts.code.semibold]: require('../assets/fonts/MDIOTypeface/MDIO_Semibold.ttf'),
    [fonts.code.bold]: require('../assets/fonts/MDIOTypeface/MDIO_Bold.ttf')
}
