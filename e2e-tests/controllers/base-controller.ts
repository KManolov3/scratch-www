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

  async verticalScroll(
    coordinateX: number,
    coordinateY: number,
    distance: number
  ) {
    await driver.touchAction([
      { action: 'longPress', x: coordinateX, y: coordinateY },
      { action: 'moveTo', x: coordinateX, y: coordinateY - distance },
      'release',
    ]);
  }

  async searchForSku(product: TestItemInput) {
    await waitFor(this.commonPages.homePage.searchForSkuInput, 5000);
    await (await $(this.commonPages.homePage.searchForSkuInput)).clearValue();
    await waitAndClick(this.commonPages.homePage.searchForSkuInput);
    await setValue(this.commonPages.homePage.searchForSkuInput, product.sku);
    await driver.sendKeyEvent(Enter);
    await waitFor(this.commonPages.itemDetailsPage.partNumber);
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
        const planogramLocX = await $(
          this.commonPages.itemDetailsPage.getPlanogramInfoTableRow(index + 1)
            .locationId
        ).getLocation('x');

        const planogramLocY = await $(
          this.commonPages.itemDetailsPage.getPlanogramInfoTableRow(index + 1)
            .locationId
        ).getLocation('y');

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

        await this.verticalScroll(planogramLocX, planogramLocY, 150);
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
        const backstockSlotLocX = await $(
          this.commonPages.itemDetailsPage.getSlotInfoTableRow(index + 1)
            .locationId
        ).getLocation('x');

        const backstockSlotLocY = await $(
          this.commonPages.itemDetailsPage.getSlotInfoTableRow(index + 1)
            .locationId
        ).getLocation('y');

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

        await this.verticalScroll(backstockSlotLocX, backstockSlotLocY, 150);
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
