import {
  Enter,
  expectElementText,
  setValue,
  waitAndClick,
} from '../methods/helpers.ts';
import { BatchCountPages } from './page-access.ts';
import { waitFor } from '../methods/helpers.ts';
import { BatchCountHomePage } from '../page-objects/batch-count/home-page.ts';
import { BatchCountItemLookupPage } from '../page-objects/batch-count/item-lookup-page.ts';
import { BatchCountConfirmPage } from '../page-objects/batch-count/batch-confirm-page.ts';
import { TestItemInput } from '../../app/src/__generated__/graphql.js';

export class BatchCountController {
  pages: BatchCountPages;

  constructor() {
    this.pages = {
      homePage: new BatchCountHomePage(),
      itemLookupPage: new BatchCountItemLookupPage(),
      confirmPage: new BatchCountConfirmPage(),
    };
  }

  async searchForSku(product: TestItemInput) {
    await waitFor(this.pages.homePage.searchForSkuInput, 15000);
    await waitAndClick(this.pages.homePage.searchForSkuInput);
    await setValue(this.pages.homePage.searchForSkuInput, product.sku);
    await driver.sendKeyEvent(Enter);
    await waitFor(this.pages.itemLookupPage.sku);
  }

  async expectProductInfo(product: TestItemInput) {
    if (product.partDesc) {
      await expectElementText(
        this.pages.itemLookupPage.productName,
        product.partDesc
      );
    }

    if (product.mfrPartNum) {
      await expectElementText(
        this.pages.itemLookupPage.partNumber,
        product.mfrPartNum
      );
    }

    await expectElementText(this.pages.itemLookupPage.sku, product.sku);

    if (product.retailPrice) {
      await expectElementText(
        this.pages.itemLookupPage.price,
        `$${product.retailPrice}`
      );
    }

    if (product.onHand) {
      await expectElementText(
        this.pages.itemLookupPage.currentQuantity,
        `${product.onHand}`
      );
    }

    if (product.planograms) {
      await expectElementText(
        this.pages.itemLookupPage.planogramInfoByRowNumber(1).locationId,
        `${product.planograms[0].planogramId}`
      );

      await expectElementText(
        this.pages.itemLookupPage.planogramInfoByRowNumber(1).seqNumber,
        `${product.planograms[0].seqNum}`
      );
    }

    if (product.backStockSlots) {
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
}
