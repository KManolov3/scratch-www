import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export const iconSize = 24;

export const loadingIndicatorColor = Colors.advanceVoid;

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 7,
    paddingHorizontal: 18,

    borderRadius: 8,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: Colors.advanceYellow,
    borderColor: Colors.advanceYellow,
    borderWidth: 1,
  },
  dark: {
    backgroundColor: Colors.advanceVoid,
    borderColor: Colors.advanceVoid,
  },
  gray: {
    backgroundColor: Colors.gray100,
    borderColor: Colors.gray100,
  },
  disabled: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.pure,
  },
  sizeBig: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    color: Colors.advanceVoid,
    fontWeight: FontWeight.Bold,
  },
  sizeBigText: {
    fontSize: 16,
  },
  primaryText: { color: Colors.advanceVoid },
  darkText: { color: Colors.pure },
  grayText: { color: Colors.advanceVoid },
  disabledText: { color: Colors.lightVoid },
  iconMargin: {
    marginRight: 12,
  },
  spinner: {
    height: 12,
    marginLeft: 4,
    alignSelf: 'center',
  },
  loading: {
    backgroundColor: Colors.lightGray,
    borderColor: 'transparent',
  },
});
