import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const fullGuidelineWidth = 375;

/**
 * Computes the size in density-independent pixels
 * for the device's dimensions
 * by taking up the (size / fullGuidelineWidth) proportion of the screen width.
 *
 * @param {number} size - Guideline width size.
 */
export const scale = (size: number) => (size / fullGuidelineWidth) * width;

export const shadow = {
  elevation: 8,
};
