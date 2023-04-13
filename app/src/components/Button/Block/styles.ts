import { Colors } from '@lib/colors';
import { StyleSheet } from 'react-native';

export const primaryColor = Colors.advanceVoid;
export const secondaryColor = Colors.lightVoid;

export const iconSize = 16;

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    padding: 16,
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
    fontSize: 16,
    lineHeight: 24,
    color: primaryColor,
  },
  disabledText: {
    color: secondaryColor,
  },
  icon: {
    marginRight: 12,
  },
  spinner: {
    height: 12,
    marginLeft: 4,
    alignSelf: 'center',
  },
});
