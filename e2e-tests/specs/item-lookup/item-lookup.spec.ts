import { expectElementText, waitFor } from '../../methods/helpers.ts';
import { TestDataInput } from '../../__generated__/graphql.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import {
  ItemLookupController,
  PrintData,
} from '../../controllers/item-lookup-controller.ts';
import { testStoreNumber } from '../../test-data/test-data.ts';

const testData = new TestDataController();
const itemLookup = new ItemLookupController();

describe('Item Lookup', () => {
  beforeEach(async () => {
    await waitFor(itemLookup.itemLookupPages.homePage.searchForSkuInput, 10000);
  });

  afterEach(async () => {
    await driver.reloadSession();
    await testData.clearData();
  });

  it('manually entering a SKU should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
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
        sku: '10073342',
        retailPrice: 73.99,
        mfrPartNum: '73682',
        onHand: 10,
        planograms: [
          { planogramId: '36839', seqNum: 21 },
          { planogramId: '43467', seqNum: 25 },
        ],
        backStockSlots: [
          { slotId: 47216, qty: 6 },
          { slotId: 23343, qty: 7 },
        ],
      },
    ];

    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    for (const [index, product] of items.entries()) {
      await itemLookup.searchForSku(product);
      await itemLookup.expectProductInfo(product);

      if (index !== items.length - 1) {
        await driver.back();
      }
    }
  });

  it('price discrepancy modal should be displayed when scanned front tag price is different from the system price', async () => {
    const itemWithPriceDiscrepancy: TestDataInput['items'] = [
      {
        sku: '25370367',
        retailPrice: 36.99,
        planograms: [
          { planogramId: 'F-22352355', seqNum: 23 },
          { planogramId: 'F-78838679', seqNum: 24 },
          { planogramId: 'F-46478421', seqNum: 25 },
        ],
      },
    ];

    await testData.setData({
      storeNumber: testStoreNumber,
      items: itemWithPriceDiscrepancy,
    });

    const scannedPrice = '15788';

    const barcodeWithPriceDiscrepancy = `99${itemWithPriceDiscrepancy[0].sku}${scannedPrice}`;

    itemLookup.sendBarcodeScanIntent(barcodeWithPriceDiscrepancy);

    await waitFor(
      itemLookup.itemLookupPages.itemDetailsPage.priceDiscrepancyModal
        .warningText
    );

    await expectElementText(
      itemLookup.itemLookupPages.itemDetailsPage.priceDiscrepancyModal
        .scannedPrice,
      '$157.88'
    );

    await expectElementText(
      itemLookup.itemLookupPages.itemDetailsPage.priceDiscrepancyModal
        .systemPrice,
      `$${itemWithPriceDiscrepancy[0].retailPrice}`
    );

    const printData: PrintData[] = [
      {
        planogram: itemWithPriceDiscrepancy[0].planograms[0].planogramId,
        printTag: true,
        tagsQuantity: 5,
      },
      {
        planogram: itemWithPriceDiscrepancy[0].planograms[1].planogramId,
        printTag: true,
        tagsQuantity: 3,
      },
      {
        planogram: itemWithPriceDiscrepancy[0].planograms[2].planogramId,
        printTag: false,
      },
    ];

    await itemLookup.printFrontTag(printData, 'Printer Counter 2');
  });

  it('scanning item UPC should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
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
    ];

    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    itemLookup.sendBarcodeScanIntent(items[0].sku);
    await itemLookup.expectProductInfo(items[0]);
  });

  it('should display No Results Found when searching for missing SKU', async () => {
    const itemWithMissingSku: TestDataInput['items'] = [
      {
        sku: '12345',
      },
    ];

    await testData.setData({
      storeNumber: testStoreNumber,
      items: [],
      missingItemSkus: [itemWithMissingSku[0].sku],
    });

    await itemLookup.searchForSku(itemWithMissingSku[0]);

    await expect(
      $(itemLookup.commonPages.homePage.noResultsFound)
    ).toBeDisplayed();

    await expect(
      $(itemLookup.commonPages.homePage.trySearchingForAnotherSKU)
    ).toBeDisplayed();
  });

  it('should display No Results Found when searching for non-numeric SKU', async () => {
    const itemWithMissingSku: TestDataInput['items'] = [
      {
        sku: 'wrong',
      },
    ];

    await itemLookup.searchForSku(itemWithMissingSku[0]);

    await expect(
      $(itemLookup.commonPages.homePage.noResultsFound)
    ).toBeDisplayed();

    await expect(
      $(itemLookup.commonPages.homePage.trySearchingForAnotherSKU)
    ).toBeDisplayed();
  });
});
