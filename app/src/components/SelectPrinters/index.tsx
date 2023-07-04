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
import {
  COUNTER_PRINTERS,
  SelectedPrinter,
  useDefaultSettings,
} from '@hooks/useDefaultSettings';
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
  } = useConfirmation<SelectedPrinter>();

  const { storeNumber, userId } = useCurrentSessionInfo();

  const { data: defaultPrinter, set: setDefaultPrinter } = useDefaultSettings(
    [userId, storeNumber],
    'defaultPrinter',
  );

  const onBackPress = useCallback(() => replace('DrawerHome'), [replace]);

  const { trigger: setPrinter } = useAsyncAction(
    async (printer: SelectedPrinter, alreadyConfirmedPrinter: boolean) => {
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
          containerStyles={styles.radioButtons}
          textStyles={styles.text}
        />
      </FixedLayout>

      <ConfirmationModal
        isVisible={confirmationRequested}
        onCancel={reject}
        onConfirm={accept}
        confirmationLabel="Continue"
        title="Default Printer"
        Icon={BlackAttentionIcon}
        // TODO: Remove and add padding to the container
        buttonsStyle={styles.buttons}>
        <Text style={styles.confirmationModalText}>
          Are you sure you want to set{' '}
        </Text>
        {/* TODO: Why wrap like this? */}
        <Text style={styles.confirmationModalText}>
          <Text style={styles.bold}>
            {printerToConfirm ? printerLabel(printerToConfirm) : 'Unknown'}
          </Text>{' '}
          as the default printer?
        </Text>
      </ConfirmationModal>
    </>
  );
}

function printerLabel(printer: SelectedPrinter) {
  switch (printer.type) {
    case 'counter':
      return COUNTER_PRINTERS.find(_ => _.id === printer.id)?.name;
    case 'portable':
      return printer.networkName;
  }
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
  container: { backgroundColor: Colors.lightGray },
});
