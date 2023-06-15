import { expectElementText, waitFor } from '../../methods/helpers.ts';

describe('Truck Detail Scan', () => {
  it('#1', async () => {
    const appTitleLocator = '[text=Truck Detail]';
    await waitFor(appTitleLocator, 5000);
    await expectElementText(appTitleLocator, 'Truck Detail');
  });
});
