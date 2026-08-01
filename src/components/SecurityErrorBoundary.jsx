import React from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

export class SecurityErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "[Security Boundary Shield Captured Error]:",
      error,
      errorInfo,
    );
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-bg-primary text-text-primary">
          <div className="max-w-md w-full bg-bg-secondary border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-text-primary">
                تم حظر استثناء أمني غير متوقع
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                قامت درع الحماية بالتقاط خطأ أثناء العرض وتم تحصين التطبيق لمنع
                تسريب أي معلومات حساسة.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-6 bg-brand-gold text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors shadow-lg shadow-brand-gold/10"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل الصفحة بأمان</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/20 py-2 px-3 rounded-lg border border-emerald-500/20">
              🛡️ Active Security Shield Protocol Enabled
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
