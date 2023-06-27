import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { BlackAttentionIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { DrawerNavigation } from '@components/Drawer/navigator';
import { LightHeader } from '@components/LightHeader';
import { Printers } from '@components/Printers';
import { Text } from '@components/Text';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useConfirmation } from '@hooks/useConfirmation';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { FixedLayout } from '@layouts/FixedLayout';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';

export function SelectPrinters() {
  const { replace } = useNavigation<DrawerNavigation>();

  const {
    confirmationRequested,
    itemToConfirm: printerToConfirm,
    askForConfirmation,
    accept,
    reject,
  } = useConfirmation<PrinterOptions>();

  const { storeNumber, userId } = useCurrentSessionInfo();

  const {
    data: { printerOption, portablePrinter },
    set: setDefaultPrinter,
  } = useDefaultSettings('defaultPrinterOption', storeNumber, userId);

  const onBackPress = useCallback(() => replace('DrawerHome'), [replace]);

  const checked = useCallback(
    (item: PrinterOptions) => item === printerOption,
    [printerOption],
  );

  const { trigger: setPrinter } = useAsyncAction(
    async (printer: PrinterOptions) => {
      if (await askForConfirmation(printer)) {
        setDefaultPrinter({ printerOption: printer, portablePrinter });
      }
    },
  );

  return (
    <>
      <FixedLayout style={styles.container} withoutHeader>
        <LightHeader label="Printers" onPress={onBackPress} />
        <Printers
          checked={checked}
          onRadioButtonPress={setPrinter}
          withDefault
          containerStyles={styles.radioButtons}
          textStyles={styles.text}
          portablePrinter={portablePrinter}
          setPortablePrinter={printerCode =>
            setDefaultPrinter({
              printerOption: PrinterOptions.Portable,
              portablePrinter: printerCode,
            })
          }
        />
      </FixedLayout>

      <ConfirmationModal
        isVisible={confirmationRequested}
        onCancel={reject}
        onConfirm={accept}
        confirmationLabel="Continue"
        title="Default Printer"
        Icon={BlackAttentionIcon}
        iconStyles={styles.icon}
        buttonsStyle={styles.buttons}>
        <Text style={styles.confirmationModalText}>
          Are you sure you want to set{' '}
        </Text>
        <Text style={styles.confirmationModalText}>
          <Text style={styles.bold}>{printerToConfirm}</Text> as the default
          printer?
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
