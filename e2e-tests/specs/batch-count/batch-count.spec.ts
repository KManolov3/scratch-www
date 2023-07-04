import { TestDataInput } from '../../__generated__/graphql.ts';
import { BatchCountController } from '../../controllers/batch-count-controller.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import {
  expectElementText,
  waitAndClick,
  waitFor,
} from '../../methods/helpers.ts';
import { testStoreNumber } from '../../test-data/test-data.ts';

const batchCount = new BatchCountController();
const testData = new TestDataController();

const items: TestDataInput['items'] = [
  {
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
  },
  {
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
  },
];

describe('Batch Count', () => {
  beforeEach(async () => {
    await waitFor(batchCount.batchCountPages.homePage.searchForSkuInput, 10000);
  });

  afterEach(async () => {
    await driver.reloadSession();
    await testData.clearData();
  });

  it('should be successfully completed', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    const batchCountData = [
      { item: items[0], newQuantity: 11, bookmarked: false },
      { item: items[1], newQuantity: 14, bookmarked: true },
    ];

    const batchCountDataOnSummary = [
      { item: items[0], newQuantity: 12, bookmarked: false },
    ];

    await batchCount.completeBatchCount(
      batchCountData,
      false,
      batchCountDataOnSummary
    );
  });

  it('should be successfully completed by Fast Accept', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    const batchCountData = [
      { item: items[0], newQuantity: 11, bookmarked: false },
    ];

    await batchCount.completeBatchCount(batchCountData, true);
  });

  it('should be able to remove an item from list and on summary', async () => {
    const threeItems = [
      ...items,
      {
        partDesc: 'Mobile 1 Economy 0W-20',
        sku: '10275177',
        retailPrice: 36.99,
        mfrPartNum: '44967',
        onHand: 25,
        upc: '071924449671',
        planograms: [
          { planogramId: '36221', seqNum: 12 },
          { planogramId: '45794', seqNum: 13 },
        ],
        backStockSlots: [
          { slotId: 79543, qty: 6 },
          { slotId: 22893, qty: 7 },
        ],
      },
    ];

    await testData.setData({
      storeNumber: testStoreNumber,
      items: threeItems,
    });

    for (const [index, item] of threeItems.entries()) {
      await batchCount.searchForSku(item.sku);

      if (index !== threeItems.length - 1) {
        await driver.back();
      }
    }

    await batchCount.removeItem(items[0]);

    await expect(
      $(
        batchCount.batchCountPages.batchCountListPage.productDetails(
          items[0].mfrPartNum
        ).partNumber
      )
    ).not.toBeDisplayed();

    await waitAndClick(
      batchCount.batchCountPages.batchCountListPage.createSummaryButton
    );

    await waitFor(batchCount.batchCountPages.summaryPage.approveCountButton);

    await batchCount.removeItem(items[1]);

    await expect(
      $(
        batchCount.batchCountPages.batchCountListPage.productDetails(
          items[1].mfrPartNum
        ).partNumber
      )
    ).not.toBeDisplayed();
  });

  it('new quantity should starts at 0 when SKU is manually entered', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    await batchCount.searchForSku(items[0].sku);

    await expectElementText(
      batchCount.batchCountPages.batchCountListPage.productDetails(
        items[0].mfrPartNum
      ).newQtyInput,
      '0'
    );
  });

  it('new quantity should starts at 0 when front tag is scanned', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    const price = batchCount.priceWithoutDecimalSeparator(items[0].retailPrice);

    const frontTag = `99${items[0].sku}${price}`;

    batchCount.sendBarcodeScanIntent(frontTag);

    await expectElementText(
      batchCount.batchCountPages.batchCountListPage.productDetails(
        items[0].mfrPartNum
      ).newQtyInput,
      '0'
    );
  });

  it('new quantity should starts at 1 when UPC is scanned and increment if scanned again', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    batchCount.sendBarcodeScanIntent(items[0].upc);

    await expectElementText(
      batchCount.batchCountPages.batchCountListPage.productDetails(
        items[0].mfrPartNum
      ).newQtyInput,
      '1'
    );

    batchCount.sendBarcodeScanIntent(items[0].upc);

    // the pause here is to wait the quantity to increment before expecting it
    await driver.pause(500);

    await expectElementText(
      batchCount.batchCountPages.batchCountListPage.productDetails(
        items[0].mfrPartNum
      ).newQtyInput,
      '2'
    );
  });
});
