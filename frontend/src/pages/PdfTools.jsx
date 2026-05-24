import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import axios from 'axios';
import { 
  FileText, Download, Loader2, UploadCloud, Scissors, 
  Type, Trash2, CheckCircle, HelpCircle, Zap, ShieldCheck, FileEdit
} from 'lucide-react';

const PdfTools = () => {
  const [mergeFiles, setMergeFiles] = useState([]);
  const [compressFile, setCompressFile] = useState(null);
  const [splitFile, setSplitFile] = useState(null);
  const [splitStart, setSplitStart] = useState('');
  const [splitEnd, setSplitEnd] = useState('');
  const [watermarkFile, setWatermarkFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [deleteFile, setDeleteFile] = useState(null);
  const [deletePages, setDeletePages] = useState('');

  const [loading, setLoading] = useState({ 
    merge: false, compress: false, split: false, watermark: false, delete: false 
  });
  const [error, setError] = useState('');

  const downloadBlob = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleError = (err, defaultMsg) => {
    setError(err.response?.data?.message || defaultMsg);
  };

  const handleMergeSubmit = async (e) => {
    e.preventDefault();
    if (mergeFiles.length < 2) return setError('Please select at least 2 PDF files to merge.');
    setLoading({ ...loading, merge: true });
    setError('');
    const formData = new FormData();
    for (let i = 0; i < mergeFiles.length; i++) formData.append('pdfs', mergeFiles[i]);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pdf/merge`, formData, { responseType: 'blob' });
      downloadBlob(res.data, 'merged_document.pdf');
      setMergeFiles([]);
    } catch (err) { handleError(err, 'Error merging PDFs.'); } 
    finally { setLoading({ ...loading, merge: false }); }
  };

  const handleCompressSubmit = async (e) => {
    e.preventDefault();
    if (!compressFile) return setError('Please select a PDF file to compress.');
    setLoading({ ...loading, compress: true });
    setError('');
    const formData = new FormData();
    formData.append('pdf', compressFile);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pdf/compress`, formData, { responseType: 'blob' });
      downloadBlob(res.data, 'compressed_document.pdf');
    } catch (err) { handleError(err, 'Error compressing PDF.'); } 
    finally { setLoading({ ...loading, compress: false }); }
  };

  const handleSplitSubmit = async (e) => {
    e.preventDefault();
    if (!splitFile || !splitStart || !splitEnd) return setError('Please complete all split fields.');
    setLoading({ ...loading, split: true });
    setError('');
    const formData = new FormData();
    formData.append('pdf', splitFile);
    formData.append('startPage', splitStart);
    formData.append('endPage', splitEnd);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pdf/split`, formData, { responseType: 'blob' });
      downloadBlob(res.data, 'split_document.pdf');
    } catch (err) { handleError(err, 'Error splitting PDF.'); } 
    finally { setLoading({ ...loading, split: false }); }
  };

  const handleWatermarkSubmit = async (e) => {
    e.preventDefault();
    if (!watermarkFile || !watermarkText) return setError('Please complete all watermark fields.');
    setLoading({ ...loading, watermark: true });
    setError('');
    const formData = new FormData();
    formData.append('pdf', watermarkFile);
    formData.append('text', watermarkText);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pdf/watermark`, formData, { responseType: 'blob' });
      downloadBlob(res.data, 'watermarked_document.pdf');
    } catch (err) { handleError(err, 'Error adding watermark.'); } 
    finally { setLoading({ ...loading, watermark: false }); }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (!deleteFile || !deletePages) return setError('Please complete all delete page fields.');
    setLoading({ ...loading, delete: true });
    setError('');
    const formData = new FormData();
    formData.append('pdf', deleteFile);
    formData.append('pages', deletePages);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pdf/delete-pages`, formData, { responseType: 'blob' });
      downloadBlob(res.data, 'deleted_pages_document.pdf');
    } catch (err) { handleError(err, 'Error deleting pages.'); } 
    finally { setLoading({ ...loading, delete: false }); }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free PDF Utilities - Merge, Split, Compress PDFs Online" 
        description="Fast, secure, and free PDF tools. Merge multiple PDFs, extract pages, reduce file size, and add watermarks instantly without registration." 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 mb-4 shadow-sm transition-transform hover:scale-110">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
            Free <span className="text-gradient">PDF Utilities</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Professional-grade tools to manage your documents. Secure, fast, and 100% free for students.
          </p>
        </div>

        {error && <div className="mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center max-w-2xl mx-auto border border-red-100 dark:border-red-900/50">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          
          {/* Merge PDFs */}
          <div className="glass-card rounded-[2rem] p-8 flex flex-col group transition-all duration-300 hover:-translate-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> Merge PDFs
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Combine multiple PDFs into one document.</p>
            <form onSubmit={handleMergeSubmit} className="flex-grow flex flex-col justify-end">
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col items-center group/label">
                <UploadCloud className="w-10 h-10 text-slate-400 group-hover/label:text-blue-500 transition-colors" />
                <span className="text-sm font-bold text-slate-500 mt-3">{mergeFiles.length} files selected</span>
                <input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setMergeFiles(prev => [...prev, ...Array.from(e.target.files)])} />
              </label>
              <button disabled={loading.merge || mergeFiles.length < 2} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl mt-5 flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all">
                {loading.merge ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5" />}
                <span>Merge & Download</span>
              </button>
            </form>
          </div>

          {/* Split PDF */}
          <div className="glass-card rounded-[2rem] p-8 flex flex-col group transition-all duration-300 hover:-translate-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-indigo-500" /> Split PDF
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Extract specific page ranges easily.</p>
            <form onSubmit={handleSplitSubmit} className="flex-grow flex flex-col justify-end space-y-4">
              <input type="file" accept=".pdf" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all" onChange={(e) => setSplitFile(e.target.files[0])} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" min="1" placeholder="Start" value={splitStart} onChange={(e)=>setSplitStart(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="number" min="1" placeholder="End" value={splitEnd} onChange={(e)=>setSplitEnd(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button disabled={loading.split || !splitFile} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all">
                {loading.split ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
                <span>Split & Download</span>
              </button>
            </form>
          </div>

          {/* Watermark PDF */}
          <div className="glass-card rounded-[2rem] p-8 flex flex-col group transition-all duration-300 hover:-translate-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Type className="w-5 h-5 text-purple-500" /> Watermark
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Add text protection to all pages.</p>
            <form onSubmit={handleWatermarkSubmit} className="flex-grow flex flex-col justify-end space-y-4">
              <input type="file" accept=".pdf" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100 transition-all" onChange={(e) => setWatermarkFile(e.target.files[0])} />
              <input type="text" placeholder="e.g. DRAFT or CONFIDENTIAL" value={watermarkText} onChange={(e)=>setWatermarkText(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500" />
              <button disabled={loading.watermark || !watermarkFile} type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all">
                {loading.watermark ? <Loader2 className="animate-spin w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                <span>Add Watermark</span>
              </button>
            </form>
          </div>

          {/* Delete Pages */}
          <div className="glass-card rounded-[2rem] p-8 flex flex-col group transition-all duration-300 hover:-translate-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-500" /> Delete Pages
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Remove specific pages from your PDF.</p>
            <form onSubmit={handleDeleteSubmit} className="flex-grow flex flex-col justify-end space-y-4">
              <input type="file" accept=".pdf" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 transition-all" onChange={(e) => setDeleteFile(e.target.files[0])} />
              <input type="text" placeholder="Pages (e.g. 1, 4-6)" value={deletePages} onChange={(e)=>setDeletePages(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500" />
              <button disabled={loading.delete || !deleteFile} type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all">
                {loading.delete ? <Loader2 className="animate-spin w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                <span>Delete Pages</span>
              </button>
            </form>
          </div>

          {/* PDF Footer Editor */}
          <div className="glass-card rounded-[2rem] p-8 flex flex-col group transition-all duration-300 hover:-translate-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-indigo-500" /> PDF Footer Editor
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Add your name &amp; enrollment number to every page footer. Replace existing footers too.</p>
            <div className="flex-grow flex flex-col justify-end">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 mb-4">
                <p className="text-sm text-indigo-700 dark:text-indigo-400 font-medium leading-relaxed">100% browser-based — your PDF never leaves your device. Supports cover &amp; replace of old footers.</p>
              </div>
              <Link
                to="/tools/pdf-footer-editor"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
              >
                <FileEdit className="w-5 h-5" />
                <span>Open Footer Editor</span>
              </Link>
            </div>
          </div>


          <div className="glass-card rounded-[2rem] p-8 flex flex-col lg:col-span-2 group transition-all duration-300 hover:-translate-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  <UploadCloud className="w-6 h-6 text-emerald-500" /> Compress PDF
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Reduce file size while keeping visual quality.</p>
              </div>
            </div>
            <form onSubmit={handleCompressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex flex-col items-center justify-center group/compress">
                <UploadCloud className="w-12 h-12 text-slate-300 group-hover/compress:text-emerald-500 transition-colors" />
                <span className="text-sm font-bold text-slate-500 mt-4 text-center">{compressFile ? compressFile.name : 'Select PDF to compress'}</span>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setCompressFile(e.target.files[0])} />
              </label>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">Our smart compression reduces metadata and optimizes images without affecting readability.</p>
                </div>
                <button disabled={loading.compress || !compressFile} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-5 rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all">
                  {loading.compress ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
                  <span>Optimize & Download</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Informational Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-24 mb-20 border-t border-slate-200 dark:border-slate-800">
           <div>
             <h2 className="text-3xl font-extrabold dark:text-white mb-8">Why Use StudentAI PDF Tools?</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               {[
                 { title: 'Privacy First', desc: 'Files are processed in memory and never stored on our servers.', icon: ShieldCheck },
                 { title: 'Lightning Fast', desc: 'Optimized algorithms ensure wait times are minimized.', icon: Zap },
                 { title: 'High Compatibility', desc: 'Works with all PDF versions and various device types.', icon: CheckCircle },
                 { title: 'Limitless Use', desc: 'No daily limits or annoying registration popups.', icon: FileText }
               ].map((item, i) => (
                 <div key={i} className="space-y-3">
                   <item.icon className="w-8 h-8 text-blue-500" />
                   <h3 className="font-extrabold text-lg dark:text-white">{item.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                 </div>
               ))}
             </div>
           </div>
           <div className="glass-card rounded-[3rem] p-10 md:p-16">
             <h2 className="text-3xl font-extrabold dark:text-white mb-10">Frequently Asked Questions</h2>
             <div className="space-y-8">
               <div>
                 <h3 className="font-extrabold text-lg dark:text-white mb-2 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-500" /> Is merging PDFs safe?</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Absolutely. We use industry-standard encryption, and your files are automatically deleted from memory after processing.</p>
               </div>
               <div>
                 <h3 className="font-extrabold text-lg dark:text-white mb-2 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-500" /> Can I compress password-protected PDFs?</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Our tools currently support unprotected PDFs. For protected files, please remove the password before uploading.</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PdfTools;
