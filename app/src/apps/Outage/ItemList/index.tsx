import { useCallback, useMemo, useRef } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useConfirmation } from '@hooks/useConfirmation';
import { FixedLayout } from '@layouts/FixedLayout';
import { useNavigation } from '@react-navigation/native';
import { useScanCodeListener } from '@services/ScanCode';
import { toastService } from '@services/ToastService';
import { OutageItemCard } from '../components/ItemCard';
import { OutageNavigation } from '../navigator';
import { useOutageState } from '../state';

export function OutageItemList() {
  const { navigate } = useNavigation<OutageNavigation>();
  const flatListRef = useRef<FlatList>(null);

  const {
    outageCountItems,
    removeItem,
    submit: submitOutage,
  } = useOutageState();

  const { shouldConfirm, confirm, accept, reject } = useConfirmation();

  const { requestToAddItem } = useOutageState();

  const { trigger: addItem } = useAsyncAction(async (sku: string) => {
    try {
      await requestToAddItem(sku);

      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    } catch (error) {
      // TODO: Don't assume that it's "No results found"
      // TODO: Duplication of the text with the batch count
      toastService.showInfoToast(
        'No results found. Try searching for another SKU or scanning a barcode.',
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
        toastService.showInfoToast(
          'Cannot scan this type of barcode. Supported are front tags and backroom tags.',
          {
            props: { containerStyle: styles.toast },
          },
        );
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

  const { trigger: submit, loading: submitLoading } = useAsyncAction(
    async () => {
      try {
        if (await confirm()) {
          await submitOutage();
          navigate('Home');
        }
      } catch (error) {
        toastService.showInfoToast(
          'Could not submit the outage count due to an error',
          {
            props: { containerStyle: styles.toast },
          },
        );

        throw error;
      }
    },
  );

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        label: 'Complete Outage Count',
        onPress: submit,
        isLoading: submitLoading,
      },
    ],
    [submit, submitLoading],
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
        isVisible={shouldConfirm}
        countType="Outage"
        items={items}
        onConfirm={accept}
        onCancel={reject}
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
