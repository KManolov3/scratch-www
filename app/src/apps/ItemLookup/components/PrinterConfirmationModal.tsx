import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PrinterIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { PrinterList } from '@components/PrinterList';
import { Text } from '@components/Text';
import { PrinterOption, SelectedPrinter } from '@hooks/useDefaultSettings';
import { FontWeight } from '@lib/font';

interface PrinterConfirmationModalProps {
  isVisible: boolean;
  onCancel(): void;
  setPrinter(printer: SelectedPrinter): void;
  lastUsedPortablePrinter: string | undefined;
  printer: SelectedPrinter;
}

export function PrinterConfirmationModal({
  isVisible,
  onCancel,
  setPrinter,
  lastUsedPortablePrinter,
  printer,
}: PrinterConfirmationModalProps) {
  const [selectedPrinter, setSelectedPrinter] = useState(printer);

  const [localLastUsedPortablePrinter, setLocalLastUsedPortablePrinter] =
    useState(lastUsedPortablePrinter);

  const onConfirm = useCallback(() => {
    onCancel();
    setPrinter(selectedPrinter);
  }, [onCancel, selectedPrinter, setPrinter]);

  const onRadioButtonPress = useCallback(
    (item: PrinterOption) => {
      setSelectedPrinter({
        printerOption: item,
        lastUsedPortablePrinter:
          item === PrinterOption.Portable ? lastUsedPortablePrinter : undefined,
      });
    },
    [lastUsedPortablePrinter],
  );

  const setPortablePrinter = useCallback(
    (printerCode: string) => {
      onCancel();
      setLocalLastUsedPortablePrinter(printerCode);
      setSelectedPrinter({
        printerOption: PrinterOption.Portable,
        lastUsedPortablePrinter: printerCode,
      });
      setPrinter({
        printerOption: PrinterOption.Portable,
        lastUsedPortablePrinter: printerCode,
      });
    },
    [onCancel, setPrinter],
  );

  return (
    <ConfirmationModal
      isVisible={isVisible}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title="Print Front Tags"
      confirmationLabel="Select"
      Icon={PrinterIcon}>
      <View style={styles.printModal}>
        <Text>
          Print to{' '}
          <Text style={styles.bold}>
            {printer.printerOption} {printer.lastUsedPortablePrinter}
          </Text>
        </Text>
        <PrinterList
          checked={item => item === selectedPrinter.printerOption}
          onRadioButtonPress={onRadioButtonPress}
          containerStyles={styles.radioButtons}
          portablePrinter={localLastUsedPortablePrinter}
          portablePrinterStyles={styles.portablePrinter}
          setPortablePrinter={setPortablePrinter}
        />
      </View>
    </ConfirmationModal>
  );
}

const styles = StyleSheet.create({
  printModal: { alignItems: 'center', justifyContent: 'center' },
  bold: { fontWeight: FontWeight.Bold },
  radioButtons: { width: 170, marginTop: 14 },
  portablePrinter: { paddingLeft: 33 },
});
