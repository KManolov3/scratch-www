import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { ItemDetails } from 'src/types/ItemLookup';
import { ApplicationName } from '@services/LaunchDarkly';

interface ContextValue {
  selectedItem?: ItemDetails;
  setSlecetedItem(item: ItemDetails | undefined): void;
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
  const [selectedItem, setSlecetedItem] = useState<ItemDetails>();

  const value = useMemo(
    () => ({ selectedItem, setSlecetedItem, applicationName }),
    [applicationName, selectedItem],
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
