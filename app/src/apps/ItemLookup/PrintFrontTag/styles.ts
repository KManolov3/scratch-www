import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { StyleSheet } from 'react-native';

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
  text: { fontSize: 16 },
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
    marginHorizontal: 12,
    alignItems: 'center',
  },
  headers: {
    padding: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    fontWeight: FontWeight.Demi,
    marginTop: 20,
  },
  separator: {
    backgroundColor: Colors.grayer,
    height: 1,
  },
  qty: {
    marginRight: 41,
  },
  toast: {
    marginBottom: '10%',
  },
  searchBar: {
    backgroundColor: Colors.pure,
  },
  planogramContainer: { flex: 1 },
  radioButtons: { width: 170, marginTop: 14 },
});
