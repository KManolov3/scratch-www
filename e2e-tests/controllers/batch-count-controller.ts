import { expectElementText } from '../methods/helpers.ts';
import { BatchCountPages } from './page-access.ts';
import { BatchCountHomePage } from '../page-objects/batch-count/home-page.ts';
import { BatchCountConfirmPage } from '../page-objects/batch-count/batch-confirm-page.ts';
import { TestItemInput } from '../__generated__/graphql.ts';
import { BatchCountItemDetailsPage } from '../page-objects/batch-count/item-details-page.ts';
import { BaseCountController } from './base-controller.ts';

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
}
