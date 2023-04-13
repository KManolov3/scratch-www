import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';

export default StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.pure,
    elevation: 8,
  },
  critical: {
    borderColor: Colors.advanceRed,
  },
});
