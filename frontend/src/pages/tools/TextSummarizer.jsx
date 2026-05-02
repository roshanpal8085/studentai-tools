import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { FileText, Loader2, Send, BookOpen, HelpCircle, CheckCircle, Copy, Check, Zap, Target } from 'lucide-react';

const TextSummarizer = () => {
  const [text, setText] = useState('');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/summarize`, {
        text, length
      });
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="AI Text Summarizer - Free Online Context Generator" 
        canonical="/ai-text-summarizer"
        description="Fast and wildly accurate AI text summarizer. Turn long articles, essays, and dense documents into incredibly concise, reliable summaries in seconds."
        keywords="ai text summarizer, article summarizer, free study tool, text condenser, ai summarizer online"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Text Summarizer",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "Powerful AI tool for condensing long articles and documents into concise summaries.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 mb-4 transition-transform hover:-translate-y-1 shadow-lg shadow-blue-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #0ea5e9)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Text Summarizer</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Gain back hours of reading time. Turn long, dense articles or difficult book chapters into highly actionable, concise paragraphs instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Input Side */}
          <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-8 md:p-10 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Source Content
                </h2>
            </div>
            <form onSubmit={handleGenerate} className="flex-grow flex flex-col p-8 md:p-10 space-y-6">
              <div className="flex-grow">
                <textarea 
                  required
                  placeholder="Paste your painfully long article, essay, or academic text here..."
                  className="w-full h-full min-h-[300px] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 dark:text-slate-200 resize-none custom-scrollbar"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Summary Detail Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {['short', 'medium', 'long'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLength(l)}
                      className={`py-3 px-4 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${
                        length === l 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={loading || !text.trim()}
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex justify-center items-center gap-3 disabled:opacity-50 group active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                <span className="text-lg uppercase tracking-tight">{loading ? 'Condensing...' : 'Generate AI Summary'}</span>
              </button>
            </form>
          </div>

          {/* Result Side */}
          <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col bg-white/30 dark:bg-slate-950/20 relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl point-events-none"></div>

            <div className="p-8 md:p-10 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex justify-between items-center z-10">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Executive Output
              </h2>
              {result && (
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all font-bold text-xs uppercase tracking-widest active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            
            <div className="p-8 md:p-10 flex-grow overflow-y-auto custom-scrollbar relative z-10">
              {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/50 rounded-2xl mb-6 shadow-sm">{error}</div>}
              
              {result ? (
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-p:font-medium animate-in fade-in duration-500">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10 opacity-30">
                  <BookOpen className="w-24 h-24 mb-6" />
                  <p className="text-2xl font-black mb-2">Blank Canvas</p>
                  <p className="text-sm font-bold text-center max-w-xs">Drop your heavy reading on the left to instantly extract the vital information.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Productivity Tools Hub
        </div>

        {/* ── SEO E-E-A-T Content ───────────────────────────────────────────── */}
        <div className="prose prose-lg prose-blue dark:prose-invert max-w-4xl mx-auto mb-20 space-y-12">
          <section className="bg-white dark:bg-slate-800/50 rounded-[3rem] p-10 md:p-14 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">How to Use an AI Text Summarizer to Accelerate Your Research</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              In today's academic and professional environments, we suffer from information overload. You are often required to read dozens of long articles, reports, and textbook chapters just to extract a few key points. A <strong>text summarizer</strong> uses advanced natural language processing to identify the core thesis and supporting evidence of any text, stripping away the filler and giving you exactly what you need.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Whether you are conducting a literature review, preparing for a seminar, or just trying to decide if a 30-page research paper is actually relevant to your essay, our AI Summarizer can cut your reading time by up to 80%.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Top 3 Use Cases for Students and Professionals</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">The "Should I Read This?" Test</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Before dedicating two hours to reading a dense academic journal article, paste the introduction and conclusion into the summarizer. The output will immediately tell you if the article contains data relevant to your specific research question.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Literature Reviews</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">When writing a literature review, you need to synthesize the findings of multiple authors. Use the "Short" summary setting on several different papers to easily compare their methodologies and conclusions side-by-side.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Executive Summaries for Reports</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">If you have just finished writing a massive 20-page business report or capstone project, paste your own writing into the tool. It will generate a perfect, unbiased Executive Summary to place at the beginning of your document.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Choosing the Right Summary Length</h2>
            <div className="grid md:grid-cols-3 gap-6 not-prose">
              <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">Short (Abstract)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Generates a 1-3 sentence TL;DR (Too Long; Didn't Read). Perfect for scanning news articles, quick emails, or getting the absolute core thesis of a document.</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">Medium (Executive)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Creates a balanced 1-2 paragraph summary. This is the default mode, providing enough context to understand the argument without reading the full text.</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 mb-2">Long (Outline)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Produces a highly detailed summary, often including bullet points of key arguments and statistics. Best for studying for exams when you need to remember the nuance.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Effortless <span className="text-blue-500" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #0ea5e9)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Extraction</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Variable Densities', desc: 'Choose between short, punchy executive summaries or longer, more descriptive outlines depending on how much deep context you actually need.', icon: Zap },
                { title: 'Information Retention', desc: 'Our engine is specifically trained to locate core arguments, numerical data points, and thesis statements, leaving the conversational fluff behind.', icon: Target },
                { title: 'Zero File Tracking', desc: 'Summarize highly confidential research data securely. We utilize a strict local session model where your inputs are discarded instantly post-generation.', icon: CheckCircle }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl point-events-none"></div>
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Summarizer FAQ</h2>
            <div className="space-y-6 relative z-10">
              {[
                { q: 'How accurate is the resulting summary?', a: 'Highly accurate. Our specific AI model is meticulously trained on intense academic and dense professional texts to maintain proper context without hallucinatory gaps.' },
                { q: 'Is there a rigid input word limit?', a: 'You can comfortably summarize up to ~10,000 words in a single ping. For longer manuscripts or full ebooks, we strongly advise summarizing chapter-by-chapter.' },
                { q: 'Can it automatically ingest PDF files?', a: 'You can easily copy text directly from a standard PDF and paste it into the editor. For complex formatting, we suggest utilizing our distinct "Chat with PDF" tool.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-blue-500" /> {faq.q}
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

export default TextSummarizer;
