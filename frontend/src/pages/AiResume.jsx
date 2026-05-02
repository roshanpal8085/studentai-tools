import { useState, useRef } from 'react';
import SEO from '../components/SEO';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import { 
  LayoutTemplate, Loader2, Download, Briefcase, 
  CheckCircle, HelpCircle, Sparkles, Send, FileText, UserCheck, Focus, Target, Check, AlertTriangle
} from 'lucide-react';

const AiResume = () => {
  const [formData, setFormData] = useState({ 
    name: '', profession: '', email: '', phone: '', linkedin: '', github: '', 
    degree: '', university: '', graduationYear: '', skills: '', experience: '', projects: '' 
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState('modern');

  const resumeRef = useRef(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/resume`, formData);
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating... Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const downloadPdf = () => {
    const element = resumeRef.current;
    if (!element) return;
    
    // Temporarily hide the 'contentEditable' highlight and other non-print elements
    const opt = {
      margin:       [10, 10, 10, 10], // Reduced margin for more space
      filename:     `${formData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'resume'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
    });
  };

  const getTemplateStyles = () => {
    // Base classes for all templates to ensure compactness
    const base = "prose-sm prose-headings:mt-4 prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5";
    
    switch (template) {
      case 'modern':
        return `${base} prose-headings:text-indigo-600 prose-a:text-indigo-500 font-sans`;
      case 'creative':
        return `${base} prose-headings:text-pink-600 prose-headings:font-serif bg-rose-50/30 rounded-lg shadow-inner`;
      case 'professional':
      default:
        // Added pb-1 and border-b-2 optimization to prevent "heading cut" issue
        return `${base} prose-headings:text-slate-800 prose-headings:border-b-2 prose-headings:border-slate-800 prose-headings:pb-1 font-serif`;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free AI Resume Builder - Create ATS-Friendly CVs Instantly" 
        canonical="/ai-resume-generator"
        description="Build a professional, ATS-optimized resume in minutes. Transform your raw experience into high-impact bullet points and download as a PDF for free."
        keywords="ai resume builder, ats friendly resume maker, free student cv generator, resume creator 2026, student internship resume"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Resume Builder",
            "operatingSystem": "Web",
            "applicationCategory": "BusinessApplication",
            "description": "Professional AI-powered resume builder for creating ATS-friendly CVs and downloading them as PDFs.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Is this AI Resume Builder truly free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. While other platforms charge you at the final download step, StudentAI lets you generate and download unlimited PDF resumes completely for free." } },
              { "@type": "Question", "name": "What is an ATS-friendly resume?", "acceptedAnswer": { "@type": "Answer", "text": "Applicant Tracking Systems (ATS) are software programs used by 99% of large companies to scan resumes. Our tool strips away complex graphics and uses standard headings so the software can easily read your skills and experience." } },
              { "@type": "Question", "name": "Can I edit the generated text before downloading?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! The preview window on the right acts as a live text editor. You can click directly on the generated text to add, remove, or fix any bullet points before you export the PDF." } },
              { "@type": "Question", "name": "What if I have no work experience?", "acceptedAnswer": { "@type": "Answer", "text": "That is exactly what this tool is built for. If you lack formal job experience, list your university projects, volunteer work, or club leadership. The AI will transform these into professional, impact-driven bullet points." } },
              { "@type": "Question", "name": "Which resume template is best?", "acceptedAnswer": { "@type": "Answer", "text": "Choose 'Professional' for finance, law, and traditional corporate roles. Choose 'Modern' for tech, engineering, and startups. Choose 'Creative' for design, marketing, and media roles." } }
            ]
          }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:-translate-y-1">
            <LayoutTemplate className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Resume Builder</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Don't let bad formatting cost you an interview. Transform your raw experiences into a highly-polished, ATS-optimized PDF resume in under two minutes.
          </p>
        </div>

        {/* Builder Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Form Side */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-indigo-500" /> Input Data
              </h2>
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100 flex items-center gap-3"><AlertTriangle className="w-5 h-5"/>{error}</div>}

            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Full Name</label>
                  <input required name="name" onChange={handleChange} placeholder="Sarah Jenkins" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Target Job Title</label>
                  <input required name="profession" onChange={handleChange} placeholder="Software Engineering Intern" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Email Address</label>
                  <input required type="email" name="email" onChange={handleChange} placeholder="sarah@university.edu" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Phone Number</label>
                  <input required type="tel" name="phone" onChange={handleChange} placeholder="+1 234 567 8900" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Template Visuals</label>
                <div className="grid grid-cols-3 gap-2">
                  {['professional', 'modern', 'creative'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTemplate(t)}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                        template === t 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Skills (Comma separated)</label>
                  <input required name="skills" onChange={handleChange} placeholder="Python, React, Agile Methodology, Data Analysis" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Raw Experience & Projects</label>
                  <textarea required name="experience" onChange={handleChange} placeholder="e.g., I was a marketing intern at TechCorp. I managed social media and increased followers by 20%. I also worked on a college group project building a weather app..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white h-32 resize-none text-sm leading-relaxed" />
                </div>
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/30 mt-4 flex justify-center items-center gap-3 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />}
                <span>{loading ? 'Synthesizing Profile...' : 'Build Professional Resume'}</span>
              </button>
            </form>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-7 bg-slate-100 dark:bg-slate-800/40 rounded-[2.5rem] overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-700/60">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 py-5 px-8 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
              <button disabled={!result} onClick={downloadPdf} className="flex items-center gap-2 text-white bg-emerald-500 hover:bg-emerald-600 transition-all px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-lg shadow-emerald-500/30 disabled:opacity-30">
                <Download className="w-4 h-4" />
                <span>Export to PDF</span>
              </button>
            </div>
            
            <div className="p-8 md:p-12 flex-grow overflow-auto flex justify-center items-start bg-slate-200 dark:bg-slate-950/50 custom-scrollbar">
              <div 
                id="resume-paper"
                ref={resumeRef}
                className={`bg-white w-full max-w-[210mm] shadow-2xl p-8 md:p-12 prose prose-slate dark:prose-invert outline-none transition-all duration-500 ${getTemplateStyles()} ${result ? 'animate-in fade-in zoom-in-95' : ''}`}
                style={{ minHeight: '297mm', maxHeight: 'none', overflow: 'visible' }}
              >
                {result ? (
                   <div contentEditable={true} suppressContentEditableWarning={true} className="focus:outline-none focus:ring-4 focus:ring-indigo-100 rounded-lg transition-all">
                     <ReactMarkdown>{result}</ReactMarkdown>
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 h-full py-40 opacity-40 select-none" contentEditable={false}>
                    <FileText className="w-24 h-24 mb-6 text-indigo-200" />
                    <p className="text-xl font-bold text-slate-600">Document generation pending.</p>
                    <p className="text-sm mt-2 text-center max-w-sm">Fill in your details and let our AI optimize your language for recruiters.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              <strong>Tip:</strong> Click anywhere on the generated resume above to manually edit the text before downloading.
            </div>
          </div>
        </div>

        {/* Deep Content Section (SEO & Value) */}
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-20 space-y-16">
          
          {/* Section 1: The Problem */}
          <section className="bg-white dark:bg-slate-800/50 rounded-[3rem] p-10 md:p-16 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-6 h-6" /></span>
              Why Over 70% of Resumes Never Reach a Human
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  For university students applying to their first internship or graduate job, the job application process feels like throwing papers into a black hole. You apply to fifty places and hear nothing back. The harsh reality? Your resume is likely being rejected by an algorithm before a human ever sees it.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Applicant Tracking Systems (ATS) are software programs used by HR departments to filter out unqualified candidates. If your resume uses complex multi-column formatting, graphics, or fails to include specific action-verb keywords, the ATS simply discards it.
                </p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/10 rounded-3xl p-8 border border-rose-100 dark:border-rose-800/30">
                <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-4">Common ATS Killers:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"><span className="text-rose-500 mt-1">âœ—</span> <strong>Canva Templates:</strong> Beautiful to humans, unreadable garbled text to computers.</li>
                  <li className="flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"><span className="text-rose-500 mt-1">âœ—</span> <strong>Task-Based Bullet Points:</strong> Writing "Managed emails" instead of "Spearheaded client communication."</li>
                  <li className="flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"><span className="text-rose-500 mt-1">âœ—</span> <strong>Skill Charts:</strong> Progress bars for skills (e.g., 4/5 stars in Python) confuse the parser completely.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Step by Step Guide */}
          <section>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">How to Build Your AI Resume</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Dump Your Raw Experience", desc: "You do not need to sound professional yet. Just brain-dump what you did. E.g., 'I worked at Starbucks and trained new people.'" },
                { step: "02", title: "AI Translates to 'Corporate'", desc: "Our AI engine analyzes your target job title and rewrites your raw text into ATS-friendly, impact-driven bullet points." },
                { step: "03", title: "Review & Export", desc: "Click directly on the document preview to fix any typos, then hit Download PDF. The formatting is automatically locked in for ATS parsers." }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-300 transition-colors">
                  <div className="text-5xl font-black text-slate-100 dark:text-slate-800 absolute -top-2 -right-2 group-hover:scale-110 transition-transform">{item.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Real Example */}
          <section className="bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />
            <h2 className="text-3xl font-extrabold text-white mb-8">The AI Transformation: Before & After</h2>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4">What the Student Typed:</div>
                <div className="prose prose-sm max-w-none text-slate-300 italic p-4 bg-slate-900 rounded-xl border border-slate-700">
                  "For my final year project, me and my friends made an app for the university cafeteria. People could order food on it. I did the frontend using React and fixed a bunch of bugs. We got about 500 students to use it."
                </div>
              </div>
              
              <div className="lg:w-1/2 bg-white rounded-2xl p-6">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4">What the AI Generated:</div>
                <div className="prose prose-sm max-w-none text-slate-800">
                  <ul className="pl-4 space-y-2 marker:text-indigo-600">
                    <li><strong>Spearheaded</strong> the frontend development of a university-wide mobile ordering application utilizing <strong>React.js</strong>.</li>
                    <li><strong>Engineered</strong> responsive UI components and resolved critical rendering bugs, improving application stability.</li>
                    <li><strong>Drove user acquisition</strong>, scaling the platform to <strong>500+ active student users</strong> within the first deployment cycle.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Tips for Students */}
          <section className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">If You Have Zero Experience...</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                The biggest mistake students make is leaving their resume empty because they haven't held a "real job". Employers hiring graduates are not expecting 10 years of corporate history; they are looking for evidence of competency.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 text-indigo-600"><Check className="w-4 h-4" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">List Academic Projects</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Did you do a massive group research paper? Treat it like a job. Put "Lead Researcher - University Capstone" and describe the data analysis you did.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 text-indigo-600"><Check className="w-4 h-4" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Extracurriculars</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">If you managed the budget for the debate club, you have "Financial Administration" experience. Input it into the tool.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-800/30">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Focus className="w-6 h-6 text-indigo-500" /> Pro Tips for Output
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400">1.</strong> 
                  <span><strong>Use the exact job title.</strong> If the application says "Junior Data Analyst", put exactly that in the Target Job Title field. The AI will optimize keywords specifically for that role.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400">2.</strong> 
                  <span><strong>Add numbers.</strong> If you know you increased sales, or managed 5 people, include the numbers in the raw text. Numbers make resumes pop.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400">3.</strong> 
                  <span><strong>Keep it to one page.</strong> For students and recent graduates, a two-page resume is an automatic red flag. Our templates are designed to constrain space efficiently.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Extended FAQ */}
          <section className="mt-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: "Do I need to pay to download the PDF?", a: "No. Unlike other resume builders that trap you with a paywall right when you try to export, our tool generates high-quality, watermark-free PDFs completely free of charge." },
                { q: "Is the generated formatting ATS compatible?", a: "Yes. Our formatting utilizes a single-column structure and standard web fonts. It avoids tables, images, and complex CSS grids that notoriously break Applicant Tracking Systems." },
                { q: "Can I generate different resumes for different jobs?", a: "We highly encourage it. Tailoring your resume to the specific job description increases your callback rate significantly. Just change the 'Target Job Title' and hit generate again." },
                { q: "How does the live editor work?", a: "After the AI generates the document in the right panel, you can click anywhere on the text to edit it like a Word document. Delete irrelevant points, fix typos, or add your own custom bullet points before downloading." },
                { q: "Is my data stored?", a: "StudentAI operates securely. Your personal information, emails, and phone numbers are processed to generate the document and then immediately discarded. We do not store your data." }
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

export default AiResume;
