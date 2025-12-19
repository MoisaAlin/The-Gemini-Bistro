
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeMonitoring } from './services/monitoringService';
import SentryErrorBoundary from './components/SentryErrorBoundary';
import { LanguageProvider } from './contexts/LanguageContext';

// Initialize Sentry and GA4
initializeMonitoring();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </SentryErrorBoundary>
  </React.StrictMode>
);
