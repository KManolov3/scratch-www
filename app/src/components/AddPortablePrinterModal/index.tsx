import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarcodeIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { Text } from '@components/Text';
import { TextInput } from '@components/TextInput';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { scanCodeService } from '@services/ScanCode';
import { useScanListener } from '@services/Scanner';

export interface AddPortablePrinterModalProps {
  isVisible: boolean;
  onConfirm: (portablePrinter: string) => void;
  onCancel: () => void;
}

export function AddPortablePrinterModal({
  isVisible,
  onConfirm,
  onCancel,
}: AddPortablePrinterModalProps) {
  const [portablePrinterInput, setPortablePrinterInput] = useState('');

  const confirm = useCallback(() => {
    onConfirm(portablePrinterInput);
    setPortablePrinterInput('');
  }, [onConfirm, portablePrinterInput]);

  useScanListener(scan => {
    const parsedScan = scanCodeService.parseExpectingPrinter(scan);
    switch (parsedScan.type) {
      case 'printer':
        onConfirm(parsedScan.networkName);
        break;

      case 'unknown':
        setPortablePrinterInput(parsedScan.networkName);
        break;
    }
  });

  return (
    <ConfirmationModal
      isVisible={isVisible}
      onConfirm={confirm}
      onCancel={onCancel}
      confirmationLabel="Add Portable"
      Icon={BarcodeIcon}
      title="Scan to Add Portable Printer">
      <View style={styles.informationTextContainer}>
        <Text style={styles.informationText}>
          Scan to connect or enter in the alphanumeric code to add a portable
          printer
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Portable Printer Number</Text>
        <TextInput
          placeholder="XXXXXX-XX-XXXX"
          value={portablePrinterInput}
          onChangeText={value => setPortablePrinterInput(value)}
          style={styles.input}
        />
      </View>
    </ConfirmationModal>
  );
}

const styles = StyleSheet.create({
  informationText: {
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    maxWidth: 180,
  },
  informationTextContainer: { justifyContent: 'center', flexDirection: 'row' },
  inputContainer: { marginTop: 70, paddingHorizontal: 30, marginBottom: 30 },
  label: { fontWeight: FontWeight.Demi, fontSize: 16, lineHeight: 24 },
  input: {
    backgroundColor: Colors.mediumGray,
    borderRadius: 4,
    paddingHorizontal: 16,
  },
});
