import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { BaseStyles } from '@lib/baseStyles';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 6,
    paddingTop: 19,
    paddingLeft: 23,
    paddingRight: 20,
    paddingBottom: 14,
    borderRadius: 8,
    backgroundColor: Colors.pure,
    ...BaseStyles.shadow,
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
  },
  productInformation: {
    flex: 1,
    marginRight: 12,
  },
  quantityUpdate: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
  },
  quantityInformation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  property: {
    marginBottom: 8,
  },
  removeItem: {
    marginLeft: 8,
    alignItems: 'center',
    verticalAlign: 'center',
    justifyContent: 'center',
  },
});
