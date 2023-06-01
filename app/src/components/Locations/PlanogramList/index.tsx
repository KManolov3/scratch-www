import { DocumentType, gql } from 'src/__generated__';
import { List } from '@components/List';
import { useMemo } from 'react';

export const PLANOGRAM_FIELDS = gql(`
  fragment PlanogramFields on Item {
    planograms {
      planogramId
      seqNum
    }
  }
`);
export type PlanogramsInfo = NonNullable<DocumentType<typeof PLANOGRAM_FIELDS>>;
type Planogram = NonNullable<
  NonNullable<DocumentType<typeof PLANOGRAM_FIELDS>['planograms']>[number]
>;

export interface PlanogramListProps {
  planograms: Planogram[];
}

export function PlanogramList({ planograms }: PlanogramListProps) {
  const listItemInfo = useMemo(
    () => [
      {
        label: 'POG Location',
        getValue: (item: Planogram) => item.planogramId ?? 'undefined',
      },
      {
        label: 'POG Seq #',
        getValue: (item: Planogram) => item.seqNum ?? 'undefined',
      },
    ],
    [],
  );
  return <List itemInfo={listItemInfo} data={planograms} />;
}
