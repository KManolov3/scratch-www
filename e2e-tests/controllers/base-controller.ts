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
import { exec } from 'child_process';

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
      for (const [index, planogram] of product.planograms.entries()) {
        await expectElementText(
          this.commonPages.itemDetailsPage.getPlanogramInfoTableRow(index + 1)
            .locationId,
          `${planogram.planogramId}`
        );

        await expectElementText(
          this.commonPages.itemDetailsPage.getPlanogramInfoTableRow(index + 1)
            .seqNumber,
          `${planogram.seqNum}`
        );
      }
    }

    await waitAndClick(this.commonPages.itemDetailsPage.slotLocationsButton);

    let backStockQuantity = 0;
    for (const [index] of product.backStockSlots.entries()) {
      const qty = await (
        await $(
          this.commonPages.itemDetailsPage.getSlotInfoTableRow(index + 1)
            .quantity
        )
      ).getText();
      backStockQuantity += +qty;
    }

    await expectElementText(
      this.commonPages.itemDetailsPage.backstockQuantity,
      `${backStockQuantity}`
    );

    if (product.backStockSlots) {
      for (const [index, slot] of product.backStockSlots.entries()) {
        await expectElementText(
          this.commonPages.itemDetailsPage.getSlotInfoTableRow(index + 1)
            .locationId,
          `${slot.slotId}`
        );

        await expectElementText(
          this.commonPages.itemDetailsPage.getSlotInfoTableRow(index + 1)
            .quantity,
          `${slot.qty}`
        );
      }
    }
  }

  sendBarcodeScanIntent(barcode: string) {
    exec(
      `cd ../app/scripts/ && bash send-intent.sh ${barcode}`,
      (err, output) => {
        if (err) {
          console.log('Failed executing command: ', err);
          return;
        }
        console.log(output);
      }
    );
  }
}
