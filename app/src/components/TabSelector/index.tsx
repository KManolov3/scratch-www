import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { Colors } from '@lib/colors';
import { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';

type DefinableStringArray = ReadonlyArray<string> | string[];

export interface TabSelectorProps<T extends DefinableStringArray> {
  values: T;
  selected: T[number];
  setSelected: (value: T[number]) => void;
}

export function TabSelector<T extends DefinableStringArray = string[]>({
  values,
  selected,
  setSelected,
}: TabSelectorProps<T>) {
  const selectValue = useCallback(
    (value: Parameters<typeof setSelected>[0]) => setSelected(value),
    [setSelected],
  );
  const tabs = useMemo(() => {
    return values.map(value => (
      <BlockButton
        label={value}
        onPress={() => selectValue(value)}
        style={[styles.pressable, value === selected ? styles.selectedTab : {}]}
        key={value}
      />
    ));
  }, [values, selectValue, selected]);
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
