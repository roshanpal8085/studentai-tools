import { Helmet } from 'react-helmet-async';

const Contact = () => (
  <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 flex justify-center items-center">
    <Helmet><title>Contact - StudentAI Tools</title></Helmet>
    <div className="max-w-2xl w-full mx-auto px-4">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Have questions or need support? We're here to help.</p>
        
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl mb-8 border border-slate-100 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</p>
          <a href="mailto:roshanpal8085@gmail.com" className="text-primary hover:text-indigo-600 font-bold text-xl">
            roshanpal8085@gmail.com
          </a>
        </div>
        
        <div className="text-left mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
             <div>
               <h3 className="font-semibold text-slate-800 dark:text-slate-200">Are the AI tools free?</h3>
               <p className="text-slate-600 dark:text-slate-400 mt-1">Yes, our essential academic AI tools are currently completely free to use!</p>
             </div>
             <div>
               <h3 className="font-semibold text-slate-800 dark:text-slate-200">Is my data secure?</h3>
               <p className="text-slate-600 dark:text-slate-400 mt-1">We respect your privacy. PDF files are deleted immediately after processing.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
