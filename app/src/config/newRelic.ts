import NewRelic from 'newrelic-react-native-agent';
import { config } from 'src/config';

const agentConfiguration = {
  // Android Specific
  // Optional: Enable or disable collection of event data.
  analyticsEventEnabled: true,

  // Optional: Enable or disable crash reporting.
  crashReportingEnabled: true,

  // Optional: Enable or disable interaction tracing. Trace instrumentation still occurs, but no traces are harvested. This will disable default and custom interactions.
  interactionTracingEnabled: true,

  // Optional: Enable or disable reporting successful HTTP requests to the MobileRequest event type.
  networkRequestEnabled: true,

  // Optional: Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
  networkErrorRequestEnabled: true,

  // Optional: Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
  httpRequestBodyCaptureEnabled: true,

  // Optional: Enable or disable agent logging.
  loggingEnabled: true,

  // Optional: Specifies the log level. Omit this field for the default log level.
  // Options include: ERROR (least verbose), WARNING, INFO, VERBOSE, AUDIT (most verbose).
  logLevel: NewRelic.LogLevel.INFO,
};

export function setUpNewRelicIfEnabled() {
  if (!config.newRelicApplicationToken) {
    return;
  }

  NewRelic.startAgent(config.newRelicApplicationToken, agentConfiguration);
  NewRelic.setJSAppVersion(config.versionName);
}
