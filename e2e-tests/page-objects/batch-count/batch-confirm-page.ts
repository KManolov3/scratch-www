export class BatchCountConfirmPage {
  get headerText() {
    return '[text=Confirm]';
  }

  get backButton() {
    return '[content-desc=Navigate up]';
  }

  getSummaryTableRow(row: number) {
    return {
      partNumber: `~P/N${row - 1}`,
      currentQuantity: `~Current${row - 1}`,
      newQuantity: `~New${row - 1}`,
    };
  }

  get completeButton() {
    return '[text=COMPLETE BATCH COUNT]';
  }
}
