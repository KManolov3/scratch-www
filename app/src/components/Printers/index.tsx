import { RadioButton } from '@components/Button/Radio';
import { Text } from '@components/Text';
import { PrinterOptions } from '@hooks/useDefaultSettings';
import { FontWeight } from '@lib/font';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface RadioButtonsListProps {
  onRadioButtonPress(item: PrinterOptions): void;
  checked(item: PrinterOptions): boolean;
  replacePortablePritner(): void;
  withDefault?: boolean;
  portablePrinter: string | undefined;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
}

function PrinterRow({
  item,
  portablePrinter,
  replacePortablePrinter,
}: {
  item: PrinterOptions;
  portablePrinter: string | undefined;
  replacePortablePrinter: () => void;
}) {
  if (item !== PrinterOptions.Portable) {
    return item;
  }

  return (
    <View>
      <Text>{portablePrinter ? 'Portable' : 'Add a Portable'}</Text>
      {portablePrinter && (
        <View>
          <Text>{portablePrinter}</Text>
          <Pressable onPress={replacePortablePrinter}>
            <Text>Replace</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export function Printers({
  checked,
  onRadioButtonPress,
  containerStyles,
  textStyles,
  portablePrinter,
  replacePortablePritner,
  withDefault = false,
}: RadioButtonsListProps) {
  return (
    <View style={containerStyles}>
      {Array.from(Object.values(PrinterOptions)).map(item => (
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
                  fontWeight: checked(item)
                    ? FontWeight.Bold
                    : FontWeight.Medium,
                },
              ]}>
              {PrinterRow({
                item,
                portablePrinter,
                replacePortablePrinter: replacePortablePritner,
              })}
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
