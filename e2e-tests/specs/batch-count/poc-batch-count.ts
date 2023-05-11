/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BatchCountController } from '../../controllers/batch-count-controller.ts';
import { TestDataController } from '../../controllers/test-data-controller.ts';
import { expectElementText, waitAndClick } from '../../methods/helpers.ts';
import { Product } from '../../models/product-model.ts';

const testData = new TestDataController();

describe('Batch Count', () => {
  it('manually entering a SKU should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
    const products: Product[] = [
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
      items: products,
    });

    const batchCount = new BatchCountController(products);

    for (const [index, product] of batchCount.products.entries()) {
      await batchCount.searchForSku(product);
      await expectElementText(
        batchCount.pages.itemLookupPage.productName,
        product.partDesc
      );

      await expectElementText(
        batchCount.pages.itemLookupPage.partNumber,
        product.mfrPartNum
      );
      await expectElementText(batchCount.pages.itemLookupPage.sku, product.sku);

      await expectElementText(
        batchCount.pages.itemLookupPage.price,
        `$${product.retailPrice}`
      );

      await expectElementText(
        batchCount.pages.itemLookupPage.currentQuantity,
        `${product.onHand}`
      );

      if (index !== batchCount.products.length - 1) {
        await waitAndClick(batchCount.pages.itemLookupPage.backButton);
        await waitAndClick(batchCount.pages.homePage.clearSearchField);
      }
    }
  });
});
