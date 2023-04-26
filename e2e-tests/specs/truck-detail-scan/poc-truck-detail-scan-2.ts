describe('Truck Detail Scan', () => {
  it('#2', async () => {
    await driver.pause(2 * 1000);
    await expect($('.android.view.View')).toBeDisplayed();
  });
});
