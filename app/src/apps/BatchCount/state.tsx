import { ApolloError, useMutation } from '@apollo/client';
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
import { gql } from 'src/__generated__';
import {
  Action,
  CycleCountType,
  Item,
  Status,
} from 'src/__generated__/graphql';
import { v4 as uuid } from 'uuid';
import { SubmitBatchCountGql } from './external-types';
import { BatchCountNavigation } from './navigator';

interface ContextValue {
  batchCountItems: BatchCountItems;
  addItem: (item: BatchCountItem) => void;
  updateItem: (sku: string, item: Partial<BatchCountItem>) => void;
  removeItem: (sku: string) => void;
  submit: () => void;
  submitLoading?: boolean;
  submitError?: ApolloError;
}

export interface BatchCountItem {
  item: Item & { sku: NonNullable<Item['sku']> };
  newQty: number;
  isBookmarked?: boolean;
}

type BatchCountItems = Record<BatchCountItem['item']['sku'], BatchCountItem>;

const SUBMIT_BATCH_COUNT = gql(`
  mutation SubmitBatchCount($request: CycleCountList!) {
    sendCycleCountList(request: $request)
  }
`);

const Context = createContext<ContextValue | undefined>(undefined);

function buildBatchCountRequest(
  batchCountItems: BatchCountItems,
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
        items: Object.keys(batchCountItems).map(sku => {
          const batchCountItem = batchCountItems[sku];
          if (batchCountItem === undefined) {
            throw new Error(
              `Could not find item indexed by sku ${sku}. This should never happen`,
            );
          }

          return {
            sku,
            onhandAtCountQty: batchCountItem.newQty.toString(),
            // Should we change the model and just not pass anything here if `onHand` is missing?
            freezeQty: batchCountItem.item.onHand?.toString() ?? 'undefined',
          };
        }),
      },
    ],
  };
}

export function BatchCountStateProvider({ children }: { children: ReactNode }) {
  const [batchCountItems, setBatchCountItems] = useState<BatchCountItems>({});
  const [submitBatchCount, { error, loading }] =
    useMutation(SUBMIT_BATCH_COUNT);
  const navigation = useNavigation<BatchCountNavigation>();

  const { storeNumber } = useCurrentSessionInfo();

  const addItem = useCallback(
    (newItem: BatchCountItem) =>
      setBatchCountItems({
        ...batchCountItems,
        [newItem.item.sku]: newItem,
      }),
    [batchCountItems, setBatchCountItems],
  );

  const updateItem = useCallback(
    (sku: string, updatedItem: Partial<BatchCountItem>) => {
      const itemInState = batchCountItems[sku];

      if (!itemInState) {
        // TODO: Should this be an error? It will break the application, but then again,
        // if the item does not exist in state that definitely means something is wrong.
        throw new Error('Attempting to update an item not existing in state');
      }

      setBatchCountItems({
        ...batchCountItems,
        [sku]: merge(batchCountItems[sku], updatedItem),
      });
    },
    [batchCountItems, setBatchCountItems],
  );

  const removeItem = useCallback(
    (sku: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [sku]: itemToRemove, ...rest } = batchCountItems;
      setBatchCountItems(rest);
    },
    [batchCountItems],
  );

  const submit = useCallback(async () => {
    const batchCountRequest = buildBatchCountRequest(
      batchCountItems,
      storeNumber,
    );
    await submitBatchCount({ variables: { request: batchCountRequest } });
    setBatchCountItems({});

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
