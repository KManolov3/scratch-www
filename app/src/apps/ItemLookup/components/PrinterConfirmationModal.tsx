import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PrinterIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { PrinterList } from '@components/PrinterList';
import { Text } from '@components/Text';
import { SelectedPrinter, printerLabel } from '@hooks/useDefaultSettings';
import { FontWeight } from '@lib/font';

interface PrinterConfirmationModalProps {
  isVisible: boolean;
  initiallySelectedPrinter: SelectedPrinter | undefined;
  onCancel(): void;
  onConfirm(printer: SelectedPrinter): void;
}

export function PrinterConfirmationModal({
  isVisible,
  initiallySelectedPrinter,
  onCancel,
  onConfirm,
}: PrinterConfirmationModalProps) {
  const [selectedPrinter, setSelectedPrinter] = useState<SelectedPrinter>(
    initiallySelectedPrinter ?? { type: 'counter', id: 1 },
  );

  const confirmPrinter = useCallback(
    () => onConfirm(selectedPrinter),
    [onConfirm, selectedPrinter],
  );

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
          <Text style={styles.bold}>{printerLabel(selectedPrinter)}</Text>
        </Text>
        <PrinterList
          selectedPrinter={selectedPrinter}
          onSelect={setSelectedPrinter}
          // TODO: Remove this style?
          styles={styles.radioButtons}
          // TODO: Remove this style?
          portablePrinterStyles={styles.portablePrinter}
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
