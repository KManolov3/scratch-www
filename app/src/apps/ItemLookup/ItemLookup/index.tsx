import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { soundService } from 'src/services/SoundService';
import { ItemDetails } from '@apps/ItemLookup/components/ItemDetails';
import { PriceDiscrepancyModal } from '@apps/ItemLookup/components/PriceDiscrepancyModal';
import { WhiteSearchIcon } from '@assets/icons';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { Header } from '@components/Header';
import { PriceDiscrepancyAttention } from '@components/PriceDiscrepancyAttention';
import { useBooleanState } from '@hooks/useBooleanState';
import { useEventBus } from '@hooks/useEventBus';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { toastService } from '@services/ToastService';
import { SearchBottomTray } from '../components/SearchBottomTray';
import { useItemLookupScanCodeListener } from '../hooks/useItemLookupScanCodeListener';
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

  const { search, error, loading } = useItemLookupScanCodeListener({
    onError: () => {
      if (!searchTrayOpen) {
        hidePriceDiscrepancyModal();
        toastService.showInfoToast(
          'No results found. Try searching for another SKU or scanning a barcode.',
        );
      }
    },
    onComplete: hideSearchTray,
  });

  const searchItem = useCallback((sku: string) => search({ sku }), [search]);

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
          hasPriceDiscrepancy ? (
            <PriceDiscrepancyAttention style={styles.priceDiscrepancy} />
          ) : null
        }
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

      <SearchBottomTray
        error={error}
        loading={loading}
        isVisible={searchTrayOpen}
        hideTray={hideSearchTray}
        onSubmit={searchItem}
      />
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
  priceDiscrepancy: {
    marginTop: 15,
  },
});
