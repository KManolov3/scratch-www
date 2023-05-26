import { CommonItemDetailsPage } from '../common/common-item-details-page.ts';

type PrinterName =
  | 'Printer Counter 1'
  | 'Printer Counter 2'
  | 'Printer Counter 3'
  | 'Portable';

export class ItemLookupItemDetailsPage extends CommonItemDetailsPage {
  get viewOptionsButton() {
    return '[text=View Options]';
  }

  get hideOptionsButton() {
    return '[text=Hide Options]';
  }

  printerWithName(printerName: PrinterName) {
    return `[text=${printerName}]`;
  }

  // get quantityInput() {
  //   return '...';
  // }

  get closeButton() {
    return '[text=Close]';
  }

  get printFrontTagButton() {
    return '[text=Print Front Tag]';
  }

  toastMessageForPrinter(printerName: PrinterName) {
    return `[text=Front tag send to ${printerName}]`;
  }

  // this modal should be displayed only when the quantity
  // of tags for printing is > 10
  quantityConfirmationModal(numberOfTags: number) {
    return {
      editQuantityButton: '[text=Edit Quantity]',
      printTagsButton: `[text=Print ${numberOfTags} Tags]`,
    };
  }
  get priceDiscrepancyModal() {
    return {
      warningText: '[text=Price Discrepancy Detected.]',
      scannedPrice:
        '//*[@text="Scanned"]/following-sibling::android.widget.TextView',
      systemPrice:
        '//*[@text="System"]/following-sibling::android.widget.TextView',
      closeButton: '[text=Close]',
      printFrontTagButton: '[text=Print Front Tag]',
    };
  }
}
