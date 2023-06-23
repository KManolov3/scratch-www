import { BlackAttentionIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import {
  DrawerNavigation,
  DrawerScreenProps,
} from '@components/Drawer/navigator';
import { LightHeader } from '@components/LightHeader';
import { RadioButtonsList } from '@components/RadioButtonsList';
import { Text } from '@components/Text';
import { useBooleanState } from '@hooks/useBooleanState';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { FixedLayout } from '@layouts/FixedLayout';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';

export interface SelectPrinterProps {
  title?: string;
}

export function SelectPrinters({
  route: {
    params: { title },
  },
}: DrawerScreenProps<'SelectPrinter'>) {
  const { replace } = useNavigation<DrawerNavigation>();

  // TODO: Use `useConfirmation`
  const {
    state: confirmationModalVisible,
    disable: closeConfirmationModal,
    enable: openConfirmationModal,
  } = useBooleanState();

  const { storeNumber, userId } = useCurrentSessionInfo();

  const { data: defaultPrinterOption, set } = useDefaultSettings(
    'defaultPrinterOption',
    storeNumber,
    userId,
  );
  const printerToBeSelected = useRef(defaultPrinterOption);

  const confirm = useCallback(() => {
    set(printerToBeSelected.current);
    closeConfirmationModal();
  }, [closeConfirmationModal, set]);

  const onBackPress = useCallback(
    () => replace('DrawerHome', { title }),
    [replace, title],
  );

  const checked = useCallback(
    (item: PrinterOptions) => item === defaultPrinterOption,
    [defaultPrinterOption],
  );

  const onPress = useCallback(
    (item: PrinterOptions) => {
      printerToBeSelected.current = item;
      openConfirmationModal();
    },
    [openConfirmationModal],
  );

  return (
    <>
      <FixedLayout style={styles.container}>
        <LightHeader label="Printers" onPress={onBackPress} />
        <RadioButtonsList
          items={Array.from(Object.values(PrinterOptions))}
          checked={checked}
          onRadioButtonPress={onPress}
          withDefault
          bold
          containerStyles={styles.radioButtons}
          textStyles={styles.text}
        />
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
  radioButtons: {
    margin: 16,
    ...BaseStyles.shadow,
    alignItems: 'flex-start',
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: Colors.pure,
    padding: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: FontWeight.Demi,
    marginLeft: 13,
  },
  buttons: { marginTop: 60 },
  confirmationModalText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  bold: { fontWeight: FontWeight.Bold },
  icon: { marginTop: 60 },
  container: { backgroundColor: Colors.lightGray },
});
