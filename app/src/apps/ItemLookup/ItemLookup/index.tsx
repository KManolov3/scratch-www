// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '@components/Text';
import { gql } from 'src/__generated__';
import { ItemDetails } from '@components/ItemDetails';
import { NoResults } from '@components/NoResults';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { FontWeight } from '@lib/font';
import { Colors } from '@lib/colors';
import { FixedLayout } from '@layouts/FixedLayout';
import { PriceDiscrepancyAttention } from '@components/PriceDiscrepancyAttention';
import { PriceDiscrepancyModal } from '@components/PriceDiscrepancyModal';
import { useBooleanState } from '@hooks/useBooleanState';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { soundService } from 'src/services/SoundService';
import { toastService } from 'src/services/ToastService';
import { ItemLookupScreenProps } from '../navigator';
import { PrintModal } from '../components/PrintModal';

// TODO: Move those below component?
const ITEM_BY_SKU = gql(`
  query ManualItemLookup($sku: String!) {
    itemBySku(sku: $sku, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

const ITEM_BY_UPC = gql(`
  query AutomaticItemLookup($upc: String!) {
    itemByUpc(upc: $upc, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

const PRINT_FRONT_TAG = gql(`
  mutation PrintFrontTag(
    $storeNumber: String!
    $printer: String! = "1"
    $data: [FrontTagItem]
  ) {
    frontTagRequest(storeNumber: $storeNumber, printer: $printer, data: $data)
  }
`);

export function ItemLookupScreen({
  route: {
    params: { type, value, frontTagPrice },
  },
}: ItemLookupScreenProps<'ItemLookup'>) {
  const {
    loading: isLoadingItemBySku,
    data: lookupBySku,
    error: errorBySku,
  } = useQuery(ITEM_BY_SKU, {
    variables: { sku: value },
    skip: type !== 'SKU',
  });

  const {
    loading: isLoadingItemByUpc,
    data: lookupByUpc,
    error: errorByUpc,
  } = useQuery(ITEM_BY_UPC, {
    variables: { upc: value },
    skip: type !== 'UPC',
  });

  const [printFrontTag, { loading }] = useMutation(PRINT_FRONT_TAG);

  const itemDetails = useMemo(() => {
    if (lookupBySku) {
      return lookupBySku.itemBySku;
    }

    if (lookupByUpc) {
      return lookupByUpc.itemByUpc;
    }
  }, [lookupBySku, lookupByUpc]);

  const [priceDiscrepancy, setPriceDiscrepancy] = useState(
    !!frontTagPrice && frontTagPrice !== itemDetails?.retailPrice,
  );

  useEffect(() => {
    if (priceDiscrepancy) {
      soundService
        .playSound('error')
        // eslint-disable-next-line no-console
        .catch(soundError => console.log('Error playing sound.', soundError));
    }
  }, [priceDiscrepancy]);

  useEffect(() => {
    setPriceDiscrepancy(
      !!frontTagPrice && frontTagPrice !== itemDetails?.retailPrice,
    );
  }, [frontTagPrice, itemDetails?.retailPrice]);

  const { state: printModalVisible, toggle: togglePrintModal } =
    useBooleanState();

  const { state: priceDiscrepancyModalVisible, toggle: toggleModal } =
    useBooleanState(priceDiscrepancy);

  const onPriceDiscrepancyConfirm = useCallback(() => {
    toggleModal();
    togglePrintModal();
  }, [toggleModal, togglePrintModal]);

  const { storeNumber } = useDefaultSettings();

  const onPrintConfirm = useCallback(
    async (printer: PrinterOptions, qty: number) => {
      if (!itemDetails?.planograms) {
        return;
      }
      await Promise.all(
        itemDetails?.planograms?.map(planogram => {
          return printFrontTag({
            variables: {
              storeNumber,
              data: {
                planogramId: planogram?.planogramId,
                sequence: planogram?.seqNum,
                sku: itemDetails?.sku,
                count: qty,
              },
            },
          });
        }),
      );

      toastService.showInfoToast(`Front tag send to ${printer}`, {
        props: { containerStyle: styles.toast },
      });
      togglePrintModal();
      setPriceDiscrepancy(false);
    },
    [
      itemDetails?.planograms,
      itemDetails?.sku,
      printFrontTag,
      storeNumber,
      togglePrintModal,
    ],
  );

  const bottomBarActions = useMemo<Action[]>(
    () => [
      {
        label: 'Print Front Tag',
        onPress: togglePrintModal,
        isLoading: loading,
        textStyle: styles.bottomBarActionText,
      },
    ],
    [loading, togglePrintModal],
  );

  if (isLoadingItemBySku || isLoadingItemByUpc) {
    return <ActivityIndicator size="large" />;
  }

  if (errorBySku || errorByUpc) {
    return (
      <View>
        <Text>
          {errorBySku?.message ?? errorByUpc?.message ?? 'Unknown error'}
        </Text>
      </View>
    );
  }

  if (!itemDetails) {
    return <NoResults lookupType={type} lookupId={value} />;
  }

  return (
    <FixedLayout style={styles.container}>
      <ItemDetails
        itemDetails={itemDetails}
        priceDiscrepancy={priceDiscrepancy}
        togglePriceDiscrepancyModal={toggleModal}
      />
      <BottomActionBar
        actions={bottomBarActions}
        topComponent={priceDiscrepancy ? <PriceDiscrepancyAttention /> : null}
        style={styles.bottomActionBar}
      />
      <PrintModal
        isVisible={printModalVisible}
        onCancel={togglePrintModal}
        onConfirm={onPrintConfirm}
      />
      {frontTagPrice && itemDetails.retailPrice && (
        <PriceDiscrepancyModal
          scanned={frontTagPrice}
          system={itemDetails.retailPrice}
          isVisible={priceDiscrepancyModalVisible}
          onCancel={toggleModal}
          onConfirm={onPriceDiscrepancyConfirm}
        />
      )}
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.pure },
  bottomBarActionText: {
    color: Colors.advanceBlack,
    fontWeight: FontWeight.Bold,
  },
  bottomActionBar: {
    paddingTop: 8,
  },
  toast: {
    marginBottom: '20%',
  },
});
