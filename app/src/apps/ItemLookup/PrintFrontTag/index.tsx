import { compact, countBy, every, some, sumBy } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { gql } from 'src/__generated__';
import { toastService } from 'src/services/ToastService';
import { useMutation } from '@apollo/client';
import { GlobalStateItemDetails } from '@apps/state';
import {
  EmptySquareCheckBox,
  SquareCheckBox,
  WhiteBackArrow,
  WhiteSearchIcon,
} from '@assets/icons';
import { BottomActionBar } from '@components/BottomActionBar';
import { BlockButton } from '@components/Button/Block';
import { Header } from '@components/Header';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import { Separator } from '@components/Separator';
import { Text } from '@components/Text';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useBooleanState } from '@hooks/useBooleanState';
import { useConfirmation } from '@hooks/useConfirmation';
import { useDefaultSettings } from '@hooks/useDefaultSettings';
import { EventBus } from '@hooks/useEventBus';
import { useMap } from '@hooks/useMap';
import { FixedLayout } from '@layouts/FixedLayout';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { Printers, Printer } from '@services/Printers';
import { PrintConfirmationModal } from '../components/PrintConfirmationModal';
import { PrinterConfirmationModal } from '../components/PrinterConfirmationModal';
import { SearchBottomTray } from '../components/SearchBottomTray';
import { useItemLookup } from '../hooks/useItemLookup';
import { ItemLookupNavigation, ItemLookupScreenProps } from '../navigator';
import { styles } from './styles';

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
  qty: number | undefined;
  id: string;
  seqNum: number;
}

function createInitialValueMap(
  locations: GlobalStateItemDetails['planograms'],
) {
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
  const { values: locationStatuses, update } = useMap<string, LocationStatus>(
    createInitialValueMap(itemDetails.planograms),
  );

  const { goBack } = useNavigation<ItemLookupNavigation>();

  const [printFrontTag] = useMutation(PRINT_FRONT_TAG);

  const {
    state: printerModalVisible,
    enable: openPrinterModal,
    disable: closePrinterModal,
  } = useBooleanState();

  const { storeNumber, userId } = useCurrentSessionInfo();

  const { data: defaultPrinter } = useDefaultSettings(
    [userId, storeNumber],
    'defaultPrinter',
  );

  const [printer, setPrinter] = useState<Printer>(defaultPrinter);

  const { confirmationRequested, askForConfirmation, accept, reject } =
    useConfirmation();

  const totalPrintQuantity = useMemo(() => {
    const checkedLocations = locationStatuses.filter(_ => _.checked);
    return sumBy(checkedLocations, ({ qty }) => qty ?? 0);
  }, [locationStatuses]);

  const { loading, trigger: printTags } = useAsyncAction(async () => {
    if (totalPrintQuantity >= TRIGGER_CONFIRMATION_QUANTITY) {
      const shouldPrint = await askForConfirmation();
      if (!shouldPrint) {
        return;
      }
    }

    const promises = locationStatuses
      .filter(_ => _.checked)
      .map(({ id, seqNum, qty }) => {
        return printFrontTag({
          variables: {
            storeNumber,
            printer: Printers.serverIdOf(printer),
            data: {
              sku: itemDetails.sku,
              count: qty,
              planogramId: id,
              sequence: seqNum,
            },
          },
        });
      });

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

    toastService.showInfoToast(
      `Front tag sent to ${Printers.labelOf(printer)}`,
      {
        props: { containerStyle: styles.toast },
      },
    );

    EventBus.emit('print-success');
    goBack();
  });

  const onConfirmPrinter = useCallback(
    (selectedPrinter: Printer) => {
      closePrinterModal();
      setPrinter(selectedPrinter);
    },
    [closePrinterModal],
  );

  const renderPlanogram = useCallback(
    (location: LocationStatus) => {
      const { id, qty, checked } = location;
      return (
        <View style={styles.planogramsContainer} key={id}>
          <View style={styles.table}>
            <Pressable onPress={() => update(id, { checked: !checked })}>
              <View style={styles.flexRow}>
                {locationStatuses.length > 1 && checked ? (
                  <SquareCheckBox width={20} height={20} />
                ) : (
                  <EmptySquareCheckBox width={20} height={20} />
                )}
                <Text style={[styles.text, styles.planogramId]}>{id}</Text>
              </View>
            </Pressable>
            <QuantityAdjuster
              uniqueAccessibilityLabel={id}
              minimum={1}
              maximum={99}
              quantity={qty}
              setQuantity={quantity => {
                update(id, { qty: quantity });
              }}
            />
          </View>
          <Separator />
        </View>
      );
    },
    [locationStatuses.length, update],
  );

  const {
    state: searchTrayOpen,
    enable: openSearchTray,
    disable: closeSearchTray,
  } = useBooleanState();

  const {
    search,
    error: skuError,
    loading: isLoadingItemBySku,
  } = useItemLookup({
    onComplete: closeSearchTray,
  });

  const searchItem = useCallback((sku: string) => search({ sku }), [search]);

  const printingDisabled = useMemo(
    () =>
      every(locationStatuses, _ => !_.checked) ||
      some(locationStatuses, _ => _.checked && !_.qty),
    [locationStatuses],
  );

  return (
    <FixedLayout
      style={styles.container}
      header={
        <Header
          item={itemDetails}
          rightIcon={<WhiteSearchIcon />}
          onClickRight={openSearchTray}
          leftIcon={<WhiteBackArrow />}
          onClickLeft={goBack}
        />
      }>
      <Text style={[styles.header, styles.bold]}>Print Front Tag</Text>

      <View style={styles.printToLabel}>
        <Text style={styles.text}>
          Print to <Text style={styles.bold}>{Printers.labelOf(printer)}</Text>
        </Text>

        <Pressable onPress={openPrinterModal}>
          <Text style={[styles.viewOptions, styles.bold]}>View Options</Text>
        </Pressable>
      </View>

      <View style={[styles.table, styles.headers]}>
        <Text style={styles.text}>POG</Text>
        <Text style={[styles.text, styles.qty]}>Qty</Text>
      </View>

      <ScrollView style={styles.planogramContainer}>
        {locationStatuses.map(renderPlanogram)}
      </ScrollView>

      <BottomActionBar>
        <BlockButton
          variant="primary"
          style={styles.actionButton}
          onPress={printTags}
          isLoading={loading}
          disabled={printingDisabled}>
          Print Front Tags
        </BlockButton>
      </BottomActionBar>

      <PrinterConfirmationModal
        isVisible={printerModalVisible}
        initiallySelectedPrinter={printer}
        onCancel={closePrinterModal}
        onConfirm={onConfirmPrinter}
      />

      <PrintConfirmationModal
        isVisible={confirmationRequested}
        onCancel={reject}
        onConfirm={accept}
        quantity={totalPrintQuantity}
      />

      <SearchBottomTray
        error={skuError}
        loading={isLoadingItemBySku}
        isVisible={searchTrayOpen}
        hideTray={closeSearchTray}
        onSubmit={searchItem}
      />
    </FixedLayout>
  );
}
