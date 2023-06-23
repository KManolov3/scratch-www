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
import { useNavigation } from '@react-navigation/native';
import { toastService } from '@services/ToastService';
import { useConfirmation } from '@hooks/useConfirmation';
import { BackstockWarningModal } from './components/BackstockWarningModal';
import { OutageNavigation } from './navigator';

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

interface OutageState {
  outageCountItems: OutageItemInfo[];

  requestToAddItem: (sku: string) => Promise<void>;
  removeItem: (sku: string) => void;

  submit: () => void;
  submitLoading: boolean;
}

const Context = createContext<OutageState | undefined>(undefined);

export function OutageStateProvider({ children }: { children: ReactNode }) {
  const { navigate } = useNavigation<OutageNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const [outageCountItems, setOutageCountItems] = useState<OutageItemInfo[]>(
    [],
  );

  const { itemToConfirm, confirm, accept, reject } =
    useConfirmation<OutageItemInfo>();

  const [getItemBySku] = useLazyQuery(ITEM_BY_SKU_QUERY);

  const [submitOutageCount, { loading: submitLoading }] =
    useMutation(SUBMIT_OUTAGE_COUNT);

  const requestToAddItem = useCallback(
    async (sku: string) => {
      if (outageCountItems.find(_ => _.sku === sku)) {
        // TODO: Toast style to have bottom margin on the outage list screen
        toastService.showInfoToast('Item is already part of the outage count');
        return;
      }

      const response = await getItemBySku({ variables: { sku, storeNumber } });

      // TODO: The stupid function doesn't reject its promise...
      //       We need to keep this in mind everywhere we use `useLazyQuery`
      if (response.error) {
        throw response.error;
      }

      const item = response?.data?.itemBySku;
      if (!item) {
        // TODO: Better error
        throw new Error('Item not found');
      }

      if (item.backStockSlots?.length && !(await confirm(item))) {
        return;
      }

      setOutageCountItems(currentItems => [item, ...currentItems]);
      navigate('Item List');
    },
    [outageCountItems, getItemBySku, confirm, navigate, storeNumber],
  );

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
      requestToAddItem,
      removeItem,
      submit,
      submitLoading,
    }),
    [outageCountItems, requestToAddItem, removeItem, submit, submitLoading],
  );

  return (
    <>
      <BackstockWarningModal
        isVisible={!!itemToConfirm}
        item={itemToConfirm}
        onConfirm={accept}
        onCancel={reject}
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

function buildOutageCount(items: OutageItemInfo[], storeNumber: string) {
  const now = DateTime.now().toISO();

  if (!now) {
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
