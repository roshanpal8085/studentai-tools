import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';

import { LayoutTemplate, Loader2, Download, Briefcase } from 'lucide-react';

const AiResume = () => {
  const [formData, setFormData] = useState({ name: '', profession: '', email: '', phone: '', linkedin: '', github: '', degree: '', university: '', graduationYear: '', skills: '', experience: '', projects: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState('professional');

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
        return 'prose-headings:text-pink-600 prose-headings:font-serif bg-rose-50 rounded-lg shadow-inner';
      case 'professional':
      default:
        return 'prose-headings:text-slate-800 prose-headings:border-b-2 prose-headings:border-slate-800 font-serif';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <Helmet><title>AI Resume Generator - StudentAI Tools</title></Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-primary mb-4">
            <LayoutTemplate className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">AI Resume Builder</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Generate, style, edit, and download a beautiful professional resume in seconds.</p>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Details</h2>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input required name="name" onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Profession</label>
                  <input required name="profession" onChange={handleChange} placeholder="Software Engineer" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input required type="email" name="email" onChange={handleChange} placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input required type="tel" name="phone" onChange={handleChange} placeholder="+1 234 567 8900" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                  <input name="linkedin" onChange={handleChange} placeholder="linkedin.com/in/johndoe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
                  <input name="github" onChange={handleChange} placeholder="github.com/johndoe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                </div>
              </div>

              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Template Style</label>
                <select value={template} onChange={(e) => setTemplate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white appearance-none cursor-pointer">
                  <option value="professional">Professional (Classic & Clean)</option>
                  <option value="modern">Modern (Indigo Accents)</option>
                  <option value="creative">Creative (Warm Tone & Serif)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree / Major</label>
                  <input required name="degree" onChange={handleChange} placeholder="e.g. B.Tech CS" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">University & Location</label>
                  <input required name="university" onChange={handleChange} placeholder="e.g. MIT, Boston" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
                  <input required name="graduationYear" onChange={handleChange} placeholder="e.g. 2025" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Skills</label>
                <input required name="skills" onChange={handleChange} placeholder="React, Node.js, Python, Leadership" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience</label>
                <textarea required name="experience" onChange={handleChange} placeholder="Intern at Tech Company - Built web apps. 2021-2022." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white h-24 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Projects</label>
                <textarea required name="projects" onChange={handleChange} placeholder="Personal Blog with React and Firebase" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white h-24 resize-none" />
              </div>
              
              <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-md mt-4 flex justify-center items-center space-x-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                <span>{loading ? 'Building Resume...' : 'Generate Resume'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-700 overflow-hidden flex flex-col relative h-[865px] lg:h-auto min-h-[700px]">
            <div className="bg-slate-900 border-b border-slate-700 py-4 px-6 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400">Click the paper to edit text</span>
              <button disabled={!result} onClick={downloadPdf} className="flex items-center space-x-2 text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm">
                <Download className="w-4 h-4" />
                <span>Save PDF</span>
              </button>
            </div>
            
            <div className="p-4 md:p-8 flex-grow bg-slate-200 overflow-auto flex justify-center items-start">
              <div 
                id="resume-paper"
                ref={resumeRef}
                className={`bg-white w-full max-w-[210mm] shadow-lg p-10 px-12 prose prose-slate outline-none ${getTemplateStyles()}`}
                style={{
                  minHeight: '297mm',
                  maxHeight: '800px',
                  overflow: 'auto',
                }}
              >
                {result ? (
                   <div contentEditable={true} suppressContentEditableWarning={true}>
                     <ReactMarkdown>{result}</ReactMarkdown>
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 h-full mt-32" contentEditable={false}>
                    <LayoutTemplate className="w-16 h-16 opacity-30 mb-4" />
                    <p>Your beautifully formatted resume will appear here...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AiResume;
