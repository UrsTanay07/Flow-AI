import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface State { hasError: boolean }

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State { return { hasError: true }; }

  componentDidCatch(error: Error) {
    console.error("FlowAI interface error", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center bg-[#0b0b0b] p-6 text-white">
        <section className="w-full max-w-lg rounded-[6px] border border-white/15 bg-[#161616] p-8 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-[#f36458]" />
          <p className="app-eyebrow mt-6">Interface recovery</p>
          <h1 className="mt-3 text-3xl tracking-[-0.04em]">This view could not be displayed.</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#b9b9b9]">Your account and recorded operations are safe. Reload the workspace to reconnect.</p>
          <button type="button" onClick={() => window.location.reload()} className="mx-auto mt-7 inline-flex h-11 items-center gap-2 rounded-[5px] bg-[#f36458] px-5 font-medium text-[#0b0b0b]">
            <RefreshCw className="h-4 w-4" /> Reload FlowAI
          </button>
        </section>
      </main>
    );
  }
}
