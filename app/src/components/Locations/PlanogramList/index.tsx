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
type PlanogramKeys = keyof Planogram;

export interface PlanogramListProps {
  planograms: Planogram[];
}

export function PlanogramList({ planograms }: PlanogramListProps) {
  const labelInfo = useMemo<{ label: string; key: PlanogramKeys }[]>(
    () => [
      {
        label: 'POG Location',
        key: 'planogramId',
      },
      {
        label: 'POG Seq #',
        key: 'seqNum',
      },
    ],
    [],
  );
  return <List labelInfo={labelInfo} data={planograms} />;
}
