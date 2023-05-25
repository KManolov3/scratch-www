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

export interface BackstockSlotListProps {
  // TODO: define fragment
  backstockSlots: BackstockSlot[];
}

export function BackstockSlotList({ backstockSlots }: BackstockSlotListProps) {
  const listItemInfo = useMemo(
    () => [
      {
        label: 'Slot Location',
        // TODO: Check if slotId is the field that should be used here -
        // can cross-reference with the code of BlueFletch apps
        getValue: (item: BackstockSlot) => item.slotId ?? 'undefined',
      },
      {
        label: 'Qty',
        getValue: (item: BackstockSlot) => item.qty ?? -1,
      },
    ],
    [],
  );
  return <List itemInfo={listItemInfo} data={backstockSlots} />;
}
