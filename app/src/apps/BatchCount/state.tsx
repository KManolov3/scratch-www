import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { merge } from 'lodash-es';
import { DateTime } from 'luxon';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import 'react-native-get-random-values';
import { toastService } from 'src/services/ToastService';
import { gql } from 'src/__generated__';
import {
  Action,
  CycleCountType,
  Item,
  Status,
} from 'src/__generated__/graphql';
import { useScanListener } from 'src/services/Scanner';
import { v4 as uuid } from 'uuid';
import { scanCodeService } from 'src/services/ScanCode';
import { EventBus } from '@hooks/useEventBus';
import { SubmitBatchCountGql } from './external-types';
import { BatchCountNavigation } from './navigator';

interface ContextValue {
  batchCountItems: BatchCountItem[];
  addItem: (item: Item | undefined, incrementCount: boolean) => void;
  updateItem: (sku: string, item: Partial<BatchCountItem>) => void;
  removeItem: (sku: string) => void;
  submit: () => void;
  submitLoading?: boolean;
  submitError?: ApolloError;
}

export const ITEM_BY_SKU = gql(`
  query BatchCountItemBySkuLookup($sku: String!, $storeNumber: String!) {
    itemBySku(sku: $sku, storeNumber: $storeNumber) {
      ...ItemInfoFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

export const ITEM_BY_UPC = gql(`
  query BatchCountItemByUpcLookup($upc: String!, $storeNumber: String!) {
    itemByUpc(upc: $upc, storeNumber: $storeNumber) {
      ...ItemInfoFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

export interface BatchCountItem {
  item: Item & { sku: NonNullable<Item['sku']> };
  newQty: number;
  isBookmarked?: boolean;
}

const SUBMIT_BATCH_COUNT = gql(`
  mutation SubmitBatchCount($request: CycleCountList!) {
    sendCycleCountList(request: $request)
  }
`);

const Context = createContext<ContextValue | undefined>(undefined);

function buildBatchCountRequest(
  batchCountItems: BatchCountItem[],
  storeNumber: string,
): SubmitBatchCountGql {
  return {
    storeNumber,
    cycleCounts: [
      {
        action: Action.Create,
        status: Status.Completed,
        // This should always be serializable to ISO
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        dueDate: DateTime.now().toISO()!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        createDate: DateTime.now().toISO()!,
        cycleCountName: uuid(),
        cycleCountType: CycleCountType.BatchCount,
        items: batchCountItems.map(({ item, newQty }) => ({
          sku: item.sku,
          onhandAtCountQty: newQty.toString(),
          // Should we change the model and just not pass anything here if `onHand` is missing?
          freezeQty: item.onHand?.toString() ?? 'undefined',
        })),
      },
    ],
  };
}

export function BatchCountStateProvider({ children }: { children: ReactNode }) {
  // TODO: Experiment implementing the state with `useMap`
  // https://usehooks-ts.com/react-hook/use-map
  const [batchCountItems, setBatchCountItems] = useState<BatchCountItem[]>([]);
  const [submitBatchCount, { error, loading }] =
    useMutation(SUBMIT_BATCH_COUNT);
  const navigation = useNavigation<BatchCountNavigation>();

  const { storeNumber } = useCurrentSessionInfo();

  const updateItem = useCallback(
    (sku: string, updatedItem: Partial<BatchCountItem>) => {
      const itemInState = batchCountItems.find(({ item }) => item.sku === sku);

      if (!itemInState) {
        // TODO: Should this be an error? It will break the application, but then again,
        // if the item does not exist in state that definitely means something is wrong.
        throw new Error('Attempting to update an item not existing in state');
      }

      setBatchCountItems([
        merge(itemInState, updatedItem),
        ...batchCountItems.filter(({ item }) => item.sku !== sku),
      ]);
    },
    [batchCountItems, setBatchCountItems],
  );

  const addItem = useCallback(
    (newItem: Item | undefined, incrementCount: boolean) => {
      if (newItem) {
        const itemInState = batchCountItems.find(
          ({ item }) => item.sku === newItem.sku,
        );

        if (!itemInState) {
          setBatchCountItems([
            {
              item: {
                ...newItem,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                sku: newItem.sku!,
              },
              newQty: incrementCount ? 1 : 0,
            },
            ...batchCountItems,
          ]);
          EventBus.emit('add-new-item');
        } else {
          // Updating with the retrieved information even if the item already exists in the state
          // in case something changed (for example, the price) on the backend.
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          updateItem(newItem.sku!, {
            item: {
              ...newItem,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              sku: newItem.sku!,
            },
            newQty: incrementCount
              ? itemInState.newQty + 1
              : itemInState.newQty,
          });
        }
        navigation.navigate('List');
      }
    },
    [batchCountItems, navigation, updateItem],
  );

  const removeItem = useCallback(
    (sku: string) =>
      setBatchCountItems(
        batchCountItems.filter(({ item }) => item.sku !== sku),
      ),
    [batchCountItems],
  );

  const submit = useCallback(async () => {
    const batchCountRequest = buildBatchCountRequest(
      batchCountItems,
      storeNumber,
    );
    await submitBatchCount({ variables: { request: batchCountRequest } });
    setBatchCountItems([]);

    toastService.showInfoToast('Batch count completed');
    navigation.navigate('Home');
  }, [batchCountItems, storeNumber, submitBatchCount, navigation]);

  const value = useMemo(
    () => ({
      batchCountItems,
      addItem,
      updateItem,
      removeItem,
      submit,
      submitLoading: loading,
      submitError: error,
    }),
    [batchCountItems, addItem, updateItem, removeItem, submit, loading, error],
  );

  const [searchBySku] = useLazyQuery(ITEM_BY_SKU, {
    onCompleted: item => {
      addItem(item.itemBySku ?? undefined, false);
      EventBus.emit('search-success', item.itemBySku ?? undefined);
    },
    onError: (searchError: ApolloError) =>
      EventBus.emit('search-error', searchError),
  });

  const [searchByUpc] = useLazyQuery(ITEM_BY_UPC, {
    onCompleted: item => {
      addItem(item.itemByUpc ?? undefined, true);
      EventBus.emit('search-success', item.itemByUpc ?? undefined);
    },
    onError: (searchError: ApolloError) =>
      EventBus.emit('search-error', searchError),
  });

  useScanListener(scan => {
    const scanCode = scanCodeService.parse(scan);

    if (scanCode.type === 'SKU') {
      return searchBySku({
        variables: { sku: scanCode.sku, storeNumber },
      });
    }

    return searchByUpc({
      variables: { upc: scanCode.upc, storeNumber },
    });
  });

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useBatchCountState() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      'Cannot use `useBatchCountContext` without <BatchCountCountContextProvider>',
    );
  }

  return context;
}
