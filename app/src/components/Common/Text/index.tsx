import React, { ReactNode } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { getFontFamily } from '@styles/font';
import styles from './styles';

export interface Props extends TextProps {
  children: ReactNode;
}

export type TextRef = Text;

export default React.forwardRef<TextRef, Props>(
  ({ children, style, ...rest }, ref) => {
    const resolvedStyle = StyleSheet.flatten(style) || {};
    const { fontWeight, fontFamily, fontStyle, ...restOfStyle } = resolvedStyle;

    const customStyle = {
      fontFamily: getFontFamily({ fontWeight, fontFamily, fontStyle }),
    };

    return (
      <Text
        style={[styles.default, restOfStyle, customStyle]}
        {...rest}
        allowFontScaling={false}
        ref={ref}>
        {children}
      </Text>
    );
  },
);
