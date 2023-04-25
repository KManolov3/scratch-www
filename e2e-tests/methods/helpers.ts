import { expect } from 'chai';
import { generate } from 'randomstring';

const WAIT_FOR_TIMEOUT = 3000;

export function generateRandomString(
  length = 12,
  charset = 'alphanumeric',
  readable = true
) {
  const randomString = generate({
    length: length,
    charset: charset,
    readable: readable,
  });

  return randomString;
}

export async function waitFor(
  selector: string,
  timeout = WAIT_FOR_TIMEOUT
): Promise<WebdriverIO.Element> {
  console.log(`Waiting for Element: ${selector}`);
  const element = await $(selector);
  await element.waitForDisplayed({ timeout });
  console.log('Wait for element success');
  return element;
}

export async function waitForInvisible(element: string) {
  console.log(`Waiting for element ${element} to become invisible`);
  expect(
    await $(element).waitForDisplayed({
      timeout: WAIT_FOR_TIMEOUT,
      reverse: true,
    })
  );
  console.log('Element is invisible');
}

export async function waitAndClick(
  selector: string,
  timeout = WAIT_FOR_TIMEOUT
) {
  const element = await waitFor(selector, timeout);
  await element.click();
  console.log(`Clicked on element ${selector}`);
}

export async function setValue(selector: string, value: string | number) {
  const element = await $(selector);
  await element.setValue(value);
  console.log(`Value ${value} is set to ${selector}`);
}

export async function clearAndSetValue(
  selector: string,
  value: string | number
) {
  await clearValue(selector);
  const element = await $(selector);
  await element.setValue(value);
  console.log(`Value ${value} is set to ${selector}`);
}

export async function clearValue(selector: string) {
  console.log(`Clearing value of ${selector}`);
  // Select all, delete
  await (await $(selector)).keys(['Control', 'a', 'Backspace']);
}

export async function expectElementValue(selector: string, expected: string) {
  await waitFor(selector);
  const displayed = await $(selector).getValue();
  expect(
    expected === displayed,
    `Displayed value ${displayed} does not match expected ${expected}`
  );
}

export async function expectElementText(selector: string, expected: string) {
  await browser.waitUntil(
    async () => {
      const displayed = await $(selector).getText();
      return displayed === expected;
    },
    {
      timeout: 3000,
      timeoutMsg: `Displayed text does not match expected ${expected}`,
    }
  );
}
