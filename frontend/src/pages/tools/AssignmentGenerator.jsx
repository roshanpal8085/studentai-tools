import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { 
  FileEdit, Loader2, Send, CheckCircle, HelpCircle, 
  FileText, Sparkles, Layout, Target, ListChecks, Copy, Check 
} from 'lucide-react';

const AssignmentGenerator = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Undergraduate');
  const [instructions, setInstructions] = useState('');
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/assignment-generator`, {
        topic, level, instructions
      });
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating assignment. Please try again.');
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
        title="AI Assignment Generator - Create Comprehensive Academic Tasks" 
        description="Design detailed academic assignments in seconds. Our AI generates objectives, instructions, and grading rubrics perfect for students and educators."
        keywords="ai assignment generator, assignment maker, academic task creator, studentai tools, teacher tools"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Assignment Generator",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "Professional AI tool for generating structured academic assignments with rubrics and objectives.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 mb-4 transition-transform hover:rotate-12">
            <FileEdit className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Assignment Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Architect perfect academic tasks. Instantly generate assignments with objectives, rubrics, and detailed instructions for any level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Form Panel */}
          <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-8 md:p-10 h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-violet-500" /> Design Lab
              </h2>
              <Sparkles className="w-5 h-5 text-violet-500 animate-pulse" />
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Assignment Topic</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g., Quantum Mechanics Fundamentals..."
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white text-sm"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Academic Level</label>
                  <select 
                    value={level} 
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option>Middle School</option>
                    <option>High School</option>
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Specific Instructions (Optional)</label>
                <textarea 
                  placeholder="e.g., Include ethical considerations, 3 diagrams required, follow APA style..."
                  className="w-full h-40 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white resize-none text-sm leading-relaxed"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <button 
                disabled={loading || !topic.trim()}
                type="submit" 
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-violet-500/20 flex justify-center items-center gap-3 disabled:opacity-50 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <FileEdit className="w-5 h-5 group-hover:-rotate-12 transition-transform" />}
                <span>{loading ? 'Processing Architecture...' : 'Generate Assignment'}</span>
              </button>
            </form>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-[600px]">
             <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex items-center justify-between">
               <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                 <Layout className="w-6 h-6 text-violet-500" /> Structured Outcome
               </h2>
               <button 
                 disabled={!result || loading} 
                 onClick={handleCopy} 
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                   copied 
                   ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                   : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-50 hover:text-violet-600'
                 }`}
               >
                 {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copied ? 'Copied' : 'Copy Tasks'}
               </button>
             </div>
             
             <div className="flex-grow p-8 md:p-14 overflow-auto custom-scrollbar bg-slate-50/20 dark:bg-transparent">
               {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 border border-red-100 text-sm font-bold">{error}</div>}
               
               {result ? (
                 <div className="prose prose-violet dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 dark:prose-headings:text-white prose-li:my-1">
                   <ReactMarkdown>{result}</ReactMarkdown>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20 opacity-30 text-center">
                   <Target className="w-24 h-24 mb-6" />
                   <p className="text-2xl font-black">Ready to build <br/> the assignment?</p>
                   <p className="text-sm font-normal mt-4">Objectives, Instructions, and Rubrics will appear here.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-32 glass-card rounded-3xl flex items-center justify-center text-slate-400 text-sm mb-24 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Academic Content Context
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Educational <span className="text-violet-600">Scaffolding</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Detailed Objectives', desc: 'Every assignment is anchored in Bloom\'s Taxonomy to ensure clear learning outcomes and measurable success.', icon: Target },
                { title: 'Grading Criteria', desc: 'Includes a professional rubric that helps both students and teachers understand evaluation standards.', icon: ListChecks },
                { title: 'Project Steps', desc: 'Breaks down complex topics into manageable phases, encouraging a structured approach to deep learning.', icon: Layout }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
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
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Assignment FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Is it suitable for university level?', a: 'Absolutely. Choosing the "Postgraduate" or "Undergraduate" level adjusts the complexity and depth of the generated tasks.' },
                { q: 'Can I add specific constraints?', a: 'Yes! Use the instructions field to specify word counts, citation styles, or required sections.' },
                { q: 'Is the rubric reusable?', a: 'Definitely. The rubric provides a great template for official grading or self-assessment.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-violet-500" /> {faq.q}
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

export default AssignmentGenerator;
