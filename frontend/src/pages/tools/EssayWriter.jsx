import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { 
  PenTool, Loader2, Send, CheckCircle, HelpCircle, 
  FileText, Sparkles, BookOpen, Quote, Languages, Copy, Check 
} from 'lucide-react';

const EssayWriter = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('Argumentative');
  const [length, setLength] = useState('500');
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setCopied(false);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/essay-writer`, {
        topic, type, length, keywords
      });
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating essay. Please try again.');
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
        title="AI Essay Writer - Generate Academic Essays for Free" 
        description="Craft high-quality, structured essays in seconds with our AI Essay Writer. Perfect for argumentative, descriptive, and persuasive essays with proper academic flow."
        keywords="ai essay writer, essay generator, academic writing tool, free essay maker, student ai"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Essay Writer",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "Powerful AI tool for generating well-structured academic essays across multiple genres.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:scale-110">
            <PenTool className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Essay Writer</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From outlines to complete drafts. Generate well-structured academic essays with logical flow and intellectual depth instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Settings Panel */}
          <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-8 md:p-10 h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <Languages className="w-6 h-6 text-indigo-500" /> Composition Setup
              </h2>
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Essay Topic</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g., The ethical implications of genetic engineering..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Essay Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option>Argumentative</option>
                    <option>Descriptive</option>
                    <option>Persuasive</option>
                    <option>Expository</option>
                    <option>Narrative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Target Length</label>
                  <select 
                    value={length} 
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="300">Short (~300)</option>
                    <option value="500">Medium (~500)</option>
                    <option value="800">Long (~800)</option>
                    <option value="1200">Extensive (~1200)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Key Focus Points (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g., climate change, policy makers, urban planning..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              <button 
                disabled={loading || !topic.trim()}
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex justify-center items-center gap-3 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />}
                <span>{loading ? 'Drafting Excellence...' : 'Generate AI Essay'}</span>
              </button>
            </form>
          </div>

          {/* Essay Output Panel */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-[600px]">
             <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex items-center justify-between">
               <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                 <FileText className="w-6 h-6 text-indigo-500" /> Academic Draft
               </h2>
               <button 
                 disabled={!result || loading} 
                 onClick={handleCopy} 
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                   copied 
                   ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                   : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600'
                 }`}
               >
                 {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copied ? 'Copied' : 'Copy Essay'}
               </button>
             </div>
             
             <div className="flex-grow p-8 md:p-14 overflow-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
               {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 border border-red-100 text-sm font-bold">{error}</div>}
               
               {result ? (
                 <div className="prose prose-indigo dark:prose-invert max-w-none prose-p:leading-loose prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300">
                   <ReactMarkdown>{result}</ReactMarkdown>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20 opacity-30 text-center">
                   <BookOpen className="w-24 h-24 mb-6" />
                   <p className="text-2xl font-black">Your future masterpiece <br/> is waiting...</p>
                   <p className="text-sm font-normal mt-4">Drafts will include Introduction, Body Paragraphs, and Conclusion.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Informational Guidance (SEO Masterclass) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Mastering <span className="text-indigo-600">Academic Writing</span></h2>
            <div className="space-y-10">
              {[
                { title: 'The Thesis Statement', desc: 'Every great essay starts with a strong, arguable claim. Our AI ensures your introduction sets a clear path for the reader.', icon: Quote },
                { title: 'Logical Transitions', desc: 'Seamlessly move between ideas. We focus on structural flow to ensure your arguments are coherent and professional.', icon: FileText },
                { title: 'Evidence Handling', desc: 'Good essays use theoretical frameworks. We provide a foundation of logical reasoning that you can supplement with specific research.', icon: PenTool }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                     <item.icon className="w-7 h-7" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden h-fit">
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Essay Writing FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Is the essay plagiarism-free?', a: 'Yes! Our AI generates original content for every prompt. However, we always recommend verifying facts and adding your own voice.' },
                { q: 'Can I choose the length?', a: 'Yes, from a 300-word summary to a comprehensive 1200-word academic piece.' },
                { q: 'What essay types are supported?', a: 'Argumentative, descriptive, persuasive, expository, and narrative essays are all supported by our model.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayWriter;
