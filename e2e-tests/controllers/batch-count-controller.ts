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
import { waitForInvisible } from '../methods/helpers.ts';
import { waitFor } from '../methods/helpers.ts';

type BatchCountData = {
  product: TestItemInput;
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

  async completeBatchCount(batchCounts: BatchCountData[]) {
    for (const [index, data] of batchCounts.entries()) {
      await setValue(
        this.batchCountPages.homePage.searchForSkuInput,
        data.product.sku
      );

      await this.expectProductInfo(data.product);

      await setValue(
        this.batchCountPages.itemDetailsPage.changeQuantityInput,
        data.newQuantity
      );

      if (index > 0) {
        await waitForInvisible(
          this.batchCountPages.itemDetailsPage.fastAcceptButton
        );
      }

      if (index !== batchCounts.length - 1) {
        await waitAndClick(this.batchCountPages.itemDetailsPage.backButton);
      }
    }

    await waitAndClick(this.batchCountPages.itemDetailsPage.verifyButton);
    await waitFor(this.batchCountPages.confirmPage.completeButton);

    for (const data of batchCounts) {
      await this.confirmProductInfo(data.product);
    }

    await waitAndClick(this.batchCountPages.confirmPage.completeButton);
    await waitFor(
      this.batchCountPages.confirmPage.shrinkageOverageModal.infoText
    );

    await waitAndClick(
      this.batchCountPages.confirmPage.shrinkageOverageModal.acceptButton
    );
  }
}
