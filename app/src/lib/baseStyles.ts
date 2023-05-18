import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const generateHitSlop = (value: number) => ({
  top: value,
  bottom: value,
  left: value,
  right: value,
});

export const BaseStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    alignSelf: 'center',
  },
  shadow: {
    shadowColor: Colors.advanceVoid,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
});
