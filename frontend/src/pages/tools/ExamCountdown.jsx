import { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import { Timer, Plus, Trash2, Calendar, HelpCircle, Bell, Clock, Target } from 'lucide-react';

const ExamCountdown = () => {
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('sa_exams');
    return saved ? JSON.parse(saved) : [{ id: 1, name: 'Final Written Exam', date: '2026-06-15', time: '09:00' }];
  });

  useEffect(() => {
    localStorage.setItem('sa_exams', JSON.stringify(exams));
  }, [exams]);

  const addExam = () => {
    setExams([...exams, { id: Date.now(), name: 'Upcoming Test', date: '', time: '09:00' }]);
  };

  const removeExam = (id) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const updateExam = (id, field, value) => {
    setExams(exams.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const calculateTimeLeft = (examDate, examTime) => {
    if (!examDate) return { text: 'Date Required', status: 'pending' };
    const target = new Date(`${examDate}T${examTime}`);
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) return { text: 'EXAM STARTED / COMPLETED', status: 'done' };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
    let status = 'safe';
    if (days < 7) status = 'warning';
    if (days < 2) status = 'urgent';

    return { text: `${days}d ${hours}h left`, status };
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Exam Countdown Timer - Student Deadline Tracker" 
        description="Never miss an exam again. Track your upcoming midterm and final exams with our personalized countdown timer app. Autosaves securely to your device." 
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 mb-4 transition-transform hover:-translate-y-1 shadow-lg shadow-rose-500/20">
            <Timer className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Exam <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #e11d48)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Countdown</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Keep your goals in sight. Track your academic deadlines in real-time, stay visually motivated, and never get caught off-guard by an exam again.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {exams.map((exam) => {
              const countdownInfo = calculateTimeLeft(exam.date, exam.time);
              let statusColors = 'bg-slate-50 text-slate-600 dark:bg-slate-900/50 dark:text-slate-400';
              let badgeColors = 'border-slate-200 dark:border-slate-700';

              if (countdownInfo.status === 'safe') {
                  statusColors = 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400';
                  badgeColors = 'border-sky-200 dark:border-sky-800/50';
              } else if (countdownInfo.status === 'warning') {
                  statusColors = 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
                  badgeColors = 'border-amber-200 dark:border-amber-800/50';
              } else if (countdownInfo.status === 'urgent') {
                  statusColors = 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 animate-pulse';
                  badgeColors = 'border-rose-200 dark:border-rose-800/50';
              } else if (countdownInfo.status === 'done') {
                  statusColors = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
                  badgeColors = 'border-emerald-200 dark:border-emerald-800/50 opacity-50';
              }

              return (
                <div key={exam.id} className="glass-card rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-rose-300 dark:hover:border-rose-500/50 transition-all duration-300 shadow-xl relative overflow-hidden bg-white/80 dark:bg-slate-800/80">
                  
                  {/* Title & Date Inputs */}
                  <div className="flex-grow w-full lg:w-auto relative z-10">
                    <input 
                      type="text" 
                      value={exam.name}
                      onChange={(e) => updateExam(exam.id, 'name', e.target.value)}
                      className={`w-full bg-transparent border-none text-2xl md:text-3xl font-black focus:ring-0 outline-none p-0 focus:text-rose-500 transition-colors ${countdownInfo.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}
                      placeholder="e.g. History Midterm"
                    />
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <input 
                            type="date" 
                            value={exam.date}
                            onChange={(e) => updateExam(exam.id, 'date', e.target.value)}
                            className="bg-transparent border-none p-0 text-sm font-bold dark:text-white focus:ring-0 cursor-pointer"
                          />
                      </div>
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <input 
                            type="time" 
                            value={exam.time}
                            onChange={(e) => updateExam(exam.id, 'time', e.target.value)}
                            className="bg-transparent border-none p-0 text-sm font-bold dark:text-white focus:ring-0 cursor-pointer"
                          />
                      </div>
                    </div>
                  </div>

                  {/* Countdown Readout */}
                  <div className={`flex flex-col items-center justify-center px-10 py-6 rounded-2xl min-w-[280px] w-full lg:w-auto border-2 \${statusColors} \${badgeColors} relative z-10`}>
                    <span className="block text-3xl font-black uppercase tracking-tight">
                      {countdownInfo.text}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-70">Calculated Time Remaining</span>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeExam(exam.id)}
                    className="absolute top-4 right-4 p-2.5 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all lg:opacity-0 group-hover:opacity-100 z-20"
                    title="Remove Exam"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
          })}

          <button 
            onClick={addExam}
            className="w-full py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] text-slate-400 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-slate-800 transition-all font-black uppercase tracking-wider flex items-center justify-center gap-3 text-sm active:scale-[0.99]"
          >
            <Plus className="w-6 h-6" /> Track Another Exam Deadline
          </button>
        </div>

        {/* Feature Highlight */}
        <div className="bg-rose-600 rounded-[2.5rem] p-10 md:p-14 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-rose-600/20 relative overflow-hidden mb-16">
             <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
             <div className="p-6 bg-white/10 rounded-3xl ring-1 ring-white/30 backdrop-blur-sm shrink-0">
                <Bell className="w-12 h-12 text-rose-100" />
             </div>
             <div className="relative z-10">
                <h2 className="text-3xl font-black mb-4">Secure Browser Sync</h2>
                <p className="text-rose-100/90 leading-relaxed max-w-2xl font-medium text-lg">
                    Your delicate academic schedule is saved directly into your current web browser's isolated local storage. You can securely close this tab—when you return, your timers will be perfectly synced and waiting for you.
                </p>
             </div>
        </div>

        {/* SEO Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 leading-relaxed mb-24 border-t border-slate-200 dark:border-slate-800 pt-16">
            <div className="space-y-8">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why Track Exam Timers?</h2>
                <div className="flex gap-4">
                    <Target className="w-8 h-8 text-rose-500 shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-xl mb-2 dark:text-slate-200">Avoid Crunch Time</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Visually seeing "14 days left" versus "2 days left" creates psychological urgency. This naturally combats procrastination, forcing you to begin review sessions earlier.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Countdown FAQ</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-sm tracking-wide text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Color changing?</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Yes! The countdown box will change from Blue (Safe / over 7 Days) to Yellow (Warning / under 7 Days) to flashing Red (Urgent / under 48 Hours).</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-wide text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Multi-device view?</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Because we value your privacy, items are saved locally. An exam tracked on your laptop will not show up on your smartphone automatically.</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ExamCountdown;
