import { useState, useEffect } from 'react';
import { Cookie, X, CheckCircle, Settings } from 'lucide-react';

const COOKIE_KEY = 'studentai_cookie_consent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ necessary: true, analytics: true, advertising: true, ts: Date.now() }));
    setVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ necessary: true, analytics: false, advertising: false, ts: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-lg z-[9999] animate-in slide-in-from-bottom-4 duration-500"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Cookie className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base">Cookie Preferences</span>
          </div>
          <button
            onClick={acceptNecessary}
            aria-label="Dismiss cookie banner"
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We use cookies to keep the site running and to serve relevant ads via{' '}
            <strong className="text-slate-700 dark:text-slate-300">Google AdSense</strong> — which is how we keep StudentAI Tools 100% free for students.
            {!showDetails && (
              <button
                onClick={() => setShowDetails(true)}
                className="ml-1 text-indigo-600 dark:text-indigo-400 underline underline-offset-2 font-medium"
              >
                Learn more
              </button>
            )}
          </p>

          {showDetails && (
            <div className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Strictly Necessary</p>
                  <p>Required for the site to function. Cannot be disabled.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <Settings className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Advertising (Google AdSense)</p>
                  <p>
                    Google uses cookies (including the DART cookie) to show relevant ads based on your browsing history. You can opt out at{' '}
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline">
                      Google Ad Settings
                    </a>.
                  </p>
                </div>
              </div>
              <p className="text-xs">
                Read our{' '}
                <a href="/privacy-policy" className="text-indigo-600 dark:text-indigo-400 underline">Privacy Policy</a>{' '}
                for full details.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={acceptAll}
            id="cookie-accept-all"
            className="flex-1 py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
          >
            Accept All Cookies
          </button>
          <button
            onClick={acceptNecessary}
            id="cookie-accept-necessary"
            className="flex-1 py-3 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all text-sm"
          >
            Necessary Only
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
