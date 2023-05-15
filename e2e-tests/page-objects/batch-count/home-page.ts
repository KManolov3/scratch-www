export class BatchCountHomePage {
  get headerText() {
    return '[text=Home]';
  }

  get searchForSkuInput() {
    return '[text=Search for a SKU]';
  }

  get clearSearchField() {
    return '(//*[@class="com.horcrux.svg.PathView"])[2]';
  }

  get noResultsFoundModal() {
    return {
      scanAgainButton: '[text=Scan Again]',
      searchForProductButton: '[text=Search For Product]',
    };
  }
}
