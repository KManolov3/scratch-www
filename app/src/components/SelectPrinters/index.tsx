import { BlackAttentionIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { DrawerNavigation } from '@components/Drawer/navigator';
import { LightHeader } from '@components/LightHeader';
import { Printers } from '@components/Printers';
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

export function SelectPrinters() {
  const { replace } = useNavigation<DrawerNavigation>();

  const { storeNumber, userId } = useCurrentSessionInfo();

  const {
    data: { printerOption, portablePrinter },
    set,
  } = useDefaultSettings('defaultPrinterOption', storeNumber, userId);

  const printerToBeSelected = useRef(printerOption);

  const onBackPress = useCallback(() => replace('DrawerHome'), [replace]);

  const checked = useCallback(
    (item: PrinterOptions) => item === printerOption,
    [printerOption],
  );

  const {
    state: confirmationModalVisible,
    disable: closeConfirmationModal,
    enable: openConfirmationModal,
  } = useBooleanState();

  const onPress = useCallback(
    (item: PrinterOptions) => {
      printerToBeSelected.current = item;
      openConfirmationModal();
    },
    [openConfirmationModal],
  );

  const confirmSetDefaultPritner = useCallback(() => {
    set({ printerOption: printerToBeSelected.current, portablePrinter });
    closeConfirmationModal();
  }, [closeConfirmationModal, portablePrinter, set]);

  return (
    <>
      <FixedLayout style={styles.container} withoutHeader>
        <LightHeader label="Printers" onPress={onBackPress} />
        <Printers
          checked={checked}
          onRadioButtonPress={onPress}
          withDefault
          containerStyles={styles.radioButtons}
          textStyles={styles.text}
          portablePrinter={portablePrinter}
          setPortablePrinter={printerCode =>
            set({
              printerOption: PrinterOptions.Portable,
              portablePrinter: printerCode,
            })
          }
        />
      </FixedLayout>

      <ConfirmationModal
        isVisible={confirmationModalVisible}
        onCancel={closeConfirmationModal}
        onConfirm={confirmSetDefaultPritner}
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
