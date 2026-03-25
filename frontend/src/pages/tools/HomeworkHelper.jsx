import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { 
  Zap, Loader2, Send, BookOpen, HelpCircle, 
  CheckCircle, Sparkles, Brain, GraduationCap, Lightbulb 
} from 'lucide-react';

const HomeworkHelper = () => {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('General');
  const [level, setLevel] = useState('High School');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/homework-helper`, {
        question, subject, level
      });
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating help. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="AI Homework Helper - Step-by-Step Solutions for Students" 
        description="Get instant, expert-level homework help for any subject. Our AI tutor provides clear, step-by-step explanations to help you master complex topics in seconds."
        keywords="ai homework helper, homework solver, step by step math, science help, free ai tutor"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Homework Helper",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "Instant AI-powered homework assistance with step-by-step explanations for all academic subjects.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 mb-4 transition-transform hover:rotate-12">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Homework Helper</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stuck on a problem? Get instant, high-quality explanations and step-by-step solutions for any subject or academic level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Input Panel */}
          <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-8 md:p-10 h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-amber-500" /> Question Lab
              </h2>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Subject</label>
                  <select 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option>General</option>
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Literature</option>
                    <option>CS & Tech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Academic Level</label>
                  <select 
                    value={level} 
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option>High School</option>
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">The Question</label>
                <textarea 
                  required
                  placeholder="Paste your question or describe the problem here..."
                  className="w-full h-48 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white resize-none text-sm leading-relaxed"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <button 
                disabled={loading || !question.trim()}
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex justify-center items-center gap-3 disabled:opacity-50 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />}
                <span>{loading ? 'Solving Problem...' : 'Get Instant Solution'}</span>
              </button>
            </form>
          </div>

          {/* Solution Panel */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-white/40 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px]">
             <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex items-center justify-between">
               <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                 <GraduationCap className="w-6 h-6 text-amber-500" /> Explanation Hub
               </h2>
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                 <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                 <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
               </div>
             </div>
             
             <div className="flex-grow p-8 md:p-12 overflow-auto custom-scrollbar bg-slate-50/50 dark:bg-transparent">
               {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 border border-red-100 text-sm font-bold">{error}</div>}
               
               {result ? (
                 <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 dark:prose-headings:text-white">
                   <ReactMarkdown>{result}</ReactMarkdown>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20 opacity-30 text-center">
                   <BookOpen className="w-24 h-24 mb-6" />
                   <p className="text-xl font-bold">Waiting for your question...<br/><span className="text-sm font-normal">Solutions will appear here instantly.</span></p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-32 glass-card rounded-3xl flex items-center justify-center text-slate-400 text-sm mb-24 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Optimized for Student Traffic
        </div>

        {/* Informational Guidance (SEO Masterclass) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Beyond Simple <span className="text-amber-500">Answers</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Step-by-Step Methodology', desc: 'We don\'t just give you the answer. We show you the logic behind it so you can learn for the exams.', icon: HelpCircle },
                { title: 'Multi-Disciplinary Support', desc: 'From the laws of thermodynamics to complex calculus or economic theories, our AI covers it all.', icon: BookOpen },
                { title: 'Conceptual Clarity', desc: 'Our explanations are tailored to your specific academic level, ensuring the language is perfectly understandable.', icon: Lightbulb }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
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

          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 blur-[60px] rounded-full translate-x-10 -translate-y-10" />
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Homework FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Is this AI Homework Helper free?', a: 'Yes! StudentAI is 100% free for all students. No registration or credit cards are required.' },
                { q: 'How accurate are the math solutions?', a: 'Our AI utilizes advanced symbolic reasoning to handle math, science, and technical subjects with extremely high accuracy.' },
                { q: 'Can I use it for research?', a: 'Definitely. It\'s a great way to verify your understanding of complex academic papers or textbook concepts.' },
                { q: 'Is my data private?', a: 'We do not store your personal information or school details. Your sessions are anonymous and private.' }
              ].map((faq, i) => (
                <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-5">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> {faq.q}
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

export default HomeworkHelper;
