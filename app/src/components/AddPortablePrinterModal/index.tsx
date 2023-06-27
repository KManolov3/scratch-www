import { StyleSheet, View } from 'react-native';
import { Text } from '@components/Text';
import { BarcodeIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { useCallback, useState } from 'react';
import { TextInput } from '@components/TextInput';
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

  useScanListener(({ code }) => {
    if (code.startsWith('APQL')) {
      return onConfirm(code);
    }
    setPortablePrinterInput(code);
  });

  return (
    <ConfirmationModal
      isVisible={isVisible}
      onConfirm={confirm}
      onCancel={onCancel}
      confirmationLabel="Add Portable"
      Icon={BarcodeIcon}
      iconStyles={styles.icon}
      title="Scan to Add Portable Printer">
      <Text style={styles.informationText}>
        Scan to connect or enter in the alphanumeric code to add a portable
        printer
      </Text>
      <View style={styles.input}>
        <Text>Portable Printer Number</Text>
        <TextInput
          placeholder="XXXXXX - XX - XXXX"
          value={portablePrinterInput}
          onChangeText={value => {
            setPortablePrinterInput(value);
          }}
        />
      </View>
    </ConfirmationModal>
  );
}

const styles = StyleSheet.create({
  icon: { marginTop: 30 },
  informationText: {
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
  },
  input: { marginTop: 70 },
});
