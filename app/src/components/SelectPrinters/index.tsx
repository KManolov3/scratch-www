import { AddPortablePrinterModal } from '@components/AddPortablePrinterModal';
import { DrawerNavigation } from '@components/Drawer/navigator';
import { LightHeader } from '@components/LightHeader';
import { Printers } from '@components/Printers';
import { useBooleanState } from '@hooks/useBooleanState';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { FixedLayout } from '@layouts/FixedLayout';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

export interface SelectPrinterProps {
  title?: string;
}

export function SelectPrinters() {
  const { replace } = useNavigation<DrawerNavigation>();

  const {
    state: confirmationModalVisible,
    disable: closeConfirmationModal,
    enable: openConfirmationModal,
  } = useBooleanState();

  const { storeNumber, userId } = useCurrentSessionInfo();

  const {
    data: { printerOption, portablePrinter },
    set,
  } = useDefaultSettings('defaultPrinterOption', storeNumber, userId);

  const confirm = useCallback(
    (printerCode: string) => {
      set({
        printerOption: PrinterOptions.Portable,
        portablePrinter: printerCode,
      });
      closeConfirmationModal();
    },
    [closeConfirmationModal, set],
  );

  const onBackPress = useCallback(() => replace('DrawerHome'), [replace]);

  const checked = useCallback(
    (item: PrinterOptions) => item === printerOption,
    [printerOption],
  );

  const onPress = useCallback(
    (item: PrinterOptions) => {
      if (item === PrinterOptions.Portable && !portablePrinter) {
        return openConfirmationModal();
      }
      set({ portablePrinter, printerOption: item });
    },
    [openConfirmationModal, portablePrinter, set],
  );

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
          replacePortablePritner={openConfirmationModal}
        />
      </FixedLayout>
      <AddPortablePrinterModal
        isVisible={confirmationModalVisible}
        onCancel={closeConfirmationModal}
        onConfirm={confirm}
      />
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
