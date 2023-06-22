import { ApplicationName } from '@services/LaunchDarkly';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { ItemDetails } from 'src/types/ItemLookup';

interface ContextValue {
  selectedItem?: ItemDetails;
  setItem(item: ItemDetails | undefined): void;
  applicationName: ApplicationName;
}

const Context = createContext<ContextValue | undefined>(undefined);

export function GlobalStateProvider({
  children,
  applicationName,
}: {
  children: ReactNode;
  applicationName: ApplicationName;
}) {
  const [item, setItem] = useState<ItemDetails>();

  const value = useMemo(
    () => ({ selectedItem: item, setItem, applicationName }),
    [applicationName, item],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useGlobalState() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      'Cannot use `useGlobalState` without <GlobalStateProvider>',
    );
  }

  return context;
}
