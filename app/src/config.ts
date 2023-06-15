// eslint-disable-next-line no-restricted-syntax
import { Config as env } from 'react-native-config';

function required<K extends keyof typeof env>(name: K): string {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }

  return value;
}

export const config = {
  build: required('BUILD'),
  version: required('VERSION'),

  apiUrl: required('API_URL'),
  launchDarklyMobileKey: required('LAUNCH_DARKLY_MOBILE_KEY'),

  okta: {
    clientId: required('OKTA_CLIENT_ID'),
    authServerURL: required('OKTA_AUTH_SERVER_URL'),
  },
};
