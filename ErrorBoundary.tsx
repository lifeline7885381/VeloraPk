import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
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
    console.error('Uncaught error in UI component:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#F5D76E] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-[#FFD700]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide mb-3">
            Sovereign Session Reconnect
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md mb-8 leading-relaxed font-sans">
            The luxury vault encountered an interruption. Your selected preferences and shopping items are secure.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reload VELORA PK
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
