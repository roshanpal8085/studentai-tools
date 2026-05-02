import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { 
  BookMarked, Loader2, Send, CheckCircle, HelpCircle, 
  FileText, Sparkles, Pencil, BookOpen, Layers, Copy, Check 
} from 'lucide-react';

const NotesGenerator = () => {
  const [content, setContent] = useState('');
  const [format, setFormat] = useState('Cornell Method');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    setCopied(false);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/notes-generator`, {
        content, format
      });
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating notes. Please try again.');
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
        title="AI Notes Generator - Structured Study Notes for Students" 
        canonical="/ai-notes-generator"
        description="Transform lecture transcripts, long articles, or book chapters into structured, high-quality study notes. Supports Cornell Method, Outlines, and more."
        keywords="ai notes generator, study notes maker, cornell notes system, transcript to notes, student ai"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Notes Generator",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "AI-powered tool for transforming raw educational content into structured study notes and Cornell summaries.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-primary mb-4 transition-transform hover:scale-110">
            <BookMarked className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Notes Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop drowning in textbooks. Turn overwhelming transcripts and chapters into clear, organized, and review-ready study notes in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Input Panel */}
          <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-8 md:p-10 h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <Pencil className="w-6 h-6 text-indigo-500" /> Note-taking Lab
              </h2>
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Note Format</label>
                <select 
                  value={format} 
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white appearance-none cursor-pointer"
                >
                  <option>Cornell Method</option>
                  <option>Outline Style</option>
                  <option>Mind Map (Hierarchical List)</option>
                  <option>Concise Summary</option>
                  <option>Q&A Format</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Paste Raw Content</label>
                <textarea 
                  required
                  placeholder="Paste your lecture transcripts, textbook chapters, or articles here..."
                  className="w-full h-56 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white resize-none text-sm leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <button 
                disabled={loading || !content.trim()}
                type="submit" 
                className="w-full bg-primary hover:bg-indigo-600 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex justify-center items-center gap-3 disabled:opacity-50 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <BookMarked className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                <span>{loading ? 'Synthesizing Wisdom...' : 'Generate Notes'}</span>
              </button>
            </form>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-[600px]">
             <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex items-center justify-between">
               <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                 <Layers className="w-6 h-6 text-primary" /> Structured Output
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
                 {copied ? 'Copied' : 'Copy Notes'}
               </button>
             </div>
             
             <div className="flex-grow p-8 md:p-14 overflow-auto custom-scrollbar bg-slate-50/20 dark:bg-transparent">
               {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 border border-red-100 text-sm font-bold">{error}</div>}
               
               {result ? (
                 <div className="prose prose-indigo dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 dark:prose-headings:text-white prose-li:my-1">
                   <ReactMarkdown>{result}</ReactMarkdown>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20 opacity-30 text-center">
                   <BookOpen className="w-24 h-24 mb-6" />
                   <p className="text-2xl font-black">Your notes will <br/> grow here...</p>
                   <p className="text-sm font-normal mt-4">Cornell, Outlines, or Mind Maps will appear instantly.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-32 glass-card rounded-3xl flex items-center justify-center text-slate-400 text-sm mb-24 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Targeted for Study Context
        </div>

        {/* Comprehensive SEO Content for AdSense E-E-A-T */}
        <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto space-y-16">
            
            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">How to Use the AI Notes Generator for Maximum Retention</h2>
              <div className="prose prose-indigo dark:prose-invert max-w-none prose-p:leading-relaxed prose-lg text-slate-600 dark:text-slate-400">
                <p>
                  Most students spend hours manually transcribing textbook chapters or lecture recordings, mistaking the physical act of writing for actual learning. The <strong>AI Notes Generator</strong> is designed to automate the mechanical formatting process, giving you back the hours you need for active recall and genuine comprehension.
                </p>
                <p>
                  Whether you are preparing for high-stakes finals, board exams, or weekly quizzes, structuring your material correctly is the first step. Here is a proven, step-by-step workflow:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 not-prose">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">1</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Select Your Input</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Copy up to 5,000 words from your source material. This works best with lecture transcripts, long articles, textbook chapters, or even disorganized personal notes.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">2</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Choose the Right Format</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Select <strong>Cornell Method</strong> for subjects requiring factual memorization (history, biology). Use <strong>Mind Map / Outline</strong> for conceptual subjects (philosophy, advanced physics).</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">3</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Generate and Review</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">The AI will extract key concepts, dates, formulas, and definitions. Read through the output immediately to ensure it aligns with your professor's emphasis.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">4</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Active Recall Testing</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Do not just read the generated notes. Take the output and paste it directly into our <strong>AI Quiz Generator</strong> to create practice questions based on your new notes.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-indigo-50 dark:bg-indigo-900/10 rounded-[3rem] p-8 md:p-12 border border-indigo-100 dark:border-indigo-800/30">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-500" /> Example: Raw Text to Cornell Notes
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Input (Raw Lecture Transcript)</h3>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700 h-64 overflow-y-auto">
                    "So today we're going to talk about mitochondria. A lot of people just call it the powerhouse of the cell, which is true, but it's more complex. Basically, it generates most of the chemical energy needed to power the cell's biochemical reactions. This energy is stored in a small molecule called ATP. Interestingly, mitochondria have their own small chromosome, their own DNA, which is different from the DNA in the nucleus..."
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Output (Cornell Format)</h3>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl text-sm text-slate-900 dark:text-slate-200 border border-indigo-200 dark:border-indigo-700 shadow-lg shadow-indigo-500/10 h-64 overflow-y-auto">
                    <strong>Cues / Keywords:</strong><br/>
                    â€¢ Mitochondria Function<br/>
                    â€¢ ATP (Adenosine Triphosphate)<br/>
                    â€¢ Mitochondrial DNA (mtDNA)<br/><br/>
                    <strong>Main Notes:</strong><br/>
                    â€¢ Primary function: Generates chemical energy for cellular reactions.<br/>
                    â€¢ Energy is stored in ATP molecules.<br/>
                    â€¢ Unique characteristic: Possesses its own independent DNA (separate from nuclear DNA).<br/><br/>
                    <strong>Summary:</strong><br/>
                    Mitochondria are organelles that produce the cell's energy (ATP) and uniquely contain their own genetic material, distinct from the cell nucleus.
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { q: 'Is the AI Notes Generator free for students?', a: 'Yes. All core tools on StudentAI, including the Notes Generator, are 100% free with no hidden paywalls or registration requirements. The platform is supported by non-intrusive educational advertisements.' },
                  { q: 'What is the maximum word count I can process at once?', a: 'You can currently process up to 5,000 words per generation. For entire textbooks or extremely long lectures, we strongly recommend processing material chapter-by-chapter for the highest quality extraction.' },
                  { q: 'Which note-taking format is best for university exams?', a: 'The Cornell Method is scientifically proven to improve retention because it forces you to separate key cues from detailed notes, creating a built-in study guide. However, for subjects like Math or Physics, the Outline format may be more effective for listing step-by-step procedures.' },
                  { q: 'Will the AI hallucinate or invent false information?', a: 'Our AI is strictly instructed to only extract and format information present in the text you provide. It acts as an organizer, not an author. However, you should always review the output to ensure critical nuance from your specific lecture wasn\'t simplified.' },
                  { q: 'Can I use this for non-academic content?', a: 'Absolutely. While optimized for students, professionals use this tool to summarize long meetings, distill dense corporate reports, and create quick reference guides from lengthy emails.' },
                  { q: 'Does it save my notes automatically?', a: 'To protect your privacy, we do not store your raw inputs or generated notes on our servers after your session ends. Always use the "Copy Notes" button to save your work to Google Docs, Notion, or Word.' }
                ].map((faq, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      {faq.q}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesGenerator;
