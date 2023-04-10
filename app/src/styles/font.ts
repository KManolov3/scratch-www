import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// TODO: should be defined by designers
const getBaseFontSize = () => (width > 340 ? 16 : 14);

/**
 * The font size used as a basis for scaling fonts in the application.
 */
const appBaseFontSize = getBaseFontSize();

/**
 * The base font size in terms of which font sizes are described in stylesheets.
 */
const appGuidelineFontSize = 16;

/**
 * Computes an appropriate font size which scales with the device size
 * and matches the design guidelines.
 * Provides responsive font sizes. Works like *rem* units.
 *
 * For example, scaleFont(14) when guidelineFontSize is 16
 * and baseFontSize is 18, would reduce to:
 * 0.875rem with root font size of 18 and the computed font size would be
 * equal to 0.875 * 18 = 15.75.
 *
 * @export
 * @param {number} fontSize
 *    Font size which follows the design guidelines.
 * @param {number} fontSizeScaleFactor
 *    Scaling factor to be applied to the fontSize.
 */
export const scaleFont = (fontSize: number, fontSizeScaleFactor = 1): number =>
  fontSizeScaleFactor * (fontSize / appGuidelineFontSize) * appBaseFontSize;

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
