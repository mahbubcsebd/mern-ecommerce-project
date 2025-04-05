// components/ErrorUI.jsx
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router';
import 'tippy.js/dist/tippy.css';

export default function ErrorUI({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  const errorDetails = {
    message: error.message,
    stack: error.stack,
    type: error.name,
    // Add more details as needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl">
        <div className="bg-rose-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
              <p className="opacity-90">
                We've hit a snag. Here's what happened:
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-rose-500 mt-0.5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-rose-800">
                  {errorDetails.type} Error
                </h3>
                <p className="text-rose-700">{errorDetails.message}</p>
              </div>
            </div>
          </div>

          <Tippy
            content="Click to see details"
            placement="bottom"
          >
            <details className="mb-6 bg-gray-50 rounded-lg overflow-hidden cursor-pointer">
              <summary className="p-3 bg-gray-100 font-medium flex items-center justify-between">
                <span>Technical Details</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 transform transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <pre className="p-3 text-xs bg-gray-800 text-gray-100 overflow-x-auto max-h-60">
                {errorDetails.stack}
              </pre>
            </details>
          </Tippy>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>

            <button
              onClick={() => navigate('/faqs')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </button>

            <button
              onClick={() => {
                navigate(-1);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}