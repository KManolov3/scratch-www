import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';
import { PlanogramsInfo } from '@components/Locations/PlanogramList';

export type GlobalStateItemDetails = ItemDetailsInfo &
  PlanogramsInfo &
  BackstockSlotsInfo;

interface ContextValue {
  selectedItem?: GlobalStateItemDetails;
  setSelectedItem(item: GlobalStateItemDetails | undefined): void;
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
  const [selectedItem, setSelectedItem] = useState<GlobalStateItemDetails>();

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
