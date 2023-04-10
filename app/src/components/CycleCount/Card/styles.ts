import { StyleSheet } from 'react-native';
import { scale, shadow } from '../../../styles/base';
import { advanceRed, pure } from '../../../styles/colors';

export default StyleSheet.create({
  card: {
    marginHorizontal: scale(16),
    marginVertical: scale(8),
    paddingHorizontal: scale(8),
    paddingVertical: scale(12),
    borderWidth: scale(1),
    borderRadius: scale(8),
    backgroundColor: pure,
    ...shadow,
  },
  critical: {
    borderColor: advanceRed,
  },
});
