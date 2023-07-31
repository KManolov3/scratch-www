import { expectElementText, waitFor } from '../../methods/helpers.ts';
import { TestDataInput } from '../../__generated__/graphql.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import {
  ItemLookupController,
  PrintData,
} from '../../controllers/item-lookup-controller.ts';
import { buildItems, testStoreNumber } from '../../test-data/test-data.ts';

const testData = new TestDataController();
const itemLookup = new ItemLookupController();

const items: TestDataInput['items'] = buildItems();

describe('Item Lookup', () => {
  beforeEach(async () => {
    await waitFor(itemLookup.itemLookupPages.homePage.searchForSkuInput, 15000);
  });

  afterEach(async () => {
    await driver.reloadSession();
    await testData.clearData();
  });

  it('manually entering a SKU should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    for (const [index, product] of items.entries()) {
      await itemLookup.manuallyEnterSku(product.sku);
      await itemLookup.expectProductInfo(product);

      if (index !== items.length - 1) {
        await driver.back();
      }
    }
  });

  it('price discrepancy modal should be displayed when scanned front tag price is different from the system price', async () => {
    const itemWithPriceDiscrepancy = buildItems({
      overrides: [
        {
          sku: '25370367',
          retailPrice: 36.99,
          planograms: [
            { planogramId: 'F-22352355', seqNum: 23 },
            { planogramId: 'F-78838679', seqNum: 24 },
            { planogramId: 'F-46478421', seqNum: 25 },
          ],
        },
      ],
    })[0];

    await testData.setData({
      storeNumber: testStoreNumber,
      items: [itemWithPriceDiscrepancy],
    });

    const scannedPrice = itemLookup.priceWithoutDecimalSeparator(157.88);

    const barcodeWithPriceDiscrepancy = `99${itemWithPriceDiscrepancy.sku}${scannedPrice}`;

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
      `$${itemWithPriceDiscrepancy.retailPrice.toFixed(2)}`
    );

    const printData: PrintData[] = [
      {
        planogram: itemWithPriceDiscrepancy.planograms[0].planogramId,
        printTag: true,
        tagsQuantity: 5,
      },
      {
        planogram: itemWithPriceDiscrepancy.planograms[1].planogramId,
        printTag: true,
        tagsQuantity: 3,
      },
      {
        planogram: itemWithPriceDiscrepancy.planograms[2].planogramId,
        printTag: false,
      },
    ];

    await itemLookup.printFrontTag(printData, 'Counter Printer 2');
  });

  it('scanning item SKU should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    itemLookup.sendBarcodeScanIntent(items[0].sku);
    await itemLookup.expectProductInfo(items[0]);
  });

  it('scanning item SKU and price should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    const price = itemLookup.priceWithoutDecimalSeparator(items[0].retailPrice);

    const scanData = `${items[0].sku},${price}`;

    itemLookup.sendBarcodeScanIntent(scanData);
    await itemLookup.expectProductInfo(items[0]);
  });

  it('scanning item UPC should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    itemLookup.sendBarcodeScanIntent(items[0].upc);
    await itemLookup.expectProductInfo(items[0]);
  });

  it('scanning item front tag should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    const price = itemLookup.priceWithoutDecimalSeparator(items[0].retailPrice);

    const frontTag = `99${items[0].sku}${price}`;

    itemLookup.sendBarcodeScanIntent(frontTag);
    await itemLookup.expectProductInfo(items[0]);
  });

  it('should display No Results Found when searching for missing SKU', async () => {
    const itemWithMissingSku = buildItems({ overrides: [{ sku: '12345' }] })[0];

    await testData.setData({
      storeNumber: testStoreNumber,
      items: [],
      missingItemSkus: [itemWithMissingSku.sku],
    });

    await itemLookup.manuallyEnterSku(itemWithMissingSku.sku);

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

    await itemLookup.manuallyEnterSku(itemWithMissingSku[0].sku);

    await expect(
      $(itemLookup.commonPages.homePage.noResultsFound)
    ).toBeDisplayed();

    await expect(
      $(itemLookup.commonPages.homePage.trySearchingForAnotherSKU)
    ).toBeDisplayed();
  });
});
