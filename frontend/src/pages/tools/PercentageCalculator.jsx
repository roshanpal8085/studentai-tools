import { useState } from 'react';
import SEO from '../../components/SEO';
import { Percent, RefreshCw, CheckCircle, HelpCircle, Variable, Wallet, PlusSquare } from 'lucide-react';

const PercentageCalculator = () => {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!val1 || !val2) return;
    setResult(((parseFloat(val1) / 100) * parseFloat(val2)).toFixed(2));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Percentage Calculator - Math & Finance Tool" 
        description="Calculate percentages quickly and accurately. Perfect for homework, grades, retail discounts, and tax estimation. Professional calculation utility."
        keywords="percentage calculator, math tool, discount calculator, grade percentage, student math utility"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Percentage Calculator",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "Fast and accurate percentage calculator for academic and financial mathematics.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 mb-4 transition-transform hover:rotate-12">
            <Percent className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Percentage <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #e11d48)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Calculator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Instantly resolve percentage problems. A seamless utility for statistics, algebra assignments, and everyday financial mathematics.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16 h-full min-h-[400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Input Side */}
            <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center bg-white/30 dark:bg-slate-950/20 backdrop-blur-md">
              <div className="max-w-md mx-auto w-full space-y-8">
                
                <div className="space-y-4 relative group">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Target Percentage</label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500 font-black text-xl select-none">%</span>
                    <input 
                      type="number" 
                      className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-inner"
                      value={val1}
                      onChange={(e) => setVal1(e.target.value)}
                      placeholder="e.g. 20"
                    />
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                   <div className="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-700"></div>
                   <div className="relative bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800 z-10">Of Base Value</div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Base Number</label>
                  </div>
                  <input 
                    type="number" 
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-inner"
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                    placeholder="e.g. 150"
                  />
                </div>

                <button 
                  onClick={calculate}
                  disabled={!val1 || !val2}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-rose-600/20 flex justify-center items-center gap-3 active:scale-[0.98] group disabled:opacity-50 mt-4"
                >
                  <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-lg uppercase tracking-tight">Compute Result</span>
                </button>
              </div>
            </div>

            {/* Output Side */}
            <div className="p-10 md:p-14 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center border-slate-200 dark:border-slate-800 relative overflow-hidden">
               <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
               
               {result !== null ? (
                 <div className="w-full text-center animate-in fade-in zoom-in-95 duration-500 relative z-10">
                   <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-black uppercase tracking-widest mb-6 border border-rose-200 dark:border-rose-800">Final Calculation</span>
                   <div className="glass-card rounded-[2.5rem] p-10 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl bg-white dark:bg-slate-800">
                     <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Result Output</div>
                     <div className="text-6xl md:text-8xl font-black text-rose-600 dark:text-rose-500 tracking-tighter break-all">
                       {result}
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="w-full text-center opacity-40">
                    <Variable className="w-24 h-24 mx-auto text-slate-400 mb-6" />
                    <p className="text-xl font-bold text-slate-500">Awaiting inputs...</p>
                    <p className="text-sm text-slate-400 mt-2">Enter your values to see the result here.</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Finance & Math Tools
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Mathematics <span className="text-rose-600" style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #e11d48)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Simplified</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Academic Statistics', desc: 'Easily isolate data points, verify survey results, and calculate margins of error for your research papers and lab assignments.', icon: CheckCircle },
                { title: 'Retail Discounting', desc: 'Quickly evaluate sale items by entering the discount percentage and the original price to find your exact savings.', icon: Wallet },
                { title: 'Tip & Tax Estimation', desc: 'Determine standard restaurant gratuities or state sales tax rapidly by using the base receipt amount.', icon: PlusSquare }
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
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Calculator FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'What is the standard percentage formula?', a: 'To calculate a percentage, the formula is: (Percentage Amount / 100) * Base Number. Our tool automates this exact equation.' },
                { q: 'Can I use decimal percentages?', a: 'Yes. You can enter values like 1.5% or 33.33%. The calculator handles floating-point arithmetic automatically.' },
                { q: 'Why do I see rounding in the results?', a: 'To maintain clean and readable numbers, the calculator automatically rounds results to two decimal places (a standard financial practice).' }
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

export default PercentageCalculator;
