export type PrinterName =
  | 'Counter Printer 1'
  | 'Counter Printer 2'
  | 'Counter Printer 3'
  | 'Portable';

export class ItemLookupPrintFrontTagPage {
  get viewOptionsButton() {
    return '[text=View Options]';
  }

  get selectPrinterModal() {
    return {
      printerWithName: (printerName: PrinterName = 'Counter Printer 1') =>
        `[text=${printerName}]`,
      cancelButton: '[text=Cancel]',
      selectButton: '[text=Select]',
    };
  }

  pogCheckbox(planogram: string) {
    return `[text=${planogram}]`;
  }

  adjustQuantityInput(planogram: string) {
    return `[content-desc=adjust quantity${planogram}]`;
  }

  get printFrontTagsButton() {
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
