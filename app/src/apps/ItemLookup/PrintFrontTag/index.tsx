import { useMutation } from '@apollo/client';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { gql } from 'src/__generated__';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { FixedLayout } from '@layouts/FixedLayout';
import { useBooleanState } from '@hooks/useBooleanState';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { Text } from '@components/Text';
import { ConfirmationModal } from '@components/ConfirmationModal';
import {
  EmptySquareCheckBox,
  PrinterIcon,
  SquareCheckBox,
  WhiteBackArrow,
  WhiteSearchIcon,
} from '@assets/icons';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import { useMap } from '@hooks/useMap';
import { ItemDetails } from 'src/types/ItemLookup';
import { compact, countBy, every, sumBy } from 'lodash-es';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { indexOfEnumValue } from '@lib/array';
import { toastService } from 'src/services/ToastService';
import { useNavigation } from '@react-navigation/native';
import { RadioButtonsList } from '@components/RadioButtonsList';
import { Header } from '@components/Header';
import { BottomRegularTray } from '@components/BottomRegularTray';
import { useCurrentSessionInfo } from '@services/Auth';
import { EventBus, useEventBus } from '@hooks/useEventBus';
import { ItemLookupNavigation, ItemLookupScreenProps } from '../navigator';
import { styles } from './styles';
import { PrintConfirmationModal } from '../components/PrintConfirmationModal';
import { ItemLookupHome } from '../components/Home';

const PRINT_FRONT_TAG = gql(`
  mutation PrintFrontTag(
    $storeNumber: String!
    $printer: String! = "1"
    $data: [FrontTagItem]
  ) {
    frontTagRequest(storeNumber: $storeNumber, printer: $printer, data: $data)
  }
`);

const TRIGGER_CONFIRMATION_QUANTITY = 11;

interface LocationStatus {
  checked: boolean;
  qty: number;
  id: string;
  seqNum: number;
}

function createInitialValueMap(locations: ItemDetails['planograms']) {
  return new Map<string, LocationStatus>(
    compact(locations).map(({ planogramId, seqNum }) => [
      // These can't realistically be null
      // but the types say they can
      planogramId ?? '',
      {
        qty: 1,
        checked: true,
        id: planogramId ?? '',
        seqNum: seqNum ?? 0,
      },
    ]),
  );
}

export function PrintFrontTagScreen({
  route: {
    params: { itemDetails },
  },
}: ItemLookupScreenProps<'PrintFrontTag'>) {
  const { map: locationsStatusMap, update } = useMap<string, LocationStatus>(
    createInitialValueMap(itemDetails.planograms),
  );

  const { goBack } = useNavigation<ItemLookupNavigation>();

  const [printFrontTag] = useMutation(PRINT_FRONT_TAG);

  const { state: printerModalVisible, toggle: togglePrintModal } =
    useBooleanState();

  const { storeNumber, userId } = useCurrentSessionInfo();

  const { data: defaultPrinterOption } = useDefaultSettings(
    'defaultPrinterOption',
    storeNumber,
    userId,
  );

  const [printer, setPrinter] = useState(defaultPrinterOption);
  const [selectPrinter, setSelectPrinter] = useState(defaultPrinterOption);

  const {
    state: confirmationModalOpen,
    enable: showConfirmationModal,
    disable: hideConfirmationModal,
  } = useBooleanState();

  const { loading, trigger: sendTagsForPrinting } = useAsyncAction(async () => {
    hideConfirmationModal();
    const promises = compact(
      Array.from(locationsStatusMap.values()).map(
        ({ id, seqNum, checked, qty }) => {
          if (!checked) {
            return undefined;
          }
          const printerToStringValue = String(
            indexOfEnumValue(PrinterOptions, printer) + 1,
          );

          return printFrontTag({
            variables: {
              storeNumber,
              printer: printerToStringValue,
              data: {
                sku: itemDetails.sku,
                count: qty,
                planogramId: id,
                sequence: seqNum,
              },
            },
          });
        },
      ),
    );

    const data = await Promise.allSettled(promises);

    const requestsByStatus = countBy(
      data,
      ({ status }) => status === 'rejected',
    );
    const numberOfFailedRequests = requestsByStatus.rejected;

    if (numberOfFailedRequests && numberOfFailedRequests > 0) {
      return toastService.showInfoToast(
        `${numberOfFailedRequests} out of ${data.length} requests failed.`,
      );
    }

    toastService.showInfoToast(`Front tag sent to ${printer}`, {
      props: { containerStyle: styles.toast },
    });

    EventBus.emit('print-success');
    goBack();
  });

  const frontTagsForPrintingQty = useMemo(
    () =>
      sumBy(Array.from(locationsStatusMap.values()), ({ qty, checked }) =>
        checked ? qty : 0,
      ),
    [locationsStatusMap],
  );

  const bottomBarActions = useMemo<Action[]>(
    () => [
      {
        label: 'Print Front Tags',
        onPress:
          frontTagsForPrintingQty >= TRIGGER_CONFIRMATION_QUANTITY
            ? showConfirmationModal
            : sendTagsForPrinting,
        isLoading: loading,
        textStyle: [styles.bottomBarActionText, styles.bold],
        disabled: every(Array.from(locationsStatusMap.values()), [
          'checked',
          false,
        ]),
      },
    ],
    [
      frontTagsForPrintingQty,
      loading,
      locationsStatusMap,
      sendTagsForPrinting,
      showConfirmationModal,
    ],
  );

  const renderPlanogram = useCallback(
    (location: LocationStatus) => {
      const { id, qty, checked } = location;
      return (
        <Fragment key={id}>
          <View style={styles.table}>
            <View style={styles.flexRow}>
              {locationsStatusMap.size > 1 && (
                <Pressable
                  style={styles.checkIcon}
                  onPress={() => update(id, { checked: !checked })}>
                  {checked ? (
                    <SquareCheckBox width={20} height={20} />
                  ) : (
                    <EmptySquareCheckBox width={20} height={20} />
                  )}
                </Pressable>
              )}
              <Text style={styles.text}>{id}</Text>
            </View>
            <QuantityAdjuster
              minimum={1}
              maximum={99}
              quantity={qty}
              setQuantity={quantity => update(id, { qty: quantity })}
            />
          </View>
          <View style={styles.separator} />
        </Fragment>
      );
    },
    [locationsStatusMap, update],
  );

  const { state: searchTrayOpen, enable, disable } = useBooleanState();

  useEventBus('search-error', () => {
    if (!searchTrayOpen) {
      toastService.showInfoToast(
        'No results found. Try searching for another SKU or scanning a barcode.',
      );
    }
  });

  return (
    <FixedLayout
      style={styles.container}
      header={
        <Header
          item={itemDetails}
          rightIcon={<WhiteSearchIcon />}
          onClickRight={enable}
          leftIcon={<WhiteBackArrow />}
          onClickLeft={goBack}
        />
      }>
      <Text style={[styles.header, styles.bold]}>Print Front Tag</Text>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Print to <Text style={styles.bold}>{printer}</Text>
        </Text>
        <Pressable onPress={togglePrintModal}>
          <Text style={[styles.viewOptions, styles.bold]}>View Options</Text>
        </Pressable>
      </View>
      <View style={[styles.table, styles.headers]}>
        <Text style={styles.text}>POG</Text>
        <Text style={[styles.text, styles.qty]}>Qty</Text>
      </View>
      <ScrollView style={styles.planogramContainer}>
        {Array.from(locationsStatusMap.values()).map(renderPlanogram)}
      </ScrollView>
      <BottomActionBar
        actions={bottomBarActions}
        style={styles.bottomActionBar}
      />

      <ConfirmationModal
        isVisible={printerModalVisible}
        onCancel={togglePrintModal}
        onConfirm={() => {
          togglePrintModal();
          setPrinter(selectPrinter);
        }}
        title="Print Front Tags"
        confirmationLabel="Select"
        Icon={PrinterIcon}>
        <View style={styles.printModal}>
          <Text style={styles.centeredText}>
            Print to <Text style={styles.bold}>{printer}</Text>
          </Text>
          <RadioButtonsList
            items={Array.from(Object.values(PrinterOptions))}
            checked={item => item === selectPrinter}
            onRadioButtonPress={item => setSelectPrinter(item)}
            containerStyles={styles.radioButtons}
            bold
          />
        </View>
      </ConfirmationModal>

      <PrintConfirmationModal
        isVisible={confirmationModalOpen}
        onCancel={hideConfirmationModal}
        onConfirm={sendTagsForPrinting}
        quantity={frontTagsForPrintingQty}
      />

      <BottomRegularTray isVisible={searchTrayOpen} hideTray={disable}>
        <ItemLookupHome onSubmit={disable} searchBarStyle={styles.searchBar} />
      </BottomRegularTray>
    </FixedLayout>
  );
}
