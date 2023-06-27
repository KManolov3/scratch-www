import { DocumentType, gql } from 'src/__generated__';
import { ListWithHeaders } from '@components/ListWithHeaders';
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
        label: 'POG',
        getValue: (item: Planogram) => item.planogramId ?? 'undefined',
      },
      {
        label: 'POG Seq #',
        getValue: (item: Planogram) => item.seqNum ?? 'undefined',
      },
    ],
    [],
  );
  return <ListWithHeaders itemInfo={listItemInfo} data={planograms} />;
}
