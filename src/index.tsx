import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider } from './core/i18n/LanguageContext';
// 1. استيراد المزود الجديد
// المسار الصحيح الآن:
import { ToastProvider } from './components/ToastProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        {/* 2. تغليف التطبيق بالمزود هنا */}
        <ToastProvider>
          <App />
        </ToastProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
