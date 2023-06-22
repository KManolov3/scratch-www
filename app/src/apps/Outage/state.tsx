import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DocumentType, gql } from 'src/__generated__';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import { Action, CycleCountType, Status } from 'src/__generated__/graphql';
import { useCurrentSessionInfo } from '@services/Auth';
import { useScanListener } from '@services/Scanner';
import { BackstockWarningModal } from './components/BackstockWarningModal';
import { OutageNavigation } from './navigator';
import { useNavigation } from '@react-navigation/native';
import { scanCodeService } from '@services/ScanCode';

const SUBMIT_OUTAGE_COUNT = gql(`
  mutation SubmitOutageCount($request: CycleCountList!) {
    sendCycleCountList(request: $request)
  }
`);

// TODO: ItemInfoHeaderFields wtf
const ITEM_BY_SKU_QUERY = gql(`
  query ItemLookupBySku($sku: String!, $storeNumber: String!) {
    itemBySku(sku: $sku, storeNumber: $storeNumber) {
      ...ItemInfoHeaderFields
      ...BackstockSlotFields
    },
  }
`);

export type OutageItemInfo = NonNullable<
  DocumentType<typeof ITEM_BY_SKU_QUERY>['itemBySku']
>;

interface ContextValue {
  outageCountItems: OutageItemInfo[];

  // TODO: Rename to requestAddItem
  addItem: (sku: string) => void;
  removeItem: (sku: string) => void;

  itemLoading: boolean;
  itemError: ErrorType | undefined;

  submit: () => void;
  submitLoading: boolean;
}

const Context = createContext<ContextValue | undefined>(undefined);

function buildOutageCount(items: OutageItemInfo[], storeNumber: string) {
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

type ErrorType = 'Not Found Error';

export function OutageStateProvider({ children }: { children: ReactNode }) {
  const { navigate } = useNavigation<OutageNavigation>();
  const [outageCountItems, setOutageCountItems] = useState<OutageItemInfo[]>(
    [],
  );

  // TODO: Not a state
  const [errorType, setErrorType] = useState<ErrorType>();

  const [itemWithBackstock, setItemWithBackstock] = useState<OutageItemInfo>();

  // TODO: Use this
  const [getItemBySku, { loading: itemLoading, error }] = useLazyQuery(
    ITEM_BY_SKU_QUERY,
    {
      onCompleted: item => {
        // TODO: "This item is already part of the outage count" message

        if (item?.itemBySku) {
          if (item?.itemBySku.backStockSlots?.length) {
            setItemWithBackstock(item.itemBySku);
          } else {
            addItemAndContinue(item.itemBySku);
          }
        } else {
          // TODO: this error should be based on what
          // the backend has returned
          setErrorType('Not Found Error');
        }
      },
      onError: () => {
        // TODO: EventBus schenanigans

        // TODO: this error should be based on what
        // the backend has returned
        setErrorType('Not Found Error');
      },
    },
  );

  const { storeNumber } = useCurrentSessionInfo();

  // TODO: show a toast with an error message
  const [submitOutageCount, { loading: submitLoading }] =
    useMutation(SUBMIT_OUTAGE_COUNT);

  // const addItem = useCallback((item: OutageItemInfo) => {
  //   setOutageCountItems(currentItems => [
  //     // TODO: Is there a better way to do this?
  //     item,
  //     ...currentItems.filter(_ => _.sku !== sku),
  //   ]);
  // }, []);

  const addItem = useCallback(
    (sku: string) => getItemBySku({ variables: { sku, storeNumber } }),
    [getItemBySku],
  );

  const removeItem = useCallback((sku: string) => {
    setOutageCountItems(currentItems =>
      currentItems.filter(item => item.sku !== sku),
    );
  }, []);

  const addItemAndContinue = useCallback(
    (item: OutageItemInfo) => {
      setErrorType(undefined);

      setOutageCountItems(currentItems => [
        // TODO: Is there a better way to do this?
        item,
        ...currentItems.filter(_ => _.sku !== item.sku),
      ]);

      setItemWithBackstock(undefined);
      navigate('Item List');
    },
    [addItem, navigate],
  );

  const submit = useCallback(() => {
    submitOutageCount({
      variables: { request: buildOutageCount(outageCountItems, storeNumber) },
    });
    setOutageCountItems([]);
  }, [outageCountItems, submitOutageCount, storeNumber]);

  useScanListener(scan => {
    const scanCode = scanCodeService.parse(scan);

    if (scanCode.type === 'SKU') {
      addItem(scanCode.sku);
    } else {
      // TODO: Toast or show message
    }
  });

  const value = useMemo(
    () => ({
      outageCountItems,
      addItem,
      removeItem,
      itemLoading,
      itemError: errorType,
      submit,
      submitLoading,
    }),
    [outageCountItems, addItem, removeItem, submit, submitLoading],
  );

  return (
    <>
      <BackstockWarningModal
        isVisible={!!itemWithBackstock}
        item={itemWithBackstock}
        onConfirm={() => {
          itemWithBackstock && addItemAndContinue(itemWithBackstock);
        }}
        onCancel={() => setItemWithBackstock(undefined)}
      />

      <Context.Provider value={value}>{children}</Context.Provider>
    </>
  );
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
