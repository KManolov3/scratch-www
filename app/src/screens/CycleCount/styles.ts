import { StyleSheet } from 'react-native';
import { lightGray } from '@styles/colors';
import { scale } from '@styles/base';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGray,
  },
  list: {
    paddingVertical: scale(12),
  },
});
