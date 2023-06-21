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
import { useCallback, useMemo, useRef } from 'react';
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

  const { data: defaultPrinterOption, set } = useDefaultSettings(
    'defaultPrinterOption',
  );
  const printerToBeSelected = useRef(defaultPrinterOption);

  const printerValues = useMemo(
    () =>
      Array.from(Object.values(PrinterOptions)).map(item => (
        <RadioButton
          key={item}
          checked={item === defaultPrinterOption}
          onPress={() => {
            printerToBeSelected.current = item;
            openConfirmationModal();
          }}>
          <View style={styles.radioButtonText}>
            <Text
              style={[
                styles.text,
                {
                  fontWeight:
                    item === defaultPrinterOption
                      ? FontWeight.Bold
                      : FontWeight.Demi,
                },
              ]}>
              {item}
            </Text>
            {item === defaultPrinterOption ? (
              <Text style={styles.default}>Default</Text>
            ) : null}
          </View>
        </RadioButton>
      )),
    [openConfirmationModal, defaultPrinterOption],
  );

  const confirm = useCallback(() => {
    set(printerToBeSelected.current);
    closeConfirmationModal();
  }, [closeConfirmationModal, set]);

  const onBackPress = useCallback(
    () => replace('DrawerHome', { title }),
    [replace, title],
  );

  return (
    <>
      <FixedLayout style={styles.container}>
        <LightHeader label="Printers" onPress={onBackPress} />
        <Container style={styles.radioButtons}>{printerValues}</Container>
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 20,
    fontWeight: FontWeight.Demi,
    marginLeft: 13,
  },
  buttons: { marginTop: 60 },
  default: { fontSize: 10, fontWeight: FontWeight.Book },
  confirmationModalText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  bold: { fontWeight: FontWeight.Bold },
  icon: { marginTop: 60 },
  container: { backgroundColor: Colors.lightGray },
  radioButtonText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
});
