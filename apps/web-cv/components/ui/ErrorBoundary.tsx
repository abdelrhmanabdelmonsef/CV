'use client';

import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="wrapper" style={{ paddingTop: '4rem', textAlign: 'center' }}>
            <div className="terminal-tag" style={{ margin: '0 auto 1rem' }}>error --code 500</div>
            <h1 className="name" style={{ fontSize: '2.5rem' }}>Something went wrong</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              An unexpected error occurred. Please refresh the page or try again later.
            </p>
            <button
              className="hud-btn"
              onClick={() => window.location.reload()}
              style={{ margin: '0 auto' }}
            >
              Reload Page
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
