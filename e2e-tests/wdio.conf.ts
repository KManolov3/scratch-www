import { Test, TestResult } from '@wdio/types/build/Frameworks';
import { existsSync, mkdirSync } from 'fs';
import { emptyDirSync } from 'fs-extra';
import { kebabCase } from 'lodash-es';
import * as path from 'path';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { ReportAggregator } from 'wdio-html-nice-reporter';

const __filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filePath);

let reportAggregator: ReportAggregator;
const screenshotPath = 'screenshots';
const reportPath = join(
  __dirname,
  `${process.env.REPORT_PATH}`,
  `${kebabCase(process.env.APP_ACTIVITY)}`
);

const green = '\x1b[32m';
const red = '\x1b[31m';
const blue = '\x1b[36m';
const white = '\x1b[37m';

function emptyTemporaryDirContent(dirsToEmpty: Array<string>) {
  dirsToEmpty.forEach((dir) => {
    const pathToDir = join(__dirname, dir);
    emptyDirSync(pathToDir);
    console.log(`> Emptied directory: ${pathToDir}\n`);
  });
}

export const config: WebdriverIO.Config = {
  port: 4723,
  path: '/wd/hub/',
  runner: 'local',

  capabilities: [
    {
      platformName: 'Android',
      automationName: 'UIAutomator2',
      deviceName: process.env.DEVICE_NAME,

      appPackage: 'com.advanceautoparts.instoreapps',
      appActivity: `com.advanceautoparts.instoreapps.activities.${process.env.APP_ACTIVITY}`,
      appWaitActivity: `com.advanceautoparts.instoreapps.activities.${process.env.APP_ACTIVITY}`,

      newCommandTimeout: 240,
      maxInstances: 1,
      noReset: true,
      dontStopAppOnReset: true,
    },
  ],

  logLevel: 'error',
  bail: 0,
  baseUrl: 'http://localhost',

  waitforTimeout: 3000,
  connectionRetryTimeout: 60000,
  connectionRetryCount: 3,
  waitforInterval: 500,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 180000,
  },

  reporters: [
    'spec',
    [
      'html-nice',
      {
        outputDir: `./${process.env.REPORT_PATH}/${kebabCase(
          process.env.APP_ACTIVITY
        )}/`,
        filename: 'spec-report.html',
        reportTitle: 'Test Results',
        linkScreenshots: true,
        useOnAfterCommandForScreenshot: false,
        showInBrowser: false,
        collapseTests: true,
      },
    ],
  ],
  reporterSyncInterval: 500,
  reporterSyncTimeout: 20000,

  onPrepare: function () {
    emptyTemporaryDirContent(['reports']);

    if (process.env.REPORT_PATH === './reports') {
      emptyTemporaryDirContent(['reports-from-multiple-apps']);
    }

    reportAggregator = new ReportAggregator({
      outputDir: `./${process.env.REPORT_PATH}/${kebabCase(
        process.env.APP_ACTIVITY
      )}/`,
      filename: 'report.html',
      reportTitle: 'Test Results Report',
      browserName: 'Chrome',
      collapseTests: true,
      collapseSuites: true,
      linkScreenshots: true,
    });
    reportAggregator.clean();
  },

  beforeTest: function (test: Test) {
    const testTitle = test.title.toUpperCase();
    console.log(
      `\n${blue}*************** RUNNING TEST: ${testTitle}  ***************${white}\n`
    );
  },

  afterTest: async function (test: Test, context: any, result: TestResult) {
    const testTitle = test.title.toUpperCase();
    const color = result.passed ? green : red;

    console.log(
      `\n${color}*************** END OF TEST: ${testTitle}  ***************${white}\n`
    );

    if (color === red) {
      const dirName = test.title.replace(/\s/g, '_').substring(0, 30);
      const screenshotDir = join(reportPath, screenshotPath, dirName);
      const screenshotFile = join(screenshotDir, dirName + '.png');
      if (!existsSync(screenshotDir)) {
        mkdirSync(screenshotDir);
      }
      try {
        await browser.saveScreenshot(screenshotFile);
      } catch (error) {
        console.log(
          `Could not take a screenshot. Error message ${error.message}`
        );
      }
      console.log(`Taken screenshot on error. File: ${screenshotFile}`);
    }
  },

  onComplete: async function () {
    await (async () => {
      await reportAggregator.createReport();
    })();
  },
};
