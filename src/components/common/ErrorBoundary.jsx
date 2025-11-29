import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Aplikasi mengalami error (kemungkinan data kosong atau cache lama).
            </p>
            <div className="bg-gray-100 p-3 rounded-lg text-left text-xs font-mono text-gray-600 mb-6 overflow-auto max-h-32">
              {this.state.error && this.state.error.toString()}
            </div>
            <Button onClick={this.handleReload} className="w-full justify-center py-3">
              <RefreshCw size={18} className="mr-2" />
              Perbaiki & Muat Ulang
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;