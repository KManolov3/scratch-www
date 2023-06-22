# AAP In-Store Apps

## Environment Variables

Environment variables are read by default from `.env` (e.g. `LAUNCH_DARKLY_MOBILE_KEY`).
All of the required variables are listed within `.env.example`.
Note that only variables defined in the `.env` and `.env.*` files work - you cannot set
actual environment variables (in the process environment) - these won't be picked up.

Explanation of the semantics of each variable can be found below.

### Build-Time Variables

- **APPLICATION_ID** - The android application/bundle/package id
- **VERSION_CODE** - The `versionCode` android property. Should always be a number
- **VERSION_NAME** - An identifier of the app version - used for the `versionName` android property
- **BUILD_INFO** - A debug identifier of the build, typically the commit hash and environment
- **SHOW_DEBUG_UI** - Whether to show debug information in the UI

### Backend

- **API_URL** - The URL to the graphql server. Should include the `/graphql` path as well

### Custom Android strings

Environment variables which start with `STRINGS_XML_` are put in the Android `env_strings.xml` file
and can be referenced in other files such as `AndroidManifest.xml`.
For example `STRINGS_XML_APP_NAME=Inventory Apps` becomes `<string name="app_name">Inventory Apps</string>`
as the `APP_NAME` part is lowercased and used for the `name`.

### Authentication

- **OKTA_CLIENT_ID** - The client id of application in Okta
- **OKTA_AUTH_SERVER_URL** - The Okta auth server (for example, `https://advanceauto.oktapreview.com/oauth2/aus1lqs5cuniao55d0h8`)

### LaunchDarkly

LaunchDarkly is a feature flagging/dynamic configuration tool used by the application.

- **LAUNCH_DARKLY_MOBILE_KEY** - Environment specific key, needed in order to connect with AAP's Launch Darkly account.
