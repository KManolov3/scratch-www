import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { soundService } from 'src/services/SoundService';
import { ItemDetails } from '@apps/ItemLookup/components/ItemDetails';
import { PriceDiscrepancyModal } from '@apps/ItemLookup/components/PriceDiscrepancyModal';
import { WhiteSearchIcon } from '@assets/icons';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { BottomRegularTray } from '@components/BottomRegularTray';
import { Header } from '@components/Header';
import { PriceDiscrepancyAttention } from '@components/PriceDiscrepancyAttention';
import { useBooleanState } from '@hooks/useBooleanState';
import { useEventBus } from '@hooks/useEventBus';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { toastService } from '@services/ToastService';
import { ItemLookupHome } from '../components/Home';
import { useItemLookupScanCodeListener } from '../hooks/useItemLookuSscanCodeListener';
import { ItemLookupNavigation, ItemLookupScreenProps } from '../navigator';

export function ItemLookupScreen({
  route: {
    params: { itemDetails, frontTagPrice },
  },
}: ItemLookupScreenProps<'ItemLookup'>) {
  const { navigate } = useNavigation<ItemLookupNavigation>();

  const [hasPriceDiscrepancy, setHasPriceDiscrepancy] = useState(
    !!frontTagPrice && frontTagPrice !== itemDetails?.retailPrice,
  );

  useEventBus('print-success', () => {
    setHasPriceDiscrepancy(false);
  });

  const {
    state: priceDiscrepancyModalVisible,
    toggle: toggleModal,
    enable: showPriceDiscrepancyModal,
    disable: hidePriceDiscrepancyModal,
  } = useBooleanState(hasPriceDiscrepancy);

  useEffect(() => {
    const priceDiscrepancy =
      !!frontTagPrice && frontTagPrice !== itemDetails?.retailPrice;
    setHasPriceDiscrepancy(priceDiscrepancy);

    if (priceDiscrepancy) {
      showPriceDiscrepancyModal();

      soundService
        .playSound('error')
        // eslint-disable-next-line no-console
        .catch(soundError => console.log('Error playing sound.', soundError));
    } else {
      // TODO: This is done on the second render, thus the modal changes values first, then hides.
      //       Maybe we want to hide it directly somehow?
      hidePriceDiscrepancyModal();
    }
  }, [
    frontTagPrice,
    itemDetails?.retailPrice,
    showPriceDiscrepancyModal,
    hidePriceDiscrepancyModal,
  ]);

  const onPriceDiscrepancyConfirm = useCallback(() => {
    toggleModal();
    navigate('PrintFrontTag', { itemDetails });
  }, [itemDetails, navigate, toggleModal]);

  const bottomBarActions = useMemo<Action[]>(
    () => [
      {
        label: 'Print Front Tag',
        onPress: () => navigate('PrintFrontTag', { itemDetails }),
        textStyle: styles.bottomBarActionText,
      },
    ],
    [itemDetails, navigate],
  );

  const {
    state: searchTrayOpen,
    enable: showSearchTray,
    disable: hideSearchTray,
  } = useBooleanState();

  const { searchBySku, error, loading } = useItemLookupScanCodeListener({
    onError() {
      if (!searchTrayOpen) {
        hidePriceDiscrepancyModal();
        toastService.showInfoToast(
          'No results found. Try searching for another SKU or scanning a barcode.',
        );
      }
    },
    onComplete: hideSearchTray,
  });

  const { storeNumber } = useCurrentSessionInfo();

  return (
    <FixedLayout
      style={styles.container}
      header={
        <Header
          item={itemDetails}
          rightIcon={<WhiteSearchIcon />}
          onClickRight={showSearchTray}
        />
      }>
      <ItemDetails
        itemDetails={itemDetails}
        hasPriceDiscrepancy={hasPriceDiscrepancy}
        frontTagPrice={frontTagPrice}
        togglePriceDiscrepancyModal={toggleModal}
      />
      <BottomActionBar
        actions={bottomBarActions}
        topComponent={
          hasPriceDiscrepancy ? <PriceDiscrepancyAttention /> : null
        }
        style={styles.bottomActionBar}
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

      <BottomRegularTray isVisible={searchTrayOpen} hideTray={hideSearchTray}>
        <ItemLookupHome
          onSubmit={sku => {
            searchBySku({
              variables: { sku, storeNumber },
            });
          }}
          searchBarStyle={styles.container}
          error={error}
          loading={loading}
        />
      </BottomRegularTray>
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pure,
  },
  bottomBarActionText: {
    color: Colors.advanceBlack,
    fontWeight: FontWeight.Bold,
  },
  bottomActionBar: {
    paddingTop: 8,
  },
});
