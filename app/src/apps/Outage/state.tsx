import { DateTime } from 'luxon';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { DocumentType, gql } from 'src/__generated__';
import {
  Action,
  CycleCountType,
  ItemLookupBySkuQuery,
  Status,
} from 'src/__generated__/graphql';
import { v4 as uuid } from 'uuid';
import { useConfirmation } from '@hooks/useConfirmation';
import { useManagedLazyQuery } from '@hooks/useManagedLazyQuery';
import { useManagedMutation } from '@hooks/useManagedMutation';
import { isApolloNoResultsError } from '@lib/apollo';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { toastService } from '@services/ToastService';
import { BackstockWarningModal } from './components/BackstockWarningModal';
import { NoResultsError } from './errors/NoResultsError';
import { OutageNavigation } from './navigator';

const SUBMIT_OUTAGE_COUNT = gql(`
  mutation SubmitOutageCount($request: CycleCountList!) {
    sendCycleCountList(request: $request)
  }
`);

const ITEM_BY_SKU_QUERY = gql(`
  query ItemLookupBySku($sku: String!, $storeNumber: String!) {
    itemBySku(sku: $sku, storeNumber: $storeNumber) {
      ...OutageItemInfoFields
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

  submit: () => Promise<void>;
  submitLoading: boolean;
}

const Context = createContext<OutageState | undefined>(undefined);

export function OutageStateProvider({ children }: { children: ReactNode }) {
  const { navigate } = useNavigation<OutageNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const [outageCountItems, setOutageCountItems] = useState<OutageItemInfo[]>(
    [],
  );

  const {
    itemToConfirm,
    confirmationRequested,
    askForConfirmation,
    accept,
    reject,
  } = useConfirmation<OutageItemInfo>();

  const { perform: getItemBySku } = useManagedLazyQuery(ITEM_BY_SKU_QUERY, {
    globalErrorHandling: () => 'ignored',
  });

  const { perform: submitOutageCount, loading: submitLoading } =
    useManagedMutation(SUBMIT_OUTAGE_COUNT, {
      globalErrorHandling: () => ({
        displayAs: 'modal',
        message: 'Could not submit the outage count due to an error',
        allowRetries: true,
      }),
    });

  const requestToAddItem = useCallback(
    async (sku: string) => {
      if (outageCountItems.find(_ => _.sku === sku)) {
        // TODO: Toast style to have bottom margin on the outage list screen
        toastService.showInfoToast('Item is already part of the outage count');
        return;
      }

      let responseData: ItemLookupBySkuQuery | undefined;

      try {
        responseData = (await getItemBySku({ variables: { sku, storeNumber } }))
          .data;
      } catch (error) {
        if (isApolloNoResultsError(error)) {
          throw new NoResultsError(`Item with sku ${sku} was not found`, error);
        }

        throw error;
      }

      const item = responseData?.itemBySku;
      if (!item) {
        // This should not be a valid case, rather the types should be made stricter on the back-end.
        toastService.showInfoToast(
          'Received empty response from server. This should not happen.',
        );
        return;
      }

      if (item.backStockSlots?.length && !(await askForConfirmation(item))) {
        return;
      }

      setOutageCountItems(currentItems => [item, ...currentItems]);
      navigate('Item List');
    },
    [outageCountItems, getItemBySku, askForConfirmation, navigate, storeNumber],
  );

  const removeItem = useCallback((sku: string) => {
    setOutageCountItems(currentItems =>
      currentItems.filter(item => item.sku !== sku),
    );
  }, []);

  const submit = useCallback(async () => {
    await submitOutageCount({
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
        isVisible={confirmationRequested}
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
