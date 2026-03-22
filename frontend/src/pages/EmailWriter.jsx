import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

import { Mail, Loader2, Copy, RefreshCw, Send } from 'lucide-react';

const EmailWriter = () => {
  const [formData, setFormData] = useState({ topic: '', tone: 'Professional' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const tones = ['Professional', 'Formal', 'Friendly', 'Persuasive', 'Urgent', 'Apologetic', 'Appreciative'];

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setCopied(false);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/email`, formData);
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating email. Please ensure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <Helmet><title>AI Email Writer - StudentAI Tools</title></Helmet>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">AI Email Writer</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Draft perfectly formatted, highly effective emails for any situation in seconds.</p>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 h-fit">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Email Configuration</h2>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">What is this email about?</label>
                <textarea 
                  required 
                  name="topic" 
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})} 
                  placeholder="e.g. Asking my professor for an extension on the database assignment due to a family emergency..." 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white h-32 resize-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Tone</label>
                <div className="relative">
                  <select 
                    name="tone" 
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer relative z-10"
                  >
                    {tones.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 z-20">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.707a1 1 0 011.414 0L10 11.586l3.293-3.879a1 1 0 111.414 1.414l-4 4.707a1 1 0 01-1.414 0l-4-4.707a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>
              
              <button disabled={loading || !formData.topic.trim()} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-md mt-4 flex justify-center items-center space-x-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                <span>{loading ? 'Drafting Email...' : 'Generate Email'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-700 overflow-hidden flex flex-col h-[600px] lg:h-auto min-h-[500px]">
            <div className="bg-slate-900 border-b border-slate-700 py-4 px-6 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400">Generated Draft</span>
              <div className="flex space-x-2">
                <button 
                  disabled={!result || loading} 
                  onClick={() => handleGenerate()} 
                  className="flex items-center space-x-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg text-sm font-medium border border-slate-700"
                  title="Regenerate"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Retry</span>
                </button>
                <button 
                  disabled={!result || loading} 
                  onClick={handleCopy} 
                  className={`flex items-center space-x-1.5 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                >
                  {copied ? <span className="flex items-center"><span className="w-4 h-4 mr-1.5">✓</span> Copied!</span> : <><Copy className="w-4 h-4" /><span>Copy Text</span></>}
                </button>
              </div>
            </div>
            
            <div className="p-0 flex-grow relative bg-white dark:bg-slate-950">
              {result ? (
                <textarea 
                  className="w-full h-full p-6 md:p-8 bg-transparent text-slate-800 dark:text-slate-200 outline-none resize-none leading-relaxed font-sans text-lg focus:ring-inset focus:ring-4 focus:ring-indigo-500/20"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  spellCheck="false"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 h-full absolute inset-0">
                  <Mail className="w-16 h-16 opacity-20 mb-4" />
                  <p className="text-lg">Your generated email will appear here ready to review.</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EmailWriter;
