// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { gql } from 'src/__generated__';
import { ItemDetails } from '@components/ItemDetails';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { FontWeight } from '@lib/font';
import { Colors } from '@lib/colors';
import { FixedLayout } from '@layouts/FixedLayout';
import { PriceDiscrepancyAttention } from '@components/PriceDiscrepancyAttention';
import { PriceDiscrepancyModal } from '@components/PriceDiscrepancyModal';
import { useBooleanState } from '@hooks/useBooleanState';
import { PrinterOptions, useDefaultSettings } from '@hooks/useDefaultSettings';
import { Header } from '@components/Header';
import { indexOfEnumValue } from '@lib/array';
import { soundService } from 'src/services/SoundService';
import { toastService } from 'src/services/ToastService';
import { countBy } from 'lodash-es';
import { ItemLookupScreenProps } from '../navigator';
import { PrintModal } from '../components/PrintModal';

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
    params: { itemDetails, frontTagPrice },
  },
}: ItemLookupScreenProps<'ItemLookup'>) {
  const [printFrontTag, { loading }] = useMutation(PRINT_FRONT_TAG);

  const [hasPriceDiscrepancy, setPriceDiscrepancy] = useState(
    !!frontTagPrice && frontTagPrice !== itemDetails?.retailPrice,
  );

  const {
    state: priceDiscrepancyModalVisible,
    toggle: toggleModal,
    enable: showPriceDiscrepancyModal,
  } = useBooleanState(hasPriceDiscrepancy);

  useEffect(() => {
    if (hasPriceDiscrepancy) {
      showPriceDiscrepancyModal();
      soundService
        .playSound('error')
        // eslint-disable-next-line no-console
        .catch(soundError => console.log('Error playing sound.', soundError));
    }
  }, [
    hasPriceDiscrepancy,
    showPriceDiscrepancyModal,
    frontTagPrice,
    itemDetails?.retailPrice,
  ]);

  const { state: printModalVisible, toggle: togglePrintModal } =
    useBooleanState();

  useEffect(() => {
    setPriceDiscrepancy(
      !!frontTagPrice && frontTagPrice !== itemDetails?.retailPrice,
    );
  }, [frontTagPrice, itemDetails?.retailPrice]);

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
      const printerToStringValue = String(
        indexOfEnumValue(PrinterOptions, printer) + 1,
      );

      const results = await Promise.allSettled(
        itemDetails?.planograms?.map(planogram =>
          printFrontTag({
            variables: {
              storeNumber,
              data: {
                planogramId: planogram?.planogramId,
                sequence: planogram?.seqNum,
                sku: itemDetails?.sku,
                count: qty,
              },
              printer: printerToStringValue,
            },
          }),
        ),
      );
      const requestsByStatus = countBy(
        results,
        ({ status }) => status === 'rejected',
      );
      const numberOfFailedRequests = requestsByStatus.rejected;

      if (numberOfFailedRequests && numberOfFailedRequests > 0) {
        return toastService.showErrorToast(
          `${numberOfFailedRequests} out of ${results.length} requests failed.`,
        );
      }

      toastService.showInfoToast(`Front tag sent to ${printer}`, {
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

  const header = useMemo(() => <Header title="Item Lookup" />, []);

  return (
    <FixedLayout style={styles.container} header={header}>
      <ItemDetails
        itemDetails={itemDetails}
        hasPriceDiscrepancy={hasPriceDiscrepancy}
        togglePriceDiscrepancyModal={toggleModal}
      />
      <BottomActionBar
        actions={bottomBarActions}
        topComponent={
          hasPriceDiscrepancy ? <PriceDiscrepancyAttention /> : null
        }
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
