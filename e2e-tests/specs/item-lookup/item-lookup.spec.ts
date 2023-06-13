import {
  expectElementText,
  waitAndClick,
  waitFor,
} from '../../methods/helpers.ts';
import { TestDataInput } from '../../__generated__/graphql.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import {
  ItemLookupController,
  PrintData,
} from '../../controllers/item-lookup-controller.ts';

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
    ];

    await testData.setData({
      // storeNumber must be exactly '0363' because for now it is hardcoded in the app
      storeNumber: '0363',
      items,
    });

    for (const [index, product] of items.entries()) {
      await itemLookup.searchForSku(product);
      await itemLookup.expectProductInfo(product);

      if (index !== items.length - 1) {
        await waitAndClick(
          itemLookup.itemLookupPages.itemDetailsPage.backButton
        );
      }
    }
  });

  it.only('price discrepancy modal should be displayed when scanned front tag price is different from the system price', async () => {
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
      // storeNumber must be exactly '0363' because for now it is hardcoded in the app
      storeNumber: '0363',
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

    await itemLookup.printFrontTag(printData, 'Portable');
  });
});
