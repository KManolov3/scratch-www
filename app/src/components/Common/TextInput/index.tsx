import React from 'react';
import {
  StyleSheet,
  TextInputProps,
  TextInput,
  Keyboard,
  KeyboardTypeOptions,
} from 'react-native';
import { getFontFamily } from '@styles/font';
import styles, { placeholderColor } from './styles';

export type TextInputRef = TextInput;

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

export default React.forwardRef<TextInput, TextInputProps>(
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
    const { fontWeight, fontFamily, fontStyle, ...restOfStyle } = resolvedStyle;

    const customStyle = {
      fontFamily: getFontFamily({ fontWeight, fontFamily, fontStyle }),
    };

    return (
      <TextInput
        style={[styles.default, restOfStyle, customStyle]}
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
