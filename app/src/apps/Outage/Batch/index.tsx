import { FixedLayout } from '@layouts/FixedLayout';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { BlockButton } from '@components/Button/Block';
import { useNavigation } from '@react-navigation/native';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { sumBy } from 'lodash-es';
import { OutageItemCard } from '../components/ItemCard';
import { RemoveItemModal } from './components/RemoveItemModal';
import { useOutageBatchState } from '../state';
import { OutageNavigation } from '../navigator';

const calculateShrinkage = (items: ItemDetailsInfo[]) =>
  sumBy(items, item => (item.onHand ?? 0) * (item.retailPrice ?? 0));

export function OutageBatch() {
  const { navigate } = useNavigation<OutageNavigation>();

  const {
    outageBatch: outageCountItems,
    removeItem,
    submit: submitOutage,
    submitLoading,
  } = useOutageBatchState();

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    removeItem(activeItem?.sku!);
    setIsRemoveItemModalVisible(false);
  }, [activeItem?.sku, removeItem]);

  const renderItem = useCallback<
    ListRenderItem<(typeof outageCountItems)[number]>
  >(
    ({ item }) => (
      <OutageItemCard
        outageItem={item}
        active={activeItem?.sku === item.sku}
        onPress={() => setActiveItem(item)}
        removeItem={() => setIsRemoveItemModalVisible(true)}
      />
    ),
    [activeItem?.sku],
  );

  const submitOutageBatch = useCallback(() => {
    setIsShrinkageModalVisible(false);
    submitOutage();
    navigate('Home');
  }, [navigate, submitOutage]);

  if (submitLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <>
      <FixedLayout>
        <View>
          <FlatList
            data={outageCountItems}
            renderItem={renderItem}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            keyExtractor={({ sku }) => sku!}
            style={styles.outageBatch}
          />

          <BlockButton
            label="Complete Outage Count"
            onPress={() => setIsShrinkageModalVisible(true)}
          />
        </View>
      </FixedLayout>

      <RemoveItemModal
        isVisible={isRemoveItemModalVisible}
        activeItem={activeItem}
        onConfirm={removeOutageItem}
        onCancel={() => setIsRemoveItemModalVisible(false)}
      />

      <ShrinkageOverageModal
        isVisible={isShrinkageModalVisible}
        shrinkage={calculateShrinkage(outageCountItems)}
        overage={0}
        onConfirm={submitOutageBatch}
        onCancel={() => setIsShrinkageModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  outageBatch: {
    marginVertical: 8,
  },
  loading: {
    flex: 1,
  },
});
