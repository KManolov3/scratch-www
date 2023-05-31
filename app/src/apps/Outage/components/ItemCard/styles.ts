import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.pure,
    elevation: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    color: Colors.blue,
    fontWeight: FontWeight.Demi,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 8,
  },
  rowItem: {
    marginRight: 12,
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
  zero: {
    color: Colors.advanceRed,
  },
  removeItem: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: Colors.advanceYellow,
  },
  removeItemText: {
    textAlign: 'center',
    fontWeight: FontWeight.Demi,
  },
});
