import { ReactNode, useMemo } from 'react';
import { Pressable, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { SelectedRadioButton, EmptyRadioButton } from '@assets/icons';
import { FontWeight } from '@lib/font';

interface Props {
  checked: boolean;
  onPress(): void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
}

const getRadioIcon = (checked: boolean) => {
  if (checked) {
    return SelectedRadioButton;
  }

  return EmptyRadioButton;
};

export function RadioButton({
  onPress,
  checked,
  children,
  style,
  iconStyle,
  iconSize: customIconSize,
}: Props) {
  const RadioIconComponent = useMemo(() => {
    const RadioIcon = getRadioIcon(checked);

    return (
      <RadioIcon
        height={customIconSize || iconSize}
        width={customIconSize || iconSize}
        style={[styles.checkbox, iconStyle]}
      />
    );
  }, [checked, customIconSize, iconStyle]);

  return (
    <Pressable onPress={onPress} style={[styles.root, style]}>
      {RadioIconComponent}
      {children}
    </Pressable>
  );
}
const iconSize = 16;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: FontWeight.Demi,
    flex: 1,
  },
  checkbox: {
    marginRight: 8,
  },
});
