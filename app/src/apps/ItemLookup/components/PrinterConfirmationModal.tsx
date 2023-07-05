import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PrinterIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { PrinterList } from '@components/PrinterList';
import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';
import { Printers, Printer } from '@services/Printers';

interface PrinterConfirmationModalProps {
  isVisible: boolean;
  initiallySelectedPrinter: Printer;
  onCancel(): void;
  onConfirm(printer: Printer): void;
}

export function PrinterConfirmationModal({
  isVisible,
  initiallySelectedPrinter,
  onCancel,
  onConfirm,
}: PrinterConfirmationModalProps) {
  const [selectedPrinter, setSelectedPrinter] = useState<Printer>(
    initiallySelectedPrinter,
  );

  const confirmPrinter = useCallback(
    () => onConfirm(selectedPrinter),
    [onConfirm, selectedPrinter],
  );

  const onSelectPrinter = useCallback(({ printer }: { printer: Printer }) => {
    setSelectedPrinter(printer);
  }, []);

  return (
    <ConfirmationModal
      isVisible={isVisible}
      onCancel={onCancel}
      onConfirm={confirmPrinter}
      title="Print Front Tags"
      confirmationLabel="Select"
      Icon={PrinterIcon}>
      <View style={styles.printModal}>
        <Text>
          Print to{' '}
          <Text style={styles.bold}>{Printers.labelOf(selectedPrinter)}</Text>
        </Text>

        <PrinterList
          selectedPrinter={selectedPrinter}
          onSelect={onSelectPrinter}
          style={styles.printerList}
        />
      </View>
    </ConfirmationModal>
  );
}

const styles = StyleSheet.create({
  printModal: { alignItems: 'center' },
  bold: { fontWeight: FontWeight.Bold },
  printerList: { width: 210, marginTop: 14 },
});
