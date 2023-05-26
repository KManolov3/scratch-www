import { TestDataInput } from '__generated__/graphql.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import { waitAndClick } from '../../methods/helpers.ts';
import { ItemLookupController } from '../../controllers/item-lookup-controller.ts';

const testData = new TestDataController();

describe('Item Lookup', () => {
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

    const itemLookup = new ItemLookupController();

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
});
