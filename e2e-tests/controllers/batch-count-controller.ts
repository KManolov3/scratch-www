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

  async searchForSku(sku: string) {
    await waitAndClick(this.pages.homePage.searchForSkuInput);
    await setValue(this.pages.homePage.searchForSkuInput, sku);
    await driver.sendKeyEvent(Enter);
    await waitFor(this.pages.itemLookupPage.sku);
  }

  async expectProductInfo(product: Product) {
    await expectElementText(
      this.pages.itemLookupPage.productName,
      product.productName
    );

    await expectElementText(
      this.pages.itemLookupPage.partNumber,
      product.partNumber
    );
    await expectElementText(this.pages.itemLookupPage.sku, product.sku);

    await expectElementText(this.pages.itemLookupPage.price, product.price);

    await expectElementText(
      this.pages.itemLookupPage.currentQuantity,
      `${product.currentQuantity}`
    );

    await expectElementText(
      this.pages.itemLookupPage.backstockQuantity,
      `${product.backstockQuantity}`
    );

    await expectElementText(
      this.pages.itemLookupPage.planogramInfoByRowNumber(1).locationId,
      product.planogramLocations[0].locationId
    );

    await expectElementText(
      this.pages.itemLookupPage.planogramInfoByRowNumber(1).seqNumber,
      product.planogramLocations[0].sequenceNumber
    );

    await waitAndClick(this.pages.itemLookupPage.slotLocationsButton);

    await expectElementText(
      this.pages.itemLookupPage.slotInfoByRowNumber(1).locationId,
      product.slotLocations[0].locationId
    );

    await expectElementText(
      this.pages.itemLookupPage.slotInfoByRowNumber(1).quantity,
      `${product.slotLocations[0].quantity}`
    );
  }
}
