// eslint-disable-next-line no-restricted-syntax
import { Config as env } from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

export const config = {
  bundleId: DeviceInfo.getBundleId(),

  buildInfo: required('BUILD_INFO'),
  versionName: required('VERSION_NAME'),
  versionCode: required('VERSION_CODE'),

  showDebugUI: boolean(optional('SHOW_DEBUG_UI'), false),

  apiUrl: required('API_URL'),
  launchDarklyMobileKey: required('LAUNCH_DARKLY_MOBILE_KEY'),

  okta: {
    clientId: required('OKTA_CLIENT_ID'),
    authServerURL: required('OKTA_AUTH_SERVER_URL'),
  },

  newRelicApplicationToken: required('NEW_RELIC_APPLICATION_TOKEN'),
};

function required<K extends keyof typeof env>(name: K): string {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }

  return value;
}

function optional<K extends keyof typeof env>(name: K): string | undefined {
  const value = env[name]?.trim();

  // We want to filter out empty strings
  // eslint-disable-next-line no-unneeded-ternary
  return value ? value : undefined;
}

function boolean(value: string): boolean;
function boolean(value: string | undefined, defaultValue: boolean): boolean;
function boolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  return value === 'true' || value === '1';
}
