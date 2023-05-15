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
import { Action, CycleCountType, Status } from 'src/__generated__/graphql';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { SubmitBatchCountGql } from './external-types';

interface ContextValue {
  batchCountItems: BatchCountItems;
  updateItem: (item: BatchCountItem) => void;
  submit: () => void;
}

interface BatchCountItem {
  sku: string;
  onHand: number;
  newQty: number;
}

type BatchCountItems = Record<
  BatchCountItem['sku'],
  Omit<BatchCountItem, 'sku'>
>;

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
            freezeQty: batchCountItems[sku]!.onHand.toString(),
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

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const updateItem = useCallback(
    ({ sku, ...rest }: BatchCountItem) =>
      setBatchCountItems({
        ...batchCountItems,
        [sku]: rest,
      }),
    [batchCountItems, setBatchCountItems],
  );
  const submit = useCallback(() => {
    const batchCountRequest = buildBatchCountRequest(batchCountItems);
    submitBatchCount({ variables: { request: batchCountRequest } });
    setBatchCountItems({});
  }, [setBatchCountItems, submitBatchCount, batchCountItems]);

  const value = useMemo(
    () => ({
      batchCountItems,
      updateItem,
      submit,
    }),
    [batchCountItems, updateItem, submit],
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
