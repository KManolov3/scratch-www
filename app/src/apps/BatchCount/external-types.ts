import {
  CycleCountDetail,
  CycleCountList,
  KafkaCycleCount,
} from 'src/__generated__/graphql';

export type BatchCountItemGql = Required<
  Pick<CycleCountDetail, 'sku' | 'onhandAtCountQty' | 'freezeQty'>
>;

export type BatchCountGql = Required<
  Pick<
    KafkaCycleCount,
    | 'action'
    | 'status'
    | 'createDate'
    | 'dueDate'
    | 'cycleCountName'
    | 'cycleCountType'
  >
> & {
  items: BatchCountItemGql[];
};

export type SubmitBatchCountGql = Required<
  Pick<CycleCountList, 'storeNumber'>
> & {
  cycleCounts: BatchCountGql[];
};
