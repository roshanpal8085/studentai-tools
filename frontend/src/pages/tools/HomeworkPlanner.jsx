import { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import { ClipboardList, Plus, Trash2, CheckCircle2, Circle, AlertCircle, Calendar, Flag, HelpCircle } from 'lucide-react';

const HomeworkPlanner = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('sa_homework');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Math Exercises Page 42', due: '2026-03-25', completed: false, priority: 'High' },
      { id: 2, text: 'Read Biology Chapter 5', due: '2026-03-26', completed: true, priority: 'Medium' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sa_homework', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), text: 'New Subject Assignment', due: '', completed: false, priority: 'Medium' }]);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Online Homework Planner - Student Task Manager" 
        description="Organize your school assignments and upcoming deadlines with our free online homework planner. Stay on top of your tasks locally within your browser."
        keywords="homework planner, school task manager, assignment tracker, student organizer, free study planner"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Homework Planner",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "Secure local task manager for students to track homework assignments and deadlines.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 mb-4 transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Homework <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #10b981, #059669)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Planner</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Take strict control of your academic life. Track local assignments, prioritize deadlines, and systematically clear your daily homework backlog.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-12">
            <div className="p-8 md:p-12 relative">
                {/* Progress Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                    <div>
                        <h2 className="text-2xl font-black dark:text-white flex items-center gap-3 mb-2">
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" /> 
                            Action Items
                        </h2>
                        <p className="text-slate-500 font-medium">You have <span className="text-emerald-500 font-bold">{tasks.length - completedCount} pending</span> tasks remaining.</p>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="hidden sm:block">
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">
                                <span>Progress</span>
                                <span>{progressPercentage}%</span>
                            </div>
                            <div className="w-48 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>
                        <button 
                            onClick={addTask}
                            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <Plus className="w-5 h-5" /> Add Assignment
                        </button>
                    </div>
                </div>

                {/* Task List */}
                {tasks.length > 0 ? (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 md:p-6 rounded-2xl border transition-all duration-300 group \${task.completed ? 'bg-slate-50/50 dark:bg-slate-900/30 opacity-70 border-slate-100 dark:border-slate-800/50' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/50'}`}>
                                
                                <button onClick={() => toggleTask(task.id)} className="shrink-0 mt-1 sm:mt-0 transition-transform active:scale-90 duration-200">
                                    {task.completed ? <CheckCircle2 className="w-7 h-7 text-emerald-500" /> : <Circle className="w-7 h-7 text-slate-300 dark:text-slate-600 hover:text-emerald-400 transition-colors" />}
                                </button>
                                
                                <div className="flex-grow min-w-0 w-full sm:w-auto">
                                    <input 
                                        type="text" 
                                        value={task.text}
                                        onChange={(e) => updateTask(task.id, 'text', e.target.value)}
                                        className={`w-full bg-transparent border-none p-0 focus:ring-0 font-bold text-lg \${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}
                                        placeholder="What needs to be done?"
                                    />
                                    
                                    <div className="flex flex-wrap gap-4 mt-3 items-center">
                                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            <input 
                                                type="date" 
                                                value={task.due}
                                                onChange={(e) => updateTask(task.id, 'due', e.target.value)}
                                                className="bg-transparent border-none p-0 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer focus:ring-0"
                                            />
                                        </div>

                                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                                            <Flag className={`w-3.5 h-3.5 \${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-amber-500' : 'text-sky-500'}`} />
                                            <select 
                                                value={task.priority}
                                                onChange={(e) => updateTask(task.id, 'priority', e.target.value)}
                                                className={`bg-transparent border-none p-0 text-xs font-bold uppercase tracking-wider cursor-pointer focus:ring-0 \${task.priority === 'High' ? 'text-red-600 dark:text-red-400' : task.priority === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-sky-600 dark:text-sky-400'}`}
                                            >
                                                <option className="text-slate-900">High</option>
                                                <option className="text-slate-900">Medium</option>
                                                <option className="text-slate-900">Low</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => removeTask(task.id)} className="absolute top-4 right-4 sm:static shrink-0 p-2.5 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all sm:opacity-0 group-hover:opacity-100 focus:opacity-100">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <ClipboardList className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400 mb-2">No Assignments Yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Click "Add Assignment" to start organizing your academic workflow immediately.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Warning / Informational Callout */}
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm mb-16">
            <div className="bg-emerald-200/50 dark:bg-emerald-800/40 p-4 rounded-full shrink-0">
                <AlertCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
                <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-200 mb-2">Local Browser Storage Enabled</h3>
                <p className="text-emerald-700 dark:text-emerald-400/80 leading-relaxed font-medium">This smart planner utilizes your device's LocalStorage. Your homework data is never transmitted to an external server, keeping your academic privacy 100% secure while preserving your tasks across active sessions.</p>
            </div>
        </div>

        {/* SEO Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Crush Your <span className="text-emerald-600">Deadlines</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Prioritization Framework', desc: 'Tag highly important assignments with High Priority indicators to ensure critical grade-making work is completed first.', icon: Flag },
                { title: 'Visual Progress Tracking', desc: 'Our progress bar utilizes gamification to motivate you. Watching the bar fill up as you click complete provides satisfying psychological momentum.', icon: CheckCircle2 },
                { title: 'Date Management', desc: 'Easily attach concrete deadlines to tasks using the built-in calendar variables, ensuring you always know exactly what is due tomorrow.', icon: Calendar }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Planner FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Will my tasks disappear if I refresh the page?', a: 'No. The planner saves your data automatically to your web browser\'s local storage cache. Every time you return to this specific browser, your list will remain intact.' },
                { q: 'Can I reorder the tasks?', a: 'Currently, tasks operate in a standard chronological flow as you add them. Try using the Priority flags (High, Medium, Low) to visually segregate what needs to be done first.' },
                { q: 'Can I access this on my phone?', a: 'Yes! However, because tasks are saved strictly locally to the specific device\'s browser (for maximum privacy), tasks added on your laptop will not automatically sync to your phone.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-emerald-500" /> {faq.q}
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

export default HomeworkPlanner;
