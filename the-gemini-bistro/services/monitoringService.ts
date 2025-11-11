// This is a mock service to simulate Sentry and Google Analytics integration.
// In a real-world application, you would install the actual SDKs
// (e.g., `@sentry/react`, `react-ga4`).

const IS_MONITORING_ENABLED = true; // Set to false to disable all monitoring

/**
 * Initializes Sentry and Google Analytics.
 * This should be called once when the application starts.
 */
export const initializeMonitoring = () => {
    if (!IS_MONITORING_ENABLED) return;

    // --- Sentry Initialization (Mock) ---
    // In a real app:
    // Sentry.init({
    //   dsn: "YOUR_SENTRY_DSN",
    //   integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    //   tracesSampleRate: 1.0,
    //   replaysSessionSampleRate: 0.1,
    // });
    console.log("Monitoring Service: Sentry initialized (mock).");

    // --- Google Analytics Initialization (Mock) ---
    // In a real app, you might use a library like react-ga4:
    // ReactGA.initialize("YOUR_GA_MEASUREMENT_ID");
    console.log("Monitoring Service: Google Analytics initialized (mock).");
};

/**
 * Logs an error to Sentry.
 * @param error The error object.
 * @param extraData Additional context to send with the error report.
 */
export const logError = (error: Error, extraData?: Record<string, any>) => {
    if (!IS_MONITORING_ENABLED) return;

    // In a real app:
    // Sentry.withScope(scope => {
    //   if (extraData) {
    //     scope.setExtras(extraData);
    //   }
    //   Sentry.captureException(error);
    // });
    console.error("Sentry (mock):", error, extraData);
};

/**
 * Tracks a page view in Google Analytics.
 * @param page The name or path of the page being viewed.
 */
export const trackPageView = (page: string) => {
    if (!IS_MONITORING_ENABLED) return;

    // In a real app:
    // ReactGA.send({ hitType: "pageview", page: `/${page}` });
    console.log(`GA4 (mock): PageView - /${page}`);
};

/**
 * Tracks a custom event in Google Analytics.
 * @param eventName The name of the event (e.g., 'button_click').
 * @param eventParams Additional parameters for the event.
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (!IS_MONITORING_ENABLED) return;
    
    // In a real app:
    // ReactGA.event(eventName, eventParams);
    console.log(`GA4 (mock): Event - ${eventName}`, eventParams);
};
