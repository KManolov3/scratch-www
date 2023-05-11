import { BatchCountController } from '../../controllers/batch-count-controller.ts';
import { waitAndClick, waitFor } from '../../methods/helpers.ts';
import { Product } from '../../models/product-model.ts';

const products: Product[] = [
  {
    productName: 'Chicken',
    partNumber: 'mytry',
    sku: '30260731',
    price: '$84.25',
    currentQuantity: 3,
    backstockQuantity: 33,
    newQuantity: 1,
    planogramLocations: [
      { locationId: '98197', sequenceNumber: '-90' },
      { locationId: '25343', sequenceNumber: '22' },
    ],
    slotLocations: [
      { locationId: '15793675', quantity: 30 },
      { locationId: '62357193', quantity: 3 },
    ],
  },
  {
    productName: 'Mouse',
    partNumber: 'dsdr4',
    sku: '33297743',
    price: '$33.29',
    currentQuantity: 2,
    backstockQuantity: 24,
    newQuantity: 1,
    planogramLocations: [
      { locationId: '18567', sequenceNumber: '-39' },
      { locationId: '63240', sequenceNumber: '30' },
    ],
    slotLocations: [
      { locationId: '20658309', quantity: 5 },
      { locationId: '73724642', quantity: 19 },
    ],
  },
];

const batchCount = new BatchCountController(products);

describe('Batch Count', () => {
  beforeEach(async () => {
    await waitFor(batchCount.pages.homePage.headerText, 10000);
  });

  it('manually entering a SKU should provide: description, P/N, SKU, price, current and backstock quantity', async () => {
    // for (const product of batchCount.products) {
    //   await batchCount.searchForSku('asd');
    //   await batchCount.expectProductInfo(product);
    //   await waitAndClick(batchCount.pages.itemLookupPage.backButton);
    // }

    await batchCount.searchForSku('asd');
    await batchCount.expectProductInfo(batchCount.products[0]);

    await waitAndClick(batchCount.pages.itemLookupPage.backButton);
    await waitAndClick(batchCount.pages.homePage.clearSearchField);

    await batchCount.searchForSku('123');
    await batchCount.expectProductInfo(batchCount.products[1]);
  });
});
