import {
  BatchCountController,
  BatchCountData,
} from '../../controllers/batch-count-controller.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import {
  expectElementText,
  waitAndClick,
  waitFor,
} from '../../methods/helpers.ts';
import { buildItems, testStoreNumber } from '../../test-data/test-data.ts';

const batchCount = new BatchCountController();
const testData = new TestDataController();

describe('Batch Count', () => {
  beforeEach(async () => {
    await waitFor(batchCount.batchCountPages.homePage.searchForSkuInput, 15000);
  });

  afterEach(async () => {
    await driver.reloadSession();
    await testData.clearData();
  });

  it('should be successfully completed', async () => {
    const items = buildItems({
      overrides: [
        { onHand: 10, retailPrice: 35.0 },
        { onHand: 15, retailPrice: 25.0 },
      ],
    });

    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    const batchCountData: BatchCountData[] = [
      { item: items[0], newQuantity: 11, bookmarked: false },
      { item: items[1], newQuantity: 14, bookmarked: true },
    ];

    const batchCountDataOnSummary: BatchCountData[] = [
      { item: items[0], newQuantity: 12, bookmarked: false },
    ];

    await batchCount.addItemsAndSetQuantity(batchCountData);

    await waitAndClick(
      batchCount.batchCountPages.batchCountListPage.createSummaryButton
    );

    await batchCount.editItemsOnSummary(batchCountDataOnSummary);

    await waitAndClick(
      batchCount.batchCountPages.summaryPage.approveCountButton
    );

    await batchCount.expectShrinkageOverageValues({
      expectedNetDollars: '$45.00', // $70.00 - $25.00
      expectedShrinkage: '-$25.00', // 1*$25.00,
      expectedOverage: '$70.00', // 2*$35.00
    });

    await batchCount.approveBatchCount();
  });

  it('should be successfully completed by Fast Accept', async () => {
    const items = buildItems({ overrides: [{ onHand: 9, retailPrice: 25.0 }] });

    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    const batchCountData = [
      { item: items[0], newQuantity: 11, bookmarked: false },
    ];

    await batchCount.addItemsAndSetQuantity(batchCountData);

    await waitAndClick(
      batchCount.batchCountPages.batchCountListPage.fastAcceptButton
    );

    await batchCount.expectShrinkageOverageValues({
      expectedNetDollars: '$50.00', // 2*$25.00
      expectedShrinkage: '$0.00',
      expectedOverage: '$50.00', // 2*$25.00
    });
  });

  it('should be able to remove an item on list screen and on summary screen', async () => {
    const thirdItem = [
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

    const items = buildItems({ additionalItems: thirdItem });

    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    for (const [index, item] of items.entries()) {
      await batchCount.manuallyEnterSku(item.sku);

      if (index !== items.length - 1) {
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

  it('should set new quantity to 0 when SKU is manually entered', async () => {
    const items = buildItems();

    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    await batchCount.manuallyEnterSku(items[0].sku);

    await expectElementText(
      batchCount.batchCountPages.batchCountListPage.productDetails(
        items[0].mfrPartNum
      ).newQtyInput,
      '0'
    );
  });

  it('new quantity should starts at 0 when front tag is scanned', async () => {
    const items = buildItems();

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
    const items = buildItems();

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
