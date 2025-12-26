
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black p-8">
          <div className="max-w-2xl w-full bg-zinc-900/50 rounded-3xl border border-red-500/30 p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-600/20 p-4 rounded-xl border border-red-500/30">
                <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bungee text-white">Something Went Wrong</h2>
                <p className="text-zinc-400 text-sm mt-1">The app encountered an unexpected error</p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <p className="text-red-400 font-mono text-sm">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-zinc-500 text-xs cursor-pointer hover:text-zinc-400 uppercase font-bold tracking-wider">
                      Error Details
                    </summary>
                    <pre className="text-zinc-500 text-xs mt-2 overflow-auto max-h-64 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-redo"></i>
                RESTART APP
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-arrow-left"></i>
                GO BACK
              </button>
            </div>

            <div className="text-center text-zinc-500 text-xs space-y-2">
              <p>If this keeps happening, try:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Clear your browser cache and reload</li>
                <li>Check your .env.local file has valid API keys</li>
                <li>Verify your internet connection</li>
                <li>Check browser console for more details</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
