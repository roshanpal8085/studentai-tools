import { useState } from 'react';
import SEO from '../../components/SEO';
import { User, RefreshCw, Copy, CheckCircle, HelpCircle, Users, Quote, Sparkles, BookOpen } from 'lucide-react';

const RandomNameGenerator = () => {
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  const [names, setNames] = useState(['John Smith', 'Jennifer Johnson', 'Michael Williams']);
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const generateNames = () => {
    const newNames = [];
    for (let i = 0; i < count; i++) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      newNames.push(`${first} ${last}`);
    }
    setNames(newNames);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(names.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Random Name Generator - Fictional & Placeholder Names" 
        description="Generate diverse random names instantly for creative writing, persona development, or demo projects. 100% free premium online tool." 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:rotate-12 hover:scale-110">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Random <span className="text-gradient">Name Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Instantly create realistic placeholders or character names for your creative projects, case studies, or software demonstrations.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
          <div className="p-10 md:p-14 bg-white/30 dark:bg-slate-950/20 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-xl mx-auto mb-10 text-center">
              <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Configuration Options</label>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <div className="relative w-full sm:w-48 group">
                   <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                     <User className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                   </div>
                   <input 
                     type="number" min="1" max="50"
                     className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
                     value={count}
                     onChange={(e) => setCount(e.target.value)}
                   />
                </div>
                <button 
                  onClick={generateNames}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex justify-center items-center gap-3 active:scale-[0.98] group"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-lg uppercase tracking-tight">Generate Output</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50/80 dark:bg-slate-900/40 rounded-[2rem] p-8 md:p-10 min-h-[300px] text-left border border-slate-200 dark:border-slate-800 shadow-inner relative group">
              <div className="absolute top-8 left-8 text-indigo-500/10 dark:text-indigo-400/5">
                <Quote className="w-24 h-24" />
              </div>
              <div className="relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Generated Output</span>
                  </div>
                  <button 
                    onClick={copyAll}
                    className={`px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                      copied ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600'
                    }`}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Successfully Copied' : 'Copy All to Clipboard'}
                  </button>
                </div>
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {names.map((name, i) => (
                    <li key={i} className="py-4 px-6 bg-white dark:bg-slate-800/80 rounded-2xl dark:text-white font-semibold text-lg border border-slate-100 dark:border-slate-700 transition-all hover:border-indigo-500/50 hover:shadow-md hover:-translate-y-1 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Creative Tools Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Identity <span className="text-indigo-600">Creation</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Dataset Agnostic', desc: 'Pulling from extensive lists of common first and last names to generate highly realistic combinations suitable for any context.', icon: Users },
                { title: 'Rapid Prototyping', desc: 'Ideal for UI/UX designers needing quick mock data for user profiles, dashboards, and contact lists.', icon: RefreshCw },
                { title: 'Writing Prompts', desc: 'Overcome writer\'s block by generating instant character names for your next short story, screenplay, or novel.', icon: BookOpen }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner text-primary">
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
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Generator FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Can I generate thousands of names at once?', a: 'To ensure browser performance, we currently cap generation at 50 names per batch. You can easily generate multiple batches.' },
                { q: 'Are these real people?', a: 'These are random combinations of common first and last names. Any resemblance to a specific real person is purely coincidental.' },
                { q: 'Is there an API available?', a: 'Currently, this is a web-only tool. If you need API access for your application, please let us know via our contact form.' }
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

export default RandomNameGenerator;
