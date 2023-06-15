import { ItemLookupPages } from './page-access.ts';
import { BaseController } from './base-controller.ts';
import { ItemLookupHomePage } from '../page-objects/item-lookup/home-page.ts';
import {
  ItemLookupItemDetailsPage,
  PrinterName,
} from '../page-objects/item-lookup/item-details-page.ts';
import { setValue, waitAndClick, waitFor } from '../methods/helpers.ts';

export class ItemLookupController extends BaseController {
  itemLookupPages: ItemLookupPages;

  constructor() {
    super();
    this.itemLookupPages = {
      homePage: new ItemLookupHomePage(),
      itemDetailsPage: new ItemLookupItemDetailsPage(),
    };
  }

  async printFrontTag(printerName?: PrinterName, tagsQuantity?: number) {
    await waitAndClick(
      this.itemLookupPages.itemDetailsPage.printFrontTagButton
    );

    if (printerName) {
      await waitAndClick(
        this.itemLookupPages.itemDetailsPage.printFrontTagModal
          .viewOptionsButton
      );

      await waitAndClick(
        this.itemLookupPages.itemDetailsPage.printFrontTagModal.printerWithName(
          printerName
        )
      );
    }

    if (tagsQuantity) {
      await setValue(
        this.itemLookupPages.itemDetailsPage.printFrontTagModal.quantityInput,
        tagsQuantity
      );
    }

    await waitAndClick(
      this.itemLookupPages.itemDetailsPage.printFrontTagModal
        .printFrontTagButton
    );

    if (tagsQuantity > 10) {
      await waitFor(
        this.itemLookupPages.itemDetailsPage.quantityConfirmationModal
          .warningText
      );
      await waitAndClick(
        this.itemLookupPages.itemDetailsPage.quantityConfirmationModal.printTagsButton(
          tagsQuantity
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
