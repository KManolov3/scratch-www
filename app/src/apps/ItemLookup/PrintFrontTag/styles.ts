import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export const styles = StyleSheet.create({
  bold: { fontWeight: FontWeight.Bold },
  flexRow: { flexDirection: 'row', alignItems: 'center' },
  planogramId: { marginLeft: 13 },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 9,
  },
  container: { backgroundColor: Colors.pure },
  actionButton: { flex: 1 },
  text: { fontSize: 16, lineHeight: 22 },
  printToLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  viewOptions: { color: Colors.blue, marginLeft: 8, fontSize: 14 },
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
  planogramContainer: { flex: 1 },
});
