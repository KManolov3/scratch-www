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
import { OutageItemCard } from '../components/ItemCard';
import { RemoveItemModal } from './components/RemoveItemModal';
import { useOutageBatchState } from '../state';
import { OutageNavigation } from '../navigator';

export function OutageBatch() {
  const { navigate } = useNavigation<OutageNavigation>();

  const {
    outageBatch: outageCountItems,
    removeItem,
    submit: submitOutage,
    submitLoading,
  } = useOutageBatchState();

  const [activeItem, setActiveItem] =
    useState<(typeof outageCountItems)[number]>();

  const [isRemoveItemModalVisible, setIsRemoveItemModalVisible] =
    useState(false);

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

          {/*
           * TODO: Revisit FixedLayout and more specifically -
           * KeyboardAvoidingView's styles; fix button position
           * to bottom of screen
           */}
          <BlockButton
            label="Complete Outage Count"
            onPress={submitOutageBatch}
          />
        </View>
      </FixedLayout>

      <RemoveItemModal
        isVisible={isRemoveItemModalVisible}
        activeItem={activeItem}
        onConfirm={removeOutageItem}
        onCancel={() => setIsRemoveItemModalVisible(false)}
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
