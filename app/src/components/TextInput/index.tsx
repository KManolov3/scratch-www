import React from 'react';
import {
  StyleSheet,
  // eslint-disable-next-line no-restricted-syntax
  TextInputProps,
  // eslint-disable-next-line no-restricted-syntax
  TextInput as RNTextInput,
  Keyboard,
  KeyboardTypeOptions,
} from 'react-native';
import { FontFamily } from '@lib/font';
import { styles, placeholderColor } from './styles';

export type { TextInputProps, RNTextInput as TextInputRef };

const getReturnKeyType = (keyboardType: KeyboardTypeOptions) => {
  switch (keyboardType) {
    case 'number-pad':
    case 'decimal-pad':
    case 'numeric':
    case 'phone-pad':
      return 'done';
    default:
      return undefined;
  }
};

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (
    {
      style,
      placeholderTextColor,
      onSubmitEditing,
      keyboardType = 'default',
      returnKeyType,
      ...restProps
    },
    ref,
  ) => {
    const resolvedStyle = StyleSheet.flatten(style);

    const fontFamily = {
      fontFamily: FontFamily.OpenSans,
    };

    return (
      <RNTextInput
        style={[styles.default, resolvedStyle, fontFamily]}
        placeholderTextColor={placeholderTextColor ?? placeholderColor}
        onSubmitEditing={onSubmitEditing ?? Keyboard.dismiss}
        returnKeyType={returnKeyType ?? getReturnKeyType(keyboardType)}
        keyboardType={keyboardType}
        ref={ref}
        {...restProps}
        allowFontScaling={false}
      />
    );
  },
);
