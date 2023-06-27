import { StyleSheet, View } from 'react-native';
import { Text } from '@components/Text';
import { BarcodeIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { useScanCodeListener } from '@services/ScanCode';
import { useState } from 'react';
import { TextInput } from '@components/TextInput';

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
  useScanCodeListener({
    onSku({ sku }) {
      onConfirm(sku);
    },
  });

  const [pp, setPp] = useState('');

  return (
    <ConfirmationModal
      isVisible={isVisible}
      onConfirm={() => {
        onConfirm(pp);
        setPp('');
      }}
      onCancel={onCancel}
      confirmationLabel="Add Portable"
      Icon={BarcodeIcon}
      iconStyles={styles.icon}
      title="Scan to Add Portable Printer">
      <Text style={styles.informationText}>
        Scan to connect or enter in the alphanumeric code to add a portable
        printer
      </Text>
      <View>
        <Text>Portable Printer Number</Text>
        <TextInput
          placeholder="XXXXXX - XX - XXXX"
          value={pp}
          onChangeText={value => {
            setPp(value);
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
});
