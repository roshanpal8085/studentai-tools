import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

import { FileText, Download, Loader2, UploadCloud, Scissors, Type, Trash2 } from 'lucide-react';

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

  // Merge Handler
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

  // Compress Handler
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

  // Split Handler
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

  // Watermark Handler
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

  // Delete Pages Handler
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
      <Helmet><title>Free PDF Tools - StudentAI Tools</title></Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Free PDF Utilities</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Merge, split, watermark, and manipulate your PDF files seamlessly.</p>
        </div>

        {error && <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-xl text-center max-w-2xl mx-auto">{error}</div>}



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          
          {/* Merge PDFs */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 text-center flex flex-col h-full">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Merge PDFs</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Combine multiple PDFs into a single document.</p>
            <form onSubmit={handleMergeSubmit} className="flex-grow flex flex-col justify-center relative">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col items-center">
                <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-xs text-slate-500 mt-2">{mergeFiles.length} files selected (Click to add more)</span>
                <input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => setMergeFiles(prev => [...prev, ...Array.from(e.target.files)])} />
              </label>
              {mergeFiles.length > 0 && <button type="button" onClick={() => setMergeFiles([])} className="text-xs mt-2 text-red-500 font-medium hover:underline">Clear selected files</button>}
              <button disabled={loading.merge || mergeFiles.length < 2} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg mt-4 flex justify-center items-center space-x-2 text-sm">
                {loading.merge ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{loading.merge ? 'Processing...' : 'Merge & Download'}</span>
              </button>
            </form>
          </div>

          {/* Setup Split PDFs */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 text-center flex flex-col h-full">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2"><Scissors className="w-5 h-5 text-blue-500" /> Split PDF</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Extract a specific range of pages.</p>
            <form onSubmit={handleSplitSubmit} className="flex-grow flex flex-col justify-center text-left space-y-3">
              <input type="file" accept=".pdf" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-300" onChange={(e) => setSplitFile(e.target.files[0])} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" min="1" placeholder="Start Page" value={splitStart} onChange={(e)=>setSplitStart(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="number" min="1" placeholder="End Page" value={splitEnd} onChange={(e)=>setSplitEnd(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button disabled={loading.split || !splitFile} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg mt-4 flex justify-center items-center space-x-2 text-sm">
                {loading.split ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>Split & Download</span>
              </button>
            </form>
          </div>

          {/* Watermark PDFs */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 text-center flex flex-col h-full">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2"><Type className="w-5 h-5 text-blue-500" /> Watermark PDF</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Add text to all pages of a PDF.</p>
            <form onSubmit={handleWatermarkSubmit} className="flex-grow flex flex-col justify-center text-left space-y-3">
              <input type="file" accept=".pdf" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-300" onChange={(e) => setWatermarkFile(e.target.files[0])} />
              <input type="text" placeholder="Watermark text (e.g. DRAFT)" value={watermarkText} onChange={(e)=>setWatermarkText(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <button disabled={loading.watermark || !watermarkFile} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg mt-4 flex justify-center items-center space-x-2 text-sm">
                {loading.watermark ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>Add Watermark</span>
              </button>
            </form>
          </div>

          {/* Delete Pages */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 text-center flex flex-col h-full">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2"><Trash2 className="w-5 h-5 text-blue-500" /> Delete Pages</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Remove specific pages from a PDF.</p>
            <form onSubmit={handleDeleteSubmit} className="flex-grow flex flex-col justify-center text-left space-y-3">
              <input type="file" accept=".pdf" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-300" onChange={(e) => setDeleteFile(e.target.files[0])} />
              <input type="text" placeholder="Pages to delete (e.g. 1, 3, 5)" value={deletePages} onChange={(e)=>setDeletePages(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <button disabled={loading.delete || !deleteFile} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg mt-4 flex justify-center items-center space-x-2 text-sm">
                {loading.delete ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>Delete & Download</span>
              </button>
            </form>
          </div>

          {/* Compress PDFs */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 text-center flex flex-col h-full lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2"><UploadCloud className="w-5 h-5 text-blue-500" /> Compress PDF</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Reduce file size without losing quality.</p>
            <form onSubmit={handleCompressSubmit} className="flex-grow flex flex-col justify-center relative">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col items-center mx-auto w-full group">
                <UploadCloud className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-500 mt-2">{compressFile ? compressFile.name : 'Click to select a file'}</span>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setCompressFile(e.target.files[0])} />
              </label>
              <button disabled={loading.compress || !compressFile} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg mt-4 flex justify-center items-center space-x-2 text-sm">
                {loading.compress ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>Compress & Download</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PdfTools;
