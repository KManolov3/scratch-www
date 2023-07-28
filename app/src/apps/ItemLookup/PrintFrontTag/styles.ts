import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export const styles = StyleSheet.create({
  bold: { fontWeight: FontWeight.Bold },
  flexRow: { flexDirection: 'row', alignItems: 'center' },
  planogramId: { marginLeft: 6 },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 9,
  },
  container: { backgroundColor: Colors.pure },
  actionButton: { flex: 1 },
  text: { fontSize: 14, lineHeight: 22, maxWidth: 205 },
  printToLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  viewOptions: { color: Colors.blue, marginLeft: 8, fontSize: 14 },
  table: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 10,
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
    marginHorizontal: 8,
  },
  qty: {
    marginRight: 46,
  },
  toast: {
    marginBottom: '10%',
  },
  planogramContainer: { flex: 1 },
});
