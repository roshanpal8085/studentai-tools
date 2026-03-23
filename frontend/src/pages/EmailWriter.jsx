import { useState } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';
import { 
  Mail, Loader2, Copy, RefreshCw, Send, CheckCircle, 
  HelpCircle, Sparkles, MessageSquare, Zap, Check 
} from 'lucide-react';

const EmailWriter = () => {
  const [formData, setFormData] = useState({ topic: '', tone: 'Professional' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const tones = ['Professional', 'Formal', 'Friendly', 'Persuasive', 'Urgent', 'Apologetic', 'Appreciative'];

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.topic.trim()) return;
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
      <SEO 
        title="AI Email Writer - Formal & Professional Email Generator" 
        description="Draft perfectly formatted emails instantly with our AI Email Writer. Choose your tone, describe the situation, and get professional results in seconds for free." 
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:scale-110">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Email Writer</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop overthinking every sentence. Draft perfectly toned emails for professors, employers, or peers in an instant.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Config Side */}
          <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-8 md:p-10 h-fit">
            <h2 className="text-2xl font-bold dark:text-white mb-8 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500" /> Email Setup
            </h2>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">{error}</div>}

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Context / Recipient</label>
                <textarea 
                  required 
                  name="topic" 
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})} 
                  placeholder="e.g. Asking Professor Smith for a 2-day extension on my calculus assignment because I have a sudden cold..." 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white h-40 resize-none leading-relaxed text-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Desired Tone</label>
                <div className="grid grid-cols-2 gap-3">
                  {tones.slice(0, 4).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, tone: t})}
                      className={`py-3 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border ${
                        formData.tone === t 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                        : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <select 
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})}
                    className="col-span-2 py-3 px-3 rounded-xl text-xs font-bold uppercase border bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Other Tones...</option>
                    {tones.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              
              <button 
                disabled={loading || !formData.topic.trim()} 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 mt-4 flex justify-center items-center gap-3 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />}
                <span>{loading ? 'Thinking...' : 'Generate Draft'}</span>
              </button>
            </form>
          </div>

          {/* Result Side */}
          <div className="lg:col-span-7 rounded-[2.5rem] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm min-h-[500px]">
            <div className="border-b border-slate-200 dark:border-slate-700 py-5 px-8 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" /> Generated Result
              </h2>
              <div className="flex gap-2">
                {result && (
                  <button 
                    onClick={() => handleGenerate()} 
                    title="Regenerate"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                )}
                <button 
                  disabled={!result || loading} 
                  onClick={handleCopy} 
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-sm transition-all ${
                    copied 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600 shadow-indigo-500/10'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Email'}
                </button>
              </div>
            </div>
            
            <div className="p-0 flex-grow relative overflow-hidden bg-slate-50/30 dark:bg-slate-950/20">
              {result ? (
                <textarea 
                  className="w-full h-full p-8 md:p-12 bg-transparent text-slate-800 dark:text-slate-200 outline-none resize-none leading-relaxed font-sans text-lg focus:bg-white/40 dark:focus:bg-slate-900/40 transition-all scrollbar-hide"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  spellCheck="false"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 h-full py-40 opacity-30">
                  <Mail className="w-24 h-24 mb-6" />
                  <p className="text-xl font-bold text-center">Your professional email <br/> is one click away.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
           <div>
             <h2 className="text-3xl font-extrabold dark:text-white mb-8">Professional Email Tips</h2>
             <div className="space-y-6">
               {[
                 { title: 'Clear Subject Lines', desc: 'Always include your name and the purpose of the email (e.g., Extension Request - John Doe).' },
                 { title: 'Choosing the Right Tone', desc: 'Use \"Formal\" for people you haven\'t met, and \"Professional\" for daily academic work.' },
                 { title: 'Call to Action', desc: 'End your email with a clear next step or question to ensure a timely response.' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center flex-shrink-0 font-bold">{i+1}</div>
                   <div>
                     <h3 className="font-bold text-lg dark:text-white">{item.title}</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
           <div className="glass-card rounded-[3rem] p-10 md:p-14">
             <h2 className="text-2xl font-extrabold dark:text-white mb-8">Frequently Asked Questions</h2>
             <div className="space-y-6">
               {[
                 { q: 'Can I use this for job applications?', a: 'Absolutely. Use the \"Persuasive\" or \"Professional\" tones for cover letters or introductory emails to recruiters.' },
                 { q: 'Does it support attachments?', a: 'The AI helps you write the email text. You will still need to attach documents manually in your email provider.' },
                 { q: 'Is the content AI-detectable?', a: 'We focus on natural, human-like professional language. However, we always recommend reviewing and minorly editing the draft to add your personal voice.' }
               ].map((faq, i) => (
                 <div key={i} className="space-y-2">
                   <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                   </h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm">{faq.a}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmailWriter;
