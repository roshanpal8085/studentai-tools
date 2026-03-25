import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { 
  HelpCircle, Loader2, Send, CheckCircle, ListTodo, 
  FileText, Sparkles, Brain, ClipboardCheck, Zap, Copy, Check 
} from 'lucide-react';

const QuizGenerator = () => {
  const [content, setContent] = useState('');
  const [numQuestions, setNumQuestions] = useState('5');
  const [type, setType] = useState('Multiple Choice');
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/quiz-generator`, {
        content, numQuestions, type
      });
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating quiz. Please try again.');
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
        title="AI Quiz Generator - Personalized Practice Tests" 
        description="Convert any study material into custom practice quizzes. Generate Multiple Choice, True/False, or Short Answer questions to master active recall."
        keywords="ai quiz generator, practice test maker, study quiz creator, free ai quiz, student tools"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Quiz Generator",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "AI-powered tool for generating custom practice quizzes and tests from study materials.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:rotate-12">
            <ListTodo className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Quiz Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Master active recall. Transform your notes, textbooks, or transcripts into professional practice quizzes that challenge your understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Settings Panel */}
          <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-8 md:p-10 h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-500" /> Quiz Settings
              </h2>
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Questions</label>
                  <select 
                    value={numQuestions} 
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Format Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option>Multiple Choice</option>
                    <option>True or False</option>
                    <option>Short Answer</option>
                    <option>Mixed Format</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Study Material Source</label>
                <textarea 
                  required
                  placeholder="Paste your notes, textbook text, or lecture transcripts here..."
                  className="w-full h-56 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white resize-none text-sm leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <button 
                disabled={loading || !content.trim()}
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex justify-center items-center gap-3 disabled:opacity-50 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <ListTodo className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                <span>{loading ? 'Analyzing Content...' : 'Create Practice Quiz'}</span>
              </button>
            </form>
          </div>

          {/* Quiz Output */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-[600px]">
             <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex items-center justify-between">
               <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                 <ClipboardCheck className="w-6 h-6 text-indigo-500" /> Practice Suite
               </h2>
               <button 
                 disabled={!result || loading} 
                 onClick={handleCopy} 
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                   copied 
                   ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                   : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                 }`}
               >
                 {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copied ? 'Copied' : 'Copy Quiz & Key'}
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
                   <ClipboardCheck className="w-24 h-24 mb-6" />
                   <p className="text-2xl font-black">Your practice <br/> starts here...</p>
                   <p className="text-sm font-normal mt-4">Questions and the correct answers will appear instantly.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-32 glass-card rounded-3xl flex items-center justify-center text-slate-400 text-sm mb-24 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Educational Product Sponsorships
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Science of <span className="text-indigo-600">Active Recall</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Information Retrieval', desc: 'Recalling information from memory is significantly more effective than passive reading for long-term retention.', icon: Zap },
                { title: 'Gap Identification', desc: 'Quizzes expose exactly what you do not know, allowing you to focus your study time on high-impact areas.', icon: ClipboardCheck },
                { title: 'Exam Confidence', desc: 'Simulating exam conditions lowers anxiety and prepares your brain for the actual test-taking environment.', icon: Brain }
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
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Practice FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Does it generate the answers too?', a: 'Yes! Every quiz includes a complete answer key at the bottom so you can self-correct immediately.' },
                { q: 'Can I generate long-form questions?', a: 'Selecting "Short Answer" will generate questions that require deep thinking and written responses.' },
                { q: 'What is the "Mixed Format"?', a: 'It provides a variety of question types (MCQ, True/False, Fill-blanks) to simulate a real-world examination.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
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

export default QuizGenerator;
