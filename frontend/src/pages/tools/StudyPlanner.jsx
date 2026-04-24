import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { 
  Calendar, Loader2, Send, CheckCircle, HelpCircle, 
  Clock, Sparkles, BookOpen, Target, Zap, Copy, Check, BarChart3 
} from 'lucide-react';

const StudyPlanner = () => {
  const [exam, setExam] = useState('');
  const [timeframe, setTimeframe] = useState('2 Weeks');
  const [subjects, setSubjects] = useState('');
  const [goal, setGoal] = useState('Mastering key concepts and practice questions');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!exam.trim()) return;
    setLoading(true);
    setError('');
    setCopied(false);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/study-planner`, {
        exam, timeframe, subjects, goal
      });
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating plan. Please try again.');
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
        title="Free AI Study Planner — Personalized Exam Study Schedule Generator (2026)" 
        description="Generate a personalised AI study plan for any exam in seconds. Uses Spaced Repetition and Active Recall. Free, no signup required. Perfect for JEE, NEET, UPSC, finals."
        keywords="ai study planner, free study schedule generator, personalized exam prep plan, best study planner for students 2026, how to make study schedule with AI"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Study Planner",
            "operatingSystem": "Web",
            "applicationCategory": "EducationalApplication",
            "description": "AI-powered study plan generator using spaced repetition and active recall for optimized exam preparation.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How many subjects can I add to the study planner?", "acceptedAnswer": { "@type": "Answer", "text": "You can add as many subjects as you need in the 'Subjects to Cover' field, separated by commas. We recommend focusing on 3-5 major subjects per plan for better focus and realistic scheduling." } },
              { "@type": "Question", "name": "Can the AI study planner handle tight exam deadlines?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The '48 Hour Crash Course' option generates a high-yield, triage-focused plan that identifies the most important topics to cover when time is critically short." } },
              { "@type": "Question", "name": "What is the difference between 'Practice Questions' and 'Mastering Theory' focus goals?", "acceptedAnswer": { "@type": "Answer", "text": "If you understand the concepts but underperform in exams, choose 'Practice Questions' — the plan will allocate more time to timed mock tests. If the content is new or unfamiliar, choose 'Mastering Theory' to focus on conceptual understanding first." } },
              { "@type": "Question", "name": "Is this study planner free to use?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, the AI Study Planner is completely free with no account creation or credit card required. It is supported by non-intrusive advertising." } },
              { "@type": "Question", "name": "Does the study plan use Spaced Repetition?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The AI schedules subject reviews at scientifically optimal intervals to move information from short-term to long-term memory, based on the principles of Spaced Repetition and Active Recall." } },
              { "@type": "Question", "name": "Can I use this for competitive exams like JEE, NEET or UPSC?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Simply enter your exam name (e.g. JEE Mains), your available preparation time, and your subjects. The AI will generate a structured daily schedule adapted to the scale of competitive exam preparation." } }
            ]
          }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 mb-4 transition-transform hover:scale-110">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Study Planner</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate exam anxiety. Get a personalized roadmap that optimizes your study hours using scientific learning techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Planner Inputs */}
          <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-8 md:p-10 h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-500" /> Goal Setting
              </h2>
              <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Target Exam/Goal</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g., Finals, SAT, GRE, Mid-terms..."
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white text-sm"
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Time Available</label>
                  <select 
                    value={timeframe} 
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>48 Hours (Crash Course)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Subjects to Cover</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g., Calculus, Organic Chemistry, World History..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white text-sm"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Primary Focus/Pain Points</label>
                <textarea 
                  placeholder="e.g., Mastering practice questions for Unit 3, understanding theory for Finals..."
                  className="w-full h-32 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white resize-none text-sm leading-relaxed"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>

              <button 
                disabled={loading || !exam.trim()}
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex justify-center items-center gap-3 disabled:opacity-50 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                <span>{loading ? 'Crunching Schedule...' : 'Generate Study Plan'}</span>
              </button>
            </form>
          </div>

          {/* Plan Output */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-[600px]">
             <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex items-center justify-between">
               <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                 <BarChart3 className="w-6 h-6 text-emerald-500" /> Productivity Roadmap
               </h2>
               <button 
                 disabled={!result || loading} 
                 onClick={handleCopy} 
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                   copied 
                   ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                   : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
                 }`}
               >
                 {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copied ? 'Copied' : 'Copy Schedule'}
               </button>
             </div>
             
             <div className="flex-grow p-8 md:p-14 overflow-auto custom-scrollbar bg-slate-50/20 dark:bg-transparent">
               {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 border border-red-100 text-sm font-bold">{error}</div>}
               
               {result ? (
                 <div className="prose prose-emerald dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 dark:prose-headings:text-white prose-li:my-1">
                   <ReactMarkdown>{result}</ReactMarkdown>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20 opacity-30 text-center">
                   <Clock className="w-24 h-24 mb-6" />
                   <p className="text-2xl font-black">Waiting for your <br/> commitments...</p>
                   <p className="text-sm font-normal mt-4">A structured daily study plan will appear here.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-32 glass-card rounded-3xl flex items-center justify-center text-slate-400 text-sm mb-24 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Productivity Tools & Courses
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Science of <span className="text-emerald-600">Preparation</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Spaced Repetition', desc: 'Our AI schedules reviews at increasing intervals to move information from short-term to long-term memory.', icon: Zap },
                { title: 'Active Recall Slots', desc: 'Every plan includes dedicated time for self-testing, the most effective way to reinforce core concepts.', icon: Target },
                { title: 'Cognitive Load Balance', desc: 'Avoids cramming by distributing subjects across your timeframe, preventing mental exhaustion and burnout.', icon: BarChart3 }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
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
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Planning FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'How many subjects can I add?', a: 'You can add as many as needed, but we suggest focusing on 3-5 major subjects per plan for better focus and realistic scheduling.' },
                { q: 'Can it handle tight deadlines?', a: 'Yes, the "48 Hour Crash Course" option helps you identify high-yield topics when time is critically short.' },
                { q: 'Which focus goal should I choose?', a: 'If you know the material but fail exams, choose "Practice Questions". If the concepts are new, choose "Mastering Theory".' },
                { q: 'Is this study planner free?', a: 'Yes, 100% free with no account creation or credit card required. Supported by non-intrusive advertising.' },
                { q: 'Does it use Spaced Repetition?', a: 'Yes. The AI schedules subject reviews at scientifically optimal intervals to move information from short-term to long-term memory.' },
                { q: 'Can I use it for JEE, NEET or UPSC prep?', a: 'Absolutely. Enter your exam name, available preparation time, and subjects. The AI adapts the plan to the scale of competitive exam preparation.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-500" /> {faq.q}
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

export default StudyPlanner;
