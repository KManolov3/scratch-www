import {
  Enter,
  expectElementText,
  setValue,
  waitAndClick,
} from '../methods/helpers.ts';
import { CommonPages } from './page-access.ts';
import { waitFor } from '../methods/helpers.ts';
import { TestItemInput } from '../__generated__/graphql.ts';
import { CommonHomePage } from '../page-objects/common/common-home-page.ts';
import { CommonItemDetailsPage } from '../page-objects/common/common-item-details-page.ts';

export class BaseCountController {
  commonPages: CommonPages;

  constructor() {
    this.commonPages = {
      homePage: new CommonHomePage(),
      itemDetailsPage: new CommonItemDetailsPage(),
    };
  }

  async searchForSku(product: TestItemInput) {
    await waitFor(this.commonPages.homePage.searchForSkuInput, 15000);
    await waitAndClick(this.commonPages.homePage.searchForSkuInput);
    await setValue(this.commonPages.homePage.searchForSkuInput, product.sku);
    await driver.sendKeyEvent(Enter);
    await waitFor(this.commonPages.itemDetailsPage.sku);
  }

  async expectProductInfo(product: TestItemInput) {
    if (product.partDesc) {
      await expectElementText(
        this.commonPages.itemDetailsPage.productName,
        product.partDesc
      );
    }

    if (product.mfrPartNum) {
      await expectElementText(
        this.commonPages.itemDetailsPage.partNumber,
        product.mfrPartNum
      );
    }

    await expectElementText(this.commonPages.itemDetailsPage.sku, product.sku);

    if (product.retailPrice) {
      await expectElementText(
        this.commonPages.itemDetailsPage.price,
        `$${product.retailPrice}`
      );
    }

    if (product.planograms) {
      await expectElementText(
        this.commonPages.itemDetailsPage.getPlanogramInfoTableRow(1).locationId,
        `${product.planograms[0].planogramId}`
      );

      await expectElementText(
        this.commonPages.itemDetailsPage.getPlanogramInfoTableRow(1).seqNumber,
        `${product.planograms[0].seqNum}`
      );
    }

    if (product.backStockSlots) {
      await waitAndClick(this.commonPages.itemDetailsPage.slotLocationsButton);

      await expectElementText(
        this.commonPages.itemDetailsPage.getSlotInfoTableRow(1).locationId,
        `${product.backStockSlots[0].slotId}`
      );

      await expectElementText(
        this.commonPages.itemDetailsPage.getSlotInfoTableRow(1).quantity,
        `${product.backStockSlots[0].qty}`
      );
    }
  }
}
