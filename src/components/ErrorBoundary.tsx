
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GlassPanel } from './GlassPanel';
import { WrenchIcon } from './icons/WrenchIcon';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-brand-dark flex items-center justify-center p-4">
          <GlassPanel className="w-full max-w-sm p-8 text-center border-red-500/30">
            <WrenchIcon className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-white">System Malfunction</h2>
            <p className="text-slate-300 mt-2 mb-6">
              Our architects encountered an unexpected structural issue.
            </p>
            <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10 text-left mb-6 overflow-auto max-h-32">
                <code className="text-xs text-red-300 font-mono">
                    {this.state.error?.message || "Unknown Error"}
                </code>
            </div>
            <button
              onClick={this.handleReload}
              className="w-full px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white hover:bg-pi-gold transition-all"
            >
              Reboot System
            </button>
          </GlassPanel>
        </div>
      );
    }

    return this.props.children;
  }
}
