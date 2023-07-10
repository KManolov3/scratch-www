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
import { styles, variants, iconSize, loadingIndicatorColor } from './styles';

interface Props extends PressableProps {
  variant: 'primary' | 'dark' | 'gray';
  size?: 'normal' | 'big';

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
  size = 'normal',
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
        variants[variant].button,
        size === 'big' && styles.sizeBig,
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
              variants[variant].text,
              size === 'big' && styles.sizeBigText,
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
