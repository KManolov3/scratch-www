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
import {
  COUNTER_PRINTERS,
  SelectedPrinter,
  useDefaultSettings,
} from '@hooks/useDefaultSettings';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useCurrentSessionInfo } from '@services/Auth';

interface PrinterListProps {
  onSelect(printer: SelectedPrinter, alreadyConfirmedPrinter: boolean): void;
  selectedPrinter: SelectedPrinter;
  // setPortablePrinter(portablePrinter: string): void;
  showDefaultLabelIfSelected?: boolean;
  // portablePrinter: string | undefined;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  portablePrinterStyles?: StyleProp<ViewStyle>;
}

// function getPrinterOptionText(printerOption: PrinterOption) {
//   if (printerOption !== PrinterOption.Portable) {
//     return printerOption;
//   }
//
//   return printerOption ? 'Portable' : 'Add a Portable';
// }

export function PrinterList({
  selectedPrinter,
  onSelect,

  // TODO: Rename to `styles`
  containerStyles,

  // textStyles,
  // portablePrinter,
  // setPortablePrinter,
  // portablePrinterStyles,
  showDefaultLabelIfSelected = false,
}: PrinterListProps) {
  const {
    state: portablePrinterModalOpen,
    enable: openPortablePrinterModal,
    disable: closePortablePrinterModal,
  } = useBooleanState();

  const { userId, storeNumber } = useCurrentSessionInfo();

  const { data: lastUsedPortablePrinter, set: setLastUsedPortablePrinter } =
    useDefaultSettings([userId, storeNumber], 'lastUsedPortablePrinter');

  return (
    <View style={containerStyles}>
      {COUNTER_PRINTERS.map(printer => (
        <PrinterOption
          key={printer.id}
          title={printer.name}
          selected={
            selectedPrinter.type === 'counter' &&
            printer.id === selectedPrinter.id
          }
          showDefaultLabelIfSelected={showDefaultLabelIfSelected}
          onSelect={() => {
            onSelect({ type: 'counter', id: printer.id }, false);
          }}
        />
      ))}

      <PrinterOption
        title={lastUsedPortablePrinter ? 'Portable' : 'Add a Portable'}
        subtitle={
          selectedPrinter.type === 'portable'
            ? selectedPrinter.networkName
            : lastUsedPortablePrinter
        }
        selected={selectedPrinter.type === 'portable'}
        showDefaultLabelIfSelected={showDefaultLabelIfSelected}
        onSelect={() => {
          if (lastUsedPortablePrinter) {
            onSelect(
              {
                type: 'portable',
                networkName: lastUsedPortablePrinter,
              },
              false,
            );
          } else {
            openPortablePrinterModal();
          }
        }}
        onReplace={openPortablePrinterModal}
      />

      {/* TODO: New instance of this modal on every render */}
      <AddPortablePrinterModal
        isVisible={portablePrinterModalOpen}
        onCancel={closePortablePrinterModal}
        onConfirm={printerCode => {
          closePortablePrinterModal();
          setLastUsedPortablePrinter(printerCode);
          onSelect({ type: 'portable', networkName: printerCode }, true);
        }}
      />
    </View>
  );
}

function PrinterOption({
  title,
  subtitle,
  selected,
  showDefaultLabelIfSelected,
  onSelect,
  onReplace,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  showDefaultLabelIfSelected: boolean;
  onSelect: () => void;
  onReplace?: () => void;
}) {
  return (
    // TODO: Fix layout
    <>
      <RadioButton
        checked={selected}
        onPress={() => {
          if (!selected) {
            onSelect();
          }
        }}>
        <View style={styles.radioButtonContainer}>
          <Text
            style={[
              selected ? styles.bold : styles.medium,

              // TODO: Why?
              // textStyles,
            ]}>
            {/* {getPrinterOptionText(item)} */}
            {title}
          </Text>

          {showDefaultLabelIfSelected && selected ? (
            <Text style={styles.default}>Default</Text>
          ) : null}

          {!showDefaultLabelIfSelected && onReplace && (
            <Pressable onPress={onReplace} style={styles.replaceContainer}>
              <Text style={styles.replace}>Replace</Text>
            </Pressable>
          )}
        </View>
      </RadioButton>

      {subtitle && (
        <Pressable
          style={[
            styles.portablePrinterRow,

            // TODO: Why?
            // portablePrinterStyles
          ]}>
          <View style={styles.radioButtonContainer}>
            <Text>{subtitle}</Text>

            {showDefaultLabelIfSelected && (
              <Pressable onPress={onReplace}>
                <Text style={styles.replace}>Replace</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      )}
    </>
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
