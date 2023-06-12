import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ItemDetails } from '@components/ItemDetails';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { FontWeight } from '@lib/font';
import { Colors } from '@lib/colors';
import { FixedLayout } from '@layouts/FixedLayout';
import { PriceDiscrepancyAttention } from '@components/PriceDiscrepancyAttention';
import { PriceDiscrepancyModal } from '@components/PriceDiscrepancyModal';
import { useBooleanState } from '@hooks/useBooleanState';
import { Header } from '@components/Header';
import { soundService } from 'src/services/SoundService';
import { BottomRegularTray } from '@components/BottomRegularTray';
import { SearchIcon } from '@assets/icons';
import { useNavigation } from '@react-navigation/native';
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
  const { state: searchTrayOpen, enable, disable } = useBooleanState();

  const header = useMemo(
    () => (
      <Header
        title="Item Lookup"
        item={itemDetails}
        rightIcon={<SearchIcon />}
        onClickRight={enable}
      />
    ),
    [enable, itemDetails],
  );

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
      {frontTagPrice && itemDetails.retailPrice && (
        <PriceDiscrepancyModal
          scanned={frontTagPrice}
          system={itemDetails.retailPrice}
          isVisible={priceDiscrepancyModalVisible}
          onCancel={toggleModal}
          onConfirm={onPriceDiscrepancyConfirm}
        />
      )}

      <BottomRegularTray isVisible={searchTrayOpen} hideTray={disable}>
        <ItemLookupHome onSubmit={disable} />
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
