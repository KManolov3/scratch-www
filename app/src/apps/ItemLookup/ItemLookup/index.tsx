import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ItemDetails } from '@components/ItemDetails';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { PriceDiscrepancyAttention } from '@components/PriceDiscrepancyAttention';
import { PriceDiscrepancyModal } from '@components/PriceDiscrepancyModal';
import { useBooleanState } from '@hooks/useBooleanState';
import { Header } from '@components/Header';
import { soundService } from 'src/services/SoundService';
import { BottomRegularTray } from '@components/BottomRegularTray';
import { WhiteSearchIcon } from '@assets/icons';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { useEventBus, useFocusEventBus } from '@hooks/useEventBus';
import { toastService } from '@services/ToastService';
import { ItemLookupNavigation, ItemLookupScreenProps } from '../navigator';
import { ItemLookupHome } from '../components/Home';

export function ItemLookupScreen({
  route: {
    params: { itemDetails, frontTagPrice },
  },
}: ItemLookupScreenProps<'ItemLookup'>) {
  const { navigate } = useNavigation<ItemLookupNavigation>();

  const [hasPriceDiscrepancy, setPriceDiscrepancy] = useState(
    !!frontTagPrice && frontTagPrice !== itemDetails?.retailPrice,
  );

  const {
    state: priceDiscrepancyModalVisible,
    toggle: toggleModal,
    enable: showPriceDiscrepancyModal,
    disable: hidePriceDiscrepancyModal,
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

  useEffect(() => {
    setPriceDiscrepancy(
      !!frontTagPrice && frontTagPrice !== itemDetails?.retailPrice,
    );
  }, [frontTagPrice, itemDetails?.retailPrice]);

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

  const header = useMemo(
    () => (
      <Header
        title="Item Lookup"
        item={itemDetails}
        rightIcon={<WhiteSearchIcon />}
        onClickRight={showSearchTray}
      />
    ),
    [showSearchTray, itemDetails],
  );

  useFocusEventBus('search-error', () => {
    if (!searchTrayOpen) {
      hidePriceDiscrepancyModal();
      toastService.showInfoToast(
        'No results found. Try searching for another SKU or scanning another barcode.',
      );
    }
  });

  useFocusEventBus('search-success', () => {
    hideSearchTray();
  });

  useEventBus('print-success', () => {
    setPriceDiscrepancy(false);
  });

  return (
    <FixedLayout style={styles.container} header={header}>
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
          onSubmit={hideSearchTray}
          searchBarStyle={styles.container}
        />
      </BottomRegularTray>
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
});
