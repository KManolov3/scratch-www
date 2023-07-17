import { sortBy } from 'lodash-es';
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
import { gql } from 'src/__generated__';
import {
  Action,
  CycleCountType,
  Item,
  Status,
} from 'src/__generated__/graphql';
import { toastService } from 'src/services/ToastService';
import { v4 as uuid } from 'uuid';
import { EventBus } from '@hooks/useEventBus';
import { useManagedMutation } from '@hooks/useManagedMutation';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { SubmitBatchCountGql } from './external-types';
import { BatchCountNavigation } from './navigator';

interface ContextValue {
  batchCountItems: BatchCountItem[];

  applySorting: () => void;

  addItem: (item: Item, incrementCount: boolean) => void;
  updateItem: (
    sku: string,
    item: Partial<BatchCountItem>,
    options: { moveItemToTop: boolean },
  ) => void;
  removeItem: (sku: string) => void;

  submit: () => Promise<void>;
  submitLoading?: boolean;
  submitError?: unknown;
}

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
  const [batchCountItems, setBatchCountItems] = useState<BatchCountItem[]>([]);
  const {
    perform: submitBatchCount,
    error,
    loading,
  } = useManagedMutation(SUBMIT_BATCH_COUNT, {
    globalErrorHandling: () => 'ignored',
  });
  const navigation = useNavigation<BatchCountNavigation>();

  const { storeNumber } = useCurrentSessionInfo();

  const updateItem = useCallback(
    (
      sku: string,
      updates: Partial<BatchCountItem>,
      { moveItemToTop }: { moveItemToTop: boolean },
    ) => {
      setBatchCountItems(items => {
        const itemInState = items.find(({ item }) => item.sku === sku);

        if (!itemInState) {
          // TODO: Should this be an error? It will break the application, but then again,
          // if the item does not exist in state that definitely means something is wrong.
          throw new Error('Attempting to update an item not existing in state');
        }
        const updatedItem = { ...itemInState, ...updates };

        if (moveItemToTop) {
          return [updatedItem, ...items.filter(({ item }) => item.sku !== sku)];
        }

        return items.map(item => (item.item.sku !== sku ? item : updatedItem));
      });
    },
    [setBatchCountItems],
  );

  const addItem = useCallback(
    (newItem: Item, incrementCount: boolean) => {
      const itemInState = batchCountItems.find(
        ({ item }) => item.sku === newItem.sku,
      );

      if (!itemInState) {
        const newBatchCountItem = {
          item: {
            ...newItem,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sku: newItem.sku!,
          },
          newQty: incrementCount ? 1 : 0,
        };
        setBatchCountItems([newBatchCountItem, ...batchCountItems]);
      } else {
        // Updating with the retrieved information even if the item already exists in the state
        // in case something changed (for example, the price) on the backend.
        updateItem(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          newItem.sku!,
          {
            item: {
              ...newItem,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              sku: newItem.sku!,
            },
            newQty: incrementCount
              ? itemInState.newQty + 1
              : itemInState.newQty,
          },
          { moveItemToTop: true },
        );
      }

      EventBus.emit('add-item-to-batch-count');
      navigation.navigate('List');
    },
    [batchCountItems, navigation, updateItem],
  );

  const removeItem = useCallback(
    (sku: string) => {
      setBatchCountItems(
        batchCountItems.filter(({ item }) => item.sku !== sku),
      );
    },
    [batchCountItems],
  );

  const submit = useCallback(async () => {
    const batchCountRequest = buildBatchCountRequest(
      batchCountItems,
      storeNumber,
    );

    // TODO: Does this reject on error?
    await submitBatchCount({ variables: { request: batchCountRequest } });

    setBatchCountItems([]);

    toastService.showInfoToast('Batch count completed');
    navigation.navigate('Home');
  }, [batchCountItems, storeNumber, submitBatchCount, navigation]);

  const applySorting = useCallback(() => {
    setBatchCountItems(items => sortBy(items, item => !item.isBookmarked));
  }, []);

  const value = useMemo(
    () => ({
      batchCountItems,
      addItem,
      updateItem,
      removeItem,
      submit,
      applySorting,

      // TODO: Make these part of the user useAsyncAction and just make `submit` return a promise?
      submitLoading: loading,
      submitError: error,
    }),
    [
      batchCountItems,
      addItem,
      updateItem,
      removeItem,
      submit,
      applySorting,
      loading,
      error,
    ],
  );

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
