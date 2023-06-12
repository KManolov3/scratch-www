import { CommonItemDetailsPage } from '../common/common-item-details-page.ts';

export type PrinterName =
  | 'Printer Counter 1'
  | 'Printer Counter 2'
  | 'Printer Counter 3'
  | 'Portable';

export class ItemLookupItemDetailsPage extends CommonItemDetailsPage {
  get printFrontTagButton() {
    return '[text=Print Front Tag]';
  }

  get printFrontTagModal() {
    return {
      viewOptionsButton: '[text=View Options]',
      hideOptionsButton: '[text=Hide Options]',
      printerWithName: (printerName: PrinterName = 'Printer Counter 1') =>
        `[text=${printerName}]`,
      quantityInput: '~adjust quantity',
      closeButton: '[text=Close]',
      printFrontTagButton: '(//*[@text="Print Front Tag"])[2]',
    };
  }

  toastMessageForPrinter(printerName: PrinterName = 'Printer Counter 1') {
    return `//android.widget.TextView[@text="Front tag sent to ${printerName}"]`;
  }

  // this modal should be displayed only when the quantity
  // of tags for printing is > 10
  get quantityConfirmationModal() {
    return {
      warningText: '[text=Quantity Confirmation]',
      editQuantityButton: '[text=Edit Quantity]',
      printTagsButton: (tagsQuantity: number) =>
        `[text=Print ${tagsQuantity} Tags]`,
    };
  }

  get priceDiscrepancyModal() {
    return {
      warningText: '[text=Price Discrepancy Detected.]',
      scannedPrice: '~Scanned value',
      systemPrice: '~System value',
      closeButton: '[text=Close]',
      printFrontTagButton: '[text=Print Front Tag]',
    };
  }
}
