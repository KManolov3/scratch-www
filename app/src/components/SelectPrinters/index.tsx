import { BlackAttentionIcon } from '@assets/icons';
import { RadioButton } from '@components/Button/Radio';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { Container } from '@components/Container';
import {
  DrawerNavigation,
  DrawerScreenProps,
} from '@components/Drawer/navigator';
import { LightHeader } from '@components/LightHeader';
import { Text } from '@components/Text';
import { useBooleanState } from '@hooks/useBooleanState';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { FixedLayout } from '@layouts/FixedLayout';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export interface SelectPrinterProps {
  title?: string;
}

export function SelectPrinters({
  route: {
    params: { title },
  },
}: DrawerScreenProps<'SelectPrinter'>) {
  const { replace } = useNavigation<DrawerNavigation>();

  const {
    state: confirmationModalVisible,
    disable: closeConfirmationModal,
    enable: openConfirmationModal,
  } = useBooleanState();

  const { defaultPrinterOption, set } = useDefaultSettings();
  const [printer, setPrinter] = useState(defaultPrinterOption);
  const printerToBeSelected = useRef(defaultPrinterOption);

  const printerValues = useMemo(
    () =>
      Array.from(Object.values(PrinterOptions)).map(item => (
        <RadioButton
          key={item}
          checked={item === printer}
          onPress={() => {
            printerToBeSelected.current = item;
            openConfirmationModal();
          }}
          buttonStyle={styles.button}>
          <Text style={styles.text}>{item}</Text>
          {item === printer ? (
            <Text style={styles.default}>Default</Text>
          ) : null}
        </RadioButton>
      )),
    [openConfirmationModal, printer],
  );

  const confirm = useCallback(() => {
    setPrinter(printerToBeSelected.current);
    set('defaultPrinterOption', printerToBeSelected.current);
    closeConfirmationModal();
  }, [closeConfirmationModal, set]);

  const onBackPress = useCallback(
    () => replace('DrawerHome', { title }),
    [replace, title],
  );

  return (
    <>
      <FixedLayout style={{ backgroundColor: Colors.lightGray }}>
        <LightHeader label="Printers" onPress={onBackPress} />
        <Container style={styles.radioButtons}>
          <View>{printerValues}</View>
        </Container>
      </FixedLayout>
      <ConfirmationModal
        isVisible={confirmationModalVisible}
        onCancel={closeConfirmationModal}
        onConfirm={confirm}
        confirmationLabel="Continue"
        title="Default Printer"
        Icon={BlackAttentionIcon}
        iconStyles={styles.icon}
        buttonsStyle={styles.buttons}>
        <Text style={styles.confirmationModalText}>
          Are you sure you want to set{' '}
        </Text>
        <Text style={styles.confirmationModalText}>
          <Text style={styles.bold}>{printerToBeSelected.current}</Text> as the
          default printer?
        </Text>
      </ConfirmationModal>
    </>
  );
}

const styles = StyleSheet.create({
  radioButtons: { margin: 16, ...BaseStyles.shadow },
  text: {
    fontSize: 20,
    fontWeight: FontWeight.Demi,
    marginLeft: 13,
  },
  button: { marginLeft: 32 },
  buttons: { marginTop: 60 },
  default: { fontSize: 10, fontWeight: FontWeight.Book, marginLeft: 70 },
  confirmationModalText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  bold: { fontWeight: FontWeight.Bold },
  icon: { marginTop: 60 },
});
