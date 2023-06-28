import { useMemo } from 'react';
import { DocumentType, gql } from 'src/__generated__';
import { ListWithHeaders } from '@components/ListWithHeaders';

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
  backstockSlots: BackstockSlot[];
}

export function BackstockSlotList({ backstockSlots }: BackstockSlotListProps) {
  const listItemInfo = useMemo(
    () => [
      {
        label: 'Slot Location',
        getValue: (item: BackstockSlot) => item.slotId ?? 'undefined',
      },
      {
        label: 'Qty',
        getValue: (item: BackstockSlot) => item.qty ?? -1,
      },
    ],
    [],
  );
  return <ListWithHeaders itemInfo={listItemInfo} data={backstockSlots} />;
}
