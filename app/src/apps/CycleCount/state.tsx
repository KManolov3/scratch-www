import { useQuery } from '@apollo/client';
import { useCurrentSessionInfo } from '@services/Auth';
import { ReactNode, createContext, useContext, useMemo } from 'react';
import { gql } from 'src/__generated__';
import { CycleCountContextQuery } from 'src/__generated__/graphql';

interface ContextValue {
  cycleCounts: CycleCountContextQuery['cycleCounts'];
  loading: boolean;
  error: unknown;
}

const Context = createContext<ContextValue | undefined>(undefined);

const QUERY = gql(`
  query CycleCountContext($storeNumber: String!) {
    cycleCounts(storeNumber: $storeNumber) {
      storeNumber
      cycleCountType

      ...CycleCountCardFragment

      items {
        sku
        mfrPartNum
        partDesc
        retailPrice

        planograms {
          seqNum
          planogramId
          description
        }
      }
    }
  }
`);

export function CycleCountStateProvider({ children }: { children: ReactNode }) {
  const { storeNumber } = useCurrentSessionInfo();
  const { data, loading, error } = useQuery(QUERY, {
    variables: { storeNumber },
  });

  const value = useMemo(
    () => ({ cycleCounts: data?.cycleCounts, loading, error }),
    [data, loading, error],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCycleCountState() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      'Cannot use `useCycleCountContext` without <CycleCountContextProvider>',
    );
  }

  return context;
}
