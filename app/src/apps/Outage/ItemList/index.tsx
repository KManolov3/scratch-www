import { FixedLayout } from '@layouts/FixedLayout';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { useOutageState } from '../state';
import { OutageNavigation } from '../navigator';
import { OutageItemCard } from '../components/ItemCard';

export function OutageItemList() {
  const { navigate } = useNavigation<OutageNavigation>();

  const {
    outageCountItems,
    removeItem,
    submit: submitOutage,
    submitLoading,
  } = useOutageState();
  const [isShrinkageModalVisible, setIsShrinkageModalVisible] = useState(false);

  useEffect(() => {
    if (outageCountItems.length === 0) {
      navigate('Home');
    }
  }, [navigate, outageCountItems.length]);

  const removeOutageItem = useCallback(
    (item: ItemDetailsInfo) => {
      if (item.sku) {
        removeItem(item.sku);
        ToastAndroid.show(
          `${item.partDesc} removed from Outage list`,
          ToastAndroid.LONG,
        );
      }
    },
    [removeItem],
  );

  const submitOutageCount = useCallback(() => {
    setIsShrinkageModalVisible(false);
    submitOutage();
  }, [submitOutage]);

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        label: 'Complete Outage Count',
        onPress: () => setIsShrinkageModalVisible(true),
      },
    ],
    [],
  );

  const items = useMemo(
    () => outageCountItems.map(item => ({ ...item, newQty: 0 })),
    [outageCountItems],
  );

  const renderItem = useCallback<ListRenderItem<ItemDetailsInfo>>(
    ({ item, index }) => (
      <OutageItemCard
        key={item.sku}
        outageItem={item}
        isLast={index === outageCountItems.length - 1}
        removeItem={() => removeOutageItem(item)}
      />
    ),
    [outageCountItems.length, removeOutageItem],
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
          contentContainerStyle={styles.list}
        />

        <BottomActionBar actions={bottomBarActions} />
      </FixedLayout>

      <ShrinkageOverageModal
        isVisible={isShrinkageModalVisible}
        countType="Outage"
        items={items}
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
});
