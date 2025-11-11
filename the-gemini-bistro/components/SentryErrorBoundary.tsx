import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '../services/monitoringService';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class SentryErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    logError(error, { componentStack: errorInfo.componentStack });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center p-4">
          <h1 className="text-3xl font-bold text-amber-400 mb-4">Oops! Something went wrong.</h1>
          <p className="text-gray-300 mb-6">
            We're sorry for the inconvenience. Our team has been notified and is working to fix the issue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition duration-300"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SentryErrorBoundary;
