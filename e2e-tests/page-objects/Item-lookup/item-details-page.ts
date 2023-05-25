export class ItemLookupItemDetailsPage {
  get printFrontTagButton() {
    return '[text=Print Front Tag]';
  }

  get priceDiscrepancyModal() {
    return {
      scannedPrice: '[text=...]',
      systemPrice: '[text=...]',
      cancelButton: '[text=Cancel]',
      printFrontTagButton: '[text=Print Front Tag]',
    };
  }
}
