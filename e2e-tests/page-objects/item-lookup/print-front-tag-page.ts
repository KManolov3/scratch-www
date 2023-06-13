export type PrinterName =
  | 'Printer Counter 1'
  | 'Printer Counter 2'
  | 'Printer Counter 3'
  | 'Portable';

export class ItemLookupPrintFrontTagPage {
  get viewOptionsButton() {
    return '[text=View Options]';
  }

  get selectPrinterModal() {
    return {
      printerWithName: (printerName: PrinterName = 'Printer Counter 1') =>
        `[text=${printerName}]`,
      cancelButton: '[text=Cancel]',
      acceptButton: '[text=Accept]',
    };
  }

  pogCheckbox(planogram: string) {
    return `[text=${planogram}]`;
  }

  adjustQuantityInput(planogram: string) {
    return `[content-desc=adjust quantity${planogram}]`;
  }

  get printFrontTagButton() {
    return '[text=Print Front Tags]';
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
}
