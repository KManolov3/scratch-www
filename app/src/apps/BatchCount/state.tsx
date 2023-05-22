import { useMutation } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { gql } from 'src/__generated__';
import {
  Action,
  CycleCountType,
  Item,
  Status,
} from 'src/__generated__/graphql';
import { merge } from 'lodash-es';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { useNavigation } from '@react-navigation/native';
import { SubmitBatchCountGql } from './external-types';
import { BatchCountNavigation } from './navigator';

interface ContextValue {
  batchCountItems: BatchCountItems;
  addItem: (item: BatchCountItem) => void;
  updateItem: (sku: string, item: Partial<BatchCountItem>) => void;
  submit: () => void;
}

export interface BatchCountItem {
  item: Item & { sku: NonNullable<Item['sku']> };
  newQty: number;
  isFlagged?: boolean;
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
): SubmitBatchCountGql {
  const cycleCountList: SubmitBatchCountGql = {
    // Currently hardocoded, change after auth tokens
    // start being parsed.
    storeNumber: '0363',
    cycleCounts: [
      {
        action: Action.Create,
        status: Status.Completed,
        // This should always be parsеable to ISO
        dueDate: DateTime.now().toISO() as string,
        createDate: DateTime.now().toISO() as string,
        cycleCountName: uuid(),
        cycleCountType: CycleCountType.BatchCount,
        items: Object.keys(batchCountItems).map(sku => {
          if (batchCountItems[sku] === undefined) {
            throw new Error(
              `Could not find item indexed by sku ${sku}. This should never happen`,
            );
          }

          return {
            sku,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onhandAtCountQty: batchCountItems[sku]!.newQty.toString(),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            freezeQty: batchCountItems[sku]!.item.onHand!.toString(),
          };
        }),
      },
    ],
  };

  return cycleCountList;
}

export function BatchCountStateProvider({ children }: { children: ReactNode }) {
  const [batchCountItems, setBatchCountItems] = useState<BatchCountItems>({});
  // TODO: Show loading indicator while submitting?
  const [submitBatchCount, { error }] = useMutation(SUBMIT_BATCH_COUNT);
  const navigation = useNavigation<BatchCountNavigation>();

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

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
  const submit = useCallback(() => {
    const batchCountRequest = buildBatchCountRequest(batchCountItems);
    submitBatchCount({ variables: { request: batchCountRequest } });
    setBatchCountItems({});
    navigation.navigate('Home');
  }, [batchCountItems, submitBatchCount, navigation]);

  const value = useMemo(
    () => ({
      batchCountItems,
      addItem,
      updateItem,
      submit,
    }),
    [batchCountItems, addItem, updateItem, submit],
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
