import { neutralGray, pure } from '@styles/colors';
import { StyleSheet } from 'react-native';
import { scale, shadow } from '@styles/base';
import { FontWeight, scaleFont } from '@styles/font';

export const defaultIconSize = scale(20);

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(10),
    height: scale(72),
    backgroundColor: pure,
    borderBottomColor: pure,
    borderBottomLeftRadius: scale(16),
    borderBottomRightRadius: scale(16),
    ...shadow,
  },
  body: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  side: {
    flexShrink: 1,
  },
  title: {
    color: neutralGray,
    fontSize: scaleFont(14),
    lineHeight: scale(20),
    fontWeight: FontWeight.Demi,
    alignSelf: 'center',
  },
  spacerContainer: {
    paddingVertical: scale(14),
    paddingHorizontal: scale(10),
  },
  spacer: {
    width: defaultIconSize,
    height: defaultIconSize,
  },
});
