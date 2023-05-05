# AAP In-Store Apps

## Environment Variables

Environment variables are read by default from `.env` (e.g. `LAUNCH_DARKLY_MOBILE_KEY`).  
All of the required variables are listed within `.env.sample`. 

Explanation of the semantics of each variable can be found below.

### Generic Variables

- **BUILD** - A unique identifier of the build in the format `branch-environment-appVersion-commitTime`.

- **VERSION** - A unique identifier of the app version. Its value is set to the value of the version property from package.json (e.g 1.0.0).

### LaunchDarkly

LaunchDarkly is a feature flagging/dynamic configuration tool used by the application.

- **LAUNCH_DARKLY_MOBILE_KEY** - Environment specific key, needed in order to connect with AAP's Launch Darkly account.