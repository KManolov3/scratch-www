import React, { ReactNode } from 'react';
// eslint-disable-next-line no-restricted-syntax
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { FontFamily } from '@lib/font';
import { styles } from './styles';

export interface Props extends TextProps {
  children: ReactNode;
}

export type TextRef = RNText;

export const Text = React.forwardRef<TextRef, Props>(
  ({ children, style, ...rest }, ref) => {
    const resolvedStyle = StyleSheet.flatten(style) || {};

    const fontFamily = {
      fontFamily: FontFamily.OpenSans,
    };

    return (
      <RNText
        style={[styles.default, resolvedStyle, fontFamily]}
        {...rest}
        allowFontScaling={false}
        ref={ref}>
        {children}
      </RNText>
    );
  },
);
