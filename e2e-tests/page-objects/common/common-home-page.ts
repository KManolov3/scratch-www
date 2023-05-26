export class CommonHomePage {
  get headerText() {
    return '[text=Home]';
  }

  get searchForSkuInput() {
    return '[text=Search for a SKU]';
  }

  get noResultsFoundModal() {
    return {
      scanAgainButton: '[text=Scan Again]',
      searchForProductButton: '[text=Search For Product]',
    };
  }
}
