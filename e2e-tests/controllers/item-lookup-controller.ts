import { ItemLookupPages } from './page-access.ts';
import { BaseController } from './base-controller.ts';
import { ItemLookupHomePage } from '../page-objects/item-lookup/home-page.ts';
import { ItemLookupItemDetailsPage } from '../page-objects/item-lookup/item-details-page.ts';
import { setValue, waitAndClick, waitFor } from '../methods/helpers.ts';
import {
  ItemLookupPrintFrontTagPage,
  PrinterName,
} from '../page-objects/item-lookup/print-front-tag-page.ts';
import { sum } from 'lodash-es';

export type PrintData = {
  planogram: string;
  printTag: boolean;
  tagsQuantity?: number;
};

export class ItemLookupController extends BaseController {
  itemLookupPages: ItemLookupPages;

  constructor() {
    super();
    this.itemLookupPages = {
      homePage: new ItemLookupHomePage(),
      itemDetailsPage: new ItemLookupItemDetailsPage(),
      printFrontTagPage: new ItemLookupPrintFrontTagPage(),
    };
  }

  async printFrontTag(printData: PrintData[], printerName?: PrinterName) {
    await waitAndClick(
      this.itemLookupPages.itemDetailsPage.printFrontTagButton
    );

    if (printerName) {
      await waitAndClick(
        this.itemLookupPages.printFrontTagPage.viewOptionsButton
      );

      await waitAndClick(
        this.itemLookupPages.printFrontTagPage.selectPrinterModal.printerWithName(
          printerName
        )
      );

      await waitAndClick(
        this.itemLookupPages.printFrontTagPage.selectPrinterModal.acceptButton
      );
    }

    if (printData.length > 1) {
      for (const data of printData) {
        if (data.printTag === false) {
          await waitAndClick(
            this.itemLookupPages.printFrontTagPage.pogCheckbox(data.planogram)
          );
        }

        if (data.tagsQuantity > 1) {
          await setValue(
            this.itemLookupPages.printFrontTagPage.adjustQuantityInput(
              data.planogram
            ),
            data.tagsQuantity
          );
        }
      }
    }

    await waitAndClick(
      this.itemLookupPages.printFrontTagPage.printFrontTagsButton
    );

    const sumOfQuantities = sum(printData.map((pog) => pog.tagsQuantity));

    if (sumOfQuantities > 10) {
      await waitFor(
        this.itemLookupPages.printFrontTagPage.quantityConfirmationModal
          .warningText
      );
      await waitAndClick(
        this.itemLookupPages.printFrontTagPage.quantityConfirmationModal.printTagsButton(
          sumOfQuantities
        )
      );
    }

    await waitFor(
      this.itemLookupPages.itemDetailsPage.toastMessageForPrinter(printerName)
    );

    await expect(
      $(
        this.itemLookupPages.itemDetailsPage.toastMessageForPrinter(printerName)
      )
    ).toBeDisplayed();
  }
}
