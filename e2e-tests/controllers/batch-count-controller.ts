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
import { differenceBy, intersectionBy } from 'lodash-es';

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

  async confirmProductInfo(batchCountsSummary: BatchCountData) {
    const productDetails = this.batchCountPages.summaryPage.productDetails(
      batchCountsSummary.item.mfrPartNum
    );

    await waitAndClick(productDetails.partNumber);

    if (batchCountsSummary.item.partDesc) {
      await expectElementText(
        productDetails.itemName,
        batchCountsSummary.item.partDesc
      );
    }

    if (batchCountsSummary.item.onHand) {
      await expectElementText(
        productDetails.currentQuantity,
        `${batchCountsSummary.item.onHand}`
      );
      await expectElementText(
        productDetails.variance,
        `${batchCountsSummary.newQuantity - batchCountsSummary.item.onHand}`
      );
    }

    await expectElementText(productDetails.sku, batchCountsSummary.item.sku);

    if (batchCountsSummary.item.retailPrice) {
      await expectElementText(
        productDetails.price,
        `$${batchCountsSummary.item.retailPrice}`
      );
    }

    if (batchCountsSummary.item.mfrPartNum) {
      await expectElementText(
        productDetails.partNumber,
        batchCountsSummary.item.mfrPartNum
      );
    }
  }

  async editQuantityOnSummary(dataOnSummary: BatchCountData[]) {
    for (const data of dataOnSummary) {
      const productDetails = this.batchCountPages.summaryPage.productDetails(
        data.item.mfrPartNum
      );

      await waitAndClick(productDetails.partNumber);
      await setValue(productDetails.newQtyInput, data.newQuantity);

      await expectElementText(
        productDetails.variance,
        `${data.newQuantity - data.item.onHand}`
      );
      await waitAndClick(productDetails.partNumber);
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
        shrinkage =
          shrinkage +
          (data.item.onHand - data.newQuantity) * data.item.retailPrice;
      }

      if (data.newQuantity > data.item.onHand) {
        overage =
          overage +
          (data.newQuantity - data.item.onHand) * data.item.retailPrice;
      }

      netDollars = overage - shrinkage;
    });

    await expectElementText(
      this.batchCountPages.summaryPage.shrinkageOverageModal.shrinkageValue,
      `$${shrinkage}` === '$0' ? '$0.00' : `-$${shrinkage.toFixed(2)}`
    );

    await expectElementText(
      this.batchCountPages.summaryPage.shrinkageOverageModal.overageValue,
      `$${overage}` === '$0' ? '$0.00' : `$${overage.toFixed(2)}`
    );

    await expectElementText(
      this.batchCountPages.summaryPage.shrinkageOverageModal.netDollars,
      shrinkage > overage
        ? `-$${netDollars.toFixed(2)}`
        : `$${netDollars.toFixed(2)}`
    );
  }

  async removeItem(item: TestItemInput) {
    const productDetails =
      this.batchCountPages.batchCountListPage.productDetails(item.mfrPartNum);

    await waitAndClick(productDetails.partNumber);

    await this.verticalScroll(
      this.batchCountPages.batchCountListPage.pogLocationsButton,
      500
    );

    await waitAndClick(productDetails.removeItemButton);

    await expect(
      $(
        this.batchCountPages.batchCountListPage.toastMessageForRemovedItem(
          item.partDesc
        )
      )
    ).toBeDisplayed();
  }

  async completeBatchCount(
    batchCounts: BatchCountData[],
    fastAccept = false,
    batchCountsSummary?: BatchCountData[]
  ) {
    for (const [index, data] of batchCounts.entries()) {
      await this.searchForSku(data.item.sku);

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
        await this.verticalScroll(
          this.batchCountPages.batchCountListPage.pogLocationsButton,
          -500
        );

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

    if (fastAccept) {
      await waitAndClick(
        this.batchCountPages.batchCountListPage.fastAcceptButton
      );
    } else {
      await waitAndClick(
        this.batchCountPages.batchCountListPage.createSummaryButton
      );

      if (batchCountsSummary) {
        await this.editQuantityOnSummary(batchCountsSummary);
        for (const dataOnSummary of batchCountsSummary) {
          await this.confirmProductInfo(dataOnSummary);
        }
      } else {
        for (const data of batchCounts) {
          await this.confirmProductInfo(data);
        }
      }

      await waitAndClick(this.batchCountPages.summaryPage.approveCountButton);
    }

    if (batchCountsSummary) {
      const intersection = intersectionBy(
        batchCountsSummary,
        batchCounts,
        'item'
      );
      const difference = differenceBy(batchCounts, batchCountsSummary, 'item');
      await this.calculateShrinkageAndOverage([...intersection, ...difference]);
    } else {
      await this.calculateShrinkageAndOverage(batchCounts);
    }

    await waitAndClick(
      this.batchCountPages.summaryPage.shrinkageOverageModal.approveButton
    );

    await waitFor(this.batchCountPages.homePage.searchForSkuInput);

    await expect(
      $(this.batchCountPages.homePage.completedBatchCountToast)
    ).toBeDisplayed();
  }
}
