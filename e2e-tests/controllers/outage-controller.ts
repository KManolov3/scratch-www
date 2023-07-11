import { sum } from 'lodash-es';
import { TestItemInput } from '../__generated__/graphql.ts';
import {
  expectElementText,
  waitAndClick,
  waitFor,
} from '../methods/helpers.ts';
import { OutageCompleteCountPage } from '../page-objects/outage/complete-outage-page.ts';
import { OutageHomePage } from '../page-objects/outage/home-page.ts';
import { BaseController } from './base-controller.ts';
import { OutagePages } from './page-access.ts';

export class OutageController extends BaseController {
  outagePages: OutagePages;

  constructor() {
    super();
    this.outagePages = {
      homePage: new OutageHomePage(),
      completeOutagePage: new OutageCompleteCountPage(),
    };
  }

  async expectProductInfo(item: TestItemInput) {
    const productDetails = this.outagePages.completeOutagePage.productDetails(
      item.mfrPartNum
    );

    if (item.mfrPartNum) {
      await expectElementText(productDetails.partNumber, item.mfrPartNum);
    }

    if (item.retailPrice) {
      await expectElementText(
        productDetails.price,
        `$${item.retailPrice.toFixed(2)}`
      );
    }

    if (item.onHand) {
      await expectElementText(productDetails.currentQuantity, `${item.onHand}`);
    }

    await expectElementText(productDetails.newQuantity, '0');

    if (item.backStockSlots.length > 0) {
      const slotIds = item.backStockSlots.map((slot) => slot.slotId).join(', ');
      await expectElementText(
        this.outagePages.completeOutagePage.itemInBackstockModal.warningBanner,
        `Slot: ${slotIds}`
      );
    }
  }

  calculateShrinkageValue(items: TestItemInput[]) {
    return sum(items.map((item) => item.onHand * item.retailPrice));
  }

  async addItemsToOutageList(items: TestItemInput[]) {
    for (const [index, item] of items.entries()) {
      await this.searchForSku(item.sku);

      if (item.backStockSlots.length > 0) {
        await waitAndClick(
          this.outagePages.completeOutagePage.itemInBackstockModal
            .addToOutageButton
        );
      }

      await this.expectProductInfo(item);

      if (index !== items.length - 1) {
        await driver.back();
      }
    }
  }

  async removeItem(item: TestItemInput) {
    await waitAndClick(
      this.outagePages.completeOutagePage.productDetails(item.mfrPartNum)
        .removeItemButton
    );

    await expect(
      $(
        this.outagePages.completeOutagePage.toastMessageForRemovedItem(
          item.partDesc
        )
      )
    ).toBeDisplayed();

    await expect(
      $(
        this.outagePages.completeOutagePage.productDetails(item.mfrPartNum)
          .partNumber
      )
    ).not.toBeDisplayed();
  }

  async completeOutageCount(items: TestItemInput[]) {
    await waitAndClick(
      this.outagePages.completeOutagePage.completeOutageCountButton
    );

    await waitFor(this.outagePages.completeOutagePage.shrinkageModal.infoText);

    const expectedShrinkageValue = this.calculateShrinkageValue(items);

    await expectElementText(
      this.outagePages.completeOutagePage.shrinkageModal.shrinkageValue,
      `-$${expectedShrinkageValue.toFixed(2)}`
    );

    await waitAndClick(
      this.outagePages.completeOutagePage.shrinkageModal.approveButton
    );

    await waitFor(this.outagePages.homePage.searchForSkuInput, 5000);

    await expect(
      $(this.outagePages.homePage.completedOutageListToast)
    ).toBeDisplayed();
  }
}
