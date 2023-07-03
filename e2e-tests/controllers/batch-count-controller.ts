import {
  expectElementText,
  setValue,
  waitAndClick,
} from '../methods/helpers.ts';
import { BatchCountPages } from './page-access.ts';
import { BatchCountHomePage } from '../page-objects/batch-count/home-page.ts';
import { TestItemInput } from '../__generated__/graphql.ts';
import { BatchCountListPage } from '../page-objects/batch-count/item-details-page.ts';
import { BaseController } from './base-controller.ts';
import { waitFor } from '../methods/helpers.ts';
import { BatchCountSummaryPage } from '../page-objects/batch-count/approve-count-page.ts';

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
      batchCountListPage: new BatchCountListPage(),
      summaryPage: new BatchCountSummaryPage(),
    };
  }

  async expectProductInfo(product: TestItemInput) {
    if (product.onHand) {
      await expectElementText(
        this.batchCountPages.batchCountListPage.productDetails(
          product.mfrPartNum
        ).currentQuantity,
        `${product.onHand}`
      );
    }

    if (product.partDesc) {
      await expectElementText(
        this.batchCountPages.batchCountListPage.productDetails(product.partDesc)
          .itemName,
        product.partDesc
      );
    }

    await super.expectProductInfo(product);
  }

  async confirmProductInfo(data: BatchCountData) {
    const productDetails = this.batchCountPages.summaryPage.productDetails(
      data.item.mfrPartNum
    );

    await waitAndClick(productDetails.partNumber);

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

  async calculateShrinkageAndOverage(batchCountData: BatchCountData[]) {
    let shrinkage = 0;
    let overage = 0;
    let netDollars = 0;

    await waitFor(
      this.batchCountPages.summaryPage.shrinkageOverageModal.infoText
    );

    batchCountData.forEach((data) => {
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

      netDollars = +(overage - shrinkage).toFixed(2);
    });

    await expectElementText(
      this.batchCountPages.summaryPage.shrinkageOverageModal.shrinkageValue,
      `$${shrinkage}` === '$0' ? '$0.00' : `-$${shrinkage}`
    );

    await expectElementText(
      this.batchCountPages.summaryPage.shrinkageOverageModal.overageValue,
      `$${overage}` === '$0' ? '$0.00' : `$${overage}`
    );

    await expectElementText(
      this.batchCountPages.summaryPage.shrinkageOverageModal.netDollars,
      shrinkage > overage
        ? `-$${netDollars.toFixed(2)}`
        : `$${netDollars.toFixed(2)}`
    );
  }

  async completeBatchCount(batchCounts: BatchCountData[]) {
    for (const [index, data] of batchCounts.entries()) {
      await this.searchForSku(data.item);

      await setValue(
        this.batchCountPages.batchCountListPage.productDetails(
          data.item.mfrPartNum
        ).newQtyInput,
        data.newQuantity
      );

      await waitAndClick(
        this.batchCountPages.batchCountListPage.productDetails(
          data.item.mfrPartNum
        ).partNumber
      );

      await this.expectProductInfo(data.item);

      if (data.bookmarked) {
        const pogLocationsButton = await $(
          this.batchCountPages.batchCountListPage.pogLocationsButton
        );
        const coordinateX = await pogLocationsButton.getLocation('x');
        const coordinateY = await pogLocationsButton.getLocation('y');

        await this.verticalScroll(coordinateX, coordinateY, -500);

        await waitAndClick(
          this.batchCountPages.batchCountListPage.productDetails(
            data.item.mfrPartNum
          ).bookmarkItemButton
        );
      }

      if (index !== batchCounts.length - 1) {
        await driver.back();
      }
    }

    await waitAndClick(
      this.batchCountPages.batchCountListPage.createSummaryButton
    );

    for (const data of batchCounts) {
      await this.confirmProductInfo(data);
    }

    await waitAndClick(this.batchCountPages.summaryPage.approveCountButton);

    await this.calculateShrinkageAndOverage(batchCounts);

    await waitAndClick(
      this.batchCountPages.summaryPage.shrinkageOverageModal.approveButton
    );

    await waitFor(this.batchCountPages.homePage.searchForSkuInput);

    expect(
      this.batchCountPages.homePage.completedBatchCountToast
    ).toBeDisplayed();
  }
}
