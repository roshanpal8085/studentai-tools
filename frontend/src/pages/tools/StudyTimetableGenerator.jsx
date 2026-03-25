import { useState } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO';
import { Calendar, Loader2, Sparkles, Clock, CheckCircle, HelpCircle, Book, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const StudyTimetableGenerator = () => {
  const [subjects, setSubjects] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateTimetable = async () => {
    if (!subjects) return;
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat-pdf`, {
        question: `Create a highly organized, realistic weekly study timetable. Subjects: ${subjects}. Hours available per day: ${hoursPerDay}. Structure it strictly as a clear Markdown table with headers: | Day | Time | Subject | Task / Break |. Include short effective breaks (Pomodoro style) and focus tips below the table.`,
        pdfText: "NO_PDF", history: []
      });
      setTimetable(res.data.answer);
    } catch (err) {
      console.error('Timetable Gen Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="AI Study Timetable Generator - Weekly Schedule Maker" 
        description="Create a personalized, optimal weekly study schedule in seconds. Our AI timetable generator balances your subjects and breaks for maximum student productivity. 100% free."
        keywords="study timetable generator, weekly schedule maker, student planner, academic schedule, free timetable tool"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Study Timetable Generator",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "AI-powered tool for creating balanced weekly study schedules and actionable academic workflows.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-indigo-500/20">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Study Timetable <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #4f46e5)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop worrying about 'what' and 'when' to study. Generate a balanced, highly actionable weekly schedule tailored to your subjects and available time.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
          <div className="grid grid-cols-1 xl:grid-cols-3 h-full">

            {/* Input Config Area */}
            <div className="xl:col-span-1 p-10 md:p-12 border-b xl:border-b-0 xl:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-center">
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-500 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">Schedule Parameters</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                     <Book className="w-4 h-4 text-indigo-500" /> Your Subjects To Cover
                  </label>
                  <textarea 
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                    className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none shadow-inner custom-scrollbar"
                    placeholder="e.g. AP Physics, Calculus BC, European History, English Literature..."
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Separate subjects by commas.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                     <Clock className="w-4 h-4 text-indigo-500" /> Daily Available Hours
                  </label>
                  <div className="relative">
                     <input 
                         type="number" 
                         min="1" max="12"
                         value={hoursPerDay}
                         onChange={(e) => setHoursPerDay(e.target.value)}
                         className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-lg"
                     />
                     <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Hours/Day</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                      onClick={generateTimetable}
                      disabled={loading || !subjects}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex justify-center items-center gap-3 active:scale-[0.98] group disabled:opacity-50"
                  >
                      {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                      <span className="text-lg tracking-tight">{loading ? 'Designing Plan...' : 'Generate Action Plan'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Render Area */}
            <div className="xl:col-span-2 p-10 md:p-14 relative bg-white/50 dark:bg-slate-950/20 min-h-[600px]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl point-events-none"></div>
                
                <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 relative z-10">
                    <h2 className="text-lg font-black uppercase tracking-widest text-slate-500">Your Custom Timetable</h2>
                </div>

                <div className="relative z-10 w-full overflow-x-auto custom-scrollbar">
                    {timetable ? (
                        <div className="prose prose-slate dark:prose-invert max-w-none 
                                prose-table:w-full prose-table:border-collapse prose-table:shadow-sm prose-table:rounded-xl prose-table:overflow-hidden
                                prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:px-4 prose-th:py-3 prose-th:border-b-2 prose-th:border-indigo-500/30 prose-th:font-black prose-th:uppercase prose-th:tracking-wider prose-th:text-xs
                                prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-slate-100 dark:prose-td:border-slate-700/50
                                prose-tr:hover:bg-slate-50 dark:prose-tr:hover:bg-slate-800/50 prose-tr:transition-colors
                                animate-in fade-in slide-in-from-bottom-4 duration-700"
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {timetable}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[450px] opacity-40">
                            <Calendar className="w-24 h-24 mb-6 text-slate-400" />
                            <h3 className="text-2xl font-bold text-slate-500 mb-2">Blank Canvas</h3>
                            <p className="text-slate-400 max-w-sm text-center">Define your subjects and daily availability to generate an AI-optimized study workflow.</p>
                        </div>
                    )}
                </div>
            </div>

          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Space - Educational Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Master Your <span className="text-indigo-600" style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #4f46e5)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Productivity</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Balanced Workloads', desc: 'The AI distributes your listed subjects evenly across the week, ensuring you don\'t burn out on a single heavy topic.', icon: Target },
                { title: 'Built-in Breaks', desc: 'Schedules are generated with cognitive science in mind, automatically inserting necessary breaks (like Pomodoro intervals) to maximize retention.', icon: Clock },
                { title: 'Actionable Tasks', desc: 'Instead of just listing a subject, the generator often includes specific focus tasks (e.g. "Review Practice Exams") to keep sessions purposeful.', icon: CheckCircle }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Timetable FAQ</h2>
            <div className="space-y-6 relative z-10">
              {[
                { q: 'Is the schedule fixed to specific real-world times?', a: 'By default, the AI organizes sessions into generic time blocks (Morning, Afternoon, Evening) or general hourly blocks, allowing you to map them to your real life easily.' },
                { q: 'Can I prioritize certain subjects?', a: 'Yes! Simply type "Prioritize Physics" or list it multiple times in the subject box to instruct the AI to allocate more study blocks to that specific subject.' },
                { q: 'Does it account for weekends?', a: 'Typically, the AI will generate a Monday-Friday plan with a lighter review schedule on weekends. However, you can command it otherwise in the input box!' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
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

export default StudyTimetableGenerator;
