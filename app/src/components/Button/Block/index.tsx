import { ReactElement } from 'react';
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
import { styles, iconSize, primaryColor, secondaryColor } from './styles';

interface Props extends PressableProps {
  label?: string | ReactElement;
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
  label,
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
          style={label ? styles.iconMargin : undefined}
        />
      )}

      {!isLoading &&
        (typeof label === 'string' ? (
          <Text
            style={[
              styles.text,
              textStyle,
              disabled && styles.disabledText,
              disabled && disabledTextStyle,
            ]}>
            {label}
          </Text>
        ) : (
          label
        ))}

      {isLoading && (
        <ActivityIndicator
          color={disabled ? secondaryColor : primaryColor}
          style={styles.spinner}
        />
      )}
    </Pressable>
  );
}
