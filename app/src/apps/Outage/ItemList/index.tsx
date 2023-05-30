import { FixedLayout } from '@layouts/FixedLayout';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
} from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { sumBy } from 'lodash-es';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { useOutageState } from '../state';
import { OutageNavigation } from '../navigator';
import { OutageItemCard } from '../components/ItemCard';

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

  const [isShrinkageModalVisible, setIsShrinkageModalVisible] = useState(false);

  useEffect(() => {
    if (outageCountItems.length > 0) {
      setActiveItem(outageCountItems[outageCountItems.length - 1]);
    }
  }, [outageCountItems]);

  const removeOutageItem = useCallback(() => {
    if (activeItem?.sku) {
      // TODO: show a toast
      removeItem(activeItem.sku);
    }
  }, [activeItem?.sku, removeItem]);

  const submitOutageCount = useCallback(() => {
    setIsShrinkageModalVisible(false);
    submitOutage();
    navigate('Home');
  }, [navigate, submitOutage]);

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        label: 'Complete Outage Count',
        onPress: () => setIsShrinkageModalVisible(true),
      },
    ],
    [],
  );

  const renderItem = useCallback<
    ListRenderItem<(typeof outageCountItems)[number]>
  >(
    ({ item }) => (
      <OutageItemCard
        key={item.sku}
        outageItem={item}
        active={activeItem?.sku === item.sku}
        onPress={() => setActiveItem(item)}
        removeItem={() => removeOutageItem()}
      />
    ),
    [activeItem?.sku, removeOutageItem],
  );

  if (submitLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <>
      <FixedLayout>
        <FlatList
          data={outageCountItems}
          renderItem={renderItem}
          style={styles.list}
        />

        <BottomActionBar
          actions={bottomBarActions}
          style={styles.bottomAction}
        />
      </FixedLayout>

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
  list: {
    paddingVertical: 6,
  },
  bottomAction: {
    paddingTop: 12,
  },
});
