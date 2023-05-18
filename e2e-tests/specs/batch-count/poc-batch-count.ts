import { TestDataInput } from '__generated__/graphql.ts';
import { BatchCountController } from '../../controllers/batch-count-controller.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import { waitAndClick } from '../../methods/helpers.ts';

const testData = new TestDataController();

describe('Batch Count', () => {
  afterEach(async () => {
    await driver.reloadSession();
    await testData.clearData();
  });

  it('manually entering a SKU should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
    const items: TestDataInput['items'] = [
      {
        mfrPartNum: '44899',
        partDesc: 'Mobil 1 5W-30 Motor Oil',
        sku: '10069908',
        retailPrice: 36.99,
        onHand: 73,
      },
      {
        mfrPartNum: '18-260',
        partDesc: 'Beam Wiper Blade',
        sku: '5070221',
        retailPrice: 22.99,
        onHand: 52,
      },
    ];

    await testData.setData({
      // storeNumber must be exactly '0363' because for now it is hardcoded in the app
      storeNumber: '0363',
      items: items,
    });

    const batchCount = new BatchCountController();

    for (const [index, product] of items.entries()) {
      await batchCount.searchForSku(product);
      await batchCount.expectProductInfo(product);

      if (index !== items.length - 1) {
        await waitAndClick(batchCount.pages.itemLookupPage.backButton);
        await waitAndClick(batchCount.pages.homePage.clearSearchField);
      }
    }
  });
});
