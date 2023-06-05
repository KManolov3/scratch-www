import {
  expectElementText,
  setValue,
  waitAndClick,
} from '../methods/helpers.ts';
import { BatchCountPages } from './page-access.ts';
import { BatchCountHomePage } from '../page-objects/batch-count/home-page.ts';
import { BatchCountConfirmPage } from '../page-objects/batch-count/batch-confirm-page.ts';
import { TestItemInput } from '../__generated__/graphql.ts';
import { BatchCountItemDetailsPage } from '../page-objects/batch-count/item-details-page.ts';
import { BaseCountController } from './base-controller.ts';
import { waitFor } from '../methods/helpers.ts';

type BatchCountData = {
  item: TestItemInput;
  newQuantity: number;
};

export class BatchCountController extends BaseCountController {
  batchCountPages: BatchCountPages;

  constructor() {
    super();
    this.batchCountPages = {
      homePage: new BatchCountHomePage(),
      itemDetailsPage: new BatchCountItemDetailsPage(),
      confirmPage: new BatchCountConfirmPage(),
    };
  }

  async expectProductInfo(product: TestItemInput) {
    if (product.onHand) {
      await expectElementText(
        this.batchCountPages.itemDetailsPage.quantityOnHand,
        `${product.onHand}`
      );
    }

    await super.expectProductInfo(product);
  }

  async confirmProductInfo(product: TestItemInput) {
    const productDetails = this.batchCountPages.confirmPage.productDetails(
      product.partDesc
    );

    await expectElementText(productDetails.sku, product.sku);

    if (product.retailPrice) {
      await expectElementText(productDetails.price, `$${product.retailPrice}`);
    }

    if (product.mfrPartNum) {
      await expectElementText(productDetails.MFR, product.mfrPartNum);
    }
  }

  calculateShrinkageAndOverage(batchCounts: BatchCountData[]) {
    let shrinkage = 0;
    let overage = 0;

    batchCounts.forEach((data) => {
      if (data.newQuantity < data.item.onHand) {
        shrinkage = +(
          shrinkage +
          (data.item.onHand - data.newQuantity) * data.item.retailPrice
        ).toFixed(2);
      }

      if (data.newQuantity > data.item.onHand) {
        overage = +(
          overage +
          (data.newQuantity - data.item.onHand) * data.item.retailPrice
        ).toFixed(2);
      }
    });
    return { shrinkage, overage };
  }

  async completeBatchCount(batchCounts: BatchCountData[]) {
    for (const [index, data] of batchCounts.entries()) {
      await this.searchForSku(data.item);

      await this.expectProductInfo(data.item);

      await setValue(
        this.batchCountPages.itemDetailsPage.changeQuantityInput,
        data.newQuantity
      );

      await expectElementText(
        this.batchCountPages.itemDetailsPage.newQuantity,
        `${data.newQuantity}`
      );

      if (index !== batchCounts.length - 1) {
        await waitAndClick(this.batchCountPages.itemDetailsPage.backButton);
      }
    }

    await waitAndClick(this.batchCountPages.itemDetailsPage.verifyButton);
    await waitFor(this.batchCountPages.confirmPage.completeButton);

    for (const data of batchCounts) {
      await this.confirmProductInfo(data.item);
    }

    await waitAndClick(this.batchCountPages.confirmPage.completeButton);
    await waitFor(
      this.batchCountPages.confirmPage.shrinkageOverageModal.infoText
    );

    const { shrinkage, overage } =
      this.calculateShrinkageAndOverage(batchCounts);

    await expectElementText(
      this.batchCountPages.confirmPage.shrinkageOverageModal.shrinkageValue,
      `$${shrinkage}` === '$0' ? '$0.00' : `$${shrinkage}`
    );

    await expectElementText(
      this.batchCountPages.confirmPage.shrinkageOverageModal.netDollarsValue,
      `$${overage}` === '$0' ? '$0.00' : `$${overage}`
    );

    await waitAndClick(
      this.batchCountPages.confirmPage.shrinkageOverageModal.acceptButton
    );

    expect(this.batchCountPages.homePage.searchForSkuInput).toBeDisplayed();
  }
}
