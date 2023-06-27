import { Fragment } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { AddPortablePrinterModal } from '@components/AddPortablePrinterModal';
import { RadioButton } from '@components/Button/Radio';
import { Text } from '@components/Text';
import { useBooleanState } from '@hooks/useBooleanState';
import { PrinterOptions } from '@hooks/useDefaultSettings';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

interface RadioButtonsListProps {
  onRadioButtonPress(item: PrinterOptions): void;
  checked(item: PrinterOptions): boolean;
  setPortablePrinter(portablePrinter: string): void;
  withDefault?: boolean;
  portablePrinter: string | undefined;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  portablePrinterStyles?: StyleProp<ViewStyle>;
}

function getPrinterOptionText(printerOptions: PrinterOptions) {
  if (printerOptions !== PrinterOptions.Portable) {
    return printerOptions;
  }
  return printerOptions ? 'Portable' : 'Add a Portable';
}

export function Printers({
  checked,
  onRadioButtonPress,
  containerStyles,
  textStyles,
  portablePrinter,
  setPortablePrinter,
  portablePrinterStyles,
  withDefault = false,
}: RadioButtonsListProps) {
  const {
    state: portablePrinterModalOpen,
    enable: openPortablePrinterModal,
    disable: closePortablePrinterModal,
  } = useBooleanState();

  return (
    <View style={containerStyles}>
      {Array.from(Object.values(PrinterOptions)).map(item => (
        <Fragment key={item}>
          <RadioButton
            checked={checked(item)}
            onPress={() => {
              if (item === PrinterOptions.Portable && !portablePrinter) {
                return openPortablePrinterModal();
              }
              onRadioButtonPress(item);
            }}
            buttonStyle={styles.radioButton}>
            <View style={styles.radioButtonContainer}>
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
                {getPrinterOptionText(item)}
              </Text>
              {withDefault && checked(item) ? (
                <Text style={styles.default}>Default</Text>
              ) : null}
              {!withDefault &&
                item === PrinterOptions.Portable &&
                portablePrinter && (
                  <Pressable
                    onPress={openPortablePrinterModal}
                    style={styles.replaceContainer}>
                    <Text style={styles.replace}>Replace</Text>
                  </Pressable>
                )}
            </View>
          </RadioButton>
          {item === PrinterOptions.Portable && portablePrinter && (
            <Pressable
              style={[styles.portablePrinterRow, portablePrinterStyles]}>
              <View style={styles.radioButtonContainer}>
                <Text>{portablePrinter}</Text>
                {withDefault && (
                  <Pressable onPress={openPortablePrinterModal}>
                    <Text style={styles.replace}>Replace</Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          )}
        </Fragment>
      ))}

      <AddPortablePrinterModal
        isVisible={portablePrinterModalOpen}
        onCancel={closePortablePrinterModal}
        onConfirm={printerCode => {
          closePortablePrinterModal();
          setPortablePrinter(printerCode);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 16 },
  default: { fontSize: 10, fontWeight: FontWeight.Book },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  radioButton: { paddingBottom: 0 },
  portablePrinterRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 8,
    paddingLeft: 45,
    paddingTop: 0,
  },
  replace: {
    color: Colors.blue,
    fontWeight: FontWeight.Bold,
    fontSize: 14,
    lineHeight: 22,
  },
  replaceContainer: { marginLeft: 50 },
});
