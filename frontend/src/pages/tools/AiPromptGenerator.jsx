import { useState } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO';
import { Terminal, Loader2, Copy, CheckCircle, HelpCircle, Code, Settings, Zap } from 'lucide-react';

const AiPromptGenerator = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [goal, setGoal] = useState('Write an essay');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePrompt = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat-pdf`, {
        question: `Act as a senior prompt engineer. Generate a high-quality, structured system prompt for ChatGPT or Gemini to help me with: "${goal}". The topic is: "${topic}" and the tone should be "${tone}". Include specific constraints and style guidelines to ensure the best possible AI output. DO NOT use conversational filler, just output the prompt itself directly.`,
        pdfText: "NO_PDF", history: []
      });
      setResult(res.data.answer);
    } catch (err) {
      console.error('Prompt Gen Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free AI Prompt Generator - Master ChatGPT & Gemini" 
        description="Master AI tools like ChatGPT and Gemini with perfectly engineered prompts. Generate high-quality prompts for studying, writing, and coding instantly. 100% free." 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white mb-4 transition-transform hover:scale-110 shadow-lg shadow-slate-900/20">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI Prompt <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #4f46e5, #0ea5e9)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Get better results from AI. Automatically generate robust, engineered prompts that force ChatGPT or Gemini to give you expert-level answers.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

            {/* Config Section */}
            <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
               <h2 className="text-lg font-black uppercase tracking-widest text-slate-500 mb-8">Prompt Variables</h2>
               
               <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" /> Objective
                        </label>
                        <div className="relative">
                            <select 
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option>Write an essay</option>
                                <option>Summarize complex text</option>
                                <option>Debug code</option>
                                <option>Brainstorm ideas</option>
                                <option>Prepare for an interview</option>
                                <option>Explain like I'm five</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                            <Settings className="w-4 h-4 text-blue-500" /> Output Tone
                        </label>
                        <div className="relative">
                            <select 
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option>Professional</option>
                                <option>Academic</option>
                                <option>Casual</option>
                                <option>Creative</option>
                                <option>Highly Technical</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                        </div>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                     <Code className="w-4 h-4 text-blue-500" /> Main Topic / Context
                  </label>
                  <textarea 
                    className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none custom-scrollbar shadow-inner"
                    placeholder="e.g. The French Revolution's impact on early 19th-century democratic movements in Europe..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="pt-4">
                    <button 
                        onClick={generatePrompt}
                        disabled={loading || !topic}
                        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex justify-center items-center gap-3 active:scale-[0.98] group disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Terminal className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                        <span className="text-lg uppercase tracking-tight">{loading ? 'Engineering...' : 'Generate Expert Prompt'}</span>
                    </button>
                </div>
               </div>
            </div>

            {/* Results Section */}
            <div className="p-10 md:p-14 bg-[#0f172a] relative overflow-hidden flex flex-col min-h-[500px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl point-events-none"></div>
                
                {result ? (
                <div className="animate-in fade-in duration-500 flex-grow flex flex-col w-full z-10">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                        <span className="text-blue-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> System Output
                        </span>
                        <button 
                            onClick={copyPrompt}
                            className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 hover:bg-blue-500/30 transition-all font-bold text-sm flex items-center gap-2 active:scale-95"
                        >
                            {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied to Clipboard!' : 'Copy to AI'}
                        </button>
                    </div>
                    
                    <div className="flex-grow bg-[#0b1120] rounded-2xl border border-slate-700/50 p-6 overflow-y-auto custom-scrollbar shadow-inner relative group text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30">
                        {result}
                    </div>
                </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40 flex-grow">
                        <Terminal className="w-20 h-20 mb-6 text-slate-500" />
                        <h3 className="text-2xl font-bold text-slate-400 mb-2">Terminal Ready</h3>
                        <p className="text-slate-500 max-w-sm text-center">Define your objective and topic on the left to compile a high-performance system prompt.</p>
                    </div>
                )}
            </div>

          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - AI Productivity
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Master <span className="text-blue-500" style={{ backgroundImage: 'linear-gradient(to right, #4f46e5, #0ea5e9)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Generative AI</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Bypass Lazy Outputs', desc: 'Standard prompts often result in vague, generic AI outputs. Our prompt engineer creates detailed frameworks that force LLMs into producing highly specific, expert-level responses.', icon: CheckCircle },
                { title: 'Role-Playing Constraints', desc: 'The generated prompts automatically assign a specific persona and constraints to the AI, dramatically improving the accuracy and tone of the information provided.', icon: ShieldCheck },
                { title: 'Save Hours of Tweaking', desc: 'Stop having endless back-and-forth conversations with ChatGPT trying to get what you want. A structurally sound initial prompt achieves your goal on the first try.', icon: Zap }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-slate-200 dark:border-slate-700">
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
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Prompting FAQ</h2>
            <div className="space-y-6 relative z-10">
              {[
                { q: 'Which AI model is this for?', a: 'The engineered prompts are model-agnostic. They work exceptionally well on OpenAI\'s ChatGPT (GPT-3.5/GPT-4), Google Gemini, Claude, and other leading LLMs.' },
                { q: 'Why is the generated prompt so long?', a: 'High-quality outputs require high-quality constraints. The length ensures the AI understands exactly the format, tone, exclusions, and depth required for your task.' },
                { q: 'How do I use the generated result?', a: 'Simply click "Copy to AI", paste the entire text block into a new, blank chat window in ChatGPT or Gemini, and hit send!' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-blue-500" /> {faq.q}
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

export default AiPromptGenerator;
