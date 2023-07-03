import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { ItemDetails } from 'src/types/ItemLookup';

interface ContextValue {
  selectedItem?: ItemDetails;
  setSelectedItem(item: ItemDetails | undefined): void;
  applicationName: string;
  activityName: string;
}

const Context = createContext<ContextValue | undefined>(undefined);

export function GlobalStateProvider({
  children,
  activityName,
  applicationName,
}: {
  children: ReactNode;
  activityName: string;
  applicationName: string;
}) {
  const [selectedItem, setSelectedItem] = useState<ItemDetails>();

  const value = useMemo(
    () => ({
      selectedItem,
      setSelectedItem,
      applicationName,
      activityName,
    }),
    [activityName, applicationName, selectedItem],
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
