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
        title="Free AI Study Planner â€” Personalized Exam Study Schedule Generator (2026)" 
        canonical="/ai-study-planner"
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
              { "@type": "Question", "name": "What is the difference between 'Practice Questions' and 'Mastering Theory' focus goals?", "acceptedAnswer": { "@type": "Answer", "text": "If you understand the concepts but underperform in exams, choose 'Practice Questions' â€” the plan will allocate more time to timed mock tests. If the content is new or unfamiliar, choose 'Mastering Theory' to focus on conceptual understanding first." } },
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

        {/* Comprehensive SEO Content for AdSense E-E-A-T */}
        <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto space-y-16">
            
            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">How to Build an AI Study Schedule That Actually Works</h2>
              <div className="prose prose-emerald dark:prose-invert max-w-none prose-p:leading-relaxed prose-lg text-slate-600 dark:text-slate-400">
                <p>
                  Most study schedules fail for a simple reason: they are built by an idealized version of yourself for a world where nothing unexpected ever happens. When you manually block out 8 hours of uninterrupted study time, you are setting yourself up for burnout and guilt when reality intervenes.
                </p>
                <p>
                  The <strong>AI Study Planner</strong> takes a different approach. It uses the principles of Spaced Repetition and Cognitive Load Theory to build a flexible, highly optimized roadmap that respects your actual mental bandwidth. Here is how to get the most out of it:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 not-prose">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">1</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Be Specific About Constraints</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Instead of broadly saying "Finals Prep," specify your exact constraints in the Pain Points field: "I only have 3 hours a day, and I am currently failing Organic Chemistry."</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">2</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Diagnose Your Weaknesses</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">The AI prioritizes subjects intelligently. If you list three subjects, explicitly tell the AI which one is your weakest so it can front-load that subject when your brain is freshest.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">3</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Respect the Buffer Zones</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Our AI deliberately includes break days and catch-up blocks. Do not skip these. They are mathematically necessary to prevent the cascading failure of a missed study session.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">4</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Execute with the 50/10 Rule</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">When you execute the plan, study in 50-minute blocks followed by 10 minutes of complete detachment from screens. This maintains your attention span across a 4-hour session.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-emerald-50 dark:bg-emerald-900/10 rounded-[3rem] p-8 md:p-12 border border-emerald-100 dark:border-emerald-800/30">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-emerald-500" /> Example: Chaotic Inputs to Structured Plan
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">User Inputs</h3>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700 h-80 overflow-y-auto">
                    <strong>Exam:</strong> Calculus 101 Midterm<br/>
                    <strong>Timeframe:</strong> 1 Week<br/>
                    <strong>Subjects:</strong> Limits, Derivatives, Chain Rule, Implicit Differentiation<br/>
                    <strong>Pain Points:</strong> I understand Limits perfectly, but I completely fail at the Chain Rule. I need to focus mostly on practice problems rather than reading the textbook again.
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">AI Generated Output</h3>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl text-sm text-slate-900 dark:text-slate-200 border border-emerald-200 dark:border-emerald-700 shadow-lg shadow-emerald-500/10 h-80 overflow-y-auto">
                    <strong>Day 1: Triage & Foundation</strong><br/>
                    â€¢ [45m] Quick Review: Limits (Verify foundation)<br/>
                    â€¢ [90m] Deep Dive: Mechanics of the Chain Rule<br/>
                    â€¢ [30m] 5 Basic Chain Rule Practice Problems<br/><br/>
                    
                    <strong>Day 2: Heavy Practice</strong><br/>
                    â€¢ [20m] Spaced Repetition: Yesterday's Chain Rule errors<br/>
                    â€¢ [90m] Deep Dive: Implicit Differentiation<br/>
                    â€¢ [60m] Drill: 15 mixed Derivatives problems<br/><br/>
                    
                    <strong>Day 3: The Weak Spot</strong><br/>
                    â€¢ [120m] Intensive Drill: Chain Rule specifically applied to Implicit functions.<br/>
                    â€¢ [30m] Review incorrect answers with professor/TA.<br/><br/>
                    <em>(Continues for 7 days, ending in a timed mock exam)</em>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { q: 'How many subjects should I include in one plan?', a: 'For optimal results, we recommend focusing on 3-5 major subjects per plan. If you are studying for 8 different finals, it is better to generate two separate 4-subject plans to maintain clarity and focus.' },
                  { q: 'Can the AI handle last-minute cramming?', a: 'Yes. By selecting the "48 Hour Crash Course" timeframe, the AI switches from long-term retention strategies to high-yield triage. It will tell you exactly what to ignore and what to memorize to maximize immediate points.' },
                  { q: 'What is the difference between "Practice Questions" and "Mastering Theory"?', a: 'If you already read the book but perform poorly on tests, choose Practice Questions; the AI will schedule more mock exams. If the material is completely new, choose Mastering Theory; the AI will allocate more time to reading and summarizing.' },
                  { q: 'Is this study planner truly free?', a: 'Yes, the AI Study Planner is 100% free. You do not need to create an account or provide a credit card. We sustain the platform through educational partnerships and non-intrusive ads.' },
                  { q: 'Does the study plan utilize Spaced Repetition?', a: 'Yes. The underlying prompt engineering specifically instructs the AI to schedule reviews of older material at increasing intervals (e.g., reviewing Day 1 topics briefly on Day 3 and Day 6).' },
                  { q: 'Is this appropriate for competitive exams like the SAT or GRE?', a: 'Absolutely. Because the AI is adaptive, you simply enter "SAT" as your goal and list your specific weak sections (e.g., "Reading Comprehension, Geometry"). The AI scales the rigor of the plan accordingly.' }
                ].map((faq, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
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

export default StudyPlanner;
