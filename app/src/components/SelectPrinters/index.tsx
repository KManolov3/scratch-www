import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { BlackAttentionIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { DrawerNavigation } from '@components/Drawer/navigator';
import { LightHeader } from '@components/LightHeader';
import { PrinterList } from '@components/PrinterList';
import { Text } from '@components/Text';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useConfirmation } from '@hooks/useConfirmation';
import { useDefaultSettings } from '@hooks/useDefaultSettings';
import { FixedLayout } from '@layouts/FixedLayout';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { Printers, Printer } from '@services/Printers';

export function SelectPrinters() {
  const { replace } = useNavigation<DrawerNavigation>();

  const {
    confirmationRequested,
    itemToConfirm: printerToConfirm,
    askForConfirmation,
    accept,
    reject,
  } = useConfirmation<Printer>();

  const { storeNumber, userId } = useCurrentSessionInfo();

  const { data: defaultPrinter, set: setDefaultPrinter } = useDefaultSettings(
    [userId, storeNumber],
    'defaultPrinter',
  );

  const onBackPress = useCallback(() => replace('DrawerHome'), [replace]);

  const { trigger: setPrinter } = useAsyncAction(
    async (printer: Printer, alreadyConfirmedPrinter: boolean) => {
      const confirmed =
        alreadyConfirmedPrinter || (await askForConfirmation(printer));

      if (confirmed) {
        setDefaultPrinter(printer);
      }
    },
  );

  return (
    <>
      <FixedLayout style={styles.container} withoutHeader>
        <LightHeader label="Printers" onPress={onBackPress} />

        <PrinterList
          selectedPrinter={defaultPrinter}
          onSelect={setPrinter}
          showDefaultLabelIfSelected
          style={styles.printerList}
        />
      </FixedLayout>

      <ConfirmationModal
        isVisible={confirmationRequested}
        onCancel={reject}
        onConfirm={accept}
        confirmationLabel="Continue"
        title="Default Printer"
        Icon={BlackAttentionIcon}>
        <Text style={styles.confirmationModalText}>
          Are you sure you want to set{' '}
        </Text>
        <Text style={styles.confirmationModalText}>
          <Text style={styles.bold}>
            {printerToConfirm ? Printers.labelOf(printerToConfirm) : 'Unknown'}
          </Text>{' '}
          as the default printer?
        </Text>
      </ConfirmationModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.lightGray },

  printerList: {
    margin: 16,
    marginTop: 0,
    ...BaseStyles.shadow,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: Colors.pure,
    padding: 8,
  },

  confirmationModalText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  bold: { fontWeight: FontWeight.Bold },
});
