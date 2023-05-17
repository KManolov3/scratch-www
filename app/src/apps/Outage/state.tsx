import { useQuery } from '@apollo/client';
import { ReactNode, createContext, useContext, useMemo } from 'react';
import { DocumentType, gql } from 'src/__generated__';

// TODO: Replace storeNumber with an appropriate value
// instead of using a hardcoded one once we have access to it
const QUERY = gql(`#graphql
  query outageBatch {
    outageCounts(storeNumber: "0363") {
      cycleCountId
      cycleCountName
      cycleCountType
      groupId
      groupName
      items {
        ...OutageItemCardFragment
      }
    }
  }
`);

type OutageBatch = NonNullable<
  DocumentType<typeof QUERY>['outageCounts']
>[number];

interface ContextValue {
  outageBatch: OutageBatch | undefined;
  loading: boolean;
  error: unknown;
}

const Context = createContext<ContextValue | undefined>(undefined);

export function OutageBatchStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data, loading, error } = useQuery(QUERY);

  const value = useMemo(
    () => ({ outageBatch: data?.outageCounts?.[0], loading, error }),
    [data, loading, error],
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
