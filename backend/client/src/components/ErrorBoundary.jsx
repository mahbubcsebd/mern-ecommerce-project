import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Error paile state update kore
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Optional: Error logging er jonno
    this.setState({ errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI dekhanor jonno
      return (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fdecea',
            border: '1px solid #f5c2c7',
            borderRadius: '5px',
          }}
        >
          <h2>Something went wrong!</h2>
          <p>{this.state.error?.toString()}</p>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
