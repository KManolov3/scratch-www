import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export const styles = StyleSheet.create({
  bold: {
    fontWeight: FontWeight.Bold,
  },
  flexRow: { flexDirection: 'row', alignItems: 'center' },
  centeredText: { textAlign: 'center' },
  checkIcon: { marginRight: 13 },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 9,
  },
  container: { backgroundColor: Colors.pure },
  bottomBarActionText: {
    color: Colors.advanceBlack,
  },
  bottomActionBar: {
    paddingTop: 8,
  },
  text: { fontSize: 16, lineHeight: 22 },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewOptions: { color: Colors.blue, marginLeft: 8, fontSize: 14 },
  printModal: { alignItems: 'center', justifyContent: 'center' },
  table: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  headers: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    fontWeight: FontWeight.Demi,
    marginTop: 20,
    marginHorizontal: 12,
  },
  planogramsContainer: {
    marginHorizontal: 13,
  },
  qty: {
    marginRight: 46,
  },
  toast: {
    marginBottom: '10%',
  },
  searchBar: {
    backgroundColor: Colors.pure,
  },
  planogramContainer: { flex: 1 },
  radioButtons: { width: 170, marginTop: 14 },
  portablePrinter: { paddingLeft: 33 },
});

export function getTextContainerStyles(
  hasPortablePrinter: boolean,
): StyleProp<ViewStyle> {
  return { flexDirection: hasPortablePrinter ? 'column' : 'row' };
}
