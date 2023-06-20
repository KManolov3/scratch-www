import {
  expectElementText,
  setValue,
  waitAndClick,
} from '../methods/helpers.ts';
import { BatchCountPages } from './page-access.ts';
import { BatchCountHomePage } from '../page-objects/batch-count/home-page.ts';
import { TestItemInput } from '../__generated__/graphql.ts';
import { BatchCountItemDetailsPage } from '../page-objects/batch-count/item-details-page.ts';
import { BaseController } from './base-controller.ts';
import { waitFor } from '../methods/helpers.ts';
import { BatchCountApprovePage } from '../page-objects/batch-count/approve-count-page.ts';

type BatchCountData = {
  item: TestItemInput;
  newQuantity: number;
  bookmarked: boolean;
};

export class BatchCountController extends BaseController {
  batchCountPages: BatchCountPages;

  constructor() {
    super();
    this.batchCountPages = {
      homePage: new BatchCountHomePage(),
      itemDetailsPage: new BatchCountItemDetailsPage(),
      approveCountPage: new BatchCountApprovePage(),
    };
  }

  async expectProductInfo(product: TestItemInput) {
    if (product.onHand) {
      await expectElementText(
        this.batchCountPages.itemDetailsPage.productDetails(product.mfrPartNum)
          .currentQuantity,
        `${product.onHand}`
      );
    }

    await super.expectProductInfo(product);
  }

  async confirmProductInfo(data: BatchCountData) {
    const productDetails = this.batchCountPages.approveCountPage.productDetails(
      data.item.mfrPartNum
    );

    await waitAndClick(
      this.batchCountPages.approveCountPage.productDetails(
        productDetails.partNumber
      ).partNumber
    );

    if (data.item.partDesc) {
      await expectElementText(productDetails.itemName, data.item.partDesc);
    }

    if (data.item.onHand) {
      await expectElementText(
        productDetails.currentQuantity,
        `${data.item.onHand}`
      );
      await expectElementText(
        productDetails.variance,
        `${data.newQuantity - data.item.onHand}`
      );
    }

    await expectElementText(productDetails.sku, data.item.sku);

    if (data.item.retailPrice) {
      await expectElementText(
        productDetails.price,
        `$${data.item.retailPrice}`
      );
    }

    if (data.item.mfrPartNum) {
      await expectElementText(productDetails.partNumber, data.item.mfrPartNum);
    }
  }

  async calculateShrinkageAndOverage(batchCounts: BatchCountData[]) {
    let shrinkage = 0;
    let overage = 0;
    let netDollars = 0;

    await waitFor(
      this.batchCountPages.approveCountPage.shrinkageOverageModal.infoText
    );

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

      netDollars = overage - Math.abs(shrinkage);
    });

    await expectElementText(
      this.batchCountPages.approveCountPage.shrinkageOverageModal
        .shrinkageValue,
      `$${shrinkage}` === '$0' ? '$0.00' : `-$${shrinkage}`
    );

    await expectElementText(
      this.batchCountPages.approveCountPage.shrinkageOverageModal.overageValue,
      `$${overage}` === '$0' ? '$0.00' : `$${overage}`
    );

    await expectElementText(
      this.batchCountPages.approveCountPage.shrinkageOverageModal.netDollars,
      shrinkage > overage ? `-$${netDollars}` : `$${netDollars}`
    );
  }

  async completeBatchCount(batchCounts: BatchCountData[]) {
    for (const [index, data] of batchCounts.entries()) {
      await this.searchForSku(data.item);

      await setValue(
        this.batchCountPages.itemDetailsPage.productDetails(
          data.item.mfrPartNum
        ).newQtyInput,
        data.newQuantity
      );

      await waitAndClick(
        this.batchCountPages.itemDetailsPage.productDetails(
          data.item.mfrPartNum
        ).partNumber
      );

      await this.expectProductInfo(data.item);

      if (data.bookmarked) {
        await waitAndClick(
          this.batchCountPages.itemDetailsPage.productDetails(
            data.item.mfrPartNum
          ).bookmarkItemButton
        );
      }

      if (index !== batchCounts.length - 1) {
        await driver.back();
      }
    }

    await waitAndClick(
      this.batchCountPages.itemDetailsPage.createSummaryButton
    );

    for (const data of batchCounts) {
      await this.confirmProductInfo(data);
    }

    await waitAndClick(
      this.batchCountPages.approveCountPage.approveCountButton
    );

    await this.calculateShrinkageAndOverage(batchCounts);

    await waitAndClick(
      this.batchCountPages.approveCountPage.shrinkageOverageModal.approveButton
    );

    await waitFor(this.batchCountPages.homePage.searchForSkuInput);

    expect(
      this.batchCountPages.homePage.completedBatchCountToast
    ).toBeDisplayed();
  }
}
