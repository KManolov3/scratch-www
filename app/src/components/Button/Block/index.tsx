import { ReactElement as ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  Pressable,
  ViewStyle,
  PressableProps,
} from 'react-native';
import type Svg from 'react-native-svg';
import { Text } from '@components/Text';
import { styles, iconSize, loadingIndicatorColor } from './styles';

interface Props extends PressableProps {
  variant: 'primary' | 'dark' | 'gray';
  children?: string | ReactNode;
  Icon?: typeof Svg;
  onPress: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;
}

export function BlockButton({
  variant,
  children,
  Icon,
  onPress,
  style,
  textStyle,
  disabled,
  isLoading = false,
  disabledStyle,
  disabledTextStyle,
  ...rest
}: Props) {
  return (
    <Pressable
      style={[
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'dark' && styles.dark,
        variant === 'gray' && styles.gray,
        style,
        disabled && styles.disabled,
        disabled && disabledStyle,
        isLoading && styles.loading,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      {...rest}>
      {!!Icon && (
        <Icon
          height={iconSize}
          width={iconSize}
          style={children ? styles.iconMargin : undefined}
        />
      )}

      {!isLoading &&
        (typeof children === 'string' ? (
          <Text
            style={[
              styles.text,
              variant === 'primary' && styles.primaryText,
              variant === 'dark' && styles.darkText,
              variant === 'gray' && styles.grayText,
              textStyle,
              disabled && styles.disabledText,
              disabled && disabledTextStyle,
            ]}>
            {children}
          </Text>
        ) : (
          children
        ))}

      {isLoading && (
        <ActivityIndicator
          color={loadingIndicatorColor}
          style={styles.spinner}
        />
      )}
    </Pressable>
  );
}
