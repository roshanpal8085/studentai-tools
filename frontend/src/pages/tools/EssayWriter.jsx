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
        title="Free AI Essay Writer — Generate Academic Essays Instantly (2026)" 
        description="Generate well-structured argumentative, persuasive and descriptive essays in seconds. Our free AI Essay Writer is used by 2M+ students. No signup needed."
        keywords="ai essay writer, free essay generator, academic essay AI, argumentative essay writer, student AI essay tool 2026"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Essay Writer",
            "operatingSystem": "Web",
            "applicationCategory": "EducationalApplication",
            "description": "Free AI tool for generating well-structured academic essays across multiple genres including argumentative, descriptive, and persuasive.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Is the AI essay plagiarism-free?", "acceptedAnswer": { "@type": "Answer", "text": "Our AI generates completely original content for every unique prompt. It does not pull from a pre-written database. However, we recommend running the output through your institution's plagiarism checker before submission." } },
              { "@type": "Question", "name": "What essay types does the AI Essay Writer support?", "acceptedAnswer": { "@type": "Answer", "text": "We support Argumentative, Descriptive, Persuasive, Expository, and Narrative essay types. Select your type in the settings panel before generating." } },
              { "@type": "Question", "name": "Can I use the AI essay as my final submission?", "acceptedAnswer": { "@type": "Answer", "text": "We recommend using the AI output as a first draft or structural outline. Add your own specific evidence, citations, and voice before submitting. Submitting AI-generated text without editing may violate your institution's academic integrity policy." } },
              { "@type": "Question", "name": "Is it considered cheating to use this AI essay tool?", "acceptedAnswer": { "@type": "Answer", "text": "Using AI to brainstorm, outline, or overcome writer's block is widely accepted. Submitting AI-generated text as entirely your own original work without modification is considered academic misconduct at most universities. Always check your syllabus." } },
              { "@type": "Question", "name": "How do I get the best quality essay output?", "acceptedAnswer": { "@type": "Answer", "text": "Be specific in the 'Key Focus Points' field. Add the exact arguments, examples or evidence you want the AI to incorporate. The more context you provide, the higher the quality of the structured output." } }
            ]
          }
        ]}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-16 py-16 border-t border-slate-200 dark:border-slate-800">
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
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden h-fit">
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Essay Writing FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Is the essay plagiarism-free?', a: 'Yes! Our AI generates completely original content for every prompt. We do not pull pre-written essays from a database. However, you should still run it through your university\'s plagiarism checker just to be safe.' },
                { q: 'Can I choose the length?', a: 'Yes, you can select from a 300-word short summary to a comprehensive 1200-word academic piece. The AI will optimally structure introduction and conclusion paragraphs to fit the length.' },
                { q: 'What essay types are supported?', a: 'We support Argumentative (defending a claim), Descriptive (painting a picture with words), Persuasive (convincing the reader), Expository (explaining a concept), and Narrative (telling a story) essays.' },
                { q: 'How do I use the generated essay?', a: 'We strongly recommend taking the AI output as a "First Draft" or an outline. Use the claims it generated, but rewrite paragraphs in your own voice and add specific citations from your course material.' },
                { q: 'Does it write in different academic styles like APA or MLA?', a: 'The AI writes in a formal academic tone suitable for both. However, for specific in-text citations (like APA auth-date format) and bibliography generation, you will need to add those manually using our Citation Generator.' },
                { q: 'What should I put in "Key Focus Points"?', a: 'This is where you guide the AI. If your professor asked you to focus specifically on "economic impacts" in an essay about climate change, type "economic impacts, job loss, renewable energy sector" here to force the AI to include them.' },
                { q: 'Why is the output sometimes cut off?', a: 'If you select "Extensive" length for a very obscure topic, the AI might exhaust its knowledge base before hitting 1,200 words. Try providing more "Key Focus Points" to give it more material to write about.' },
                { q: 'Is it cheating to use this tool?', a: 'Submitting an AI-generated essay directly as your own work is considered academic misconduct at almost all universities. Using this tool to brainstorm, structure an outline, or overcome writer\'s block is acceptable. Always check your syllabus.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The 4 Pillars of a Perfect Academic Essay */}
        <div className="mb-24 py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">The 4 Pillars of a Perfect Academic Essay</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">
            Whether you use our AI to generate a draft or write from scratch, your final submission must contain these four structural pillars to get an A grade.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 font-black text-xl">1</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">The Hook & Context</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                The first 3 sentences of your introduction must grab attention and explain *why this topic matters now*. Do not start with "Since the beginning of time..."
              </p>
              <div className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-400">
                Example: "In 2023 alone, global e-waste reached..."
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 relative">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6 font-black text-xl">2</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">The Thesis Statement</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                The last sentence of your introduction. It must be a debatable claim, not a statement of fact. It tells the reader exactly what you intend to prove.
              </p>
              <div className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-400">
                Example: "Therefore, carbon taxes cannot succeed without simultaneous infrastructure subsidies."
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 font-black text-xl">3</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">TEEL Paragraphs</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Every body paragraph must follow TEEL: Topic sentence, Evidence (quote or data), Explanation (what the evidence means), and Link (connecting back to the thesis).
              </p>
              <div className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-400">
                Without the 'Explanation' step, quotes are just floating text.
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 relative">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 font-black text-xl">4</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">The Synthesis Conclusion</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Never just copy-paste your introduction. Synthesize your arguments. Show how the points you made in the body paragraphs *prove* the thesis you stated at the start.
              </p>
              <div className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-400">
                Leave the reader with a final thought on future implications.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EssayWriter;

