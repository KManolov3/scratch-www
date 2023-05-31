import { SelectedRadioButton, EmptyRadioButton } from '@assets/icons';
import { ReactNode, useMemo } from 'react';
import { Pressable, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { FontWeight } from '@lib/font';

interface Props {
  checked: boolean;
  onPress(): void;
  children?: ReactNode;
  buttonStyle?: StyleProp<ViewStyle>;
  checkedButtonStyle?: StyleProp<ViewStyle>;
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
  buttonStyle,
  checkedButtonStyle,
  iconSize: customIconSize,
}: Props) {
  const RadioIconComponent = useMemo(() => {
    const RadioIcon = getRadioIcon(checked);

    return (
      <RadioIcon
        height={customIconSize || iconSize}
        width={customIconSize || iconSize}
        style={styles.checkbox}
      />
    );
  }, [checked, customIconSize]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.radioButton, buttonStyle, checked && checkedButtonStyle]}>
      {RadioIconComponent}
      {children}
    </Pressable>
  );
}
const iconSize = 16;

const styles = StyleSheet.create({
  radioButton: {
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
