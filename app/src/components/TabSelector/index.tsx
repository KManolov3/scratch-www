import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { useMemo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

type DefinableStringArray = ReadonlyArray<string>;

export interface TabSelectorProps<T extends DefinableStringArray> {
  values: T;
  selected: T[number];
  setSelected: (value: T[number]) => void;
  style?: StyleProp<ViewStyle>;
}

export function TabSelector<T extends DefinableStringArray>({
  values,
  selected,
  setSelected,
  style,
}: TabSelectorProps<T>) {
  const tabs = useMemo(() => {
    return values.map(value => (
      <BlockButton
        label={value}
        onPress={() => setSelected(value)}
        style={[styles.pressable, value === selected ? styles.selectedTab : {}]}
        textStyle={value === selected ? { color: Colors.pure } : {}}
        key={value}
      />
    ));
  }, [values, setSelected, selected]);
  return <Container style={[BaseStyles.shadow, style]}>{tabs}</Container>;
}

const styles = StyleSheet.create({
  selectedTab: {
    backgroundColor: Colors.advanceBlack,
  },
  pressable: {
    flex: 1,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: Colors.pure,
  },
});
