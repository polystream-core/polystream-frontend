type HexColor = `#${string}`;

interface ColorShades {
  primary: HexColor;
  color01: HexColor;
  color02: HexColor;
  color03: HexColor;
}

interface GreyShades extends ColorShades {
  color04: HexColor;
  white: HexColor;
}

interface ColorPalette {
  beige: ColorShades;
  red: ColorShades;
  cyan: ColorShades;
  black: ColorShades;
  grey: GreyShades;
  green: ColorShades;
}

export const colors: ColorPalette = {
  beige: {
    primary: '#FFEEDA',
    color01: '#EBC28E',
    color02: '#FFDCB1',
    color03: '#FFF8F3'
  },
  red: {
    primary: '#FF684B',
    color01: '#EE5132',
    color02: '#FFA998',
    color03: '#FFE4DF'
  },
  cyan: {
    primary: '#93FBED',
    color01: '#62E6D4',
    color02: '#B7F7EE',
    color03: '#DFFCF8'
  },
  black : {
    primary: '#190602',
    color01: '#101010',
    color02: '#5B5B5B',
    color03: '#FBFBFB'
  },
  grey: {
    primary: '#EFEBE6',
    color01: '#A0A0A0',
    color02: '#BEBEBE',
    color03: '#DADADA',
    color04: '#EDEDED',
    white: '#FFFFFF'
  },
  green: {
    primary: '#00C853',
    color01: '#00C853',
    color02: '#00C853',
    color03: '#00C853'
  }
};
