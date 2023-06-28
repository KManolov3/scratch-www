import { RadioButton } from '@components/Button/Radio';
import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface RadioButtonsListProps<T extends string> {
  onRadioButtonPress(item: T): void;
  checked(item: T): boolean;
  items: T[];
  bold?: boolean;
  withDefault?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
}

export function RadioButtonsList<T extends string>({
  items,
  checked,
  onRadioButtonPress,
  containerStyles,
  textStyles,
  bold = false,
  withDefault = false,
}: RadioButtonsListProps<T>) {
  return (
    <View style={containerStyles}>
      {items.map(item => (
        <RadioButton
          key={item}
          checked={checked(item)}
          onPress={() => onRadioButtonPress(item)}>
          <View style={styles.radioButtonText}>
            <Text
              style={[
                styles.text,
                textStyles,
                {
                  fontWeight:
                    bold && checked(item) ? FontWeight.Bold : FontWeight.Medium,
                },
              ]}>
              {item}
            </Text>
            {withDefault && checked(item) ? (
              <Text style={styles.default}>Default</Text>
            ) : null}
          </View>
        </RadioButton>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 16 },
  default: { fontSize: 10, fontWeight: FontWeight.Book },
  radioButtonText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
});
