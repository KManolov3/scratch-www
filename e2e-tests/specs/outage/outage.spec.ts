import { TestDataInput } from '../../__generated__/graphql.ts';
import { OutageController } from '../../controllers/outage-controller.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import { waitFor } from '../../methods/helpers.ts';
import { testStoreNumber } from '../../test-data/test-data.ts';

const testData = new TestDataController();
const outageCount = new OutageController();

const items: TestDataInput['items'] = [
  {
    partDesc: 'Mobil 1 5W-30 Motor Oil',
    sku: '10069908',
    retailPrice: 36.99,
    mfrPartNum: '44899',
    onHand: 10,
    backStockSlots: [],
  },
  {
    partDesc: 'Beam Wiper Blade',
    sku: '5070221',
    retailPrice: 22.99,
    mfrPartNum: '18-260',
    onHand: 15,
    backStockSlots: [
      { slotId: 47216, qty: 6 },
      { slotId: 23343, qty: 7 },
    ],
  },
];

describe('Outage Count', () => {
  beforeEach(async () => {
    await waitFor(outageCount.outagePages.homePage.searchForSkuInput, 15000);
  });

  afterEach(async () => {
    await driver.reloadSession();
    await testData.clearData();
  });

  it('should be successfully completed', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items: items,
    });

    await outageCount.completeOutageCount(items);
  });

  it('should be able to remove an item from outage list', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items: items,
    });

    await outageCount.addItemsToOutageList(items);
    await outageCount.removeItem(items[0]);
  });

  it('should be able to add items by scanning front tag', async () => {
    await testData.setData({
      storeNumber: testStoreNumber,
      items,
    });

    for (const item of items) {
      const price = outageCount.priceWithoutDecimalSeparator(item.retailPrice);
      const frontTag = `99${item.sku}${price}`;

      outageCount.sendBarcodeScanIntent(frontTag);
      await outageCount.expectProductInfo(item);
    }
  });
});
