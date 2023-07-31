import { useMemo } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface TabSelectorProps<T extends string> {
  values: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function TabSelector<T extends string>({
  values,
  selected,
  onSelect,
  style,
  buttonStyle,
  textStyle,
}: TabSelectorProps<T>) {
  const tabs = useMemo(() => {
    return values.map(value => (
      <Pressable
        key={value}
        onPress={() => onSelect(value)}
        style={[
          styles.button,
          value === selected ? styles.selectedTab : {},
          buttonStyle,
        ]}>
        <Text
          style={[
            styles.buttonText,
            value === selected ? { color: Colors.pure } : {},
            textStyle,
          ]}>
          {value}
        </Text>
      </Pressable>
    ));
  }, [values, selected, buttonStyle, textStyle, onSelect]);

  return <Container style={[BaseStyles.shadow, style]}>{tabs}</Container>;
}

const styles = StyleSheet.create({
  selectedTab: {
    backgroundColor: Colors.advanceBlack,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: FontWeight.Bold,
  },
});
