import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { 
  FileEdit, Loader2, Send, CheckCircle, HelpCircle, 
  Target, ListChecks, Copy, Check, Layout, BookOpen, Clock, AlertTriangle, Zap
} from 'lucide-react';

const AssignmentGenerator = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Undergraduate');
  const [instructions, setInstructions] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setCopied(false);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/assignment-generator`, {
        topic, level, instructions
      });
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating assignment. Please try again.');
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
        title="Free AI Assignment Generator - Structure Academic Tasks Instantly" 
        canonical="/ai-assignment-generator"
        description="Struggling to structure your academic assignment? Use our free AI Assignment Generator to instantly create outlines, objectives, and rubrics. Perfect for all academic levels."
        keywords="ai assignment generator, free assignment maker, structure academic task, assignment outline ai, studentai tools, assignment creator 2026"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Assignment Generator",
            "operatingSystem": "Web",
            "applicationCategory": "EducationalApplication",
            "description": "Professional AI tool for generating structured academic assignments, complete with rubrics, learning objectives, and methodological steps.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Is the AI Assignment Generator completely free to use?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, our tool is 100% free for both students and educators. There are no hidden fees, no credit card requirements, and absolutely no need to create an account before using it." } },
              { "@type": "Question", "name": "Can students use this to write their assignments?", "acceptedAnswer": { "@type": "Answer", "text": "This tool generates the *structure* of an assignment (the outline, objectives, and rubric), not the final essay. It is designed to help students understand what is expected of them and outline their approach before they begin writing." } },
              { "@type": "Question", "name": "What academic levels are supported by the generator?", "acceptedAnswer": { "@type": "Answer", "text": "We support Middle School, High School, Undergraduate, and Postgraduate levels. The AI automatically adjusts the vocabulary, expected depth of research, and rubric strictness based on the level you select." } },
              { "@type": "Question", "name": "Will this tool generate a grading rubric?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Every assignment structure generated includes a detailed grading rubric. This helps educators grade fairly and helps students understand exactly what criteria they must meet to achieve top marks." } },
              { "@type": "Question", "name": "How specific can I get with the instructions?", "acceptedAnswer": { "@type": "Answer", "text": "Very specific. You can ask the AI to 'include a methodology section requiring 3 peer-reviewed journals' or 'make sure the presentation component is graded out of 20 points.' It will seamlessly integrate these constraints." } }
            ]
          }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 mb-4 transition-transform hover:-translate-y-1">
            <FileEdit className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Assignment Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop staring at a blank page. Generate professional, highly-structured assignment outlines, learning objectives, and grading rubrics in under 10 seconds.
          </p>
        </div>

        {/* Tool Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Settings Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-200/60 dark:border-slate-700/60 h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-violet-500" /> Task Parameters
              </h2>
              <Sparkles className="w-5 h-5 text-violet-500 animate-pulse" />
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Core Topic / Subject</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g., The Impact of Artificial Intelligence on Modern Healthcare..."
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white text-sm"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Academic Level</label>
                  <select 
                    value={level} 
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white appearance-none cursor-pointer text-sm font-medium"
                  >
                    <option>Middle School</option>
                    <option>High School</option>
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Specific Constraints (Optional)</label>
                <textarea 
                  placeholder="e.g., Must include a case study, require 3 primary sources, use APA formatting, focus heavily on ethical implications..."
                  className="w-full h-36 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white resize-none text-sm leading-relaxed"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <button 
                disabled={loading || !topic.trim()}
                type="submit" 
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-violet-500/30 flex justify-center items-center gap-3 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />}
                <span>{loading ? 'Structuring Document...' : 'Generate Assignment Outline'}</span>
              </button>
            </form>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex flex-col min-h-[600px]">
             <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
               <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                 <Layout className="w-6 h-6 text-violet-500" /> Assignment Brief
               </h2>
               <button 
                 disabled={!result || loading} 
                 onClick={handleCopy} 
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                   copied 
                   ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                   : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600'
                 }`}
               >
                 {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copied ? 'Copied to Clipboard' : 'Copy Text'}
               </button>
             </div>
             
             <div className="flex-grow p-8 md:p-12 overflow-auto custom-scrollbar bg-white dark:bg-slate-900">
               {error && <div className="p-5 bg-red-50 text-red-700 rounded-2xl mb-6 border border-red-100 text-sm font-bold flex items-center gap-3"><AlertTriangle className="w-5 h-5" />{error}</div>}
               
               {result ? (
                 <div className="prose prose-violet dark:prose-invert max-w-none prose-p:leading-loose prose-headings:text-slate-900 dark:prose-headings:text-white prose-li:my-2 prose-strong:text-slate-900 dark:prose-strong:text-slate-200">
                   <ReactMarkdown>{result}</ReactMarkdown>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20 opacity-40 text-center">
                   <ListChecks className="w-24 h-24 mb-6 text-violet-300" />
                   <p className="text-2xl font-black text-slate-600 dark:text-slate-400">Structure awaits.</p>
                   <p className="text-sm font-normal mt-4 max-w-sm">Enter your topic and academic level to generate a comprehensive assignment brief, complete with a rubric.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Deep Content Section (SEO & Value) */}
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-20 space-y-16">
          
          {/* Section 1: The Problem */}
          <section className="bg-white dark:bg-slate-800/50 rounded-[3rem] p-10 md:p-16 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-6 h-6" /></span>
              The Problem with Unstructured Assignments
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Whether you are a student trying to interpret a vague prompt, or an educator trying to design a comprehensive task, poor assignment structure is a universal pain point. An assignment that simply says <em>"Write 2000 words on the French Revolution"</em> is practically guaranteed to produce disorganized, unfocused work.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Without clear learning objectives, specific methodological requirements, and a transparent grading rubric, students spend more time guessing what the professor wants than actually researching the topic. This leads to academic anxiety, lower grades, and frustrating grading sessions for educators.
                </p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/10 rounded-3xl p-8 border border-rose-100 dark:border-rose-800/30">
                <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-4">Signs of a Poorly Structured Task:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"><span className="text-rose-500 mt-1">âœ—</span> No specific research constraints (e.g., "Use 5 peer-reviewed sources").</li>
                  <li className="flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"><span className="text-rose-500 mt-1">âœ—</span> Lack of a clear grading rubric outlining how marks are distributed.</li>
                  <li className="flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"><span className="text-rose-500 mt-1">âœ—</span> Ambiguous final deliverables (e.g., is it an essay, a report, or a presentation?).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Step by Step Guide */}
          <section>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">How to Use the AI Assignment Generator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Define the Core Topic", desc: "Start by entering the central theme. Be as broad or as specific as you need. For example: 'The architectural innovations of the Roman Empire'." },
                { step: "02", title: "Set the Academic Level", desc: "Select the appropriate tier. This dictates the complexity of the vocabulary, the depth of critical analysis expected, and the strictness of the rubric." },
                { step: "03", title: "Add Custom Constraints", desc: "Use the optional instructions box to add specific requirements: word counts, required formatting (APA/MLA), or mandatory sub-topics." }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-violet-300 transition-colors">
                  <div className="text-5xl font-black text-slate-100 dark:text-slate-800 absolute -top-2 -right-2 group-hover:scale-110 transition-transform">{item.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Real Example */}
          <section className="bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />
            <h2 className="text-3xl font-extrabold text-white mb-8">Real Example: See it in Action</h2>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="text-xs font-black text-violet-400 uppercase tracking-widest mb-4">User Input</div>
                <div className="space-y-4">
                  <div>
                    <span className="block text-slate-500 text-xs mb-1">Topic</span>
                    <span className="text-white font-medium text-sm">Supply Chain Disruptions during Global Crises</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs mb-1">Level</span>
                    <span className="text-white font-medium text-sm">Undergraduate</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs mb-1">Constraints</span>
                    <span className="text-white font-medium text-sm">Must include a PESTLE analysis, focus on the semiconductor industry, and require a 10-point presentation.</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-2/3 bg-white rounded-2xl p-8">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4">AI Generated Output (Excerpt)</div>
                <div className="prose prose-sm max-w-none text-slate-800">
                  <h4 className="text-lg font-bold text-slate-900">Assignment Brief: Global Supply Chain Resilience</h4>
                  <p><strong>Objective:</strong> To critically analyze the vulnerabilities of global supply chains during macroeconomic crises, utilizing the semiconductor industry as a primary case study.</p>
                  <h4 className="text-md font-bold text-slate-900 mt-4">Deliverable 1: The Analytical Report (70%)</h4>
                  <ul>
                    <li><strong>Introduction (300 words):</strong> Define modern supply chain globalization.</li>
                    <li><strong>PESTLE Analysis (800 words):</strong> Apply the PESTLE framework to the semiconductor shortage of 2020-2022.</li>
                    <li><strong>Strategic Recommendations (400 words):</strong> Propose risk mitigation strategies (e.g., nearshoring).</li>
                  </ul>
                  <h4 className="text-md font-bold text-slate-900 mt-4">Grading Rubric (Excerpt)</h4>
                  <ul>
                    <li><strong>Critical Analysis (30 points):</strong> Exceptional depth in applying the PESTLE framework; evidence of original thought.</li>
                    <li><strong>Presentation Clarity (10 points):</strong> Slides are visually coherent, strictly adhering to the 10-slide limit.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Use Cases & Tips */}
          <section className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Common Use Cases</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 text-indigo-600"><BookOpen className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">For Students (Reverse Engineering)</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">If your professor gave you a vague prompt, generate a structured assignment based on it to figure out exactly what headings and rubrics you should aim to fulfill.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 text-emerald-600"><Target className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">For Educators</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Save hours of administrative work. Use the AI to generate the syllabus breakdown, learning outcomes, and grading rubrics for your upcoming semester.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-800/30">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-indigo-500" /> Tips for Best Results
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400">1.</strong> 
                  <span><strong>Specify the deliverables.</strong> Tell the AI if you want an essay, a slide deck, a lab report, or a creative project.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400">2.</strong> 
                  <span><strong>Ask for multiple parts.</strong> Modern assignments often have a written component and a presentation component. Note this in the instructions.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400">3.</strong> 
                  <span><strong>Define the formatting.</strong> Explicitly state if you need APA 7th edition, double-spacing, or specific margin sizes if it matters to your rubric.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Extended FAQ */}
          <section className="mt-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: "Is the generated rubric actually usable for grading?", a: "Yes. The AI generates standards-based rubrics that assign point values to specific criteria (e.g., Critical Thinking, Formatting, Research Quality), making it highly practical for real-world grading." },
                { q: "Can I use this for STEM subjects?", a: "Absolutely. For STEM, the tool will generate assignment structures focused on methodology, data analysis, laboratory procedures, and empirical results rather than essay-style arguments." },
                { q: "Does the AI save the assignments I generate?", a: "No. StudentAI operates with strict privacy standards. Your prompts and generated assignments are not stored in our databases, ensuring your coursework remains entirely private." },
                { q: "How long does the generation process take?", a: "Typically under 10 seconds. We utilize state-of-the-art LLMs to ensure that you get high-quality, structured output almost instantaneously." },
                { q: "What is the difference between High School and Postgraduate outputs?", a: "High school outputs focus on summarizing, understanding, and basic application. Postgraduate outputs demand critical synthesis, primary research, complex theoretical frameworks, and strict peer-reviewed citation standards." }
              ].map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">{faq.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AssignmentGenerator;
