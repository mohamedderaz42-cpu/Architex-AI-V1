import React, { ErrorInfo, ReactNode } from 'react';
import { GlassPanel } from './GlassPanel';
import { WrenchIcon } from './icons/WrenchIcon';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-brand-dark flex items-center justify-center p-4">
          <GlassPanel className="w-full max-w-sm p-8 text-center border-red-500/30">
            <WrenchIcon className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-white">System Malfunction</h2>
            <p className="text-slate-300 mt-2 mb-6">
              The architectural core encountered a critical failure.
            </p>
            <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10 text-left mb-6 overflow-auto max-h-48">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Error Trace:</p>
                <code className="text-xs text-red-300 font-mono block whitespace-pre-wrap">
                    {this.state.error?.message || "Unknown Error"}
                    {this.state.error?.stack && `\n\n${this.state.error.stack.split('\n')[1]}`}
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
