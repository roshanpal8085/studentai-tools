import { useState, useRef } from 'react';
import SEO from '../components/SEO';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import { 
  LayoutTemplate, Loader2, Download, Briefcase, 
  CheckCircle, HelpCircle, Sparkles, Send, FileText, UserCheck 
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
    
    const opt = {
      margin:       [15, 15, 15, 15],
      filename:     `${formData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'resume'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.style.maxHeight = '800px';
      element.style.overflow = 'auto';
    });
  };

  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return 'prose-headings:text-indigo-600 prose-a:text-indigo-500 font-sans';
      case 'creative':
        return 'prose-headings:text-pink-600 prose-headings:font-serif bg-rose-50/30 rounded-lg shadow-inner';
      case 'professional':
      default:
        return 'prose-headings:text-slate-800 prose-headings:border-b-2 prose-headings:border-slate-800 font-serif';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="AI Resume Builder - Free ATS-Friendly Resume Generator" 
        description="Create a professional, ATS-optimized resume in minutes with our AI Resume Builder. Choose from modern templates and download as a high-quality PDF for free." 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:rotate-6">
            <LayoutTemplate className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Resume Builder</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop worrying about formatting. Enter your details and let our AI craft a high-impact, ATS-friendly resume for your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 shadow-2xl shadow-indigo-500/5 rounded-[3rem]">
          {/* Form Side */}
          <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-indigo-500" /> Career Profile
              </h2>
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">{error}</div>}

            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Full Name</label>
                  <input required name="name" onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Job Title</label>
                  <input required name="profession" onChange={handleChange} placeholder="Software Engineer" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Email Address</label>
                  <input required type="email" name="email" onChange={handleChange} placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Phone Number</label>
                  <input required type="tel" name="phone" onChange={handleChange} placeholder="+1 234 567 8900" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
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
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
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
                  <input required name="skills" onChange={handleChange} placeholder="React, Figma, Agile, SEO" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase">Work Experience</label>
                  <textarea required name="experience" onChange={handleChange} placeholder="Detailed roles, dates, and achievements..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white h-28 resize-none text-sm" />
                </div>
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 mt-4 flex justify-center items-center gap-3 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />}
                <span>{loading ? 'Generating Resume...' : 'Build AI Resume'}</span>
              </button>
            </form>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-7 bg-slate-100 dark:bg-slate-800/40 rounded-[2.5rem] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 py-5 px-8 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <button disabled={!result} onClick={downloadPdf} className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 transition-all px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-lg shadow-indigo-500/20 disabled:opacity-30">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
            
            <div className="p-8 md:p-12 flex-grow overflow-auto flex justify-center items-start bg-slate-200 dark:bg-slate-900/20 custom-scrollbar">
              <div 
                id="resume-paper"
                ref={resumeRef}
                className={`bg-white w-full max-w-[210mm] shadow-2xl p-10 md:p-16 prose prose-slate dark:prose-invert outline-none animate-in fade-in zoom-in duration-500 ${getTemplateStyles()}`}
                style={{ minHeight: '297mm', maxHeight: 'none', overflow: 'visible' }}
              >
                {result ? (
                   <div contentEditable={true} suppressContentEditableWarning={true}>
                     <ReactMarkdown>{result}</ReactMarkdown>
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 h-full py-40 opacity-30" contentEditable={false}>
                    <FileText className="w-24 h-24 mb-6" />
                    <p className="text-xl font-bold">Your professional resume <br/> will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informational SEO Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 px-4 overflow-hidden">
          <div className="space-y-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Mastering the <span className="text-indigo-600">ATS System</span> in 2026</h2>
            <div className="space-y-8">
              {[
                { title: 'AI-Powered Keyword Optimization', desc: 'Our algorithm analyzes thousands of job descriptions to ensure your skills match what recruiters are searching for.', icon: Briefcase },
                { title: 'Standardized Formatting', desc: 'We use clean, structural layouts that are 100% readable by Applicant Tracking Systems (ATS).', icon: LayoutTemplate },
                { title: 'Instant Tailoring', desc: 'Generate multiple versions of your resume for different roles in just a few clicks.', icon: Sparkles }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-[50px] rounded-full translate-x-10 -translate-y-10" />
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: 'Is this resume really free?', a: 'Yes, StudentAI is committed to helping students. You can generate and download unlimited resumes without any hidden fees.' },
                { q: 'What is an ATS-friendly resume?', a: 'ATS (Applicant Tracking Systems) are used by 99% of Fortune 500 companies. Our resumes avoid complex graphics that break these systems.' },
                { q: 'Can I edit the generated text?', a: 'Absolutely! Once the resume is generated, you can click directly on the text in the preview window to make final adjustments.' },
                { q: 'Which template should I choose?', a: 'Professional is best for corporate roles, Modern for tech/startups, and Creative for design or marketing positions.' }
              ].map((faq, i) => (
                <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-5">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiResume;
