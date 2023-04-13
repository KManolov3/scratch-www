import { Colors } from '@lib/colors';
import { StyleSheet } from 'react-native';
import { FontWeight } from 'src/lib/font';

export const defaultIconSize = 20;

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 72,
    backgroundColor: Colors.pure,
    borderBottomColor: Colors.pure,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 8,
  },
  body: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  side: {
    flexShrink: 1,
  },
  title: {
    color: Colors.advanceBlack,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeight.Demi,
    alignSelf: 'center',
  },
  spacerContainer: {
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  spacer: {
    width: defaultIconSize,
    height: defaultIconSize,
  },
});
