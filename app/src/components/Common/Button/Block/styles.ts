import { scale } from '@styles/base';
import {
  advanceYellow,
  advanceVoid,
  lightGray,
  lightVoid,
  pure,
} from '@styles/colors';
import { StyleSheet } from 'react-native';
import { scaleFont } from '@styles/font';

export const primaryColor = advanceVoid;
export const secondaryColor = lightVoid;

export const iconSize = scale(16);

export default StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scale(48),
    padding: scale(16),
    margin: scale(16),
    backgroundColor: advanceYellow,
    borderColor: advanceYellow,
    borderWidth: scale(1),
    borderRadius: scale(4),
  },
  disabled: {
    borderWidth: scale(1),
    borderColor: lightGray,
    backgroundColor: pure,
  },
  text: {
    fontSize: scaleFont(16),
    lineHeight: scale(24),
    color: primaryColor,
  },
  disabledText: {
    color: secondaryColor,
  },
  icon: {
    marginRight: scale(12),
  },
  spinner: {
    height: scale(12),
    marginLeft: scale(4),
    alignSelf: 'center',
  },
});
