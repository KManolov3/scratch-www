import React, { ReactNode } from 'react';
// eslint-disable-next-line no-restricted-syntax
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { getFontFamily } from 'src/lib/font';
import { styles } from './styles';

export interface Props extends TextProps {
  children: ReactNode;
}

export type TextRef = React.RefObject<RNText>;

export const Text = React.forwardRef<RNText, Props>(
  ({ children, style, ...rest }, ref) => {
    const resolvedStyle = StyleSheet.flatten(style) || {};
    const { fontWeight, fontFamily, fontStyle, ...restOfStyle } = resolvedStyle;

    const customStyle = {
      fontFamily: getFontFamily({ fontWeight, fontFamily, fontStyle }),
    };

    return (
      <RNText
        style={[styles.default, restOfStyle, customStyle]}
        {...rest}
        allowFontScaling={false}
        ref={ref}>
        {children}
      </RNText>
    );
  },
);
