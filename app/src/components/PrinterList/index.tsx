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
import { PrinterOption } from '@hooks/useDefaultSettings';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

interface PrinterListProps {
  onRadioButtonPress(item: PrinterOption): void;
  checked(item: PrinterOption): boolean;
  setPortablePrinter(portablePrinter: string): void;
  withDefault?: boolean;
  portablePrinter: string | undefined;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  portablePrinterStyles?: StyleProp<ViewStyle>;
}

function getPrinterOptionText(printerOption: PrinterOption) {
  if (printerOption !== PrinterOption.Portable) {
    return printerOption;
  }
  return printerOption ? 'Portable' : 'Add a Portable';
}

export function PrinterList({
  checked,
  onRadioButtonPress,
  containerStyles,
  textStyles,
  portablePrinter,
  setPortablePrinter,
  portablePrinterStyles,
  withDefault = false,
}: PrinterListProps) {
  const {
    state: portablePrinterModalOpen,
    enable: openPortablePrinterModal,
    disable: closePortablePrinterModal,
  } = useBooleanState();

  return (
    <View style={containerStyles}>
      {Array.from(Object.values(PrinterOption)).map(item => (
        <Fragment key={item}>
          <RadioButton
            checked={checked(item)}
            onPress={() => {
              if (item === PrinterOption.Portable && !portablePrinter) {
                return openPortablePrinterModal();
              }
              onRadioButtonPress(item);
            }}>
            <View style={styles.radioButtonContainer}>
              <Text
                style={[
                  checked(item) ? styles.bold : styles.medium,
                  textStyles,
                ]}>
                {getPrinterOptionText(item)}
              </Text>
              {withDefault && checked(item) ? (
                <Text style={styles.default}>Default</Text>
              ) : null}
              {!withDefault &&
                item === PrinterOption.Portable &&
                portablePrinter && (
                  <Pressable
                    onPress={openPortablePrinterModal}
                    style={styles.replaceContainer}>
                    <Text style={styles.replace}>Replace</Text>
                  </Pressable>
                )}
            </View>
          </RadioButton>
          {item === PrinterOption.Portable && portablePrinter && (
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
  bold: { fontSize: 16, fontWeight: FontWeight.Bold },
  medium: { fontSize: 16, fontWeight: FontWeight.Medium },
  default: { fontSize: 10, fontWeight: FontWeight.Book },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
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
