import { FixedLayout } from '@layouts/FixedLayout';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
} from 'react-native';
import { useCallback, useMemo, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { useScanCodeListener } from '@services/ScanCode';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useBooleanState } from '@hooks/useBooleanState';
import { toastService } from '@services/ToastService';
import { useOutageState } from '../state';
import { OutageNavigation } from '../navigator';
import { OutageItemCard } from '../components/ItemCard';

export function OutageItemList() {
  const { navigate } = useNavigation<OutageNavigation>();
  const flatListRef = useRef<FlatList>(null);

  const {
    outageCountItems,
    removeItem,
    submit: submitOutage,
    submitLoading,
  } = useOutageState();
  const {
    state: isShrinkageModalVisible,
    enable: showShrinkageModal,
    disable: hideShrinkageModal,
  } = useBooleanState(false);

  const { requestToAddItem } = useOutageState();

  const { trigger: addItem } = useAsyncAction(async (sku: string) => {
    try {
      await requestToAddItem(sku);

      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    } catch (error) {
      // TODO: Don't assume that it's "No results found"
      // TODO: Duplication of the text with the batch count
      toastService.showInfoToast(
        'No results found. Try searching for another SKU or scanning another barcode.',
        {
          props: { containerStyle: styles.toast },
        },
      );

      throw error;
    }
  });

  useScanCodeListener(code => {
    switch (code.type) {
      case 'front-tag':
      case 'sku':
        addItem(code.sku);
        break;
      default:
      // TODO: Duplication with the other Outage screen
    }
  });

  const removeOutageItem = useCallback(
    (item: ItemDetailsInfo) => {
      if (item.sku) {
        removeItem(item.sku);

        if (outageCountItems.length === 1) {
          navigate('Home');
        }

        toastService.showInfoToast(
          `${item.partDesc} removed from Outage list`,
          {
            props: { containerStyle: styles.toast },
          },
        );
      }
    },
    [removeItem, outageCountItems, navigate],
  );

  const submitOutageCount = useCallback(() => {
    hideShrinkageModal();
    submitOutage();
    toastService.showInfoToast('Outage List Complete');
  }, [hideShrinkageModal, submitOutage]);

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        label: 'Complete Outage Count',
        onPress: showShrinkageModal,
      },
    ],
    [showShrinkageModal],
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
        onRemove={() => removeOutageItem(item)}
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
          ref={flatListRef}
        />

        <BottomActionBar actions={bottomBarActions} />
      </FixedLayout>

      <ShrinkageOverageModal
        isVisible={isShrinkageModalVisible}
        countType="Outage"
        items={items}
        onConfirm={submitOutageCount}
        onCancel={hideShrinkageModal}
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
  // TODO: Duplication with batch count
  toast: {
    marginBottom: '10%',
  },
});
