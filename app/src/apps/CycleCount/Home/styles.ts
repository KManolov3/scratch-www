import { StyleSheet } from 'react-native';
import { Colors } from '../../../lib/colors';

export const styles = StyleSheet.create({
  cycleCounts: {},

  cycleCount: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  cycleCountTitle: {
    fontSize: 16,
  },

  cycleCountSubtext: {
    marginTop: 2,
    color: Colors.darkGray,
  },

  separator: {
    backgroundColor: Colors.grayer,
    height: 1,
    marginHorizontal: 10,
  },
});
