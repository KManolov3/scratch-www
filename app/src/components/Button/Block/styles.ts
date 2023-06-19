import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { StyleSheet } from 'react-native';

export const primaryColor = Colors.advanceVoid;
export const secondaryColor = Colors.lightVoid;

export const iconSize = 24;

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    margin: 16,
    backgroundColor: Colors.advanceYellow,
    borderColor: Colors.advanceYellow,
    borderWidth: 1,
    borderRadius: 4,
  },
  disabled: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.pure,
  },
  text: {
    fontSize: 14,
    lineHeight: 40,
    color: primaryColor,
    fontWeight: FontWeight.Bold,
  },
  disabledText: {
    color: secondaryColor,
  },
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
