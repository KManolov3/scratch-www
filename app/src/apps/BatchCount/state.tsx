import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface ContextValue {
  storeNumber: string;
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

const Context = createContext<ContextValue | undefined>(undefined);

export function BatchCountStateProvider({ children }: { children: ReactNode }) {
  const storeNumber = useMemo(() => '0363', []);
  const [batchCountItems, setBatchCountItems] = useState<BatchCountItems>({});
  const updateItem = useCallback(
    ({ sku, ...rest }: BatchCountItem) =>
      setBatchCountItems({
        ...batchCountItems,
        [sku]: rest,
      }),
    [batchCountItems, setBatchCountItems],
  );
  const submit = useCallback(() => {
    // TODO: send batch count
    setBatchCountItems({});
  }, [setBatchCountItems]);

  const value = useMemo(
    () => ({
      storeNumber,
      batchCountItems,
      updateItem,
      submit,
    }),
    [storeNumber, batchCountItems, updateItem, submit],
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
