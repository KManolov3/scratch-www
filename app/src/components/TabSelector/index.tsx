import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { Colors } from '@lib/colors';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

type DefinableStringArray = ReadonlyArray<string>;

export interface TabSelectorProps<T extends DefinableStringArray> {
  values: T;
  selected: T[number];
  setSelected: (value: T[number]) => void;
}

export function TabSelector<T extends DefinableStringArray>({
  values,
  selected,
  setSelected,
}: TabSelectorProps<T>) {
  const tabs = useMemo(() => {
    return values.map(value => (
      <BlockButton
        label={value}
        onPress={() => setSelected(value)}
        style={[styles.pressable, value === selected ? styles.selectedTab : {}]}
        key={value}
      />
    ));
  }, [values, setSelected, selected]);
  return <Container style={styles.container}>{tabs}</Container>;
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
  },
  selectedTab: {
    backgroundColor: Colors.advanceYellow,
  },
  pressable: {
    flex: 1,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: Colors.pure,
  },
});
