import { RadioButton } from '@components/Button/Radio';
import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';
import { StyleSheet, View } from 'react-native';

interface RadioButtonsListProps<T extends string> {
  onRadioButtonPress(item: T): void;
  checked(item: T): boolean;
  items: T[];
  bold?: boolean;
}

export function RadioButtonsList<T extends string>({
  items,
  checked,
  onRadioButtonPress,
  bold = false,
}: RadioButtonsListProps<T>) {
  return (
    <View>
      {items.map(item => (
        <RadioButton
          key={item}
          checked={checked(item)}
          onPress={() => onRadioButtonPress(item)}>
          <Text
            style={[
              styles.text,
              {
                fontWeight:
                  bold && checked(item) ? FontWeight.Bold : FontWeight.Medium,
              },
            ]}>
            {item}
          </Text>
        </RadioButton>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 16 },
});
