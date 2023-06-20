import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';

type DefinableStringArray = ReadonlyArray<string>;

export interface TabSelectorProps<T extends DefinableStringArray> {
  values: T;
  selected: T[number];
  setSelected: (value: T[number]) => void;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function TabSelector<T extends DefinableStringArray>({
  values,
  selected,
  setSelected,
  style,
  buttonStyle,
  textStyle,
}: TabSelectorProps<T>) {
  const tabs = useMemo(() => {
    return values.map(value => (
      <BlockButton
        label={value}
        onPress={() => setSelected(value)}
        style={[
          styles.pressable,
          value === selected ? styles.selectedTab : {},
          buttonStyle,
        ]}
        textStyle={[
          value === selected ? { color: Colors.pure } : {},
          textStyle,
        ]}
        key={value}
      />
    ));
  }, [values, selected, buttonStyle, textStyle, setSelected]);
  return <Container style={[BaseStyles.shadow, style]}>{tabs}</Container>;
}

const styles = StyleSheet.create({
  selectedTab: {
    backgroundColor: Colors.advanceBlack,
  },
  pressable: {
    flex: 1,
    margin: 0,
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: Colors.pure,
  },
});
