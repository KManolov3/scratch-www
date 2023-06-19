import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { BaseStyles } from '@lib/baseStyles';

export const styles = StyleSheet.create({
  card: {
    paddingTop: 19,
    paddingBottom: 14,
    paddingLeft: 23,
    paddingRight: 20,
    borderRadius: 8,
    backgroundColor: Colors.pure,
  },
  cardWithShadow: {
    marginHorizontal: 16,
    marginTop: 12,
    ...BaseStyles.shadow,
  },
  lastCard: {
    marginBottom: 12,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    color: Colors.advanceVoid,
    fontWeight: FontWeight.Bold,
  },
  content: {
    flexDirection: 'row',
    paddingTop: 9,
    justifyContent: 'space-between',
  },
  property: {
    marginBottom: 8,
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
