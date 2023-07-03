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
    if (item.mfrPartNum) {
      await expectElementText(
        this.outagePages.completeOutagePage.partNumber,
        item.mfrPartNum
      );
    }

    if (item.retailPrice) {
      await expectElementText(
        this.outagePages.completeOutagePage.price,
        `$${item.retailPrice.toFixed(2)}`
      );
    }

    if (item.onHand) {
      await expectElementText(
        this.outagePages.completeOutagePage.currentQuantity,
        `${item.onHand}`
      );
    }

    await expectElementText(
      this.outagePages.completeOutagePage.newQuantity,
      '0'
    );

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

  async completeOutageCount(items: TestItemInput[]) {
    for (const [index, item] of items.entries()) {
      await this.searchForSku(item);

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

    expect(this.outagePages.homePage.completedOutageListToast).toBeDisplayed();
  }
}
