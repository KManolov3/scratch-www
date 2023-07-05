import { useCallback } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { AddPortablePrinterModal } from '@components/AddPortablePrinterModal';
import { RadioButton } from '@components/Button/Radio';
import { Text } from '@components/Text';
import { useBooleanState } from '@hooks/useBooleanState';
import { useDefaultSettings } from '@hooks/useDefaultSettings';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useCurrentSessionInfo } from '@services/Auth';
import { Printers, Printer } from '@services/Printers';

interface PrinterListProps {
  showDefaultLabelIfSelected?: boolean;

  selectedPrinter: Printer;
  onSelect(selection: { printer: Printer; alreadyConfirmed: boolean }): void;

  style?: StyleProp<ViewStyle>;
}

export function PrinterList({
  selectedPrinter,
  onSelect,

  style,

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
    <View style={style}>
      {Printers.availableCounterPrinters.map(printer => (
        <PrinterOption
          key={printer.id}
          title={printer.name}
          selected={
            selectedPrinter.type === 'counter' &&
            printer.id === selectedPrinter.id
          }
          showDefaultLabelIfSelected={showDefaultLabelIfSelected}
          onSelect={() => {
            if (selectedPrinter.type === 'portable') {
              // This is to keep the portable option the same if deselected while
              // another printer was used more recently
              setLastUsedPortablePrinter(selectedPrinter.networkName);
            }

            onSelect({
              printer: { type: 'counter', id: printer.id },
              alreadyConfirmed: false,
            });
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
            onSelect({
              printer: {
                type: 'portable',
                networkName: lastUsedPortablePrinter,
              },
              alreadyConfirmed: false,
            });
          } else {
            openPortablePrinterModal();
          }
        }}
        onReplace={openPortablePrinterModal}
      />

      <AddPortablePrinterModal
        isVisible={portablePrinterModalOpen}
        onCancel={closePortablePrinterModal}
        onConfirm={printerCode => {
          closePortablePrinterModal();
          setLastUsedPortablePrinter(printerCode);
          onSelect({
            printer: { type: 'portable', networkName: printerCode },
            alreadyConfirmed: true,
          });
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
  const selectIfNotSelected = useCallback(() => {
    if (!selected) {
      onSelect();
    }
  }, [selected, onSelect]);

  return (
    <RadioButton
      style={styles.radioButtonContainer}
      iconSize={20}
      iconStyle={styles.radioButtonIcon}
      checked={selected}
      onPress={selectIfNotSelected}>
      <View style={styles.printerLabel}>
        <View style={styles.printerLabelTitle}>
          <Text
            style={[selected ? styles.titleSelected : styles.titleNotSelected]}>
            {title}
          </Text>

          {showDefaultLabelIfSelected && selected ? (
            <Text style={styles.default}>Default</Text>
          ) : null}

          {!showDefaultLabelIfSelected && onReplace && (
            <Pressable onPress={onReplace} style={styles.replaceButtonInLabel}>
              <Text style={styles.replaceText}>Replace</Text>
            </Pressable>
          )}
        </View>

        {subtitle && (
          <View style={styles.printerLabelSubtitle}>
            <Text style={styles.subtitle}>{subtitle}</Text>

            {showDefaultLabelIfSelected && (
              <Pressable onPress={onReplace}>
                <Text style={styles.replaceText}>Replace</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </RadioButton>
  );
}

const styles = StyleSheet.create({
  titleSelected: { fontSize: 20, fontWeight: FontWeight.Bold },
  titleNotSelected: { fontSize: 20, fontWeight: FontWeight.Medium },
  default: { fontSize: 10, fontWeight: FontWeight.Book },
  radioButtonContainer: {
    alignItems: 'flex-start',
  },
  radioButtonIcon: { marginTop: 4 },
  printerLabel: {
    flexDirection: 'column',
    marginLeft: 5,
    flex: 1,
  },
  printerLabelTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replaceButtonInLabel: { marginLeft: 50 },
  replaceText: {
    color: Colors.blue,
    fontWeight: FontWeight.Bold,
    fontSize: 14,
  },
  printerLabelSubtitle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  subtitle: { fontSize: 16 },
});
