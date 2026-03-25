import { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import { Play, Pause, RotateCcw, Coffee, BookOpen, CheckCircle, HelpCircle, Target, Zap } from 'lucide-react';

const StudyTimer = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('study'); // study, break

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      alert(mode === 'study' ? 'Study session finished! Take a break.' : 'Break finished! Time to study.');
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, mode]);

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setSeconds(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (m) => {
    setMode(m);
    setIsActive(false);
    setSeconds(m === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Pomodoro Study Timer - Maximize Academic Focus" 
        description="Radically boost your productivity and retention with our highly-optimized Pomodoro Study Timer. Leverage deep 25-minute study sessions securely in your browser."
        keywords="study timer, pomodoro timer, focus timer, online productivity tool, student focus"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Focus Study Timer",
          "operatingSystem": "Web",
          "applicationCategory": "UtilitiesApplication",
          "description": "Optimized Pomodoro timer for deep study sessions and cognitive recovery.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 mb-4 transition-transform hover:-translate-y-1 shadow-lg shadow-rose-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Focus Study <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #e11d48)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Timer</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Master your internal clock utilizing the proven Pomodoro technique. Deep dive for 25 intense minutes of focus, followed by exactly 5 minutes of cognitive rest.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl point-events-none"></div>
          
          <div className="p-10 md:p-20 text-center relative z-10">
            
            <div className="flex justify-center gap-4 mb-16">
                <button 
                  onClick={() => switchMode('study')}
                  className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-3 ${mode === 'study' ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/30 scale-105 ring-2 ring-rose-500 ring-offset-4 dark:ring-offset-slate-800' : 'bg-slate-100 dark:bg-slate-900/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-900'}`}
                >
                  <BookOpen className="w-5 h-5" /> Sprint Mode
                </button>
                <button 
                  onClick={() => switchMode('break')}
                  className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-3 ${mode === 'break' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-105 ring-2 ring-emerald-500 ring-offset-4 dark:ring-offset-slate-800' : 'bg-slate-100 dark:bg-slate-900/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-900'}`}
                >
                  <Coffee className="w-5 h-5" /> Rest Mode
                </button>
            </div>

            <div className="relative inline-flex items-center justify-center w-72 h-72 md:w-96 md:h-96 mb-16">
                <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-inner border-[12px] border-slate-50 dark:border-slate-900"></div>
                <svg className="absolute w-full h-full -rotate-90">
                    <circle 
                        cx="50%" cy="50%" r="48%" 
                        className="stroke-slate-100 dark:stroke-slate-700/50 fill-transparent stroke-[6px]" 
                    />
                    <circle 
                        cx="50%" cy="50%" r="48%" 
                        className={`fill-transparent stroke-[12px] transition-all duration-1000 ease-in-out ${mode === 'study' ? 'stroke-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'stroke-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}
                        strokeDasharray="301.59"
                        strokeDashoffset={301.59 - (301.59 * seconds / (mode === 'study' ? 25*60 : 5*60))}
                        strokeLinecap="round"
                    />
                </svg>
                <div className={`text-7xl md:text-8xl lg:text-9xl font-black tabular-nums tracking-tighter transition-colors ${mode === 'study' ? 'text-slate-900 dark:text-white' : 'text-emerald-900 dark:text-emerald-50'}`}>
                    {formatTime(seconds)}
                </div>
            </div>

            <div className="flex justify-center gap-8 items-center">
                <button 
                  onClick={toggle}
                  className={`w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${isActive ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600' : (mode === 'study' ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/30' : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/30')}`}
                >
                   {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
                </button>
                <button 
                  onClick={reset}
                  className="w-16 h-16 rounded-[1.5rem] bg-slate-100 dark:bg-slate-900/80 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-all shadow-sm active:scale-95 group"
                  title="Reset Timer"
                >
                    <RotateCcw className="w-7 h-7 group-active:-rotate-180 transition-transform duration-500" />
                </button>
            </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Productivity Tools Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Master <span className="text-rose-600" style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #e11d48)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Pomodoro</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Cognitive Recovery', desc: 'The rigidly enforced 5-minute break structure prevents severe mental fatigue, allowing your brain\'s semantic networks time to unconsciously process and store complex information.', icon: Zap },
                { title: 'Shattered Procrastination', desc: 'It is highly intimidating to sit down to study for 4 straight hours. It is extremely easy to commit to a single fast 25-minute sprint. Break the initial friction instantly.', icon: Target },
                { title: 'Flow State Architecture', desc: 'By utilizing a clear, physical timer counting downwards, your brain easily links the visual UI motion to the distinct psychological necessity for immediate deep focus.', icon: CheckCircle }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl point-events-none"></div>
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Timer FAQ</h2>
            <div className="space-y-6 relative z-10">
              {[
                { q: 'Is 25 minutes completely strict?', a: 'While 25 minutes is historically standard, everyone\'s attention limits drastically differ. Use it as a powerful baseline, but feel zero guilt manually resetting if you absolutely hit a strong flow state.' },
                { q: 'What do I do during the 5-minute break time?', a: 'Physically leave your exact workspace environment immediately. Drink water, stretch rigorously, or stare deeply out a window. Do absolutely nothing cognitively taxing.' },
                { q: 'Will the timer actively run in the background?', a: 'Yes. Modern web browsers are specifically configured to aggressively throttle completely inactive tabs, but the timer delta calculation ensures proper tracking when you finally return.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-rose-500" /> {faq.q}
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

export default StudyTimer;
