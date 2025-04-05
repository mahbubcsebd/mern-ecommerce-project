// components/ErrorBoundary.jsx
import { useEffect } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import ErrorUI from './ErrorUI';

function logErrorToService(error, info) {
  // Implement your error logging service here
  console.error('Caught an error:', error, info);
}

function CustomErrorBoundary({ children }) {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleRejection = (event) => {
      logErrorToService(event.reason, 'Unhandled Rejection');
    };

    // Handle errors in event listeners
    const handleError = (event) => {
      logErrorToService(event.error, 'Window Error');
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorUI}
      onError={(error, info) => logErrorToService(error, info)}
      onReset={() => {
        // Reset the state of your app here
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default CustomErrorBoundary;
