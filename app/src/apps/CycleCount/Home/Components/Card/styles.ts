import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.darkGray,
    backgroundColor: Colors.pure,
    elevation: 8,

    flexDirection: 'row',
    overflow: 'hidden',
  },

  critical: {
    borderColor: Colors.advanceRed,
  },

  criticalContainer: {
    minWidth: 60,
    backgroundColor: Colors.advanceRed,

    padding: 5,

    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },

  criticalDays: {
    fontSize: 25,
    textAlign: 'center',
    color: Colors.pure,
  },
  criticalLabel: {
    textAlign: 'center',
    color: Colors.pure,
  },

  title: {
    fontSize: 18,
  },
});
