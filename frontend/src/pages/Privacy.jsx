import { Helmet } from 'react-helmet-async';

const Privacy = () => (
  <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
    <Helmet><title>Privacy Policy - StudentAI Tools</title></Helmet>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6">
        <p>Your privacy is important to us. This Privacy Policy explains how StudentAI Tools collects, uses, and protects your information.</p>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mt-8 mb-4">1. Data Collection</h2>
        <p>We collect information you provide directly to us when you register for an account, such as your name and email address. We also collect the content you input to generate resumes, presentations, and captions.</p>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mt-8 mb-4">2. Cookies and Third-Party Services</h2>
        <p>We use cookies to maintain your session. Furthermore, we use Google AdSense to display advertisements. Google may use advertising cookies to serve ads based on your prior visits.</p>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mt-8 mb-4">3. Data Security</h2>
        <p>We implement standard security measures, including bcrypt for passwords and helmet for headers. PDF files are processed transiently and are not permanently stored on our servers.</p>
      </div>
    </div>
  </div>
);

export default Privacy;
