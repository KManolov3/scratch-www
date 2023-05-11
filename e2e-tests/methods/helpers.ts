import { expect } from 'chai';
import { generate } from 'randomstring';

const WAIT_FOR_TIMEOUT = 3000;
export const Enter = '66';

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
  console.log(`Waiting for element: ${selector}`);
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

export async function clearValue(selector: string) {
  console.log(`Clearing value of element ${selector}`);
  await $(selector).clearValue();
}

export async function expectElementValue(selector: string, expected: string) {
  await waitFor(selector);
  const displayed = await $(selector).getValue();
  expect(
    expected === displayed,
    `Displayed value ${displayed} does not match expected ${expected}`
  );
}

export async function expectElementText(
  selector: string,
  expected: string,
  timeout = WAIT_FOR_TIMEOUT
) {
  await browser.waitUntil(
    async () => {
      const displayed = await $(selector).getText();
      console.log(`Expecting element ${selector} to have text ${expected}`);
      return displayed === expected;
    },
    {
      timeout: timeout,
      timeoutMsg: `Displayed text does not match expected ${expected}`,
    }
  );
}
