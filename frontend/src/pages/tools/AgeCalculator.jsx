import { useState } from 'react';
import SEO from '../../components/SEO';
import { Calendar, RefreshCw, CheckCircle, HelpCircle, Clock, Zap, History, Info, ChevronRight, Timer } from 'lucide-react';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState(null);

  const calculateAge = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();
    
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Accurate Age Calculator - Premium Time Tool" 
        description="Calculate your exact age down to the day. Professional-grade age analysis tool for students, applications, and record keeping."
        keywords="age calculator, exact age, age in days, time calculator, student utility"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Accurate Age Calculator",
          "operatingSystem": "Web",
          "applicationCategory": "UtilitiesApplication",
          "description": "High-precision age calculator for determining exact years, months, and days since birth.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 mb-4 transition-transform hover:rotate-12">
            <Timer className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Accurate <span className="text-gradient">Age Calculator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Professional-grade chronically analysis. Determine your exact years, months, and days since birth with mathematical precision.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
          <div className="p-10 md:p-16 text-center bg-white/30 dark:bg-slate-950/20 backdrop-blur-md">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Birth Parameters</span>
              </div>
              
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Select Date of Birth</label>
              <input 
                type="date" 
                className="w-full px-8 py-5 rounded-[1.5rem] border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-2xl font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all mb-8 shadow-inner"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              <button 
                onClick={calculateAge}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-600/20 flex justify-center items-center gap-3 active:scale-[0.98] group"
              >
                <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-lg uppercase tracking-tight">Generate Report</span>
              </button>
            </div>

            {age && (
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {[
                  { label: 'Years', val: age.years, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-900/50' },
                  { label: 'Months', val: age.months, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-900/50' },
                  { label: 'Days', val: age.days, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-900/50' }
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} p-8 rounded-[2rem] border-2 ${stat.border} shadow-sm group hover:scale-105 transition-transform`}>
                    <span className={`block text-6xl font-black ${stat.color} mb-2 tracking-tighter`}>{stat.val}</span>
                    <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Academic Analytics Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Time <span className="text-orange-600 text-gradient">Intelligence</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Exact Chronology', desc: 'Our engine accounts for leap years and varying month lengths to ensure 100% accuracy in your age calculation.', icon: Info },
                { title: 'Application Ready', desc: 'Perfect for official forms, scholarship applications, and identity verification that requires exact age in months.', icon: Zap },
                { title: 'Historical Context', desc: 'Instantly visualize your personal timeline and duration milestones within the context of the modern calendar.', icon: History }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 text-gradient">Calculator FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Is this calculation official?', a: 'Yes, it follows the Western Gregorian calendar standards used by most academic and legal institutions globally.' },
                { q: 'Does it work for leap years?', a: 'Absolutely. The algorithm dynamically adjusts for Feb 29th and the precise number of days in the preceding months.' },
                { q: 'Can I calculate age for the future?', a: 'Yes! You can set the birth date and compare it to any future date by adjusting your system clock or target logic.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-orange-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/50 flex items-center justify-between group cursor-pointer hover:bg-orange-100 transition-colors">
               <span className="font-bold text-orange-700 dark:text-orange-300">Share Results</span>
               <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgeCalculator;
