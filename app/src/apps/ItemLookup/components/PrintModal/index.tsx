import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { PrinterIcon } from '@assets/icons';
import { useState } from 'react';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { useBooleanState } from '@hooks/useBooleanState';
import { RadioButton } from '@components/Button/Radio';
import { QuantityAdjuster } from '@components/QuantityAdjuster';

export interface PrintModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PrintModal({
  isVisible,
  onConfirm,
  onCancel,
}: PrintModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { defaultPrinterOption } = useDefaultSettings();
  const [printer, setPrinter] = useState(defaultPrinterOption);
  const { state: showPrinterOptions, toggleState: toggleShowPrinterOptions } =
    useBooleanState();

  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <View style={styles.printerSvg}>
        <PrinterIcon height={48} width={40} />
      </View>
      <Text style={styles.header}>Print Front Tag</Text>
      <View style={styles.printerInformation}>
        <Text style={styles.text}>
          Print to <Text style={styles.bold}>{printer}</Text>
        </Text>
        <Pressable onPress={toggleShowPrinterOptions}>
          <Text style={[styles.viewOptions, styles.bold]}>
            {showPrinterOptions ? 'Hide' : 'View'} Options
          </Text>
        </Pressable>
      </View>
      {showPrinterOptions && (
        // TODO: center them
        <View style={styles.radioButtons}>
          {(Object.values(PrinterOptions) as Array<PrinterOptions>).map(
            item => (
              <RadioButton
                key={item}
                checked={item === printer}
                onPress={() => setPrinter(item)}>
                <Text>{item}</Text>
              </RadioButton>
            ),
          )}
        </View>
      )}
      <View style={styles.quantityAdjuster}>
        <Text style={styles.bold}>Qty:</Text>
        <QuantityAdjuster quantity={quantity} setQuantity={setQuantity} />
      </View>
      <View style={styles.container}>
        <Pressable onPress={onCancel} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={[styles.button, styles.confirmationButton]}>
          <Text style={styles.buttonText}>Print Front Tag</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  header: {
    fontWeight: FontWeight.Bold,
    marginTop: 12,
    fontSize: 20,
    textAlign: 'center',
  },
  text: {
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: FontWeight.Book,
  },
  printerInformation: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewOptions: { color: Colors.blue },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    fontWeight: FontWeight.Bold,
    backgroundColor: Colors.lightGray,
  },
  confirmationButton: {
    backgroundColor: Colors.advanceYellow,
  },
  buttonText: {
    fontWeight: FontWeight.Demi,
    textAlign: 'center',
  },
  printerSvg: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  bold: { fontWeight: FontWeight.Bold },
  radioButtons: { alignItems: 'center' },
  quantityAdjuster: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
