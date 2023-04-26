import { ViewStyle } from 'react-native';

export const generateHitSlop = (value: number) => ({
  top: value,
  bottom: value,
  left: value,
  right: value,
});

export const buttonStyle: ViewStyle = {
  position: 'absolute',
  alignSelf: 'center',
};
