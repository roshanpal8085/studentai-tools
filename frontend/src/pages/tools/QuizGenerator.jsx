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
        canonical="/ai-quiz-generator"
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

        {/* Comprehensive SEO Content for AdSense E-E-A-T */}
        <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto space-y-16">
            
            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">How to Use the AI Quiz Generator to Master Active Recall</h2>
              <div className="prose prose-indigo dark:prose-invert max-w-none prose-p:leading-relaxed prose-lg text-slate-600 dark:text-slate-400">
                <p>
                  Psychologists and educational researchers consistently rank <strong>Active Recall</strong> as the single most effective study technique for long-term memory retention. Unlike passive reading—which creates a false sense of familiarity—active recall forces your brain to retrieve information, strengthening the neural pathways associated with that memory.
                </p>
                <p>
                  However, creating practice tests manually is incredibly time-consuming. The <strong>AI Quiz Generator</strong> bridges this gap, instantly converting your study materials into rigorous practice questions. Here is how to incorporate it into your study routine:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 not-prose">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">1</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Input Structured Material</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">For the highest quality quizzes, paste structured notes (like Cornell Notes) rather than unstructured text. Clean inputs lead to highly specific, exam-style questions.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">2</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Vary Question Formats</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Use <strong>Multiple Choice</strong> to build initial familiarity, then switch to <strong>Short Answer</strong> 3-4 days before the exam to rigorously test your unaided recall.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">3</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Take the Quiz 'Cold'</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Do not review your notes immediately before taking the quiz. The cognitive struggle of trying to remember the answer is exactly what cements the memory.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">4</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Analyze the Mistakes</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Every quiz includes an answer key. Treat wrong answers as diagnostic data—they tell you exactly which paragraphs of your textbook you actually need to review.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-indigo-50 dark:bg-indigo-900/10 rounded-[3rem] p-8 md:p-12 border border-indigo-100 dark:border-indigo-800/30">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-indigo-500" /> Example: Study Text to Practice Test
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Input (Economics Notes)</h3>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700 h-72 overflow-y-auto">
                    "Inflation is the rate at which the general level of prices for goods and services is rising, and consequently, the purchasing power of currency is falling. Central banks attempt to limit inflation, and avoid deflation, in order to keep the economy running smoothly. The two main causes of inflation are Demand-Pull inflation (when aggregate demand outweighs aggregate supply) and Cost-Push inflation (when the cost of production increases, decreasing aggregate supply)."
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Output (Multiple Choice)</h3>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl text-sm text-slate-900 dark:text-slate-200 border border-indigo-200 dark:border-indigo-700 shadow-lg shadow-indigo-500/10 h-72 overflow-y-auto">
                    <strong>1. What happens to the purchasing power of currency during inflation?</strong><br/>
                    A) It increases<br/>
                    B) It remains stable<br/>
                    C) It falls<br/>
                    D) It becomes irrelevant<br/><br/>
                    <strong>2. Which type of inflation occurs when aggregate demand outweighs aggregate supply?</strong><br/>
                    A) Cost-Push inflation<br/>
                    B) Demand-Pull inflation<br/>
                    C) Deflationary inflation<br/>
                    D) Structural inflation<br/><br/>
                    <em>Answer Key: 1-C, 2-B</em>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { q: 'Does the AI generate the answer key as well?', a: 'Yes! Every generated quiz automatically includes a complete answer key at the very bottom, allowing you to self-grade immediately after practicing.' },
                  { q: 'Can I generate long-form or essay questions?', a: 'Selecting the "Short Answer" format will generate open-ended questions that require deep conceptual thinking and written responses, rather than simple multiple-choice recognition.' },
                  { q: 'What is the "Mixed Format" option?', a: 'The Mixed Format intelligently combines Multiple Choice, True/False, and Short Answer questions into a single test. This is the best option for simulating real-world examination papers.' },
                  { q: 'How many questions can I generate at once?', a: 'You can generate up to 20 questions in a single batch. For larger topics, we recommend generating multiple 10-question quizzes across different study sessions (Spaced Repetition).' },
                  { q: 'Is it considered cheating to use AI for practice tests?', a: 'No. Generating practice tests is a globally recognized, ethical study technique. You are simply automating the creation of flashcards/practice questions. You still have to do the mental work of answering them.' },
                  { q: 'What happens if the AI generates a wrong answer?', a: 'Our AI is fine-tuned for high accuracy based specifically on the text you provide. However, you should always verify any surprising answers against your original source text as an added layer of review.' }
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

export default QuizGenerator;
