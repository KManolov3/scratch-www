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
    await super.expectProductInfo(item);

    await expectElementText(
      this.outagePages.completeOutagePage.newQuantity,
      '0'
    );
  }

  calculateShrinkageValue(items: TestItemInput[]) {
    let shrinkage = 0;
    for (const item of items) {
      shrinkage += item.onHand * item.retailPrice;
    }
    return shrinkage;
  }

  async completeOutageCount(items: TestItemInput[]) {
    for (const [index, item] of items.entries()) {
      await this.searchForSku(item);

      await this.expectProductInfo(item);

      if (index !== items.length - 1) {
        await waitAndClick(this.outagePages.completeOutagePage.backButton);
      }
    }

    await waitAndClick(
      this.outagePages.completeOutagePage.completeOutageCountButton
    );

    await waitFor(this.outagePages.completeOutagePage.shrinkageModal.infoText);

    const expectedShrinkageValue = this.calculateShrinkageValue(items);

    await expectElementText(
      this.outagePages.completeOutagePage.shrinkageModal.shrinkageValue,
      `$${expectedShrinkageValue}`
    );

    await waitAndClick(
      this.outagePages.completeOutagePage.shrinkageModal.acceptButton
    );

    expect(this.outagePages.homePage.searchForSkuInput).toBeDisplayed();
  }
}
