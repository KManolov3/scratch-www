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
import { useCurrentSessionInfo } from '@services/Auth';

const SUBMIT_OUTAGE_COUNT = gql(`
  mutation SubmitOutageCount($request: CycleCountList!) {
    sendCycleCountList(request: $request)
  }
`);

interface ContextValue {
  outageCountItems: ItemDetailsInfo[];
  addItem: (item: ItemDetailsInfo) => void;
  removeItem: (sku: string) => void;
  submit: () => void;
  submitLoading: boolean;
}

const Context = createContext<ContextValue | undefined>(undefined);

function buildOutageCount(items: ItemDetailsInfo[], storeNumber: string) {
  const now = DateTime.now().toISO();

  if (!now) {
    // TODO: hande this case
    throw new Error('Cannot get current time');
  }

  return {
    storeNumber,
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

export function OutageStateProvider({ children }: { children: ReactNode }) {
  const [outageCountItems, setOutageCountItems] = useState<ItemDetailsInfo[]>(
    [],
  );

  const { storeNumber } = useCurrentSessionInfo();

  // TODO: show a toast with an error message
  const [submitOutageCount, { loading }] = useMutation(SUBMIT_OUTAGE_COUNT);

  const addItem = useCallback((item: ItemDetailsInfo) => {
    setOutageCountItems(currentItems => [
      ...currentItems.filter(({ sku }) => sku !== item.sku),
      item,
    ]);
  }, []);

  const removeItem = useCallback((sku: string) => {
    setOutageCountItems(currentItems =>
      currentItems.filter(item => item.sku !== sku),
    );
  }, []);

  const submit = useCallback(() => {
    submitOutageCount({
      variables: { request: buildOutageCount(outageCountItems, storeNumber) },
    });
    setOutageCountItems([]);
  }, [outageCountItems, submitOutageCount, storeNumber]);

  const value = useMemo(
    () => ({
      outageCountItems,
      addItem,
      removeItem,
      submit,
      submitLoading: loading,
    }),
    [outageCountItems, addItem, removeItem, submit, loading],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useOutageState() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      'Cannot use `useOutageState` without <OutageStateProvider>',
    );
  }

  return context;
}
