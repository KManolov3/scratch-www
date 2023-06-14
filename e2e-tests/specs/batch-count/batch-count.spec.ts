import { TestDataInput } from '../../__generated__/graphql.ts';
import { BatchCountController } from '../../controllers/batch-count-controller.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';

const testData = new TestDataController();

describe('Batch Count', () => {
  afterEach(async () => {
    await driver.reloadSession();
    await testData.clearData();
  });

  it('should be successfully completed', async () => {
    const items: TestDataInput['items'] = [
      {
        partDesc: 'Mobil 1 5W-30 Motor Oil',
        sku: '10069908',
        retailPrice: 36.99,
        mfrPartNum: '44899',
        onHand: 10,
        planograms: [
          { planogramId: '35899', seqNum: 44 },
          { planogramId: '12456', seqNum: 22 },
        ],
        backStockSlots: [
          { slotId: 47457, qty: 7 },
          { slotId: 87802, qty: 3 },
        ],
      },
      {
        partDesc: 'Beam Wiper Blade',
        sku: '5070221',
        retailPrice: 22.99,
        mfrPartNum: '18-260',
        onHand: 15,
        planograms: [
          { planogramId: '57211', seqNum: 43 },
          { planogramId: '23425', seqNum: 56 },
        ],
        backStockSlots: [
          { slotId: 47457, qty: 8 },
          { slotId: 87802, qty: 3 },
        ],
      },
    ];

    await testData.setData({
      // storeNumber must be exactly '0363' because for now it is hardcoded in the app
      storeNumber: '0363',
      items,
    });

    const batchCount = new BatchCountController();
    const batchCountData = [
      { item: items[0], newQuantity: 11 },
      { item: items[1], newQuantity: 14 },
    ];

    await batchCount.completeBatchCount(batchCountData);
  });
});
