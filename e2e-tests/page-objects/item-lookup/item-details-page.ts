import { CommonItemDetailsPage } from '../common/common-item-details-page.ts';
import { PrinterName } from './print-front-tag-page.ts';

export class ItemLookupItemDetailsPage extends CommonItemDetailsPage {
  get printFrontTagButton() {
    return '[text=Print Front Tag]';
  }

  toastMessageForPrinter(printerName: PrinterName = 'Printer Counter 1') {
    return `//android.widget.TextView[@text="Front tag sent to ${printerName}"]`;
  }

  get priceDiscrepancyModal() {
    return {
      warningText: '[text=Price Discrepancy Detected.]',
      scannedPrice: '~Scanned value',
      systemPrice: '~System value',
      cancelButton: '[text=Cancel]',
      printFrontTagButton: '[text=Print Front Tag]',
    };
  }
}
