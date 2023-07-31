export class CommonHomePage {
  get searchForSkuInput() {
    return '[text=Search for a SKU]';
  }

  get noResultsFound() {
    return '[text=No Results Found]';
  }

  get trySearchingForAnotherSKU() {
    return '[text=Try searching for another SKU or scanning a barcode]';
  }
}
