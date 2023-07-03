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
import { sum } from 'lodash-es';

export class BaseController {
  commonPages: CommonPages;

  constructor() {
    this.commonPages = {
      homePage: new CommonHomePage(),
      itemDetailsPage: new CommonItemDetailsPage(),
    };
  }

  async verticalScroll(element: string, distance: number) {
    const referenceElement = await $(element);
    const referenceElementX = await referenceElement.getLocation('x');
    const referenceElementY = await referenceElement.getLocation('y');

    await driver.touchAction([
      { action: 'longPress', x: referenceElementX, y: referenceElementY },
      {
        action: 'moveTo',
        x: referenceElementX,
        y: referenceElementY - distance,
      },
      'release',
    ]);
  }

  async searchForSku(sku: string) {
    await waitFor(this.commonPages.homePage.searchForSkuInput, 5000);
    await (await $(this.commonPages.homePage.searchForSkuInput)).clearValue();
    await waitAndClick(this.commonPages.homePage.searchForSkuInput);
    await setValue(this.commonPages.homePage.searchForSkuInput, sku);
    await driver.sendKeyEvent(Enter);
  }

  async expectProductInfo(product: TestItemInput) {
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
        `$${product.retailPrice.toFixed(2)}`
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

        await this.verticalScroll(
          this.commonPages.itemDetailsPage.getPlanogramInfoTableRow(index + 1)
            .locationId,
          150
        );
      }
    }

    if (product.backStockSlots) {
      await waitAndClick(this.commonPages.itemDetailsPage.slotLocationsButton);

      const backStockQuantity = sum(
        product.backStockSlots.map((slot) => slot.qty)
      );

      await expectElementText(
        this.commonPages.itemDetailsPage.backstockQuantity,
        `${backStockQuantity}`
      );

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

        await this.verticalScroll(
          this.commonPages.itemDetailsPage.getSlotInfoTableRow(index + 1)
            .locationId,
          150
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

  priceWithoutDecimalSeparator(price: number) {
    return (price * 100).toFixed(0).padStart(5, '0');
  }
}
