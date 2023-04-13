export enum FontWeight {
  Book = '300',
  Medium = '500',
  Demi = '600',
  Bold = '700',
}

export enum FontStyle {
  Italic = 'italic',
  Normal = 'normal',
}

export enum Font {
  FuturaPT = 'futurapt',
  FuturaPTCond = 'futurapt_cond',
}

const FuturaPT = {
  [FontStyle.Normal]: {
    [FontWeight.Book]: 'FuturaPT-Book',
    [FontWeight.Medium]: 'FuturaPT-Medium',
    [FontWeight.Demi]: 'FuturaPT-Demi',
    [FontWeight.Bold]: 'FuturaPT-Bold',
  },
  [FontStyle.Italic]: {
    [FontWeight.Book]: 'FuturaPT-Book-Italic',
    [FontWeight.Medium]: 'FuturaPT-Medium--Italic',
    [FontWeight.Demi]: 'FuturaPT-Dem-Italic',
    [FontWeight.Bold]: 'FuturaPT-Bold-Italic',
  },
};

const FuturaPTCond = {
  [FontStyle.Normal]: {
    [FontWeight.Book]: 'FuturaPTCond-Medium',
    [FontWeight.Medium]: 'FuturaPTCond-Medium',
    [FontWeight.Demi]: 'FuturaPTCond-Bold',
    [FontWeight.Bold]: 'FuturaPTCond-Bold',
  },
  [FontStyle.Italic]: {
    [FontWeight.Book]: 'FuturaPTCond-Medium-Italic',
    [FontWeight.Medium]: 'FuturaPTCond-Medium-Italic',
    [FontWeight.Demi]: 'FuturaPTCond-Bold-Italic',
    [FontWeight.Bold]: 'FuturaPTCond-Bold-Italic',
  },
};

const getFontWeight = (fontWeight?: string): FontWeight => {
  switch (fontWeight) {
    case '100':
    case '200':
    case '300':
    case '400':
      return FontWeight.Book;
    case '600':
      return FontWeight.Demi;
    case 'bold':
    case '700':
    case '800':
    case '900':
      return FontWeight.Bold;
    case '500':
    default:
      return FontWeight.Medium;
  }
};

const getFontStyle = (fontStyle?: string): FontStyle =>
  fontStyle === 'italic' ? FontStyle.Italic : FontStyle.Normal;

export const getFontFamily = ({
  fontWeight,
  fontFamily,
  fontStyle,
}: {
  fontWeight?: string;
  fontFamily?: string;
  fontStyle?: string;
}) => {
  const weight = getFontWeight(fontWeight);
  const style = getFontStyle(fontStyle);

  return fontFamily === Font.FuturaPTCond
    ? FuturaPTCond[style][weight]
    : FuturaPT[style][weight];
};
