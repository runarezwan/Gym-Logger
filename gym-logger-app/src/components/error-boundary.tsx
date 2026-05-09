'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy px-6 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-black font-outfit uppercase italic text-white mb-2 tracking-tighter">System Error</h1>
          <p className="text-slate-500 text-sm font-medium mb-12 max-w-xs">{this.state.error?.message || "An unexpected error occurred."}</p>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 px-8 py-4 bg-neon-blue rounded-2xl text-navy font-black uppercase italic active:scale-95 transition-all text-xs shadow-xl shadow-neon-blue/20"
          >
            <RefreshCw className="w-4 h-4" /> Restart Session
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
