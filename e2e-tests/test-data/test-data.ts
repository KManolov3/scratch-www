import { TestItemInput } from '../__generated__/graphql.ts';

// storeNumber must be the same in the input field in Blue Fletch Launcher
export const testStoreNumber = '0363';

export function buildItems(
  {
    overrides = [],
    additionalItems = [],
  }: {
    overrides?: Partial<TestItemInput>[];
    additionalItems?: TestItemInput[];
  } = {
    overrides: [],
    additionalItems: [],
  }
): TestItemInput[] {
  const firstItem: TestItemInput = {
    partDesc: 'Mobil 1 5W-30 Motor Oil',
    sku: '10069908',
    retailPrice: 36.99,
    mfrPartNum: '44899',
    onHand: 10,
    upc: '887220132090',
    planograms: [
      { planogramId: '35899', seqNum: 44 },
      { planogramId: '12456', seqNum: 22 },
    ],
    backStockSlots: [
      { slotId: 47457, qty: 7 },
      { slotId: 87802, qty: 3 },
    ],
  };
  const secondItem: TestItemInput = {
    partDesc: 'Beam Wiper Blade',
    sku: '5070221',
    retailPrice: 22.99,
    mfrPartNum: '18-260',
    onHand: 15,
    upc: '892331562191',
    planograms: [
      { planogramId: '57211', seqNum: 43 },
      { planogramId: '23425', seqNum: 56 },
    ],
    backStockSlots: [
      { slotId: 47457, qty: 8 },
      { slotId: 87802, qty: 3 },
    ],
  };

  return [
    { ...firstItem, ...overrides[0] },
    { ...secondItem, ...overrides[1] },
    ...additionalItems,
  ];
}
