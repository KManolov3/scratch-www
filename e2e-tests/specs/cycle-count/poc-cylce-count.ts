describe("Cycle Count", () => {
  it("#1", async () => {
    await driver.pause(2 * 1000);
    await expect($(".android.view.View")).toBeDisplayed();
  });
});
