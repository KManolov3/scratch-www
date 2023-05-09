import { useMemo } from 'react';
import { DocumentType, gql } from 'src/__generated__';
import { List } from '@components/List';

export const BACKSTOCK_SLOT_FIELDS = gql(`
  fragment BackstockSlotFields on Item {
    backStockSlots {
      slotId
      qty
    }
  }
`);
export type BackstockSlotsInfo = NonNullable<
  DocumentType<typeof BACKSTOCK_SLOT_FIELDS>
>;
type BackstockSlot = NonNullable<
  NonNullable<
    DocumentType<typeof BACKSTOCK_SLOT_FIELDS>['backStockSlots']
  >[number]
>;
type BackstockSlotKeys = keyof BackstockSlot;

export interface BackstockSlotListProps {
  // TODO: define fragment
  backstockSlots: BackstockSlot[];
}

export function BackstockSlotList({ backstockSlots }: BackstockSlotListProps) {
  const labelInfo = useMemo<{ label: string; key: BackstockSlotKeys }[]>(
    () => [
      {
        label: 'Slot Location',
        // TODO: Check if slotId is the field that should be used here -
        // can cross-reference with the code of BlueFletch apps
        key: 'slotId',
      },
      {
        label: 'Qty',
        key: 'qty',
      },
    ],
    [],
  );
  return <List labelInfo={labelInfo} data={backstockSlots} />;
}
