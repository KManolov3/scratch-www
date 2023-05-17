import { FixedLayout } from '@layouts/FixedLayout';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { filterNotNull } from '@lib/array';
import { noop } from 'lodash-es';
import { BlockButton } from '@components/Button/Block';
import { Error } from '@components/Error';
import { OutageItemCard } from '../components/ItemCard';
import { RemoveItemModal } from './components/RemoveItemModal';
import { useOutageBatchState } from '../state';

export function OutageBatch() {
  const { outageBatch, error, loading } = useOutageBatchState();

  const outageCountItems = useMemo(() => {
    if (!outageBatch) {
      return [];
    }

    return filterNotNull(outageBatch.items ?? []);
  }, [outageBatch]);

  const [activeItem, setActiveItem] =
    useState<(typeof outageCountItems)[number]>();

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (outageCountItems.length > 0) {
      setActiveItem(outageCountItems[outageCountItems.length - 1]);
    }
  }, [outageCountItems]);

  const renderItem = useCallback<
    ListRenderItem<(typeof outageCountItems)[number]>
  >(
    ({ item }) => (
      <OutageItemCard
        outageItem={item}
        active={activeItem?.sku === item.sku}
        onPress={() => setActiveItem(item)}
        removeItem={() => setIsModalVisible(true)}
      />
    ),
    [activeItem],
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (error || !outageCountItems) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Error message={(error as any)?.message} />;
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

          {/*
           * TODO: Revisit FixedLayout and more specifically -
           * KeyboardAvoidingView's styles; fix button position
           * to bottom of screen
           */}
          <BlockButton label="Complete Outage Count" onPress={noop} />
        </View>
      </FixedLayout>

      <RemoveItemModal
        isVisible={isModalVisible}
        activeItem={activeItem}
        /*
         * TODO: apply a mutation or update local state
         * to remove item from outage batch
         */
        onConfirm={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
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
