import { useCallback, useMemo, useRef } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { BottomActionBar } from '@components/BottomActionBar';
import { BlockButton } from '@components/Button/Block';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useConfirmation } from '@hooks/useConfirmation';
import { NoItemResultsError } from '@hooks/useItemSearch';
import { FixedLayout } from '@layouts/FixedLayout';
import { useNavigation } from '@react-navigation/native';
import { ErrorOptions } from '@services/ErrorContext/formatter';
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
    submitLoading,
    requestToAddItem,
  } = useOutageState();

  const { confirmationRequested, askForConfirmation, accept, reject } =
    useConfirmation();

  const { trigger: addItem } = useAsyncAction(
    async (sku: string) => {
      await requestToAddItem(sku);

      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    },
    {
      globalErrorHandling: error => {
        const toastDetails: Partial<ErrorOptions> =
          error instanceof NoItemResultsError
            ? {
                message:
                  'No results found. Try searching for another SKU or scanning a barcode.',
                toastStyle: styles.toast,
              }
            : {};

        return {
          ...toastDetails,
          displayAs: 'toast',
        };
      },
    },
  );

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

  const { trigger: submit } = useAsyncAction(
    async () => {
      if (await askForConfirmation()) {
        // TODO: Submitting an outage shows a toast, but submitting a batch count
        // throws an error. Converge their error handling behaviours
        await submitOutage();
        toastService.showInfoToast('Outage List Complete');
        navigate('Home');
      }
    },
    { globalErrorHandling: () => 'ignored' },
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

        <BottomActionBar>
          <BlockButton
            variant="primary"
            style={styles.actionButton}
            onPress={submit}
            isLoading={submitLoading}>
            Complete Outage Count
          </BlockButton>
        </BottomActionBar>
      </FixedLayout>

      <ShrinkageOverageModal
        isVisible={confirmationRequested}
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
  actionButton: {
    flex: 1,
  },
  // TODO: Duplication with batch count
  toast: {
    marginBottom: '10%',
  },
});
