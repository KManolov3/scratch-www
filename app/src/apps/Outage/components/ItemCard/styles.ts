import { StyleSheet } from 'react-native';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export const styles = StyleSheet.create({
  card: {
    paddingBottom: 15,
    borderRadius: 8,
    backgroundColor: Colors.pure,
    marginHorizontal: 16,
    marginTop: 12,
    ...BaseStyles.shadow,
  },
  lastCard: {
    marginBottom: 12,
  },
  removeItemButton: {
    paddingTop: 15,
    marginLeft: 8,
    gap: 20,
    alignItems: 'center',
    verticalAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  removeItemText: {
    fontSize: 14,
    color: Colors.advanceVoid,
    fontWeight: FontWeight.Bold,
  },
});
