import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';

export const styles = StyleSheet.create({
  input: {
    margin: 10,
    color: Colors.advanceVoid,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    height: 48,
    lineHeight: 14,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },

  truckScans: {},

  truckScanListItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  truckScanTitle: {
    fontSize: 16,
  },

  truckScanSubtext: {
    marginTop: 2,
    color: Colors.darkGray,
  },

  separator: {
    backgroundColor: Colors.grayer,
    height: 1,
    marginHorizontal: 10,
  },
});
