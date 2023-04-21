import { useQuery } from '@apollo/client';
import { ReactNode, createContext, useContext } from 'react';
import { gql } from 'src/__generated__';
import { CycleCountContextQuery } from 'src/__generated__/graphql';

interface ContextValue {
  cycleCounts: CycleCountContextQuery['cycleCounts'];
  loading: boolean;
  error: unknown;
}

const Context = createContext<ContextValue | undefined>(undefined);

const QUERY = gql(`
  query CycleCountContext {
    cycleCounts(storeNumber: "0363") {
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

// export class CycleCountController {
//
// }

export function CycleCountStateProvider({ children }: { children: ReactNode }) {
  const { data, loading, error } = useQuery(QUERY);

  return (
    <Context.Provider
      value={{ cycleCounts: data?.cycleCounts, loading, error }}>
      {children}
    </Context.Provider>
  );
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
