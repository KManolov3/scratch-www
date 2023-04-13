import { ReactElement } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  Pressable,
  ViewStyle,
  PressableProps,
} from 'react-native';
import { SvgType } from '*.svg';
import styles, { iconSize, primaryColor, secondaryColor } from './styles';

interface Props extends PressableProps {
  label: string | ReactElement;
  Icon?: SvgType;
  onPress: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;
}

function BlockButton({
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
      ]}
      onPress={onPress}
      disabled={disabled}
      {...rest}>
      {!!Icon && (
        <Icon height={iconSize} width={iconSize} style={styles.icon} />
      )}

      {typeof label === 'string' ? (
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
      )}

      {isLoading && (
        <ActivityIndicator
          color={disabled ? secondaryColor : primaryColor}
          style={styles.spinner}
        />
      )}
    </Pressable>
  );
}
export default BlockButton;
