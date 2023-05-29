import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { PrinterIcon } from '@assets/icons';
import { useCallback, useMemo, useState } from 'react';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { useBooleanState } from '@hooks/useBooleanState';
import { RadioButton } from '@components/Button/Radio';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import { PrintConfirmationModal } from '../PrintConfirmationModal';

const TRIGGER_CONFIRMATION_QUANTITY = 11;
export interface PrintModalProps {
  isVisible: boolean;
  onConfirm: (printer: PrinterOptions, quantity: number) => void;
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
  const {
    state: showPrinterOptions,
    toggle: toggleShowPrinterOptions,
    disable: hidePrinterOptions,
  } = useBooleanState();
  const {
    state: confirmationModalOpen,
    enable: showConfirmationModal,
    disable: hideConfirmationModal,
  } = useBooleanState();

  const resetState = useCallback(() => {
    setQuantity(1);
    setPrinter(defaultPrinterOption);
    hidePrinterOptions();
  }, [defaultPrinterOption, hidePrinterOptions]);

  const print = useCallback(() => {
    if (quantity >= TRIGGER_CONFIRMATION_QUANTITY) {
      hidePrinterOptions();
      return showConfirmationModal();
    }
    onConfirm(printer, quantity);
    resetState();
  }, [
    hidePrinterOptions,
    onConfirm,
    printer,
    quantity,
    resetState,
    showConfirmationModal,
  ]);

  const onConfirmCallback = useCallback(() => {
    onConfirm(printer, quantity);
    resetState();
    hideConfirmationModal();
  }, [hideConfirmationModal, onConfirm, printer, quantity, resetState]);

  const printerValues = useMemo(
    () =>
      (Object.values(PrinterOptions) as Array<PrinterOptions>).map(item => (
        <RadioButton
          key={item}
          checked={item === printer}
          onPress={() => setPrinter(item)}>
          <Text>{item}</Text>
        </RadioButton>
      )),
    [printer],
  );

  return (
    <>
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
          <View style={styles.radioButtons}>
            <View>{printerValues}</View>
          </View>
        )}
        <View style={styles.quantityAdjuster}>
          <Text style={[styles.bold, styles.qty]}>Qty:</Text>
          <QuantityAdjuster
            minimum={1}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </View>
        <View style={styles.container}>
          <Pressable onPress={onCancel} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
          <Pressable
            onPress={print}
            style={[styles.button, styles.confirmationButton]}>
            <Text style={styles.buttonText}>Print Front Tag</Text>
          </Pressable>
        </View>
      </Modal>
      <PrintConfirmationModal
        isVisible={confirmationModalOpen}
        onCancel={showConfirmationModal}
        onConfirm={onConfirmCallback}
        quantity={quantity}
      />
    </>
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
  qty: { marginRight: 12 },
});
