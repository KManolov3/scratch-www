import { FixedLayout } from '@layouts/FixedLayout';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { sumBy } from 'lodash-es';
import { Colors } from '@lib/colors';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { VerifyItemsList } from '@components/VerifyItemsList';
import { RemoveItemModal } from '../components/RemoveItemModal';
import { useOutageState } from '../state';
import { OutageNavigation } from '../navigator';

const calculateShrinkage = (items: ItemDetailsInfo[]) =>
  sumBy(items, item => (item.onHand ?? 0) * (item.retailPrice ?? 0));

export function OutageItemList() {
  const { navigate } = useNavigation<OutageNavigation>();

  const {
    outageCountItems,
    removeItem,
    submit: submitOutage,
    submitLoading,
  } = useOutageState();

  const [activeItem, setActiveItem] = useState<ItemDetailsInfo>();

  const [isRemoveItemModalVisible, setIsRemoveItemModalVisible] =
    useState(false);
  const [isShrinkageModalVisible, setIsShrinkageModalVisible] = useState(false);

  useEffect(() => {
    if (outageCountItems.length > 0) {
      setActiveItem(outageCountItems[outageCountItems.length - 1]);
    }
  }, [outageCountItems]);

  const removeOutageItem = useCallback(() => {
    if (activeItem?.sku) {
      removeItem(activeItem.sku);
    }
    setIsRemoveItemModalVisible(false);
  }, [activeItem?.sku, removeItem]);

  const submitOutageCount = useCallback(() => {
    setIsShrinkageModalVisible(false);
    submitOutage();
    navigate('Home');
  }, [navigate, submitOutage]);

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        // TODO: Show variance confirmation modal before submitting
        label: 'Complete Outage Count',
        onPress: submitOutageCount,
      },
    ],
    [submitOutageCount],
  );

  if (submitLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <>
      <FixedLayout style={styles.layout}>
        <VerifyItemsList items={outageCountItems} />

        <BottomActionBar
          actions={bottomBarActions}
          style={styles.bottomAction}
        />
      </FixedLayout>

      {
        // TODO: Remove this if we go with a no active item design
        activeItem ? (
          <RemoveItemModal
            isVisible={isRemoveItemModalVisible}
            activeItem={activeItem}
            onConfirm={removeOutageItem}
            onCancel={() => setIsRemoveItemModalVisible(false)}
          />
        ) : null
      }

      <ShrinkageOverageModal
        isVisible={isShrinkageModalVisible}
        shrinkage={calculateShrinkage(outageCountItems)}
        overage={0}
        onConfirm={submitOutageCount}
        onCancel={() => setIsShrinkageModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
  },
  layout: {
    flex: 1,
    backgroundColor: Colors.pure,
  },
  bottomAction: {
    paddingTop: 8,
  },
});
