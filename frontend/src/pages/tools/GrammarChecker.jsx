import { useState } from 'react';
import { SpellCheck, Loader2, Sparkles, CheckCircle, HelpCircle, Zap, ShieldCheck, Search, Copy, Info } from 'lucide-react';
import axios from 'axios';
import SEO from '../../components/SEO';

const GrammarChecker = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat-pdf`, {
        question: `Act as a professional grammar checker. Analyze the following text, fix all grammatical errors, and explain what you changed. Text: "${text}"`,
        pdfText: "NO_PDF", history: []
      });
      setResult(res.data.answer);
    } catch (err) {
      setError("Our AI models are currently overwhelmed or offline. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) navigator.clipboard.writeText(result);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free AI Grammar & Proofreading Checker - Premium Standards" 
        description="Fix spelling, syntax, and punctuation errors instantly with our AI-powered grammar engine. Get flawless essays and professional emails for free online."
        keywords="ai grammar checker, grammar corrector, free proofreading, spelling checker, sentence fixer"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Grammar Checker",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "Professional-grade AI proofreading and grammar correction tool for students and business writers.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-500 mb-4 transition-transform hover:-translate-y-1 shadow-lg shadow-teal-500/20">
            <SpellCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #14b8a6, #0d9488)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Grammar Checker</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate critical errors and dynamically enhance your writing. Professional-grade AI proofreading optimized for academic essays and business emails.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Input Block */}
          <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px] transition-all hover:border-teal-500/30">
            <div className="px-8 py-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
               <div className="flex items-center gap-2">
                 <Search className="w-4 h-4 text-teal-500" />
                 <span className="text-xs font-black uppercase tracking-widest text-slate-500">Source Text Frame</span>
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{text.length} / 5000 LIMIT</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the writing you desperately want to perfect here..."
              className="flex-grow p-8 bg-white/20 dark:bg-slate-950/20 border-none focus:ring-0 resize-none text-slate-800 dark:text-slate-200 text-lg leading-relaxed outline-none font-medium custom-scrollbar"
            ></textarea>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
              <button 
                onClick={handleCheck}
                disabled={loading || !text.trim() || text.length > 5000}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                <span className="text-lg uppercase tracking-tight">{loading ? 'Analyzing Syntax...' : 'Check Writing Integrity'}</span>
              </button>
            </div>
          </div>

          {/* Results Block */}
          <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px] bg-white/30 dark:bg-slate-950/20 transition-all relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl point-events-none"></div>
             
             <div className="px-8 py-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
               <div className="flex items-center gap-2">
                 <CheckCircle className="w-4 h-4 text-emerald-500" />
                 <span className="text-xs font-black uppercase tracking-widest text-slate-500">Corrected Analysis</span>
               </div>
               {result && (
                 <button onClick={handleCopy} className="text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                   <Copy className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Copy</span>
                 </button>
               )}
            </div>
            
            <div className="flex-grow p-8 overflow-y-auto custom-scrollbar relative z-10">
              {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl mb-6 border border-red-200 dark:border-red-900/50 text-sm font-bold text-center shadow-sm">{error}</div>}
              {result ? (
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 leading-relaxed font-medium whitespace-pre-wrap animate-in fade-in duration-500">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-30">
                  <SpellCheck className="w-20 h-20 mb-6" />
                  <p className="text-xl font-bold">Awaiting Input Data</p>
                  <p className="text-sm max-w-xs text-center mt-2">Paste text into the left module to receive deep semantic and syntactic corrections.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Educational Tools Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Advanced <span className="text-teal-500" style={{ backgroundImage: 'linear-gradient(to right, #14b8a6, #0d9488)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Proofreading</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Semantic Corrections', desc: 'Our engine identifies complex, context-aware errors that standard spell-checkers consistently miss, such as minor homophone confusion and advanced tense shifts.', icon: Info },
                { title: 'Structural Integrity', desc: 'Beyond just fixing basic words, we carefully analyze overall paragraph flow and sentence variety to suggest macro-structural improvements for academic work.', icon: Zap },
                { title: 'Privacy Shielded Architecture', desc: 'Your highly sensitive content is processed securely on the fly. It is never permanently stored or used for backend model training data.', icon: ShieldCheck }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                     <item.icon className="w-7 h-7" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden h-fit">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl point-events-none"></div>
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Grammar FAQ</h2>
            <div className="space-y-6 relative z-10">
              {[
                { q: 'Is it completely free?', a: 'Yes! Our AI-powered advanced proofreading module is 100% free with absolutely no hidden monthly limits or "premium-only" semantic features.' },
                { q: 'Does it support alternative dialects?', a: 'Currently, the underlying model engine heavily excels at Standard US and UK English syntax, supporting rigorous academic and professional formalisms.' },
                { q: 'Why is there a character limit?', a: 'To ensure processing speed and server stability, the model analyzes syntax chunks across strict blocks up to 5000 characters per individual ping.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-teal-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GrammarChecker;
