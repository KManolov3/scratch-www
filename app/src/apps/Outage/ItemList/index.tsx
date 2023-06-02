import { FixedLayout } from '@layouts/FixedLayout';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BlockButton } from '@components/Button/Block';
import { useNavigation } from '@react-navigation/native';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { Header } from '@components/Header';
import { sumBy } from 'lodash-es';
import { OutageItemCard } from '../components/ItemCard';
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

  const renderItem = useCallback<
    ListRenderItem<(typeof outageCountItems)[number]>
  >(
    ({ item }) => (
      <OutageItemCard
        key={item.sku}
        outageItem={item}
        active={activeItem?.sku === item.sku}
        onPress={() => setActiveItem(item)}
        removeItem={() => setIsRemoveItemModalVisible(true)}
      />
    ),
    [activeItem?.sku],
  );

  const submitOutageCount = useCallback(() => {
    setIsShrinkageModalVisible(false);
    submitOutage();
    navigate('Home');
  }, [navigate, submitOutage]);

  const header = useMemo(() => <Header title="Outage" />, []);

  if (submitLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <>
      <FixedLayout header={header}>
        <View>
          <FlatList
            data={outageCountItems}
            renderItem={renderItem}
            style={styles.list}
          />

          <BlockButton
            label="Complete Outage Count"
            onPress={() => setIsShrinkageModalVisible(true)}
          />
        </View>
      </FixedLayout>

      {activeItem ? (
        <RemoveItemModal
          isVisible={isRemoveItemModalVisible}
          activeItem={activeItem}
          onConfirm={removeOutageItem}
          onCancel={() => setIsRemoveItemModalVisible(false)}
        />
      ) : null}

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
  list: {
    marginVertical: 8,
  },
  loading: {
    flex: 1,
  },
});
