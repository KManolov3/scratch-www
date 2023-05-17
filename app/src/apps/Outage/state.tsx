import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useMutation } from '@apollo/client';
import { gql } from 'src/__generated__';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import { Action, CycleCountType, Status } from 'src/__generated__/graphql';

const SUBMIT_OUTAGE_COUNT = gql(`
  mutation SubmitOutageCount($request: CycleCountList!) {
    sendCycleCountList(request: $request)
  }
`);

interface ContextValue {
  outageBatch: ItemDetailsInfo[];
  addItem: (item: ItemDetailsInfo) => void;
  removeItem: (sku: string) => void;
  submit: () => void;
  submitLoading: boolean;
}

const Context = createContext<ContextValue | undefined>(undefined);

function buildOutageCount(items: ItemDetailsInfo[]) {
  const now = DateTime.now().toISO();

  if (!now) {
    // TODO: hande this case
    throw new Error('Cannot get current time');
  }

  return {
    /**
     * TODO: Replace storeNumber with the appropriate value
     * instead of using a hardcoded one once we have access to it
     */
    storeNumber: '0363',
    cycleCounts: [
      {
        action: Action.Create,
        status: Status.Completed,
        dueDate: now,
        createDate: now,
        cycleCountName: uuid(),
        cycleCountType: CycleCountType.Outage,
        items: items.map(({ sku, onHand }) => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          sku: sku!,
          onhandAtCountQty: '0',
          freezeQty: onHand?.toString(),
        })),
      },
    ],
  };
}

export function OutageBatchStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [outageBatch, setOutageBatch] = useState<ItemDetailsInfo[]>([]);

  // TODO: show a toast with an error message
  const [submitOutageCount, { loading }] = useMutation(SUBMIT_OUTAGE_COUNT);

  const addItem = useCallback((item: ItemDetailsInfo) => {
    setOutageBatch(currentBatch => [
      ...currentBatch.filter(({ sku }) => sku !== item.sku),
      item,
    ]);
  }, []);

  const removeItem = useCallback((sku: string) => {
    setOutageBatch(currentBatch =>
      currentBatch.filter(item => item.sku !== sku),
    );
  }, []);

  const submit = useCallback(() => {
    submitOutageCount({
      variables: { request: buildOutageCount(outageBatch) },
    });
    setOutageBatch([]);
  }, [outageBatch, submitOutageCount]);

  const value = useMemo(
    () => ({
      outageBatch,
      addItem,
      removeItem,
      submit,
      submitLoading: loading,
    }),
    [outageBatch, addItem, removeItem, submit, loading],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useOutageBatchState() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      'Cannot use `useOutageBatchState` without <OutageBatchStateProvider>',
    );
  }

  return context;
}
