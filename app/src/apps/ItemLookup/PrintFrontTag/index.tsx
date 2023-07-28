import { compact, every, some, sumBy } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { gql } from 'src/__generated__';
import { PrintRequestStatus } from 'src/__generated__/graphql';
import { toastService } from 'src/services/ToastService';
import { GlobalStateItemDetails } from '@apps/state';
import {
  EmptySquareCheckBox,
  SquareCheckBox,
  WhiteBackArrow,
  WhiteSearchIcon,
} from '@assets/icons';
import { BottomActionBar } from '@components/BottomActionBar';
import { BlockButton } from '@components/Button/Block';
import { ErrorContainer } from '@components/ErrorContainer';
import { Header } from '@components/Header';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import { Separator } from '@components/Separator';
import { Text } from '@components/Text';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useBooleanState } from '@hooks/useBooleanState';
import { useConfirmation } from '@hooks/useConfirmation';
import { useDefaultSettings } from '@hooks/useDefaultSettings';
import { EventBus } from '@hooks/useEventBus';
import { useManagedMutation } from '@hooks/useManagedMutation';
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
  description: string;
}

function createInitialValueMap(
  locations: GlobalStateItemDetails['planograms'],
) {
  return new Map<string, LocationStatus>(
    compact(locations).map(({ planogramId, seqNum, description }) => [
      // These can't realistically be null
      // but the types say they can
      planogramId ?? '',
      {
        qty: 1,
        checked: true,
        id: planogramId ?? '',
        seqNum: seqNum ?? 0,
        description: description ?? '',
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

  const { perform: printFrontTag, loading } = useManagedMutation(
    PRINT_FRONT_TAG,
    {
      // managed in the useAsyncAction below
      globalErrorHandling: () => 'ignored',
    },
  );

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

  const { trigger: printTags } = useAsyncAction(
    async () => {
      if (totalPrintQuantity >= TRIGGER_CONFIRMATION_QUANTITY) {
        const shouldPrint = await askForConfirmation();
        if (!shouldPrint) {
          return;
        }
      }

      const result = await printFrontTag({
        variables: {
          storeNumber,
          printer: Printers.serverIdOf(printer),
          data: locationStatuses
            .filter(_ => _.checked)
            .map(({ id, seqNum, qty }) => ({
              sku: itemDetails.sku,
              count: qty,
              planogramId: id,
              sequence: seqNum,
            })),
        },
      });

      if (result?.frontTagRequest === PrintRequestStatus.Error) {
        throw new Error('Could not print the front tags');
      }

      toastService.showInfoToast(
        `Front tag sent to ${Printers.labelOf(printer)}`,
        {
          props: { containerStyle: styles.toast },
        },
      );

      EventBus.emit('print-success');
      goBack();
    },
    {
      globalErrorHandling: () => ({
        displayAs: 'toast',
        message: 'Could not print the front tags',
      }),
    },
  );

  const onConfirmPrinter = useCallback(
    (selectedPrinter: Printer) => {
      closePrinterModal();
      setPrinter(selectedPrinter);
    },
    [closePrinterModal],
  );

  const renderPlanogram = useCallback(
    (location: LocationStatus) => {
      const { id, qty, checked, description, seqNum } = location;

      const printTagText =
        description === '' ? id : `${description} - ${seqNum}`;

      return (
        <View style={styles.planogramsContainer} key={id}>
          <View style={styles.table}>
            {locationStatuses.length > 1 ? (
              <Pressable
                style={styles.flexRow}
                onPress={() => update(id, { checked: !checked })}>
                {checked ? (
                  <SquareCheckBox width={20} height={20} />
                ) : (
                  <EmptySquareCheckBox width={20} height={20} />
                )}
                <Text style={[styles.text, styles.planogramId]}>
                  {printTagText}
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.text}>{printTagText}</Text>
            )}
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
      {locationStatuses.length === 0 && (
        <ErrorContainer
          title="No POG assignment."
          message="Front tag is not currently available."
        />
      )}
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
