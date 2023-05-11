import {
  Enter,
  expectElementText,
  setValue,
  waitAndClick,
} from '../methods/helpers.ts';
import { Product } from '../models/product-model.ts';
import { BatchCountPages } from './page-access.ts';
import { waitFor } from '../methods/helpers.ts';
import { BatchCountHomePage } from '../page-objects/batch-count/home-page.ts';
import { BatchCountItemLookupPage } from '../page-objects/batch-count/item-lookup-page.ts';

export class BatchCountController {
  products: Product[];
  pages: BatchCountPages;

  constructor(model: Product[]) {
    this.products = model;
    this.pages = {
      homePage: new BatchCountHomePage(),
      itemLookupPage: new BatchCountItemLookupPage(),
    };
  }

  async searchForSku(product: Product) {
    await waitFor(this.pages.homePage.headerText, 10000);
    await waitAndClick(this.pages.homePage.searchForSkuInput);
    await setValue(this.pages.homePage.searchForSkuInput, product.sku);
    await driver.sendKeyEvent(Enter);
    await waitFor(this.pages.itemLookupPage.sku);
  }

  async expectProductInfo(product: Product) {
    await expectElementText(
      this.pages.itemLookupPage.productName,
      product.partDesc
    );

    await expectElementText(
      this.pages.itemLookupPage.partNumber,
      product.mfrPartNum
    );
    await expectElementText(this.pages.itemLookupPage.sku, product.sku);

    await expectElementText(
      this.pages.itemLookupPage.price,
      `$${product.retailPrice}`
    );

    await expectElementText(
      this.pages.itemLookupPage.currentQuantity,
      `${product.onHand}`
    );

    await expectElementText(
      this.pages.itemLookupPage.planogramInfoByRowNumber(1).locationId,
      product.planograms[0].planogramId
    );

    await expectElementText(
      this.pages.itemLookupPage.planogramInfoByRowNumber(1).seqNumber,
      `${product.planograms[0].seqNum}`
    );

    await waitAndClick(this.pages.itemLookupPage.slotLocationsButton);

    await expectElementText(
      this.pages.itemLookupPage.slotInfoByRowNumber(1).locationId,
      `${product.backStockSlots[0].slotId}`
    );

    await expectElementText(
      this.pages.itemLookupPage.slotInfoByRowNumber(1).quantity,
      `${product.backStockSlots[0].qty}`
    );
  }
}
